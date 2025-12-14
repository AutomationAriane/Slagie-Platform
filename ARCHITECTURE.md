# Slagie Platform - Architecture & Documentation

## 1. System Overview
Slagie is a modern e-learning platform for CBR driving theory exams. It consists of a high-performance FastAPI backend and a responsive React frontend.

## 2. Tech Stack

### Frontend (User Interface)
- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Custom Theme: Teal/Green/Orange)
- **Icons**: Lucide React
- **State Management**: React Context (AuthContext)
- **Routing**: React Router v6

### Backend (API & Logic)
- **Framework**: FastAPI (Python)
- **Database**: SQLite (via SQLAlchemy)
- **Data Processing**: Pandas (Excel Import)
- **API Documentation**: Swagger UI (`/docs`)

## 3. Environment & Ports

| Service  | URL | Port | Description |
|----------|-----|------|-------------|
| **Frontend** | http://localhost:5174 | `5174` | Main user interface (Login, Dashboard) |
| **Backend** | http://localhost:8000 | `8000` | API, Database, Logic |
| **API Docs** | http://localhost:8000/docs | `8000` | Interactive API testing |

## 4. Authentication (Current State: MOCK)

⚠️ **NOTE:** The frontend is currently running in **Dev/Mock Mode** for authentication. It is NOT yet connected to the backend login endpoint.

### Access Credentials
You can use **ANY** email and password to log in. The system is programmed to accept all inputs for testing UI flows.

**Recommended Test Credentials:**

**Admin:**
- **Email**: `admin@test.nl`
- **Password**: `admin123`

**Student:**
- **Email**: `student@test.nl`
- **Password**: `student123`

*(Clicking "Inloggen" will simply set a dummy admin user in the session and redirect you to the Admin Dashboard).*

## 5. Project Structure

```
Slagie Platform/
├── backend/                # Python FastAPI Application
│   ├── app/
│   │   ├── main.py        # API Entry Point
│   │   ├── models.py      # Database Schemas
│   │   └── database.py    # DB Connection
│   └── scripts/           # Import/Rebuild Scripts
│
├── frontend/               # Vite React Application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Global State (Auth)
│   │   ├── pages/         # Full Page Views
│   │   │   ├── LoginPage.tsx
│   │   │   └── AdminDashboard.tsx
│   │   └── App.tsx        # Main Routing
│   └── vite.config.ts     # Build Configuration
│
└── ARCHITECTURE.md         # This file
```

## 6. Key Workflows

### 1. Database Rebuild
To reset the database and import questions from Excel:
```bash
cd backend
py scripts/rebuild_database.py
```

### 2. Start Backend
```bash
cd backend
py -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```
