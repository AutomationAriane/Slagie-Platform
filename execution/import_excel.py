#!/usr/bin/env python3
"""
Script om Excel data (TheorieToppers examen vragen) in te lezen en in de database in te zetten.

Excel kolommen verwacht:
- Vraagnummer: int
- Vraagtekst: str
- Antwoord (A/B/C/D): str
- Optie A: str
- Optie B: str
- Optie C: str
- Optie D: str
- Vraagtype: str
- CBR Thema: str
- Onderwerp: str
- Foto: str (optioneel)
"""

import os
import sys
from pathlib import Path
import openpyxl
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Voeg backend dir toe aan path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

import models
from config import DATABASE_URL

# Verbind met database
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

# Maak tabellen
models.Base.metadata.create_all(bind=engine)

def import_excel(excel_path: str):
    """
    Import vragen uit Excel bestand
    """
    print(f"📂 Inladen Excel bestand: {excel_path}")
    
    if not os.path.exists(excel_path):
        print(f"❌ Bestand niet gevonden: {excel_path}")
        return
    
    # Open Excel
    workbook = openpyxl.load_workbook(excel_path)
    worksheet = workbook.active
    
    # Zet headers in dict
    headers = {}
    for col_num, cell in enumerate(worksheet[1], 1):
        headers[cell.value] = col_num
    
    print(f"📋 Headers gevonden: {list(headers.keys())}")
    
    # Verwerk rijen
    row_count = 0
    for row_num, row in enumerate(worksheet.iter_rows(min_row=2, values_only=False), start=2):
        try:
            # Lees data uit cel
            vraagnummer = row[headers.get("Vraagnummer", 1) - 1].value
            vraagtekst = row[headers.get("Vraagtekst", 2) - 1].value
            antwoord_letter = row[headers.get("Antwoord (A/B..", 3) - 1].value
            optie_a = row[headers.get("Optie A", 4) - 1].value
            optie_b = row[headers.get("Optie B", 5) - 1].value
            optie_c = row[headers.get("Optie C", 6) - 1].value
            optie_d = row[headers.get("Optie D", 7) - 1].value
            vraagtype = row[headers.get("Vraagtype", 8) - 1].value
            cbr_thema = row[headers.get("CBR Thema", 9) - 1].value
            onderwerp = row[headers.get("Onderwerp", 10) - 1].value
            foto = row[headers.get("Foto", 11) - 1].value
            
            # Skip lege rijen
            if not vraagnummer or not vraagtekst:
                continue
            
            # Check of Topic exists, anders maak aan
            topic = session.query(models.Topic).filter_by(name=cbr_thema).first()
            if not topic:
                topic = models.Topic(name=cbr_thema, description=f"CBR Thema: {cbr_thema}")
                session.add(topic)
                session.flush()  # Zorg dat topic.id beschikbaar is
                print(f"  ✅ Nieuw topic gemaakt: {cbr_thema}")
            
            # Check of SubTopic exists, anders maak aan
            subtopic = session.query(models.SubTopic).filter_by(
                topic_id=topic.id,
                name=onderwerp
            ).first()
            if not subtopic:
                subtopic = models.SubTopic(
                    topic_id=topic.id,
                    name=onderwerp,
                    description=f"Onderwerp: {onderwerp}"
                )
                session.add(subtopic)
                session.flush()  # Zorg dat subtopic.id beschikbaar is
                print(f"  ✅ Nieuw onderwerp gemaakt: {onderwerp}")
            
            # Maak Question aan
            question = models.Question(
                question_number=int(vraagnummer),
                subtopic_id=subtopic.id,
                text=vraagtekst,
                question_type=vraagtype,
                image_path=foto
            )
            session.add(question)
            session.flush()  # Zorg dat question.id beschikbaar is
            
            # Maak AnswerOptions aan
            options = {
                'A': optie_a,
                'B': optie_b,
                'C': optie_c,
                'D': optie_d,
            }
            
            # Zet is_correct op basis van antwoord_letter
            antwoord_letter = str(antwoord_letter).upper().strip() if antwoord_letter else None
            
            for letter, text in options.items():
                if text:  # Alleen als er tekst is
                    option = models.AnswerOption(
                        question_id=question.id,
                        option_letter=letter,
                        text=text,
                        is_correct=(letter == antwoord_letter)
                    )
                    session.add(option)
            
            row_count += 1
            if row_count % 10 == 0:
                print(f"  📝 {row_count} vragen verwerkt...")
        
        except Exception as e:
            print(f"⚠️  Fout bij rij {row_num}: {str(e)}")
            continue
    
    # Commit alle wijzigingen
    try:
        session.commit()
        print(f"\n✅ Succes! {row_count} vragen in database gezet.")
    except Exception as e:
        session.rollback()
        print(f"❌ Fout bij opslaan: {str(e)}")
    finally:
        session.close()

if __name__ == "__main__":
    # Standaard locatie
    excel_file = Path(__file__).parent.parent / "data" / "TheorieToppers examen vragen (3).xlsx"
    
    # Of van command line argument
    if len(sys.argv) > 1:
        excel_file = sys.argv[1]
    
    import_excel(str(excel_file))
