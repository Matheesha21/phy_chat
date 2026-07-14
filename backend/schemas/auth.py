from datetime import datetime

from pydantic import BaseModel


class GoogleSignInRequest(BaseModel):
    id_token: str


class UserRead(BaseModel):
    id: int
    google_sub: str
    email: str
    full_name: str | None = None
    picture_url: str | None = None
    is_active: bool
    has_completed_competition_onboarding: bool
    competition_score: int


class AuthResponse(BaseModel):
    user: UserRead
    session_expires_at: datetime


class MessageResponse(BaseModel):
    message: str