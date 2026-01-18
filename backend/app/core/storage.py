import json
import os
from pathlib import Path
from typing import Dict, List, Optional
import uuid
from datetime import datetime

# Data directory
DATA_DIR = Path(__file__).parent.parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)

USERS_FILE = DATA_DIR / "users.json"
ROADMAPS_FILE = DATA_DIR / "roadmaps.json"

# Initialize files if they don't exist
def init_storage():
    if not USERS_FILE.exists():
        save_users({"users": []})
    if not ROADMAPS_FILE.exists():
        save_roadmaps({"roadmaps": []})

# Users
def load_users() -> Dict:
    try:
        with open(USERS_FILE, 'r') as f:
            data = json.load(f)
            # Add missing fields to existing users (Backwards Compatibility)
            for user in data["users"]:
                if "credits" not in user:
                    user["credits"] = -1 # Infinite for existing users
                if "is_agent_enabled" not in user:
                    user["is_agent_enabled"] = True
            return data
    except:
        return {"users": []}

def save_users(data: Dict):
    with open(USERS_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def get_user_by_email(email: str) -> Optional[Dict]:
    data = load_users()
    for user in data["users"]:
        if user["email"] == email:
            return user
    return None

def get_user_by_id(user_id: str) -> Optional[Dict]:
    data = load_users()
    for user in data["users"]:
        if user["id"] == user_id:
            return user
    return None

def create_user(email: str, password_hash: str, is_admin: bool = False) -> Dict:
    data = load_users()
    user = {
        "id": str(uuid.uuid4()),
        "email": email,
        "password_hash": password_hash,
        "is_admin": is_admin,
        "is_blocked": False,
        "credits": -1, # Dev Mode: Infinite by default
        "is_agent_enabled": True,
        "created_at": datetime.utcnow().isoformat()
    }
    data["users"].append(user)
    save_users(data)
    return user

def update_user(user_id: str, updates: Dict) -> Optional[Dict]:
    data = load_users()
    for i, user in enumerate(data["users"]):
        if user["id"] == user_id:
            data["users"][i].update(updates)
            save_users(data)
            return data["users"][i]
    return None

def delete_user(user_id: str) -> bool:
    data = load_users()
    original_len = len(data["users"])
    data["users"] = [u for u in data["users"] if u["id"] != user_id]
    if len(data["users"]) < original_len:
        save_users(data)
        return True
    return False

def get_all_users() -> List[Dict]:
    data = load_users()
    return data["users"]

# Roadmaps
def load_roadmaps() -> Dict:
    try:
        with open(ROADMAPS_FILE, 'r') as f:
            return json.load(f)
    except:
        return {"roadmaps": []}

def save_roadmaps(data: Dict):
    with open(ROADMAPS_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def create_roadmap(user_id: str, title: str, user_goal: str, skill_level: str, roadmap_data: Dict) -> Dict:
    data = load_roadmaps()
    roadmap = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "title": title,
        "user_goal": user_goal,
        "skill_level": skill_level,
        "roadmap_data": roadmap_data,
        "created_at": datetime.utcnow().isoformat()
    }
    data["roadmaps"].append(roadmap)
    save_roadmaps(data)
    return roadmap

def get_roadmaps_by_user(user_id: str) -> List[Dict]:
    data = load_roadmaps()
    return [r for r in data["roadmaps"] if r["user_id"] == user_id]

def get_roadmap_by_id(roadmap_id: str) -> Optional[Dict]:
    data = load_roadmaps()
    for roadmap in data["roadmaps"]:
        if roadmap["id"] == roadmap_id:
            return roadmap
    return None

def delete_roadmap(roadmap_id: str, user_id: str) -> bool:
    data = load_roadmaps()
    original_len = len(data["roadmaps"])
    data["roadmaps"] = [r for r in data["roadmaps"] if not (r["id"] == roadmap_id and r["user_id"] == user_id)]
    if len(data["roadmaps"]) < original_len:
        save_roadmaps(data)
        return True
    return False

# Initialize on import
init_storage()
