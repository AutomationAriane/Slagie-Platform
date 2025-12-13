#!/usr/bin/env python
"""
Import questions from the Excel source, including embedded images.

Key features:
- Reads the .xlsx source (NOT CSV)
- Extracts images from column J ("Foto") using openpyxl-image-loader
- Saves images to backend/static/images/ as vraag_{vraagnummer_clean}.png
- Stores full image URL in DB: http://localhost:8000/static/images/vraag_{vraagnummer_clean}.png
- Parses question number like "11/50" to integer 11 for `question_number`
- Creates 3 exams if none exist yet; distributes questions round-robin
- Reuses or creates SubTopics per (exam, theme) to avoid duplicates

Run inside the backend container:
    docker-compose exec backend python scripts/import_with_images.py
"""
import os
import sys
from pathlib import Path
from typing import Dict, Optional, Tuple

import openpyxl
from openpyxl_image_loader import SheetImageLoader
from PIL import Image

# Ensure project root (/app) is on sys.path when running as a script
CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import models
from database import SessionLocal, engine


DATA_FILENAME = "TheorieToppers examen vragen (3).xlsx"


def get_backend_root() -> Path:
    return Path(__file__).resolve().parent.parent


def get_excel_path() -> Path:
    # Prefer backend/data/ relative path
    candidate = get_backend_root() / "data" / DATA_FILENAME
    return candidate


def ensure_dirs() -> Path:
    """Ensure static images dir exists and return its Path."""
    images_dir = get_backend_root() / "static" / "images"
    images_dir.mkdir(parents=True, exist_ok=True)
    return images_dir


def parse_question_number(raw) -> Optional[int]:
    if raw is None:
        return None
    s = str(raw).strip()
    if not s:
        return None
    if "/" in s:
        s = s.split("/")[0]
    # keep only digits at start
    digits = "".join(ch for ch in s if ch.isdigit())
    if not digits:
        return None
    try:
        return int(digits)
    except ValueError:
        return None


def clean_for_filename(raw) -> str:
    if raw is None:
        return ""
    s = str(raw).strip().replace("/", "_")
    # keep alnum, underscore, dash
    safe = [c for c in s if c.isalnum() or c in ("_", "-")]
    return "".join(safe)


def get_headers(ws) -> Dict[str, int]:
    headers: Dict[str, int] = {}
    for idx, cell in enumerate(ws[1], 1):
        if cell.value:
            headers[str(cell.value).strip().lower()] = idx
    return headers


def get_col(headers: Dict[str, int], key: str, default_col_index: int) -> int:
    return headers.get(key, default_col_index)


def get_or_create_subtopic(db, exam_id: int, theme: str) -> models.SubTopic:
    theme = (theme or "Algemeen").strip()
    st = (
        db.query(models.SubTopic)
        .filter(models.SubTopic.topic_id == exam_id, models.SubTopic.name == theme)
        .first()
    )
    if st:
        return st
    st = models.SubTopic(topic_id=exam_id, name=theme, description=None)
    db.add(st)
    db.flush()
    return st


def extract_and_save_image(image_loader: SheetImageLoader, row_idx: int, filename: str, images_dir: Path) -> Optional[str]:
    """Try to get image from column J at given row and save as PNG. Return stored path or filename (not full URL)."""
    cell_ref = f"J{row_idx}"
    try:
        img = image_loader.get(cell_ref)
    except Exception:
        img = None
    if img is None:
        return None

    target_path = images_dir / f"{filename}.png"
    try:
        # Ensure mode suitable for PNG
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGB")
        img.save(target_path, format="PNG")
        # Store only filename; API will build full URL dynamically
        return f"{filename}.png"
    except Exception as e:
        print(f"⚠️  Could not save image for row {row_idx}: {e}")
        return None


def ensure_exams(db) -> Tuple[int, int, int]:
    exams = db.query(models.Topic).order_by(models.Topic.id.asc()).all()
    if len(exams) >= 3:
        return (exams[0].id, exams[1].id, exams[2].id)

    needed = 3 - len(exams)
    for i in range(needed):
        ex = models.Topic(name=f"Examen {len(exams)+i+1}", description=f"CBR Theorie Examen {len(exams)+i+1}")
        db.add(ex)
        db.flush()
        exams.append(ex)
    db.commit()
    return (exams[0].id, exams[1].id, exams[2].id)


