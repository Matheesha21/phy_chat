from fastapi import APIRouter, Depends

from models.user import User
from schemas.chat import ChatRequest, ChatResponse
from services.auth import get_current_user
from services.chat import generate_reply


router = APIRouter(prefix='/chat', tags=['chat'])


@router.post('/', response_model=ChatResponse)
def chat(payload: ChatRequest, _user: User = Depends(get_current_user)):
    return generate_reply(payload)
