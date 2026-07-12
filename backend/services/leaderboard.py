from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from models.leaderboard import LeaderboardEntry
from models.user import User
from schemas.leaderboard import LeaderboardEntryRead

CORRECT_BASE_SCORE = 100
MIN_CORRECT_SCORE = 10


def score_for_answer(is_correct: bool, time_taken_seconds: float) -> int:
    if not is_correct:
        return 0
    return max(MIN_CORRECT_SCORE, CORRECT_BASE_SCORE - int(round(time_taken_seconds)))


def _get_or_create_entry(db: Session, user_id: int) -> LeaderboardEntry:
    entry = db.scalar(select(LeaderboardEntry).where(LeaderboardEntry.user_id == user_id))
    if entry:
        return entry

    entry = LeaderboardEntry(user_id=user_id)
    db.add(entry)
    db.flush()
    return entry


def record_answer(db: Session, user_id: int, is_correct: bool, time_taken_seconds: float, score_awarded: int) -> LeaderboardEntry:
    entry = _get_or_create_entry(db, user_id)
    if is_correct:
        entry.correct_answers += 1
    else:
        entry.wrong_answers += 1
    entry.total_time_seconds += time_taken_seconds
    entry.score += score_awarded
    db.commit()
    db.refresh(entry)
    return entry


def get_leaderboard(db: Session, limit: int = 50) -> list[LeaderboardEntryRead]:
    rows = db.execute(
        select(LeaderboardEntry, User)
        .join(User, User.id == LeaderboardEntry.user_id)
        .order_by(LeaderboardEntry.score.desc(), LeaderboardEntry.total_time_seconds.asc())
        .limit(limit)
    ).all()

    return [
        LeaderboardEntryRead(
            rank=index + 1,
            user_id=user.id,
            full_name=user.full_name,
            email=user.email,
            correct_answers=entry.correct_answers,
            wrong_answers=entry.wrong_answers,
            total_time_seconds=entry.total_time_seconds,
            score=entry.score,
        )
        for index, (entry, user) in enumerate(rows)
    ]
