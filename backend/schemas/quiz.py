from pydantic import BaseModel, Field


class GeneratedQuestion(BaseModel):
    """Structured output contract for the LLM question generator."""

    topic: str = Field(description='The specific physics topic the question covers')
    question: str = Field(description='The MCQ question text')
    options: list[str] = Field(description='Exactly four answer options', min_length=4, max_length=4)
    correct_option_index: int = Field(description='Index (0-3) of the correct option in options', ge=0, le=3)


class QuizQuestionRead(BaseModel):
    id: int
    topic: str | None = None
    question: str
    options: list[str]


class QuizAnswerRequest(BaseModel):
    selected_option_index: int | None = Field(default=None, ge=0, le=3)
    time_taken_seconds: float = Field(ge=0)


class QuizAnswerResponse(BaseModel):
    quiz_id: int
    is_correct: bool
    correct_option_index: int
    score_awarded: int
