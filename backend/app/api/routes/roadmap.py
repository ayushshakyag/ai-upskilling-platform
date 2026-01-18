from fastapi import APIRouter, HTTPException, Header
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
from app.services.ai_gateway import generate_roadmap_stream
from app.core import storage, auth_utils

router = APIRouter()

class GenerateRoadmapRequest(BaseModel):
    prompt: str # useCompletion sends 'prompt'
    skill_level: str = "beginner"
    user_goal: str | None = None # legacy support or optional

class SaveRoadmapRequest(BaseModel):
    title: str
    user_goal: str
    skill_level: str
    roadmap_data: dict

class RoadmapResponse(BaseModel):
    id: str
    title: str
    user_goal: str
    skill_level: str
    roadmap_data: dict
    created_at: str

@router.post("/generate")
async def generate_roadmap(request: GenerateRoadmapRequest, authorization: Optional[str] = Header(None)):
    """Generate a learning roadmap using AI with credit and agent status checks"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    current_user_token = auth_utils.get_current_user_from_token(authorization)
    if not current_user_token:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Reload user from storage to get latest credits/status
    user = storage.get_user_by_id(current_user_token["user_id"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if user is blocked
    if user.get("is_blocked", False):
        raise HTTPException(status_code=403, detail="Your account has been blocked")
    
    # Check agent status
    if not user.get("is_agent_enabled", True):
        raise HTTPException(status_code=403, detail="AI Agent access has been disabled by admin. Please contact support.")
    
    # Check credits (-1 is infinite)
    credits = user.get("credits", -1)
    if credits != -1 and credits <= 0:
        raise HTTPException(status_code=403, detail="You have exhausted your credits. Please contact admin for more.")

    goal = request.user_goal or request.prompt
    print(f"Received request from {user['email']}: {goal}, {request.skill_level}")
    
    # Decrement credit if not infinite
    if credits != -1:
        storage.update_user(user["id"], {"credits": credits - 1})

    try:
        return StreamingResponse(
            generate_roadmap_stream(goal, request.skill_level),
            media_type="text/event-stream"
        )
    except Exception as e:
        print(f"Error generating roadmap: {e}")
        # Optionally refund credit on total failure? 
        # For now keep it simple.
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save", response_model=RoadmapResponse)
async def save_roadmap(request: SaveRoadmapRequest, authorization: Optional[str] = Header(None)):
    """Save a generated roadmap to user's account"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    current_user = auth_utils.get_current_user_from_token(authorization)
    if not current_user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    roadmap = storage.create_roadmap(
        user_id=current_user["user_id"],
        title=request.title,
        user_goal=request.user_goal,
        skill_level=request.skill_level,
        roadmap_data=request.roadmap_data
    )
    
    return roadmap

@router.get("/list", response_model=List[RoadmapResponse])
async def list_roadmaps(authorization: Optional[str] = Header(None)):
    """Get all roadmaps for current user"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    current_user = auth_utils.get_current_user_from_token(authorization)
    if not current_user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    roadmaps = storage.get_roadmaps_by_user(current_user["user_id"])
    return roadmaps

@router.get("/{roadmap_id}", response_model=RoadmapResponse)
async def get_roadmap(roadmap_id: str, authorization: Optional[str] = Header(None)):
    """Get a specific roadmap by ID"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    current_user = auth_utils.get_current_user_from_token(authorization)
    if not current_user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    roadmap = storage.get_roadmap_by_id(roadmap_id)
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    # Check ownership
    if roadmap["user_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized to view this roadmap")
    
    return roadmap

@router.delete("/{roadmap_id}")
async def delete_roadmap(roadmap_id: str, authorization: Optional[str] = Header(None)):
    """Delete a roadmap"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    current_user = auth_utils.get_current_user_from_token(authorization)
    if not current_user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    success = storage.delete_roadmap(roadmap_id, current_user["user_id"])
    if not success:
        raise HTTPException(status_code=404, detail="Roadmap not found or not authorized")
    
    return {"message": "Roadmap deleted successfully"}

