from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.core import storage, auth_utils
import os

router = APIRouter()

class SignupRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    id: str
    email: str
    is_admin: bool
    created_at: str

@router.post("/signup", response_model=TokenResponse)
async def signup(request: SignupRequest):
    """Create a new user account"""
    # Check if user already exists
    existing_user = storage.get_user_by_email(request.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password and create user
    password_hash = auth_utils.hash_password(request.password)
    user = storage.create_user(request.email, password_hash)
    
    # Create token
    token = auth_utils.create_access_token(user["id"], user["email"], user["is_admin"])
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "is_admin": user["is_admin"]
        }
    }

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """Login with email and password"""
    # Get user
    user = storage.get_user_by_email(request.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Check if blocked
    if user.get("is_blocked", False):
        raise HTTPException(status_code=403, detail="Account is blocked")
    
    # Verify password
    if not auth_utils.verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    token = auth_utils.create_access_token(user["id"], user["email"], user["is_admin"])
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "is_admin": user["is_admin"]
        }
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user(authorization: Optional[str] = Header(None)):
    """Get current user info from token"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    current_user = auth_utils.get_current_user_from_token(authorization)
    if not current_user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Get full user data
    user = storage.get_user_by_id(current_user["user_id"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.get("is_blocked", False):
        raise HTTPException(status_code=403, detail="Account is blocked")
    
    return {
        "id": user["id"],
        "email": user["email"],
        "is_admin": user["is_admin"],
        "created_at": user["created_at"]
    }

# Initialize admin user on startup
def init_admin():
    admin_email = os.getenv("ADMIN_EMAIL", "admin@example.com")
    admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
    
    existing_admin = storage.get_user_by_email(admin_email)
    if not existing_admin:
        password_hash = auth_utils.hash_password(admin_password)
        storage.create_user(admin_email, password_hash, is_admin=True)
        print(f"✅ Admin user created: {admin_email}")

init_admin()
