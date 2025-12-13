Param(
    [int]$BackendPort = 8001,
    [int]$TimeoutSec = 300,
    [string]$ExcelPath = "backend/data/TheorieToppers examen vragen (3).xlsx"
)

function Wait-DockerUp {
    param([int]$Timeout=180)
    $start = Get-Date
    while ((Get-Date) - $start -lt ([TimeSpan]::FromSeconds($Timeout))) {
        try { docker info | Out-Null; return $true } catch { Start-Sleep -s 3 }
    }
    return $false
}

function Wait-HttpOk {
    param([string]$Url, [int]$Timeout=180)
    $start = Get-Date
    while ((Get-Date) - $start -lt ([TimeSpan]::FromSeconds($Timeout))) {
        try {
            $resp = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
            if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 300) { return $true }
        } catch { }
        Start-Sleep -s 3
    }
    return $false
}

Write-Host "==> Checking Docker daemon..."
if (-not (Wait-DockerUp -Timeout 240)) {
    Write-Error "Docker daemon is not running. Start Docker Desktop and retry."
    exit 1
}

Set-Location "$PSScriptRoot\.."

if (-not (Test-Path $ExcelPath)) {
    Write-Error "Excel bronbestand ontbreekt: $ExcelPath"
    exit 1
}

Write-Host "==> Building containers..."
docker compose build | Out-Host

Write-Host "==> Starting stack (backend on port $BackendPort)..."
docker compose up -d | Out-Host

Write-Host "==> Waiting for Postgres health..."
Start-Sleep -s 5

Write-Host "==> Waiting for backend health endpoint..."
if (-not (Wait-HttpOk -Url "http://localhost:$BackendPort/health" -Timeout $TimeoutSec)) {
    Write-Error "Backend health check failed on port $BackendPort"
    docker compose logs backend --tail 100 | Out-Host
    exit 1
}

Write-Host "==> Running importer..."
docker compose exec backend python scripts/import_with_images.py | Out-Host

Write-Host "==> Sanity check quiz endpoint..."
try {
    $check = Invoke-RestMethod -Uri "http://localhost:$BackendPort/api/exams/1/start?num_questions=3" -UseBasicParsing -TimeoutSec 10
    if (-not $check.success) { throw "Quiz API returned error" }
} catch {
    Write-Warning "Quiz endpoint check failed; check logs or try exam 2/3."
}

Write-Host "\nREADY: Backend http://localhost:$BackendPort and Frontend http://localhost:3000" -ForegroundColor Green
exit 0
