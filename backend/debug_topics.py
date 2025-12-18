from sqlalchemy import create_engine, text
from database import DATABASE_URL

engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    print("--- COUNTS ---")
    
    # Gevaarherkenning
    gh = conn.execute(text("SELECT COUNT(*) FROM exam_question_items WHERE cbr_topic = 'Gevaarherkenning'")).scalar()
    print(f"Gevaarherkenning: {gh}")

    # Kennis
    kn = conn.execute(text("SELECT COUNT(*) FROM exam_question_items WHERE cbr_topic = 'Kennis'")).scalar()
    print(f"Kennis: {kn}")

    # Inzicht (Everything else)
    inz = conn.execute(text("SELECT COUNT(*) FROM exam_question_items WHERE cbr_topic NOT IN ('Gevaarherkenning', 'Kennis')")).scalar()
    print(f"Inzicht (Rest): {inz}")
