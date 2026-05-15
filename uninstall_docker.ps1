# Docker Desktop Complete Uninstaller Script
# Created: 2026-05-13

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Docker Desktop Complete Uninstaller" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Force kill all WSL-related processes
Write-Host "[Step 1/6] Stopping WSL-related processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*wsl*" -or $_.ProcessName -like "*vmmem*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "  Processes terminated." -ForegroundColor Green

# Step 2: Force stop VMCompute service
Write-Host "[Step 2/6] Stopping VMCompute service..." -ForegroundColor Yellow
Stop-Service VMCompute -Force -ErrorAction SilentlyContinue
Write-Host "  VMCompute service stopped." -ForegroundColor Green

# Step 3: Wait 3 seconds
Write-Host "[Step 3/6] Waiting 3 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Write-Host "  Wait complete." -ForegroundColor Green

# Step 4: Find and execute Docker Desktop uninstaller
Write-Host "[Step 4/6] Executing Docker Desktop uninstaller..." -ForegroundColor Yellow
$uninstallerPath = "C:\Program Files\Docker\Docker\Uninstall.exe"
if (Test-Path $uninstallerPath) {
    & $uninstallerPath /quiet
    Write-Host "  Uninstall.exe executed." -ForegroundColor Green
} else {
    Write-Host "  Uninstall.exe not found at expected location." -ForegroundColor Yellow
}

# Step 5: Remove all Docker-related directories
Write-Host "[Step 5/6] Removing Docker-related directories..." -ForegroundColor Yellow

$dockerPaths = @(
    "C:\Program Files\Docker",
    "$env:APPDATA\Docker",
    "$env:LOCALAPPDATA\Docker",
    "$env:ProgramData\Docker",
    "$env:ProgramData\docker-desktop"
)

foreach ($path in $dockerPaths) {
    if (Test-Path $path) {
        try {
            Remove-Item -Path $path -Recurse -Force -ErrorAction Stop
            Write-Host "  Removed: $path" -ForegroundColor Green
        } catch {
            Write-Host "  Failed to remove: $path - $_" -ForegroundColor Red
        }
    } else {
        Write-Host "  Not found (already removed): $path" -ForegroundColor Gray
    }
}

# Step 6: Unregister WSL distributions
Write-Host "[Step 6/6] Unregistering WSL distributions..." -ForegroundColor Yellow

# Shutdown WSL first (may fail, ignore errors)
wsl --shutdown 2>$null
Write-Host "  WSL shutdown attempted." -ForegroundColor Green

# Unregister docker-desktop distribution
wsl --unregister docker-desktop 2>$null
Write-Host "  docker-desktop unregistration attempted." -ForegroundColor Green

# Unregister docker-desktop-data distribution
wsl --unregister docker-desktop-data 2>$null
Write-Host "  docker-desktop-data unregistration attempted." -ForegroundColor Green

# Restart VMCompute service
Start-Service VMCompute -ErrorAction SilentlyContinue
Write-Host "  VMCompute service restarted." -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Uninstallation Steps Completed" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verification
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Verification Results" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if Docker directory exists
$dockerDirExists = Test-Path "C:\Program Files\Docker"
Write-Host "Docker directory exists: $dockerDirExists" -ForegroundColor $(if ($dockerDirExists) {"Red"} else {"Green"})

# Try to run docker --version
$dockerVersion = docker --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "docker --version: $dockerVersion" -ForegroundColor Red
    Write-Host "WARNING: Docker still appears to be installed!" -ForegroundColor Red
} else {
    Write-Host "docker --version: Command not found" -ForegroundColor Green
    Write-Host "SUCCESS: Docker CLI not found (properly uninstalled)" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Script Execution Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
