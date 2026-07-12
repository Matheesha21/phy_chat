from datetime import datetime

from pydantic import BaseModel, Field


class ProfileUpsertRequest(BaseModel):
    study_year: int = Field(ge=1, le=4)
    interest_modules: list[str] = Field(min_length=1)
    description: str | None = None


class ProfileRead(BaseModel):
    id: int
    user_id: int
    study_year: int
    interest_modules: list[str]
    description: str | None = None
    created_at: datetime
    updated_at: datetime
