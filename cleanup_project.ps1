# Slagie Platform Tree Shake Cleanup
# Removes redundant files and folders

Write-Host "Slagie Platform - Tree Shake Cleanup" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$ProjectRoot = "c:\Users\YassineAzouaghAriane\Documents\Repos\Slagie Platform"
Set-Location $ProjectRoot

# Create backup log
$BackupLog = "cleanup_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').txt"
Write-Host "Creating backup log: $BackupLog" -ForegroundColor Yellow

# Files to delete
$FilesToDelete = @(
    "data\full_log.txt",
    "data\seed_error.log",
    "data\seed_log.txt",
    "backend\error_log.txt",
    "backend\error_log_2.txt",
    "backend\working_q.txt",
    "backend\backend_debug.log",
    "backend\backend_debug_exam.log",
    "backend\backend_run.log",
    "backend\server_critical.log",
    "frontend\vite-error.log",
    "backend\scripts\import_excel_with_images.py",
    "backend\scripts\import_final.py",
    "backend\scripts\import_full_excel.py",
    "backend\scripts\inspect_excel.py",
    "backend\find_data.py",
    "backend\test_auth.py",
    "backend\verify_users.py",
    "backend\seed_admin.py",
    "backend\seed_direct.py",
    "backend\seed_users.py",
    "backend\create_tables.py",
    "backend\app\main.py",
    "backend\app\models.py",
    "backend\app\database.py"
)

# Directories to delete
$DirsToDelete = @(
    "execution",
    "backend\app",
    "backend\.pytest_cache",
    "backend\__pycache__"
)

$DeletedFiles = 0
$DeletedDirs = 0
$TotalSizeFreed = 0

# Create backup log header
"Slagie Platform Cleanup - $(Get-Date)" | Out-File $BackupLog
"=" * 60 | Out-File $BackupLog -Append
"" | Out-File $BackupLog -Append

Write-Host ""
Write-Host "Deleting Files..." -ForegroundColor Yellow
Write-Host ""

# Delete files
foreach ($file in $FilesToDelete) {
    $fullPath = Join-Path $ProjectRoot $file
    if (Test-Path $fullPath) {
        $fileInfo = Get-Item $fullPath
        $size = $fileInfo.Length
        $TotalSizeFreed += $size
        
        "FILE: $file ($([math]::Round($size/1KB, 2)) KB)" | Out-File $BackupLog -Append
        
        Write-Host "  [X] $file" -ForegroundColor Red
        Remove-Item $fullPath -Force
        $DeletedFiles++
    }
    else {
        Write-Host "  [-] Not found: $file" -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "Deleting Directories..." -ForegroundColor Yellow
Write-Host ""

# Delete directories
foreach ($dir in $DirsToDelete) {
    $fullPath = Join-Path $ProjectRoot $dir
    if (Test-Path $fullPath) {
        $dirSize = (Get-ChildItem $fullPath -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        if ($dirSize) {
            $TotalSizeFreed += $dirSize
        }
        
        "DIR: $dir ($([math]::Round($dirSize/1KB, 2)) KB)" | Out-File $BackupLog -Append
        
        Write-Host "  [X] $dir\" -ForegroundColor Red
        Remove-Item $fullPath -Recurse -Force
        $DeletedDirs++
    }
    else {
        Write-Host "  [-] Not found: $dir\" -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Cleanup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Files deleted:       $DeletedFiles" -ForegroundColor White
Write-Host "  Directories deleted: $DeletedDirs" -ForegroundColor White
Write-Host "  Space freed:         $([math]::Round($TotalSizeFreed/1KB, 2)) KB" -ForegroundColor White
Write-Host ""
Write-Host "Backup log saved to: $BackupLog" -ForegroundColor Yellow
Write-Host ""
Write-Host "Core Pillars Remaining:" -ForegroundColor Green
Write-Host "  1. Frontend (Admin + Student) - frontend/" -ForegroundColor White
Write-Host "  2. Authorization (JWT) - backend/routers/auth.py" -ForegroundColor White
Write-Host "  3. Database (SQLAlchemy) - backend/models.py" -ForegroundColor White
Write-Host "  4. Import Script - backend/scripts/import_with_images.py" -ForegroundColor White
Write-Host ""
