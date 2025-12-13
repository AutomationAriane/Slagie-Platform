"""
Verify seeded users in database
"""
from database import SessionLocal
from models import User

def verify_users():
    db = SessionLocal()
    
    try:
        users = db.query(User).all()
        
        print(f"✅ Found {len(users)} user(s) in database:\n")
        
        for user in users:
            print(f"  ID: {user.id}")
            print(f"  Email: {user.email}")
            print(f"  Role: {user.role}")
            print(f"  Active: {user.is_active}")
            print(f"  Password Hash: {user.hashed_password[:30]}...")
            print(f"  Created: {user.created_at}")
            print()
        
        return len(users) > 0
        
    except Exception as e:
        print(f"❌ Error querying users: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    success = verify_users()
    exit(0 if success else 1)