def main():
    excel_path = get_excel_path()
    if not excel_path.exists():
        print(f"❌ Excel bestand niet gevonden: {excel_path}")
        return

    images_dir = ensure_dirs()

    # Load workbook and sheet
    wb = openpyxl.load_workbook(excel_path)
    ws = wb.active
    headers = get_headers(ws)

    # Column defaults (0-based to 1-based index mapping by openpyxl):
    # A: Vraagnummer (1), B: Vraagtekst (2), C: Correct antwoord (3),
    # D-G: Opties A-D (4..7), I: Thema (9), J: Foto (10)
    col_vraagnummer = get_col(headers, "vraagnummer", 1)
    col_vraagtekst = get_col(headers, "vraagtekst", 2)
    col_correct = get_col(headers, "correct antwoord", 3)
    col_opt_a = get_col(headers, "optie a", 4)
    col_opt_b = get_col(headers, "optie b", 5)
    col_opt_c = get_col(headers, "optie c", 6)
    col_opt_d = get_col(headers, "optie d", 7)
    # Thema header may vary
    col_thema = headers.get("cbr thema", headers.get("thema", 9))

    db = SessionLocal()
    try:
        # Create tables if needed
        models.Base.metadata.create_all(bind=engine)

        # Ensure 3 exams and prepare round-robin
        exam_ids = ensure_exams(db)
        rr = 0

        # To keep things clean, delete existing Questions and Options, keep Topics/SubTopics
        print("🗑️  Verwijder bestaande vragen en opties...")
        db.query(models.AnswerOption).delete()
        db.query(models.Question).delete()
        db.commit()

        # Cache of (exam_id -> {theme -> SubTopic})
        subtopic_cache: Dict[int, Dict[str, models.SubTopic]] = {}

        # Prepare image loader
        image_loader = SheetImageLoader(ws)

        imported = 0
        with_images = 0

        for row_idx in range(2, ws.max_row + 1):
            raw_num = ws.cell(row_idx, col_vraagnummer).value
            question_number = parse_question_number(raw_num)
            question_text = ws.cell(row_idx, col_vraagtekst).value
            if not question_text or question_number is None:
                continue

            theme = ws.cell(row_idx, col_thema).value or "Algemeen"
            opt_a = ws.cell(row_idx, col_opt_a).value
            opt_b = ws.cell(row_idx, col_opt_b).value
            opt_c = ws.cell(row_idx, col_opt_c).value
            opt_d = ws.cell(row_idx, col_opt_d).value
            correct_raw = ws.cell(row_idx, col_correct).value
            correct_letter = str(correct_raw).strip().upper() if correct_raw else None

            # Determine exam
            exam_id = exam_ids[rr % 3]
            rr += 1

            # Get or create SubTopic per theme
            cache_for_exam = subtopic_cache.setdefault(exam_id, {})
            st = cache_for_exam.get(theme)
            if not st:
                st = get_or_create_subtopic(db, exam_id, theme)
                cache_for_exam[theme] = st

            # Try to extract image at column J
            filename_stub = f"vraag_{clean_for_filename(raw_num)}" if raw_num else f"vraag_{question_number}"
            image_url = extract_and_save_image(image_loader, row_idx, filename_stub, images_dir)
            if image_url:
                with_images += 1

            # Create Question
            q = models.Question(
                question_number=question_number,
                subtopic_id=st.id,
                text=str(question_text),
                question_type="multiple_choice",
                image_url=image_url,
                theme=str(theme),
            )
            db.add(q)
            db.flush()

            # Create options
            def is_corr(letter: str) -> bool:
                return bool(correct_letter and letter == correct_letter)

            options = [
                ("A", opt_a, is_corr("A")),
                ("B", opt_b, is_corr("B")),
                ("C", opt_c, is_corr("C")),
                ("D", opt_d, is_corr("D")),
            ]
            for letter, text, is_correct in options:
                if text and str(text).strip():
                    db.add(models.AnswerOption(
                        question_id=q.id,
                        option_letter=letter,
                        text=str(text),
                        is_correct=bool(is_correct),
                    ))

            imported += 1
            if imported % 25 == 0:
                print(f"  ✓ {imported} vragen verwerkt...")

        db.commit()
        print("\n============================================================")
        print("✅ Import gereed")
        print(f"  - Vragen geïmporteerd: {imported}")
        print(f"  - Met afbeeldingen:  {with_images}")
        print("============================================================")
    finally:
        db.close()


if __name__ == "__main__":
    main()
