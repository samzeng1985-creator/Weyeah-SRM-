# Complete Docker Desktop Uninstall Script
Write-Host "=== Complete Docker Desktop Uninstall ===" -ForegroundColor Cyan

# 1. Stop all Docker processes
Write-Host "[1/5] Stopping all Docker processes..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.ProcessName -like "*docker*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

# 2. Shutdown WSL
Write-Host "[2/5] Shutting down WSL..." -ForegroundColor Yellow
wsl --shutdown 2>$null
Start-Sleep -Seconds 3

# 3. Unregister all Docker WSL distros
Write-Host "[3/5] Unregistering Docker WSL distros..." -ForegroundColor Yellow
$wslDists = @("docker-desktop", "docker-desktop-data", "Ubuntu", "docker-desktop-toolbox")
foreach ($dist in $wslDists) {
    Write-Host "   Unregistering $dist..." -ForegroundColor Gray
    wsl --unregister $dist 2>$null
}

# 4. Run Docker Desktop uninstaller
Write-Host "[4/5] Running Docker Desktop uninstaller..." -ForegroundColor Yellow
$uninstallPath = "C:\Program Files\Docker\Docker\Uninstall.exe"
if (Test-Path $uninstallPath) {
    Start-Process -FilePath $uninstallPath -ArgumentList "/quiet" -Wait
    Write-Host "   Uninstall completed." -ForegroundColor Green
} else {
    Write-Host "   Uninstall.exe not found, skipping..." -ForegroundColor Yellow
}

Start-Sleep -Seconds 5

# 5. Clean up remaining files
Write-Host "[5/5] Cleaning up remaining files..." -ForegroundColor Yellow

# Remove Docker installation directory
if (Test-Path "C:\Program Files\Docker") {
    Write-Host "   Removing C:\Program Files\Docker..." -ForegroundColor Gray
    Remove-Item -Path "C:\Program Files\Docker" -Recurse -Force -ErrorAction SilentlyContinue
}

# Remove Docker data directories
$appdataDocker = "$env:APPDATA\Docker"
$localAppdataDocker = "$env:LOCALAPPDATA\Docker"
$dockerData = "$env:ProgramData\Docker"
$dockerDesktop = "$env:ProgramData\docker-desktop"

@($appdataDocker, $localAppdataDocker, $dockerData, $dockerDesktop) | ForEach-Object {
    if (Test-Path $_) {
        Write-Host "   Removing $_..." -ForegroundColor Gray
        Remove-Item -Path $_ -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "`n=== Uninstall Complete ===" -ForegroundColor Green
Write-Host "Docker Desktop has been fully uninstalled."
Write-Host "`nNext steps:"
Write-Host "1. Restart your computer (recommended)"
Write-Host "2. We will deploy SRM using local services instead of Docker"
