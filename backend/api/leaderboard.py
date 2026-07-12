from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db
from models.user import User
from schemas.leaderboard import LeaderboardEntryRead
from services.auth import get_current_user
from services.leaderboard import get_leaderboard


router = APIRouter(prefix='/leaderboard', tags=['leaderboard'])


@router.get('/', response_model=list[LeaderboardEntryRead])
def leaderboard(_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_leaderboard(db)
