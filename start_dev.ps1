Write-Host "Starting Slagie Platform..." -ForegroundColor Green

# Start Backend (Port 8000)
Write-Host "Starting Backend..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\activate; uvicorn main:app --port 8000 --reload"

# Start Frontend (Port 5173)
Write-Host "Starting Frontend..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev -- --port 5173"

Write-Host "---------------------------------------------------" -ForegroundColor Yellow
Write-Host "Backend running on: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend running on: http://localhost:5173" -ForegroundColor Cyan
Write-Host "---------------------------------------------------" -ForegroundColor Yellow
Write-Host "Please wait a moment for services to boot up."
