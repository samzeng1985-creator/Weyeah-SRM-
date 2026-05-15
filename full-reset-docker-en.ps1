# Full Docker Desktop Reset
Write-Host "=== Full Docker Desktop Reset ===" -ForegroundColor Cyan

# 1. Stop Docker Desktop
Write-Host "[1/5] Stopping Docker Desktop..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.ProcessName -like "*docker*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

# 2. Try to shutdown WSL
Write-Host "[2/5] Shutting down WSL..." -ForegroundColor Yellow
wsl --shutdown 2>$null
Start-Sleep -Seconds 3

# 3. Unregister Docker WSL distros
Write-Host "[3/5] Unregistering Docker WSL distros..." -ForegroundColor Yellow
wsl --unregister docker-desktop 2>$null
wsl --unregister docker-desktop-data 2>$null
Start-Sleep -Seconds 2

# 4. Backup and clear Docker Desktop data
Write-Host "[4/5] Clearing Docker Desktop data..." -ForegroundColor Yellow
$dockerDataPath = "$env:APPDATA\Docker"
$dockerLocalPath = "$env:LOCALAPPDATA\Docker"

if (Test-Path $dockerDataPath) {
    Write-Host "   Backing up config to $dockerDataPath.backup"
    Rename-Item -Path $dockerDataPath -NewName "$dockerDataPath.backup" -ErrorAction SilentlyContinue
}

if (Test-Path $dockerLocalPath) {
    Write-Host "   Backing up local data to $dockerLocalPath.backup"
    Rename-Item -Path $dockerLocalPath -NewName "$dockerLocalPath.backup" -ErrorAction SilentlyContinue
}

# 5. Restart Docker Desktop
Write-Host "[5/5] Starting Docker Desktop..." -ForegroundColor Yellow
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

Write-Host "`n=== Reset Complete ===" -ForegroundColor Green
Write-Host "Docker Desktop will now reinitialize the WSL environment."
Write-Host "This may take 3-5 minutes, please wait."
Write-Host "`nIf Docker Desktop fails again, we'll use local deployment instead."
