Get-Process | Where-Object {$_.ProcessName -like "*docker*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "Stopped all docker-related processes"

Get-Service VMCompute | Restart-Service -Force
Write-Host "Restarted VMCompute service"

Start-Sleep -Seconds 5
Write-Host "Waited 5 seconds"

Write-Host "Unregistering docker-desktop WSL distribution..."
wsl --unregister docker-desktop -ErrorAction SilentlyContinue
Write-Host "docker-desktop unregister command executed"

Start-Sleep -Seconds 2

$wslList = wsl --list --verbose 2>&1
if ($wslList -match "docker-desktop") {
    Write-Host "Warning: docker-desktop still exists, trying to unregister again..."
    wsl --unregister docker-desktop -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

Write-Host "Starting Docker Desktop..."
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe" -ErrorAction SilentlyContinue

Write-Host "Waiting 30 seconds for Docker to initialize..."
Start-Sleep -Seconds 30

Write-Host ""
Write-Host "Testing Docker status..."
docker info 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: Docker is now running and working!"
} else {
    Write-Host ""
    Write-Host "ISSUE: Docker may have problems starting. Please check Docker Desktop app."
}
