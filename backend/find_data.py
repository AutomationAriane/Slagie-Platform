
import sys
import os
sys.path.append(os.getcwd())
import models
from database import SessionLocal

def find_working_question():
    db = SessionLocal()
    try:
        # Check first 50 questions
        questions = db.query(models.Question).limit(50).all()
        for q in questions:
            correct = [o for o in q.answer_options if o.is_correct]
            if correct:
                wrong = [o for o in q.answer_options if not o.is_correct]
                if wrong:
                    with open("working_q.txt", "w") as f:
                        f.write(f"FOUND: q_id={q.id}, correct_opt_id={correct[0].id}, wrong_opt_id={wrong[0].id}, text='{correct[0].text}'")
                    print("Found!")
                    return
        print("NO_QUESTION_FOUND_WITH_CORRECT_ANSWER")
    except Exception as e:
        print(f"ERROR: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    find_working_question()
