import sys
import os
import random

# Set up path to import backend modules
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend.database import SessionLocal, engine
from backend.models import Base, ExamQuestionItem, ExamAnswerOption

def seed_cbr_questions():
    print("Seeding CBR Questions...")
    db = SessionLocal()
    
    try:
        # Clear existing? Maybe not, just finish if we have enough.
        # But for valid test, let's just add if count is low.
        
        # 1. Gevaarherkenning (Need 25)
        # Type: Drag Drop / Hotspot usually, but here we model as basic Qs for now or specific format
        # GH usually has "Remmen", "Gas loslaten", "Niets doen"
        print("Seeding Gevaarherkenning...")
        for i in range(30):
            q = ExamQuestionItem(
                question_text=f"Gevaarherkenning Situatie {i+1}: U ziet een bal de weg op rollen. Wat doet u?",
                question_type="multiple_choice",
                cbr_topic="Gevaarherkenning",
                cbr_subtopic="Gevaarherkenning algemeen",
                explanation="Bij direct gevaar moet u remmen."
            )
            db.add(q)
            db.flush()
            
            # Answers: A=Remmen, B=Gas los, C=Niets
            opts = [
                ("Remmen", True),
                ("Gas loslaten", False),
                ("Niets doen", False)
            ]
            for idx, (txt, corr) in enumerate(opts):
                db.add(ExamAnswerOption(question_id=q.id, answer_text=txt, is_correct=corr, order=idx))
        
        # 2. Kennis (Need 12)
        print("Seeding Kennis...")
        for i in range(20):
            q = ExamQuestionItem(
                question_text=f"Kennis Vraag {i+1}: Wat is de maximumsnelheid op een autoweg?",
                question_type="multiple_choice",
                cbr_topic="Kennis",
                cbr_subtopic="Wegen en snelheden",
                explanation="Op een autoweg is de maximumsnelheid 100 km/u, tenzij anders aangegeven."
            )
            db.add(q)
            db.flush()
            
            opts = [
                ("80 km/u", False),
                ("100 km/u", True),
                ("120 km/u", False),
                ("130 km/u", False)
            ]
            for idx, (txt, corr) in enumerate(opts):
                db.add(ExamAnswerOption(question_id=q.id, answer_text=txt, is_correct=corr, order=idx))

        # 3. Inzicht (Need 28)
        print("Seeding Inzicht...")
        for i in range(35):
            q = ExamQuestionItem(
                question_text=f"Inzicht Situatie {i+1}: U wilt inhalen maar er is een tegenligger in de verte. Het is mistig.",
                question_type="multiple_choice",
                cbr_topic="Inzicht",
                cbr_subtopic="Inhalen en voorbijgaan",
                explanation="Bij mist is het inschatten van afstand en snelheid lastig. Niet inhalen."
            )
            db.add(q)
            db.flush()
            
            opts = [
                ("Inhalen, want de tegenligger is ver", False),
                ("Niet inhalen", True),
                ("Toeteren en inhalen", False)
            ]
            for idx, (txt, corr) in enumerate(opts):
                db.add(ExamAnswerOption(question_id=q.id, answer_text=txt, is_correct=corr, order=idx))

        db.commit()
        print("Seeding Complete!")
        
    except Exception as e:
        print(f"Error seeding: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_cbr_questions()
