from pydantic import BaseModel


class LeaderboardEntryRead(BaseModel):
    rank: int
    user_id: int
    full_name: str | None = None
    email: str
    correct_answers: int
    wrong_answers: int
    missed_answers: int
    total_time_seconds: float
    score: int
