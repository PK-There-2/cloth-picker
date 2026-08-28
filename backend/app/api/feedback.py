from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict

router = APIRouter()

# Mock Database for User Preferences
# In a real app, this would connect to Firebase/Firestore
user_db: Dict[str, Dict[str, bool]] = {
    "default_user": {
        "funky": False,
        "old_money": False
    }
}

class PreferenceRequest(BaseModel):
    user_id: str
    style: str
    liked: bool

@router.post("/feedback")
async def update_preference(request: PreferenceRequest):
    """
    Endpoint for updating user style preferences (Like/Dislike Loop).
    """
    if request.user_id not in user_db:
        user_db[request.user_id] = {}
        
    user_db[request.user_id][request.style] = request.liked
    
    return {
        "status": "success",
        "user_id": request.user_id,
        "preferences": user_db[request.user_id]
    }

@router.get("/preferences/{user_id}")
async def get_preferences(user_id: str):
    return user_db.get(user_id, {})
