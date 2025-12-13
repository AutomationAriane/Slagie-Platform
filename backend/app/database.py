"""
Database configuration for Slagie Platform
SQLite database setup
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# SQLite database file
DATABASE_URL = "sqlite:///./slagie.db"

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # For SQLite
    echo=False  # Set to True for SQL debugging
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Dependency for FastAPI endpoints"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
