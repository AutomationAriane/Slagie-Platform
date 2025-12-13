"""
Script to create/update database tables with User model
"""
from database import Base, engine
from models import User, Topic, SubTopic, Question, AnswerOption, QuizAttempt

def create_tables():
    """Create all tables defined in models"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")
    
    # Print all tables
    print("\nCreated tables:")
    for table_name in Base.metadata.tables.keys():
        print(f"  - {table_name}")

if __name__ == "__main__":
    create_tables()
