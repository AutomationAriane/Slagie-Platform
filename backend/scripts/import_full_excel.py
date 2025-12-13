import pandas as pd
import sys
import os
import math
import logging

# Add backend directory to sys.path to import modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Correct path relative to this script (scripts/import_full_excel.py -> backend/data/...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXCEL_FILE = os.path.join(BASE_DIR, "data", "TheorieToppers examen vragen (3).xlsx")

def clean_text(text):
    if pd.isna(text):
        return ""
    return str(text).strip()

def clean_question_number(val):
    if pd.isna(val):
        return None
    # Handle "11/50" or "11"
    s = str(val).strip()
    if "/" in s:
        return int(s.split("/")[0])
    try:
        return int(float(s))
    except (ValueError, TypeError):
        return None

def import_data():
    if not os.path.exists(EXCEL_FILE):
        logger.error(f"Excel file not found: {EXCEL_FILE}")
        return

    logger.info("Reading Excel file...")
    df = pd.read_excel(EXCEL_FILE)
    
    # Init DB
    models.Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Clear existing data? logic: User said "Fresh", so maybe clear.
        # But "Bij twijfel niet verwijderen".
        # Let's perform upsert logic or clear if user asked for "Fresh build"
        # User said: "We negeren oude, buggy code en bouwen... fris op." -> Implies clearing DATA might be okay?
        # Safe bet: check if exists, if not create.
        
        # Dictionary to cache topics and subtopics
        # Topic = Examen 1, Examen 2...
        # SubTopic = Same as Topic for now (1:1 mapping for simplicity unless "Onderwerp" column dictates otherwise)
        # User Prompt: "Logic: exam_id = math.ceil(vraagnummer / 50)."
        # This implies Exam 1 contains Q1-50.
        
        for index, row in df.iterrows():
            q_num = clean_question_number(row['Vraagnummer'])
            if not q_num:
                continue
            
            # --- 1. Exam Logic ---
            exam_number = math.ceil(q_num / 50)
            exam_name = f"Examen {exam_number}"
            
            # Find or Create Topic (Exam)
            topic = db.query(models.Topic).filter(models.Topic.name == exam_name).first()
            if not topic:
                topic = models.Topic(name=exam_name, description=f"Oefenexamen {exam_number} (Vragen {((exam_number-1)*50)+1}-{(exam_number*50)})")
                db.add(topic)
                db.commit()
                db.refresh(topic)
            
            # --- 2. SubTopic Logic ---
            # Use "Onderwerp" column if valid, else fallback to Exam Name
            sub_name = clean_text(row.get('Onderwerp'))
            if not sub_name:
                sub_name = "Algemeen"
            
            # To prevent duplication of subtopic names across exams, maybe scope it?
            # Or just link to Topic.
            subtopic = db.query(models.SubTopic).filter(models.SubTopic.name == sub_name, models.SubTopic.topic_id == topic.id).first()
            if not subtopic:
                subtopic = models.SubTopic(name=sub_name, topic_id=topic.id)
                db.add(subtopic)
                db.commit()
                db.refresh(subtopic)

            # --- 3. Image Logic ---
            # "Construeer de URL: http://localhost:8000/static/images/{Foto}"
            # "Als de cel leeg is of NaN, zet image_url = None."
            raw_foto = row.get('Foto')
            image_url = None
            if not pd.isna(raw_foto):
                foto_str = str(raw_foto).strip()
                if foto_str:
                    image_url = f"http://localhost:8000/static/images/{foto_str}"
            
            # --- 4. Question ---
            question_text = clean_text(row['Vraagtekst'])
            
            # Check if exists to prevent duplicates
            question = db.query(models.Question).filter(models.Question.question_number == q_num).first()
            if not question:
                question = models.Question(
                    question_number=q_num,
                    subtopic_id=subtopic.id,
                    text=question_text,
                    question_type=clean_text(row.get('Vraagtype')),
                    image_url=image_url
                )
                db.add(question)
                db.commit()
                db.refresh(question)
            
            # --- 5. Answers ---
            # "De kolom Antwoord bevat de tekst van het goede antwoord"
            correct_answer_text = clean_text(row['Antwoord']).lower().strip()
            
            # Create Options A, B, C, D
            options = [
                ('A', clean_text(row.get('Optie A'))),
                ('B', clean_text(row.get('Optie B'))),
                ('C', clean_text(row.get('Optie C'))),
                # Check if D exists (sometimes 3 options)
            ]
            if 'Optie D' in row and not pd.isna(row['Optie D']):
                 options.append(('D', clean_text(row['Optie D'])))

            # Clear existing options if any (full refresh logic for options)
            db.query(models.AnswerOption).filter(models.AnswerOption.question_id == question.id).delete()

            for letter, opt_text in options:
                if not opt_text:
                    continue
                    
                # Matching Logic
                # "Als OptieString == AntwoordString -> Zet is_correct = True"
                # Be robust: lower case comparison
                is_correct = (opt_text.lower().strip() == correct_answer_text)
                
                # Fallback: Sometimes 'Antwoord' is just 'A' or 'B'. 
                # Check if correct_answer_text matches the LETTER exactly.
                if not is_correct and len(correct_answer_text) == 1:
                     if correct_answer_text.upper() == letter:
                         is_correct = True
                
                opt = models.AnswerOption(
                    question_id=question.id,
                    option_letter=letter,
                    text=opt_text,
                    is_correct=is_correct
                )
                db.add(opt)
            
            db.commit()
            
            if index % 50 == 0:
                logger.info(f"Processed {index} rows...")

        logger.info("Import completed successfully!")

    except Exception as e:
        logger.error(f"Error during import: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import_data()
