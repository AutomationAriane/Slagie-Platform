import sys
import os
sys.path.append(os.getcwd()) # Ensure backend modules are found

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from config import DATABASE_URL
from models import Exam, ExamQuestionItem, exam_questions_association
from database import Base

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

print("--- EXAM DEBUG ---")
exams = db.query(Exam).all()
for exam in exams:
    print(f"Exam ID: {exam.id}, Title: {exam.title}, Published: {exam.is_published}")
    print(f"  Questions Count: {len(exam.questions)}")
    for q in exam.questions:
        print(f"    - QID: {q.id} ({q.question_type}): {q.question_text[:30]}...")
        print(f"      Answers: {len(q.answers)}")

print("\n--- RAW ASSOCIATION TABLE ---")
with engine.connect() as conn:
    result = conn.execute(text("SELECT * FROM exam_questions_link"))
    rows = result.fetchall()
    if not rows:
        print("  <EMPTY>")
    for row in rows:
        print(f"  {row}")
