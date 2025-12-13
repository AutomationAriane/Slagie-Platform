"""
Main FastAPI Application for Slagie Platform
Clean, simple backend with exact frontend contract
"""
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import os

from app.database import get_db, engine
from app.models import Base, Exam, Question, AnswerOption

# Create FastAPI app
app = FastAPI(
    title="Slagie API",
    description="CBR Theorie Examen Platform",
    version="2.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for images
static_path = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_path):
    app.mount("/static", StaticFiles(directory=static_path), name="static")

# Create tables on startup (if needed)
@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)


# ============ PYDANTIC SCHEMAS ============

class ExamListItem(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    questions_count: int

class AnswerOptionResponse(BaseModel):
    id: int
    label: str
    text: str

class QuestionResponse(BaseModel):
    id: int
    text: str
    image_url: Optional[str] = None
    options: List[AnswerOptionResponse]

class CheckAnswerRequest(BaseModel):
    question_id: int
    selected_option_id: int

class CheckAnswerResponse(BaseModel):
    is_correct: bool
    correct_answer_text: str


# ============ API ENDPOINTS ============

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "Slagie API v2"}


@app.get("/api/exams", response_model=List[ExamListItem])
def get_exams(db: Session = Depends(get_db)):
    """
    Get list of all exams
    Frontend expects: [{ id, title, description, questions_count }]
    """
    try:
        exams = db.query(Exam).order_by(Exam.id).all()
        
        result = []
        for exam in exams:
            result.append({
                "id": exam.id,
                "title": exam.title,
                "description": exam.description,
                "questions_count": len(exam.questions)
            })
        
        return result
    except Exception as e:
        print(f"Error in get_exams: {e}")
        return []  # Return empty list instead of error


@app.get("/api/exams/{exam_id}/start", response_model=List[QuestionResponse])
def start_exam(exam_id: int, db: Session = Depends(get_db)):
    """
    Get all questions for an exam with their options
    Frontend expects: [{ id, text, image_url, options: [{id, label, text}] }]
    """
    # Check if exam exists
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    # Get all questions for this exam
    questions = db.query(Question).filter(
        Question.exam_id == exam_id
    ).order_by(Question.question_number).all()
    
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for this exam")
    
    # Build response
    result = []
    for question in questions:
        options_list = []
        for option in question.options:
            options_list.append({
                "id": option.id,
                "label": option.label,
                "text": option.text
            })
        
        result.append({
            "id": question.id,
            "text": question.text,
            "image_url": question.image_url,
            "options": options_list
        })
    
    return result


@app.post("/api/exams/check-answer", response_model=CheckAnswerResponse)
def check_answer(request: CheckAnswerRequest, db: Session = Depends(get_db)):
    """
    Check if the selected answer is correct
    Frontend expects: { is_correct: bool, correct_answer_text: string }
    """
    # Get the selected option
    selected_option = db.query(AnswerOption).filter(
        AnswerOption.id == request.selected_option_id
    ).first()
    
    if not selected_option:
        raise HTTPException(status_code=404, detail="Selected option not found")
    
    # Get the question to find the correct answer
    question = db.query(Question).filter(
        Question.id == request.question_id
    ).first()
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # Find the correct answer
    correct_option = None
    for option in question.options:
        if option.is_correct:
            correct_option = option
            break
    
    if not correct_option:
        raise HTTPException(status_code=500, detail="No correct answer found for this question")
    
    return {
        "is_correct": selected_option.is_correct,
        "correct_answer_text": correct_option.text
    }


class FinishExamRequest(BaseModel):
    score: int
    total: int


@app.post("/api/exams/{exam_id}/finish")
def finish_exam(exam_id: int, request: FinishExamRequest, db: Session = Depends(get_db)):
    """
    Save exam result
    Input: { score: int, total: int }
    Output: { message: str, passed: bool }
    """
    from datetime import datetime
    from app.models import UserExamResult
    
    # Check if exam exists
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    # Calculate if passed (CBR standard: 86% = 43/50)
    percentage = (request.score / request.total) * 100 if request.total > 0 else 0
    passed = percentage >= 86
    
    # Save result
    result = UserExamResult(
        exam_id=exam_id,
        score=request.score,
        total=request.total,
        passed=passed,
        timestamp=datetime.now().isoformat()
    )
    
    db.add(result)
    db.commit()
    
    return {
        "message": "Resultaat opgeslagen",
        "passed": passed,
        "percentage": round(percentage, 1)
    }



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
