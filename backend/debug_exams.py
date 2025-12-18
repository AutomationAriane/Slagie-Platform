
import sys
import os

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models import Exam

db = SessionLocal()
print("--- EXAM DEBUG ---")
exams = db.query(Exam).all()
print(f"Total Exams: {len(exams)}")

for e in exams:
    print(f"ID: {e.id} | Title: {e.title} | Published: {e.is_published} | Questions: {len(e.questions)}")

if not exams:
    print("❌ No exams found in database.")

db.close()
