Write-Host "=== Docker Desktop WSL Reset Script ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "[Step 1] Stopping all Docker-related processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*docker*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "Docker processes stopped" -ForegroundColor Green

Write-Host ""
Write-Host "[Step 2] Restarting VMCompute service..." -ForegroundColor Yellow
try {
    Get-Service VMCompute -ErrorAction Stop | Restart-Service -Force -ErrorAction Stop
    Write-Host "VMCompute service restarted successfully" -ForegroundColor Green
} catch {
    Write-Host "Warning: Could not restart VMCompute service: $_" -ForegroundColor Red
    Write-Host "Attempting alternative method..." -ForegroundColor Yellow
    Start-Process sc -ArgumentList "config","VMCompute","start=disabled" -Verb RunAs -Wait -WindowStyle Hidden -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Start-Process sc -ArgumentList "config","VMCompute","start=demand" -Verb RunAs -Wait -WindowStyle Hidden -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "[Step 3] Waiting 5 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "[Step 4] Unregistering docker-desktop WSL distribution..." -ForegroundColor Yellow
$wslTimeout = 10
$wslProcess = Start-Process -FilePath "wsl" -ArgumentList "--unregister docker-desktop" -NoNewWindow -PassThru -ErrorAction SilentlyContinue
if ($wslProcess) {
    $wslCompleted = $wslProcess.WaitForExit($wslTimeout * 1000)
    if (-not $wslCompleted) {
        Write-Host "WSL unregister timed out after $wslTimeout seconds, killing process..." -ForegroundColor Red
        Stop-Process -Id $wslProcess.Id -Force -ErrorAction SilentlyContinue
    } else {
        Write-Host "docker-desktop WSL distribution unregistered" -ForegroundColor Green
    }
} else {
    Write-Host "Warning: Could not start WSL unregister process" -ForegroundColor Red
}

Write-Host ""
Write-Host "[Step 5] Verifying unregistration..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
$wslList = wsl --list --verbose 2>&1
if ($wslList -match "docker-desktop") {
    Write-Host "Warning: docker-desktop still exists in WSL list" -ForegroundColor Red
    Write-Host "WSL List output:" -ForegroundColor Yellow
    Write-Host $wslList
} else {
    Write-Host "docker-desktop successfully unregistered" -ForegroundColor Green
}

Write-Host ""
Write-Host "[Step 6] Starting Docker Desktop..." -ForegroundColor Yellow
$dockerPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
if (Test-Path $dockerPath) {
    Start-Process $dockerPath -ErrorAction SilentlyContinue
    Write-Host "Docker Desktop started" -ForegroundColor Green
} else {
    Write-Host "Error: Docker Desktop executable not found at $dockerPath" -ForegroundColor Red
}

Write-Host ""
Write-Host "[Step 7] Waiting 30 seconds for Docker to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host ""
Write-Host "[Step 8] Testing Docker status..." -ForegroundColor Yellow
Write-Host "Running: docker info" -ForegroundColor Gray
Write-Host ""

$dockerTest = docker info 2>&1
$dockerExitCode = $LASTEXITCODE

if ($dockerExitCode -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Docker is now working!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Docker Info Summary:" -ForegroundColor Cyan
    $dockerTest | Select-Object -First 10
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "  Docker may have issues starting" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Docker test output:" -ForegroundColor Red
    $dockerTest
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Cyan
    Write-Host "1. Check if Docker Desktop is running in system tray" -ForegroundColor Gray
    Write-Host "2. Try manually starting Docker Desktop" -ForegroundColor Gray
    Write-Host "3. Check Windows Event Viewer for Docker errors" -ForegroundColor Gray
    Write-Host "4. Try running 'wsl --list --verbose' to check WSL status" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Script completed at: $(Get-Date)" -ForegroundColor Cyan
