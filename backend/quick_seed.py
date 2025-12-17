"""
Quick user seeder - Creates admin and student users
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User
from auth import get_password_hash

def main():
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check existing users
        count = db.query(User).count()
        if count > 0:
            print(f"⚠️  {count} users already exist. Skipping.")
            return
        
        print("Creating users...")
        
        # Admin user
        admin = User(
            email="admin@test.nl",
            hashed_password=get_password_hash("admin123"),
            role="admin",
            is_active=True
        )
        db.add(admin)
        
        # Student user
        student = User(
            email="student@test.nl",
            hashed_password=get_password_hash("student123"),
            role="student",
            is_active=True
        )
        db.add(student)
        
        db.commit()
        
        print("✅ Users created!")
        print("   Admin:   admin@test.nl / admin123")
        print("   Student: student@test.nl / student123")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
