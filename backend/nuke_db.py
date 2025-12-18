import sys
import os
sys.path.append(os.getcwd())

from database import engine, Base
import models # Import models to register them with Base

def reset_db():
    print("WARNING: This will delete all data!")
    print("Dropping tables...")
    Base.metadata.drop_all(bind=engine)
    print("Tables dropped.")
    
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created with new schema.")

if __name__ == "__main__":
    reset_db()
