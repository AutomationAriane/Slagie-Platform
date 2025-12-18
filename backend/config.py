import os
from dotenv import load_dotenv

load_dotenv()


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Force absolute path for SQLite to avoid relative path issues
DB_PATH = os.path.join(BASE_DIR, "sql_app_fixed.db")
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

FASTAPI_ENV = os.getenv("FASTAPI_ENV", "development")
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")

# CORS settings
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
