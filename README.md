# Slagie - SaaS Theorie-Platform

Een volledige Full-Stack SaaS platform voor voorbereiding op CBR theorie-examens, gebouwd met **FastAPI + React + PostgreSQL + Docker**.

## 🚀 Project Overzicht

**Slagie** is een modern, mobielvriendelijk platform waar studenten kunnen oefenen met echte CBR examenvragen georganiseerd per thema.

### Tech Stack

**Backend:**
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- PostgreSQL (Database)
- Uvicorn (ASGI server)

**Frontend:**
- React 18
- React Router DOM
- Tailwind CSS
- Axios (HTTP client)

**DevOps:**
- Docker & Docker Compose
- Multi-container setup

## 📦 Project Structuur

```
Slagie Platform/
├── backend/                 # FastAPI applicatie
│   ├── main.py             # FastAPI app & routes
│   ├── models.py           # SQLAlchemy modellen
│   ├── database.py         # Database configuratie
│   ├── config.py           # Config & environment
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile          # Backend container
│   └── .env                # Environment variabelen
│
├── frontend/               # React applicatie
│   ├── src/
│   │   ├── App.js          # Main component
│   │   ├── index.js        # Entry point
│   │   ├── index.css       # Global styles
│   │   ├── api.js          # API client
│   │   ├── pages/
│   │   │   ├── LandingPage.js   # Home page
│   │   │   └── Dashboard.js     # Admin dashboard
│   │   └── components/
│   │       └── TopicCard.js     # Topic card component
│   ├── public/
│   │   └── index.html      # HTML entry
│   ├── package.json        # Dependencies
│   ├── tailwind.config.js  # Tailwind config
│   ├── postcss.config.js   # PostCSS config
│   ├── Dockerfile          # Frontend container
│   └── .gitignore
│
├── scripts/
│   └── import_excel.py     # Excel import utility
│
├── data/                   # Data directory (plaats Excel hier)
│   └── TheorieToppers examen vragen (3).xlsx
│
├── docker-compose.yml      # Container orchestration
├── .env.example            # Environment template
└── README.md              # Dit bestand
```

## 🛠️ Setup & Installatie

### Vereisten

- Docker & Docker Compose
- Of: Python 3.11+, Node.js 18+, PostgreSQL 15

### Optie 1: Met Docker (Aanbevolen)

1. **Clone/Navigeer naar project:**
   ```bash
   cd "Slagie Platform"
   ```

2. **Start containers:**
   ```bash
   docker-compose up -d
   ```

3. **Wacht totdat alle services goed zijn:**
   ```bash
   docker-compose logs -f
   ```

4. **Importeer Excel data:**
   ```bash
   docker-compose exec backend python ../scripts/import_excel.py
   ```

5. **Open browser:**
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8000/docs

### Optie 2: Lokaal (Development)

#### Backend Setup

```bash
cd backend

# Maak virtual environment
python -m venv venv
source venv/Scripts/activate  # Windows
# source venv/bin/activate    # macOS/Linux

# Installeer dependencies
pip install -r requirements.txt

# Start server
python main.py
# Of: uvicorn main:app --reload
```

Backend draait op: `http://localhost:8000`

#### Frontend Setup

```bash
cd frontend

# Installeer dependencies
npm install

# Start dev server
npm start
```

Frontend draait op: `http://localhost:3000`

#### Database Setup

```bash
# PostgreSQL moet draaien (lokaal of Docker)
# Update DATABASE_URL in backend/.env als nodig
```

## 📊 Excel Data Importeren

### Stap 1: Excel voorbereiding

Zet je Excel bestand (`TheorieToppers examen vragen (3).xlsx`) in de `data/` map.

**Verwachte kolommen:**
- Vraagnummer (int)
- Vraagtekst (tekst)
- Antwoord (A/B/C/D) (letter)
- Optie A (tekst)
- Optie B (tekst)
- Optie C (tekst)
- Optie D (tekst)
- Vraagtype (tekst, optioneel)
- CBR Thema (tekst)
- Onderwerp (tekst)
- Foto (path, optioneel)

