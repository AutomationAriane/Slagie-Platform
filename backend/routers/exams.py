from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from database import get_db
from models import Exam, ExamQuestionItem, ExamAnswerOption, User
from routers.auth import get_current_user

router = APIRouter(prefix="/api", tags=["exams"])

# ==================== PYDANTIC SCHEMAS ====================

class ExamAnswerCreate(BaseModel):
    answer_text: str
    is_correct: bool
    order: int = 0

class ExamAnswerResponse(BaseModel):
    id: int
    answer_text: str
    is_correct: bool
    order: int
    
    class Config:
        from_attributes = True

class ExamQuestionCreate(BaseModel):
    question_text: str
    question_image: Optional[str] = None
    question_type: str = "multiple_choice"
    order: int = 0
    answers: List[ExamAnswerCreate]

class ExamQuestionResponse(BaseModel):
    id: int
    question_text: str
    question_image: Optional[str]
    question_type: str
    order: int
    answers: List[ExamAnswerResponse]
    
    class Config:
        from_attributes = True

class ExamCreate(BaseModel):
    title: str
    description: Optional[str] = None
    cover_image: Optional[str] = None
    time_limit: Optional[int] = 30  # Default 30 minutes
    passing_score: Optional[int] = 86  # Default 86%
    category: Optional[str] = "Theorie"
    is_published: bool = False
    questions: List[ExamQuestionCreate] = []

class ExamUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None
    time_limit: Optional[int] = None
    passing_score: Optional[int] = None
    category: Optional[str] = None

class ExamResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    cover_image: Optional[str]
    time_limit: Optional[int]
    passing_score: Optional[int]
    category: Optional[str]
    is_published: bool
    created_at: datetime
    updated_at: Optional[datetime]
    published_at: Optional[datetime]
    questions: List[ExamQuestionResponse] = []
    
    class Config:
        from_attributes = True

class ExamListItem(BaseModel):
    """Simplified exam for list views (no questions)"""
    id: int
    title: str
    description: Optional[str]
    cover_image: Optional[str]
    time_limit: Optional[int]
    passing_score: Optional[int]
    category: Optional[str]
    is_published: bool
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# ==================== ADMIN ENDPOINTS ====================

@router.post("/admin/exams", response_model=ExamResponse, status_code=status.HTTP_201_CREATED)
def create_exam(
    exam_data: ExamCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new exam (admin only)"""
    # Check if user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create exams"
        )
    
    # Create exam
    new_exam = Exam(
        title=exam_data.title,
        description=exam_data.description,
        cover_image=exam_data.cover_image,
        time_limit=exam_data.time_limit,
        passing_score=exam_data.passing_score,
        category=exam_data.category,
        is_published=exam_data.is_published,
        created_by=current_user.id,
        published_at=datetime.utcnow() if exam_data.is_published else None
    )
    
    db.add(new_exam)
    db.flush()  # Get exam ID
    
    # Add questions and answers
    question_items = []
    for q_data in exam_data.questions:
        question = ExamQuestionItem(
            question_text=q_data.question_text,
            question_image=q_data.question_image,
            question_type=q_data.question_type
        )
        
        # Add answers
        for a_data in q_data.answers:
            answer = ExamAnswerOption(
                answer_text=a_data.answer_text,
                is_correct=a_data.is_correct,
                order=a_data.order
            )
            question.answers.append(answer)
        
        question_items.append(question)
    
    # Link questions to exam via M2M relationship
    new_exam.questions = question_items
    
    db.commit()
    db.refresh(new_exam)
    
    return new_exam

@router.get("/admin/exams", response_model=List[ExamListItem])
def list_all_exams(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all exams including drafts (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view all exams"
        )
    
    exams = db.query(Exam).order_by(Exam.created_at.desc()).all()
    return exams

@router.get("/admin/exams/{exam_id}", response_model=ExamResponse)
def get_exam_detail(
    exam_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get exam details with questions (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view exam details"
        )
    
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    return exam

@router.put("/admin/exams/{exam_id}", response_model=ExamResponse)
def update_exam(
    exam_id: int,
    exam_data: ExamUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update exam settings (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update exams"
        )
    
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    # Update fields
    update_data = exam_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(exam, key, value)
    
    db.commit()
    db.refresh(exam)
    
    return exam

@router.put("/admin/exams/{exam_id}/publish")
def publish_exam(
    exam_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Publish exam - makes it visible to students"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can publish exams"
        )
    
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    # Publish exam
    exam.is_published = True
    exam.published_at = datetime.utcnow()
    
    db.commit()
    db.refresh(exam)
    
    return {
        "message": "Examen staat live voor studenten!",
        "exam": ExamResponse.from_orm(exam)
    }

@router.put("/admin/exams/{exam_id}/unpublish")
def unpublish_exam(
    exam_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Unpublish exam - hides it from students"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can unpublish exams"
        )
    
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    # Unpublish exam
    exam.is_published = False
    
    db.commit()
    
    return {"message": "Examen is nu een concept"}

# ==================== STUDENT ENDPOINTS ====================

@router.get("/student/exams", response_model=List[ExamListItem])
def get_published_exams(db: Session = Depends(get_db)):
    """
    CRITICAL: Get ONLY published exams for students
    Filter: WHERE is_published == True
    """
    exams = db.query(Exam).filter(Exam.is_published == True).order_by(Exam.created_at.desc()).all()
    return exams

@router.get("/student/exams/{exam_id}", response_model=ExamResponse)
def get_student_exam_detail(
    exam_id: int,
    db: Session = Depends(get_db)
):
    """Get published exam details for student"""
    exam = db.query(Exam).filter(
        Exam.id == exam_id,
        Exam.is_published == True
    ).first()
    
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found or not published"
        )
    
    return exam
