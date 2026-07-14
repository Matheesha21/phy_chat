from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)


class ChatResponse(BaseModel):
    reply: str


class ChatMessageRead(BaseModel):
    id: int
    role: Literal['user', 'assistant']
    message: str
    created_at: datetime
