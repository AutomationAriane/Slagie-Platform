# Slagie Backend - Clean Rebuild

## Quick Start

### 1. Install Dependencies
```bash
cd backend
pip install fastapi uvicorn sqlalchemy pandas openpyxl
```

### 2. Rebuild Database
```bash
python scripts/rebuild_database.py
```

Expected output:
```
🔧 Starting database rebuild...
📦 Dropping existing tables...
📦 Creating new tables...
📖 Reading Excel: ...
✅ Loaded XXX rows from Excel
✅ Created: Examen 1
✅ Created: Examen 2
...
✅ Database rebuild complete!
```

### 3. Start Backend (Port 8000)
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Test Endpoints
- Health: http://localhost:8000/health
- API Docs: http://localhost:8000/docs  
- Exams List: http://localhost:8000/api/exams

## Architecture

```
backend/
├── app/
│   ├── main.py          # FastAPI app with endpoints
│   ├── models.py        # SQLAlchemy models (Exam, Question, AnswerOption)
│   └── database.py      # SQLite configuration
├── scripts/
│   └── rebuild_database.py  # Database rebuild script
├── data/
│   └── TheorieToppers examen vragen (3).xlsx
└── slagie.db           # SQLite database (auto-created)
```

## API Contract

### GET /api/exams
Returns list of exams:
```json
[
  {
    "id": 1,
    "title": "Examen 1",
    "description": "Theorie-examen 1 (Vragen 1-50)",
    "questions_count": 50
  }
]
```

### GET /api/exams/{id}/start  
Returns questions with options:
```json
[
  {
    "id": 1,
    "text": "Vraag text...",
    "image_url": "http://localhost:8000/static/images/11_50.png",
    "options": [
      {"id": 1, "label": "A", "text": "..."},
      {"id": 2, "label": "B", "text": "..."}
    ]
  }
]
```

### POST /api/exams/check-answer
Request:
```json
{
  "question_id": 1,
  "selected_option_id": 5
}
```

Response:
```json
{
  "is_correct": true,
  "correct_answer_text": "Het juiste antwoord"
}
```
