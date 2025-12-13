"""
Seed initial test users with hashed passwords
"""
from database import SessionLocal
from models import User
from auth import get_password_hash

def seed_users():
    db = SessionLocal()
    
    try:
        # Check if users already exist
        existing_users = db.query(User).count()
        if existing_users > 0:
            print(f"⚠️  Database already has {existing_users} user(s). Skipping seed.")
            return
        
        print("Seeding test users...")
        
        # Create test users
        users = [
            User(
                email="student@test.nl",
                hashed_password=get_password_hash("test123"),
                role="student",
                is_active=True
            ),
            User(
                email="admin@test.nl",
                hashed_password=get_password_hash("admin123"),
                role="admin",
                is_active=True
            )
        ]
        
        for user in users:
            db.add(user)
            print(f"  ✅ Created {user.role}: {user.email}")
        
        db.commit()
        print(f"\n✅ Successfully seeded {len(users)} users!")
        print("\nTest credentials:")
        print("  Student: student@test.nl / test123")
        print("  Admin:   admin@test.nl / admin123")
        
    except Exception as e:
        print(f"❌ Error seeding users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()
