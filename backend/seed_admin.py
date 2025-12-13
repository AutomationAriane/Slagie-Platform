import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'backend'))

import models
from database import SessionLocal, engine
from auth import get_password_hash
import traceback

def seed_admin():
    db = SessionLocal()
    print("DEBUG: Session created.")
    try:
        # Check if admin exists
        admin_email = "admin@slagie.nl"
        existing = db.query(models.User).filter(models.User.email == admin_email).first()
        
        if existing:
            print(f"Admin user already exists: {existing}")
            return

        # Create Admin
        print(f"Creating admin user: {admin_email}")
        raw_pw = "admin123"
        hashed_pw = get_password_hash(raw_pw)
        print(f"DEBUG: Password hashed. Hash length: {len(hashed_pw)}")

        admin = models.User(
            email=admin_email,
            hashed_password=hashed_pw,
            role="admin",
            is_active=True
        )
        db.add(admin)
        print("DEBUG: User added to session")
        db.commit()
        print("DEBUG: Commit successful")
        db.refresh(admin)
        print(f"Successfully created admin user: {admin}")
        
    except Exception as e:
        db.rollback()
        log_path = os.path.abspath("seed_error.log")
        with open(log_path, "w") as f:
            f.write(f"Error: {e}\n")
            traceback.print_exc(file=f)
        print(f"Error seeding admin: {e}")
        print(f"DEBUG: Log written to {log_path}")
        print(f"❌ Error seeding admin: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("DEBUG: Starting seed script...")
    # Ensure tables exist (including new Users table)
    models.Base.metadata.create_all(bind=engine)
    print("DEBUG: Tables verified.")
    seed_admin()
    print("DEBUG: Script finished.")
