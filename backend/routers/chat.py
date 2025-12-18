from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from database import get_db
from models import ExamQuestionItem, User
from dependencies import get_current_user
import random

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatArtifact(BaseModel):
    type: str # 'question'
    data: dict # Question data

class ChatResponse(BaseModel):
    text: str
    artifact: Optional[ChatArtifact] = None

@router.post("/student/chat", response_model=ChatResponse)
def chat_with_tutor(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    msg = request.message.lower()
    
    # 1. Simple Keyword Search Strategy
    # Find relevant questions based on user input terms
    keywords = [w for w in msg.split() if len(w) > 3] # simple filter
    
    relevant_q = None
    if keywords:
        # Construct dynamic filter
        # For MVP, just search description or topic
        query = db.query(ExamQuestionItem)
        # Search for ANY keyword match (very basic)
        matches = []
        for kw in keywords:
            params = f"%{kw}%"
            found = query.filter(
                (ExamQuestionItem.question_text.ilike(params)) | 
                (ExamQuestionItem.cbr_topic.ilike(params)) |
                (ExamQuestionItem.cbr_subtopic.ilike(params))
            ).limit(5).all()
            matches.extend(found)
        
        if matches:
            relevant_q = random.choice(matches)

    # 2. Construct Response
    if relevant_q:
        response_text = f"Ik heb iets gevonden over dat onderwerp in onze database. Probeer deze examenvraag eens over '{relevant_q.cbr_topic}':"
        
        # Serialize Question for Artifact
        # Minimal data needed for display
        q_data = {
            "id": relevant_q.id,
            "question_text": relevant_q.question_text,
            "question_image": relevant_q.question_image,
            "question_type": relevant_q.question_type,
            # We don't send answers here to keep it "quiz mode", frontend handles fetching or we assume simple display?
            # Actually, let's just send the text/image and ask user to go to quiz?
            # "SLAGIE-SETUP" says: "Render... interactive Exam Cards".
            # For MVP simplicity, let's send full question data structure so frontend can render a mini-player.
            "answers": [
                {"id": a.id, "text": a.answer_text} for a in relevant_q.answers
            ]
        }
        
        artifact = ChatArtifact(type="question", data=q_data)
        return ChatResponse(text=response_text, artifact=artifact)

    # 3. Fallback / Greeting
    if "hallo" in msg or "hoi" in msg:
        return ChatResponse(text=f"Hoi {current_user.email.split('@')[0]}! Waar wil je vandaag mee oefenen? (Bijv. 'voorrang', 'borden', 'snelheid')")
    
    return ChatResponse(text="Ik begrijp je niet helemaal, maar ik leer nog! Probeer een specifiek onderwerp te noemen zoals 'voorrang' of 'autoweg'.")
