"""
Direct seed script to add test users
"""
import sys
sys.path.insert(0, '.')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User, Base
from auth import get_password_hash

# Direct database connection
engine = create_engine('sqlite:///./slagie.db')
Session = sessionmaker(bind=engine)
db = Session()

try:
    # Check existing users
    count = db.query(User).count()
    print(f"Current users in database: {count}")
    
    if count > 0:
        print("\nExisting users:")
        for u in db.query(User).all():
            print(f"  - {u.email} (role: {u.role})")
        
        response = input("\nDelete all users and reseed? (y/n): ")
        if response.lower() == 'y':
            db.query(User).delete()
            db.commit()
            print("Deleted all users")
        else:
            print("Keeping existing users, exiting...")
            sys.exit(0)
    
    # Create test users
    print("\nCreating test users...")
    
    student = User(
        email="student@test.nl",
        hashed_password=get_password_hash("test123"),
        role="student",
        is_active=True
    )
    
    admin = User(
        email="admin@test.nl",
        hashed_password=get_password_hash("admin123"),
        role="admin",
        is_active=True
    )
    
    db.add(student)
    db.add(admin)
    db.commit()
    
    print("\n✅ Successfully created test users!")
    print("\nCredentials:")
    print("  Student: student@test.nl / test123")
    print("  Admin:   admin@test.nl / admin123")
    
    # Verify
    print("\nVerifying...")
    for u in db.query(User).all():
        print(f"  ✓ {u.email} (role: {u.role}, active: {u.is_active})")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()
