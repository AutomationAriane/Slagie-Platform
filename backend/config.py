import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://slagie:slagie_pass@localhost:5432/slagie_db")
FASTAPI_ENV = os.getenv("FASTAPI_ENV", "development")
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")

# CORS settings
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
]
