"""
Seed Users Script - Create admin and student test users
"""
from database import SessionLocal, engine
from models import Base, User
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def seed_users():
    """Create admin and student users"""
    db = SessionLocal()
    
    try:
        # Check if users already exist
        existing_users = db.query(User).count()
        if existing_users > 0:
            print(f"⚠️  Database already has {existing_users} users. Skipping seed.")
            print("   Delete users manually if you want to re-seed.")
            return
        
        print("=" * 60)
        print("🌱 Seeding Users...")
        print("=" * 60)
        
        # Create admin user
        admin = User(
            email="admin@test.nl",
            hashed_password=hash_password("admin123"),
            role="admin",
            is_active=True
        )
        db.add(admin)
        print("✓ Created admin user: admin@test.nl / admin123")
        
        # Create student user
        student = User(
            email="student@test.nl",
            hashed_password=hash_password("student123"),
            role="student",
            is_active=True
        )
        db.add(student)
        print("✓ Created student user: student@test.nl / student123")
        
        db.commit()
        print("\n" + "=" * 60)
        print("✅ Users seeded successfully!")
        print("=" * 60)
        print("\nYou can now login with:")
        print("  Admin:   admin@test.nl / admin123")
        print("  Student: student@test.nl / student123")
        print()
        
    except Exception as e:
        print(f"\n❌ Error seeding users: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    # Make sure tables exist
    Base.metadata.create_all(bind=engine)
    seed_users()
