# Slagie - Full Stack Project

Compleet SaaS platform voor CBR theorie-examen voorbereiding.

## 🚀 Quick Start

### Met Docker (Aanbevolen)

```bash
docker-compose up -d
```

Open browser:
- Frontend: http://localhost:3000
- Backend API Docs: http://localhost:8000/docs

### Lokaal Development

**Backend:**
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## 📊 Excel Data Importeren

1. Zet Excel bestand in `data/` map
2. Draai import script:

```bash
# Met Docker
docker-compose exec backend python ../scripts/import_excel.py

# Lokaal
cd backend
python ../scripts/import_excel.py
```

## 🎨 Branding

- **Primair**: Teal (#14b8a6) → Groen (#10b981) gradient
- **Accent**: Oranje (#FF7F50) voor buttons
- **Typografie**: Wit op kleur, donkergrijs op wit

## 📚 Database Schema

```
Topics (CBR Thema's)
  ├── SubTopics (Onderwerpen)
  │   ├── Questions (Vragen)
  │   │   └── AnswerOptions (A, B, C, D)
```

## 📱 Pages

- **`/`** - Landing page met hero section
- **`/dashboard`** - Topic overview met cards

## 🔗 API Endpoints

- `GET /api/topics` - Alle topics
- `GET /api/topics/{id}` - Specifiek topic
- `GET /api/subtopics/{id}` - Onderwerp met vragen
- `GET /api/questions/{id}` - Specifieke vraag

---

Voor meer details zie:
- `README.md` - Uitgebreide documentatie
- `BACKEND_STARTUP.md` - Backend setup guide
- `FRONTEND_STARTUP.md` - Frontend setup guide
