from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.user import User
from schemas.chat import ChatMessageRead, ChatRequest, ChatResponse
from services.auth import get_current_user
from services.chat import clear_chat_history, generate_reply, get_chat_history


router = APIRouter(prefix='/chat', tags=['chat'])


@router.post('/', response_model=ChatResponse)
def chat(payload: ChatRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return generate_reply(db, user.id, payload.message)


@router.get('/history', response_model=list[ChatMessageRead])
def chat_history(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_chat_history(db, user.id)


@router.delete('/history', status_code=status.HTTP_204_NO_CONTENT)
def delete_chat_history(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    clear_chat_history(db, user.id)
