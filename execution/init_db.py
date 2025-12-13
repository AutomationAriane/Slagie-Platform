#!/usr/bin/env python3
"""
Database initialization script voor Slagie
Maakt alle tabellen aan en zet opmaak
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from database import engine
import models

def init_db():
    """Initialize database"""
    print("🔧 Database initialiseren...")
    
    # Maak alle tabellen
    models.Base.metadata.create_all(bind=engine)
    
    print("✅ Database klaar!")
    print("\nTabellen gemaakt:")
    print("  - topics (CBR Thema's)")
    print("  - subtopics (Onderwerpen)")
    print("  - questions (Vragen)")
    print("  - answer_options (Antwoordopties)")
    print("\nVolgende stap: Excel data importeren met import_excel.py")

if __name__ == "__main__":
    init_db()
