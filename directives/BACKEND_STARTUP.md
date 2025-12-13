# Slagie Backend API Server Startup Guide

Om de backend server te starten, kunt u volgende commando's gebruiken:

## 1. Met Docker Compose (Aanbevolen)

```bash
docker-compose up -d
```

Dit zal automatisch alle services starten:
- PostgreSQL database (port 5432)
- FastAPI backend (port 8000)
- React frontend (port 3000)

## 2. Lokaal op Windows

### Stap 1: Virtual Environment activeren

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
```

### Stap 2: Dependencies installeren

```powershell
pip install -r requirements.txt
```

### Stap 3: PostgreSQL-verbinding checken

Zorg dat PostgreSQL draait. Update `backend/.env` met correcte DATABASE_URL:

```
DATABASE_URL=postgresql://slagie:slagie_pass@localhost:5432/slagie_db
```

### Stap 4: Server starten

```powershell
python main.py
```

Of met uvicorn direct:

```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## ✅ Check Status

Open in browser: http://localhost:8000

U zou een JSON response moeten zien:
```json
{
  "message": "Welkom bij Slagie API",
  "docs": "/docs",
  "version": "1.0.0"
}
```

## 📚 API Documentation

Swagger UI: http://localhost:8000/docs
ReDoc: http://localhost:8000/redoc

## 🔌 Database Migratie

Het eerste keer dat de app draait, maakt hij automatisch alle tabellen aan via SQLAlchemy.

## 📊 Excel Data Importeren

Nadat server draait, import Excel data:

```powershell
# Lokaal
python ../scripts/import_excel.py

# Met Docker
docker-compose exec backend python ../scripts/import_excel.py
```

## ❌ Veelgestelde Problemen

### "Connection refused to PostgreSQL"
- Zorg dat PostgreSQL draait
- Check DATABASE_URL in .env
- Test connectie: `psql -U slagie -h localhost -d slagie_db`

### "ModuleNotFoundError"
- Zorg dat venv is geactiveerd
- Draai: `pip install -r requirements.txt`

### Port 8000 is al in gebruik
- Gebruik ander port: `uvicorn main:app --port 8001`

---

Veel succes! 🚀
