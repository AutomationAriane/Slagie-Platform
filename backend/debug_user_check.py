import sys
import os
sys.path.append(os.getcwd())

from database import SessionLocal
from models import User
from auth import verify_password

db = SessionLocal()
print("--- USER DEBUG ---")
try:
    user = db.query(User).filter(User.email == "student@test.nl").first()
    if user:
        print(f"User found: {user.email}")
        print(f"Role: {user.role}")
        print(f"Is Active: {user.is_active}")
        
        is_valid = verify_password("student123", user.hashed_password)
        print(f"Check password 'student123': {'PASSED' if is_valid else 'FAILED'}")
    else:
        print("❌ User 'student@test.nl' NOT FOUND in database")
        
    # List all users just in case
    print("\nAll Users:")
    for u in db.query(User).all():
        print(f" - {u.email} ({u.role})")
        
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
