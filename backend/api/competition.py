from typing import cast

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.user import User
from schemas.competition import (
    LeaderboardEntryOut,
    ModuleOut,
    QuestionOut,
    StudyYear,
    SubmitRequest,
    SubmitResult,
)
from services.auth import get_current_user
from services.competition import get_leaderboard, get_modules, get_questions, submit_quiz


router = APIRouter(prefix='/competitions', tags=['competitions'])


@router.get('/modules', response_model=list[ModuleOut])
def list_modules(year: int = Query(ge=1, le=4), _user: User = Depends(get_current_user)):
    return get_modules(cast(StudyYear, year))


@router.get('/modules/{module_id}/questions', response_model=list[QuestionOut])
def list_questions(module_id: str, _user: User = Depends(get_current_user)):
    questions = get_questions(module_id)
    if not questions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Module not found')
    return questions


@router.post('/submit', response_model=SubmitResult)
def submit(
    payload: SubmitRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return submit_quiz(db, user, payload.module_id, payload.answers)


@router.get('/leaderboard', response_model=list[LeaderboardEntryOut])
def leaderboard(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_leaderboard(db, user)
