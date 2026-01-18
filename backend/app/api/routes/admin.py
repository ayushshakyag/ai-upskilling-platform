from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import List, Optional
from app.core import storage, auth_utils

router = APIRouter()

class UserListResponse(BaseModel):
    id: str
    email: str
    is_admin: bool
    is_blocked: bool
    created_at: str

def require_admin(authorization: Optional[str] = Header(None)):
    """Middleware to check if user is admin"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    current_user = auth_utils.get_current_user_from_token(authorization)
    if not current_user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    if not current_user.get("is_admin", False):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return current_user

@router.get("/users", response_model=List[UserListResponse])
async def list_users(authorization: Optional[str] = Header(None)):
    """List all users (admin only)"""
    require_admin(authorization)
    
    users = storage.get_all_users()
    return [
        {
            "id": user["id"],
            "email": user["email"],
            "is_admin": user["is_admin"],
            "is_blocked": user.get("is_blocked", False),
            "created_at": user["created_at"]
        }
        for user in users
    ]

@router.put("/users/{user_id}/block")
async def block_user(user_id: str, authorization: Optional[str] = Header(None)):
    """Block a user account (admin only)"""
    admin = require_admin(authorization)
    
    # Can't block yourself
    if admin["user_id"] == user_id:
        raise HTTPException(status_code=400, detail="Cannot block yourself")
    
    user = storage.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    storage.update_user(user_id, {"is_blocked": True})
    return {"message": "User blocked successfully"}

@router.put("/users/{user_id}/unblock")
async def unblock_user(user_id: str, authorization: Optional[str] = Header(None)):
    """Unblock a user account (admin only)"""
    require_admin(authorization)
    
    user = storage.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    storage.update_user(user_id, {"is_blocked": False})
    return {"message": "User unblocked successfully"}

@router.delete("/users/{user_id}")
async def delete_user(user_id: str, authorization: Optional[str] = Header(None)):
    """Delete a user account (admin only)"""
    admin = require_admin(authorization)
    
    # Can't delete yourself
    if admin["user_id"] == user_id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    user = storage.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Delete user
    success = storage.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete user")
    
    return {"message": "User deleted successfully"}
