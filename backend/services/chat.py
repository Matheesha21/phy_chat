from fastapi import HTTPException, status
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI

from core.config import get_gemini_model, get_google_api_key
from schemas.chat import ChatRequest, ChatResponse


SYSTEM_PROMPT = 'You are a helpful AI assistant for the Physics Department chat application. Answer clearly and concisely.'


def _build_llm() -> ChatGoogleGenerativeAI:
    return ChatGoogleGenerativeAI(model=get_gemini_model(), google_api_key=get_google_api_key())


def _to_langchain_messages(request: ChatRequest) -> list:
    messages = [SystemMessage(content=SYSTEM_PROMPT)]
    for item in request.history:
        if item.role == 'user':
            messages.append(HumanMessage(content=item.content))
        else:
            messages.append(AIMessage(content=item.content))
    messages.append(HumanMessage(content=request.message))
    return messages


def generate_reply(request: ChatRequest) -> ChatResponse:
    llm = _build_llm()
    try:
        result = llm.invoke(_to_langchain_messages(request))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail='Failed to get a response from the chat model',
        ) from exc

    return ChatResponse(reply=result.content)
