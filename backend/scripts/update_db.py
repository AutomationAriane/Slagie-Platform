
import sys
import os

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import engine, Base
from models import UserExamAttempt

# Create all tables (only creates missing ones)
print("Updating database schema...")
Base.metadata.create_all(bind=engine)
print("Database schema updated successfully.")
