"""
Database Rebuild Script
Drops existing tables, recreates them, and imports data from Excel
"""
import pandas as pd
import math
import os
import sys

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, SessionLocal
from app.models import Base, Exam, Question, AnswerOption

# Excel file path
EXCEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "TheorieToppers examen vragen (3).xlsx")
BASE_URL = "http://localhost:8000"


def clean_text(value):
    """Clean text values from Excel"""
    if pd.isna(value):
        return ""
    return str(value).strip()


def extract_question_number(value):
    """Extract question number from formats like '11/50' or '11'"""
    if pd.isna(value):
        return None
    text = str(value).strip()
    if "/" in text:
        return int(text.split("/")[0])
    try:
        return int(float(text))
    except (ValueError, TypeError):
        return None


def rebuild_database():
    """Main rebuild function"""
    print("🔧 Starting database rebuild...")
    
    # Step 1: Drop and recreate tables
    print("📦 Dropping existing tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("📦 Creating new tables...")
    Base.metadata.create_all(bind=engine)
    
    # Step 2: Check Excel file exists
    if not os.path.exists(EXCEL_PATH):
        print(f"❌ Excel file not found: {EXCEL_PATH}")
        return False
    
    print(f"📖 Reading Excel: {EXCEL_PATH}")
    df = pd.read_excel(EXCEL_PATH)
    print(f"✅ Loaded {len(df)} rows from Excel")
    
    # Step 3: Create database session
    db = SessionLocal()
    
    try:
        # Track created exams to avoid duplicates
        created_exams = {}
        processed_count = 0
        
        for index, row in df.iterrows():
            # Extract question number
            q_num = extract_question_number(row.get('Vraagnummer'))
            if not q_num:
                continue
            
            # Calculate exam ID (50 questions per exam)
            exam_number = math.ceil(q_num / 50)
            
            # Create exam if not exists
            if exam_number not in created_exams:
                start_q = ((exam_number - 1) * 50) + 1
                end_q = exam_number * 50
                
                exam = Exam(
                    id=exam_number,
                    title=f"Examen {exam_number}",
                    description=f"Theorie-examen {exam_number} (Vragen {start_q}-{end_q})"
                )
                db.add(exam)
                db.flush()  # Get the ID
                created_exams[exam_number] = exam
                print(f"✅ Created: {exam.title}")
            
            # Get question text
            question_text = clean_text(row.get('Vraagtekst'))
            if not question_text:
                continue
            
            # Handle image URL
            foto = row.get('Foto')
            image_url = None
            if not pd.isna(foto):
                foto_str = str(foto).strip()
                if foto_str:
                    image_url = f"{BASE_URL}/static/images/{foto_str}"
            
            # Create question
            question = Question(
                exam_id=exam_number,
                text=question_text,
                image_url=image_url,
                question_type=clean_text(row.get('Vraagtype')),
                question_number=q_num
            )
            db.add(question)
            db.flush()  # Get the ID
            
            # Get correct answer text
            correct_answer_text = clean_text(row.get('Antwoord')).lower()
            
            # Create answer options
            options_data = [
                ('A', clean_text(row.get('Optie A'))),
                ('B', clean_text(row.get('Optie B'))),
                ('C', clean_text(row.get('Optie C'))),
            ]
            
            # Add D if exists
            if 'Optie D' in row and not pd.isna(row.get('Optie D')):
                options_data.append(('D', clean_text(row.get('Optie D'))))
            
            for label, option_text in options_data:
                if not option_text:
                    continue
                
                # Determine if this is the correct answer
                is_correct = (option_text.lower() == correct_answer_text)
                
                # Fallback: check if answer is just the letter
                if not is_correct and len(correct_answer_text) == 1:
                    is_correct = (correct_answer_text.upper() == label)
                
                option = AnswerOption(
                    question_id=question.id,
                    label=label,
                    text=option_text,
                    is_correct=is_correct
                )
                db.add(option)
            
            processed_count += 1
            if processed_count % 50 == 0:
                print(f"⏳ Processed {processed_count} questions...")
                db.commit()  # Commit in batches
        
        # Final commit
        db.commit()
        print(f"✅ Database rebuild complete! Processed {processed_count} questions.")
        print(f"📊 Created {len(created_exams)} exams")
        return True
        
    except Exception as e:
        print(f"❌ Error during rebuild: {e}")
        db.rollback()
        return False
    finally:
        db.close()


if __name__ == "__main__":
    success = rebuild_database()
    sys.exit(0 if success else 1)
