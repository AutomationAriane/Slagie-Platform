"""
Main FastAPI Application for Slagie Platform
Driving Theory Exam Platform (CBR)
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers import auth, exams

# Create all tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Slagie API",
    description="CBR Theorie Examen Platform - Auto Theorie",
    version="3.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(exams.router)

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "Slagie API v3 - Auth Enabled"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