### Stap 2: Import script runnen

**Met Docker:**
```bash
docker-compose exec backend python ../scripts/import_excel.py
```

**Lokaal:**
```bash
cd backend
python ../scripts/import_excel.py
```

Dit zal:
1. ✅ Excel bestand inlezen
2. ✅ Topics (CBR Thema's) aanmaken
3. ✅ SubTopics (Onderwerpen) aanmaken
4. ✅ Questions (Vragen) aanmaken
5. ✅ AnswerOptions aanmaken met `is_correct` gebaseerd op antwoord letter

## 🎨 Branding & Kleuren

### Tailwind Color Scheme

```javascript
// tailwind.config.js
colors: {
  "slagie-teal": "#14b8a6",      // Teal/Turquoise
  "slagie-green": "#10b981",     // Fris Groen
  "slagie-accent": "#FF7F50",    // Oranje
}
```

### Gradient

```html
<!-- Primaire gradient: Teal → Groen -->
<div class="bg-slagie-gradient">...</div>
```

### Typografie

- **Headers**: Wit op gradient achtergrond
- **Body text**: Donkergrijs (#1f2937) op wit
- **Accents**: Oranje voor CTA buttons

## 🚀 API Endpoints

### Topics (CBR Thema's)

```http
GET /api/topics
GET /api/topics/{topic_id}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Verkeerstekens",
      "description": "...",
      "subtopic_count": 5
    }
  ]
}
```

### SubTopics (Onderwerpen)

```http
GET /api/subtopics/{subtopic_id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Waarschuwingstekens",
    "topic_id": 1,
    "questions": [...]
  }
}
```

### Questions (Vragen)

```http
GET /api/questions/{question_id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "question_number": 42,
    "text": "Wat betekent dit teken?",
    "options": [
      {
        "id": 1,
        "letter": "A",
        "text": "Voorzorg",
        "is_correct": false
      },
      {
        "id": 2,
        "letter": "B",
        "text": "Gevaar",
        "is_correct": true
      }
    ]
  }
}
```

## 📱 Pagina's

### Landing Page (`/`)

- Full-width gradient header met hero copy
- "Klaar om te slagen voor je theorie-examen?"
- Twee CTA buttons: "Start Gratis Proef" (Oranje) & "Neem Contact Op" (Wit)
- Features section
- Footer

### Dashboard (`/dashboard`)

- Overzicht van alle CBR Thema's
- Card-based layout met gradient headers
- Statistieken per thema
- Start button per thema

## 🔧 Development

### Hot Reload

Beide containers hebben volume mounts voor development:

```bash
# Backend: /app is gemap naar ./backend
# Frontend: /app is gemap naar ./frontend
```

Wijzigingen aan code worden direct gereloaded!

### Database Browser

Connecteer met pgAdmin of postico:

```
Host: localhost:5432
Database: slagie_db
User: slagie
Password: slagie_pass
```

## 🐛 Troubleshooting

### Database connection error

```bash
# Zorg dat PostgreSQL draait
docker-compose ps

# Herstart postgres
docker-compose restart postgres
```

### Frontend kan backend niet bereiken

```bash
# Check of backend API draait
curl http://localhost:8000/health

# Update REACT_APP_API_URL in frontend .env
```

### Excel import faalt

```bash
# Check Excel kolom namen
# Zorg dat Excel in data/ map staat
# Kijk naar script output voor details
```

## 📝 Volgende Stappen

- [ ] Quiz/Examen functionaliteit
- [ ] User authentication (Login/Signup)
- [ ] Resultaten tracking & analytics
- [ ] Mobile app (React Native)
- [ ] Spaced repetition algorithm
- [ ] Multiplayer mode

## 📄 Licentie

Gesloten source - Slagie © 2025

## 👥 Contact

Voor vragen: contact@slagie.nl

---

**Veel sterkte met je theorie-examen! 🚗✨**
