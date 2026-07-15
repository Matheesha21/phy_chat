from fastapi import HTTPException, status
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from core.config import get_gemini_model, get_google_api_key
from models.chat import ChatMessage
from schemas.chat import ChatMessageRead, ChatResponse
from services.rag import retrieve_relevant_chunks


SYSTEM_PROMPT = """You are the AI assistant for the Department of Physics at the University of Sri Jayewardenepura, Sri Lanka.

Your primary role is to help students, lecturers, and visitors by providing accurate and useful information related to:

- Physics concepts, theories, equations, and problem-solving
- Undergraduate physics courses and learning materials
- Department information such as lecturers, courses, research areas, laboratories, and academic activities
- General academic guidance related to physics

Guidelines:

1. Physics-specific questions:
- Provide scientifically accurate answers based on established physics principles.
- Do not invent information about the university, lecturers, courses, or department activities.
- If specific department information is unavailable, clearly state that you do not have enough information.
- When appropriate, explain assumptions and limitations.

2. Department-specific questions:
- Prioritize information from the Physics Department knowledge base when available.
- For questions about lecturers, courses, schedules, research, or facilities, use only verified information.
- If information is missing, suggest contacting the department.

3. Limitations:
- Do not provide unsupported claims. 
- Keep answers concise and to the point.
- Do not pretend to know information that is not available.
- For topics outside physics or department-related information, politely explain that your expertise is focused on physics.

Your goal is to provide reliable physics education support and improve the learning experience of students and lecturers at the University of Sri Jayewardenepura."""
CONTEXT_MESSAGE_LIMIT = 10


def _build_llm() -> ChatGoogleGenerativeAI:
    return ChatGoogleGenerativeAI(model=get_gemini_model(), google_api_key=get_google_api_key())


def _build_system_prompt(context_chunks: list[str]) -> str:
    if not context_chunks:
        return SYSTEM_PROMPT
    context = '\n\n---\n\n'.join(context_chunks)
    return (
        f'{SYSTEM_PROMPT}\n\n'
        'Use the following context about the Physics Department if it is relevant to the question. '
        "If the context doesn't contain the answer, say you don't know rather than guessing.\n\n"
        f'Context:\n{context}'
    )


def _to_langchain_messages(history: list[ChatMessage], message: str, context_chunks: list[str]) -> list:
    messages = [SystemMessage(content=_build_system_prompt(context_chunks))]
    for item in history:
        if item.role == 'user':
            messages.append(HumanMessage(content=item.message))
        else:
            messages.append(AIMessage(content=item.message))
    messages.append(HumanMessage(content=message))
    return messages


def get_chat_history(db: Session, user_id: int) -> list[ChatMessageRead]:
    rows = db.scalars(
        select(ChatMessage)
        .where(ChatMessage.user_id == user_id)
        .order_by(ChatMessage.created_at, ChatMessage.id)
    ).all()
    return [ChatMessageRead(id=row.id, role=row.role, message=row.message, created_at=row.created_at) for row in rows]


def clear_chat_history(db: Session, user_id: int) -> None:
    db.execute(delete(ChatMessage).where(ChatMessage.user_id == user_id))
    db.commit()


def _extract_text(content) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for block in content:
            if isinstance(block, str):
                parts.append(block)
            elif isinstance(block, dict) and block.get('type') == 'text':
                parts.append(block.get('text', ''))
        return ''.join(parts)
    return str(content)


def generate_reply(db: Session, user_id: int, message: str) -> ChatResponse:
    history = db.scalars(
        select(ChatMessage)
        .where(ChatMessage.user_id == user_id)
        .order_by(ChatMessage.created_at.desc(), ChatMessage.id.desc())
        .limit(CONTEXT_MESSAGE_LIMIT)
    ).all()
    history = list(reversed(history))

    llm = _build_llm()
    try:
        context_chunks = retrieve_relevant_chunks(db, message)
        result = llm.invoke(_to_langchain_messages(history, message, context_chunks))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail='Failed to get a response from the chat model',
        ) from exc

    reply = _extract_text(result.content)
    db.add(ChatMessage(user_id=user_id, role='user', message=message))
    db.add(ChatMessage(user_id=user_id, role='assistant', message=reply))
    db.commit()

    return ChatResponse(reply=reply)
