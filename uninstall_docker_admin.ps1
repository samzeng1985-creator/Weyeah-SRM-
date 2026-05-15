# Enhanced Docker Desktop Uninstaller - Administrator Mode
# 2026-05-13

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Enhanced Docker Desktop Uninstaller" -ForegroundColor Cyan
Write-Host "  Running with Administrator Rights" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Force kill all WSL and Docker related processes
Write-Host "[1/8] Force killing all WSL/Docker processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*wsl*" -or $_.ProcessName -like "*vmmem*" -or $_.ProcessName -like "*docker*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "  Processes terminated" -ForegroundColor Green

# Stop VMCompute service
Write-Host "[2/8] Stopping VMCompute service..." -ForegroundColor Yellow
Stop-Service VMCompute -Force -ErrorAction SilentlyContinue
Write-Host "  VMCompute stopped" -ForegroundColor Green

# Wait for processes to terminate
Write-Host "[3/8] Waiting for processes to terminate..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Write-Host "  Wait complete" -ForegroundColor Green

# Shutdown WSL
Write-Host "[4/8] Shutting down WSL..." -ForegroundColor Yellow
wsl --shutdown 2>$null
Write-Host "  WSL shutdown attempted" -ForegroundColor Green

# Unregister WSL distributions
Write-Host "[5/8] Unregistering WSL distributions..." -ForegroundColor Yellow
wsl --unregister docker-desktop 2>$null
Write-Host "  docker-desktop unregister attempted" -ForegroundColor Green
wsl --unregister docker-desktop-data 2>$null
Write-Host "  docker-desktop-data unregister attempted" -ForegroundColor Green

# Kill any remaining processes again
Write-Host "[6/8] Final process termination..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*wsl*" -or $_.ProcessName -like "*vmmem*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Run Docker uninstaller if exists
Write-Host "[7/8] Running Docker uninstaller..." -ForegroundColor Yellow
$uninstaller = "C:\Program Files\Docker\Docker\Uninstall.exe"
if (Test-Path $uninstaller) {
    Start-Process $uninstaller -ArgumentList "/quiet" -Wait
    Write-Host "  Uninstall.exe completed" -ForegroundColor Green
} else {
    Write-Host "  Uninstall.exe not found" -ForegroundColor Yellow
}

# Remove all Docker directories
Write-Host "[8/8] Removing Docker directories..." -ForegroundColor Yellow
$paths = @(
    "C:\Program Files\Docker",
    "$env:APPDATA\Docker",
    "$env:LOCALAPPDATA\Docker",
    "$env:ProgramData\Docker",
    "$env:ProgramData\docker-desktop"
)

foreach ($path in $paths) {
    if (Test-Path $path) {
        Write-Host "  Removing: $path" -ForegroundColor Yellow
        Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
        if (-not (Test-Path $path)) {
            Write-Host "    Successfully removed" -ForegroundColor Green
        } else {
            Write-Host "    Failed to remove (may be locked)" -ForegroundColor Red
        }
    } else {
        Write-Host "  Already removed: $path" -ForegroundColor Gray
    }
}

# Restart VMCompute
Write-Host "Restarting VMCompute service..." -ForegroundColor Yellow
Start-Service VMCompute -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  VERIFICATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Final verification
$dockerDirExists = Test-Path "C:\Program Files\Docker"
Write-Host ""
Write-Host "Docker directory still exists: $dockerDirExists" -ForegroundColor $(if ($dockerDirExists) {"Red"} else {"Green"})

$dockerCmd = Get-Command docker -ErrorAction SilentlyContinue
if ($dockerCmd) {
    Write-Host "Docker CLI found: $($dockerCmd.Source)" -ForegroundColor Red
    $version = docker --version 2>&1
    Write-Host "Docker version: $version" -ForegroundColor Red
} else {
    Write-Host "Docker CLI: NOT FOUND" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  COMPLETE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
