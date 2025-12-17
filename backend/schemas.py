from pydantic import BaseModel
from typing import List, Optional

# ============ ANSWER OPTIONS ============

class AnswerOptionSchema(BaseModel):
    id: int
    letter: str
    text: str
    is_correct: bool

    class Config:
        from_attributes = True


# ============ QUESTIONS ============

class QuestionSchema(BaseModel):
    id: int
    question_number: int
    text: str
    type: str
    image_url: Optional[str] = None
    subtopic_id: int
    options: List[AnswerOptionSchema]

    class Config:
        from_attributes = True


# ============ QUIZ ============

class QuizStartSchema(BaseModel):
    """Schema voor het starten van een quiz"""
    topic_id: int
    topic_name: str
    total_questions: int
    questions: List[QuestionSchema]

    class Config:
        from_attributes = True


class QuizAnswerSchema(BaseModel):
    """Schema voor een antwoord"""
    question_id: int
    selected_option_id: int


class QuizResultSchema(BaseModel):
    """Schema voor quiz resultaat (response van /api/quiz/submit)"""
    is_correct: bool
    selected_letter: str
    correct_letter: Optional[str] = None
    correct_text: Optional[str] = None
    explanation: Optional[str] = None

    class Config:
        from_attributes = True


# ============ AUTH & USERS ============

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "student"

class UserLogin(UserBase):
    password: str

class UserSchema(UserBase):
    id: int
    role: str
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


# ============ QUIZ RESULTS ============

class QuizAttemptCreate(BaseModel):
    exam_id: int
    score: int
    total_questions: int
    passed: bool


# ============ EXAM SYSTEM (Admin-Created Exams) ============

class ExamAnswerOptionSchema(BaseModel):
    """Answer option for exam questions"""
    id: int
    answer_text: str
    is_correct: bool
    order: int

    class Config:
        from_attributes = True


class ExamQuestionSchema(BaseModel):
    """Question in an exam with answer options"""
    id: int
    question_text: str
    question_image: Optional[str] = None
    question_type: str
    answers: List[ExamAnswerOptionSchema]

    class Config:
        from_attributes = True


class ExamListSchema(BaseModel):
    """Simplified exam for list views (no questions)"""
    id: int
    title: str
    description: Optional[str] = None
    cover_image: Optional[str] = None
    time_limit: Optional[int] = None
    passing_score: Optional[int] = None
    category: Optional[str] = None
    is_published: bool

    class Config:
        from_attributes = True


class ExamDetailSchema(BaseModel):
    """Full exam with all questions and answers"""
    id: int
    title: str
    description: Optional[str] = None
    cover_image: Optional[str] = None
    time_limit: Optional[int] = None
    passing_score: Optional[int] = None
    category: Optional[str] = None
    is_published: bool
    questions: List[ExamQuestionSchema] = []

    class Config:
        from_attributes = True


class ExamUpdateSchema(BaseModel):
    """Schema for updating exam metadata"""
    title: Optional[str] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None
    time_limit: Optional[int] = None
    passing_score: Optional[int] = None
    category: Optional[str] = None
    is_published: Optional[bool] = None
