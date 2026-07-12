from typing import Literal

from pydantic import BaseModel, Field


StudyYear = Literal[1, 2, 3, 4]


class ModuleOut(BaseModel):
    id: str
    year: StudyYear
    code: str
    name: str
    description: str
    question_count: int


class QuestionOut(BaseModel):
    id: str
    module_id: str
    prompt: str
    options: list[str]
    correct_option: int
    explanation: str
    points: int


class AnswerIn(BaseModel):
    question_id: str
    selected_option: int


class SubmitRequest(BaseModel):
    module_id: str = Field(min_length=1)
    answers: list[AnswerIn] = Field(default_factory=list)


class SubmitResult(BaseModel):
    awarded_points: int
    correct_answers: int
    total_questions: int
    total_points: int


class LeaderboardEntryOut(BaseModel):
    rank: int
    student_id: str
    student_name: str
    points: int
    quizzes_completed: int
    is_current_student: bool = False
