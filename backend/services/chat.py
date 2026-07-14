from fastapi import HTTPException, status
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from core.config import get_gemini_model, get_google_api_key
from models.chat import ChatMessage
from schemas.chat import ChatMessageRead, ChatResponse


SYSTEM_PROMPT = 'You are a helpful AI assistant for the Physics Department chat application. Answer clearly and concisely.'
CONTEXT_MESSAGE_LIMIT = 20


def _build_llm() -> ChatGoogleGenerativeAI:
    return ChatGoogleGenerativeAI(model=get_gemini_model(), google_api_key=get_google_api_key())


def _to_langchain_messages(history: list[ChatMessage], message: str) -> list:
    messages = [SystemMessage(content=SYSTEM_PROMPT)]
    for item in history:
        if item.role == 'user':
            messages.append(HumanMessage(content=item.message))
        else:
            messages.append(AIMessage(content=item.message))
    messages.append(HumanMessage(content=message))
    return messages


def get_chat_history(db: Session, user_id: int) -> list[ChatMessageRead]:
    rows = db.scalars(
        select(ChatMessage).where(ChatMessage.user_id == user_id).order_by(ChatMessage.created_at)
    ).all()
    return [ChatMessageRead(id=row.id, role=row.role, message=row.message, created_at=row.created_at) for row in rows]


def clear_chat_history(db: Session, user_id: int) -> None:
    db.execute(delete(ChatMessage).where(ChatMessage.user_id == user_id))
    db.commit()


def generate_reply(db: Session, user_id: int, message: str) -> ChatResponse:
    history = db.scalars(
        select(ChatMessage)
        .where(ChatMessage.user_id == user_id)
        .order_by(ChatMessage.created_at.desc())
        .limit(CONTEXT_MESSAGE_LIMIT)
    ).all()
    history = list(reversed(history))

    llm = _build_llm()
    try:
        result = llm.invoke(_to_langchain_messages(history, message))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail='Failed to get a response from the chat model',
        ) from exc

    reply = result.content
    db.add(ChatMessage(user_id=user_id, role='user', message=message))
    db.add(ChatMessage(user_id=user_id, role='assistant', message=reply))
    db.commit()

    return ChatResponse(reply=reply)
