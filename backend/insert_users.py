import sqlite3
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Connect to database
conn = sqlite3.connect('slagie.db')
cursor = conn.cursor()

# Hash passwords
admin_hash = pwd_context.hash("admin123")
student_hash = pwd_context.hash("student123")

# Insert users
try:
    cursor.execute("""
        INSERT INTO users (email, hashed_password, role, is_active)
        VALUES (?, ?, ?, ?)
    """, ("admin@test.nl", admin_hash, "admin", 1))
    
    cursor.execute("""
        INSERT INTO users (email, hashed_password, role, is_active)
        VALUES (?, ?, ?, ?)
    """, ("student@test.nl", student_hash, "student", 1))
    
    conn.commit()
    print("✅ Users created successfully!")
    print("  Admin:   admin@test.nl / admin123")
    print("  Student: student@test.nl / student123")
except sqlite3.IntegrityError:
    print("⚠️  Users already exist")
finally:
    conn.close()
