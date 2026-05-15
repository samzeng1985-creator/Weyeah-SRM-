# Stop all Docker related processes
Write-Host "Stopping Docker processes..."
Get-Process | Where-Object { $_.ProcessName -like "*docker*" } | Stop-Process -Force -ErrorAction SilentlyContinue

# Shutdown WSL
Write-Host "Shutting down WSL..."
wsl --shutdown 2>$null

# Wait a moment
Start-Sleep -Seconds 3

# Unregister docker-desktop distribution
Write-Host "Unregistering docker-desktop WSL distribution..."
wsl --unregister docker-desktop 2>$null

Write-Host "Docker WSL reset complete. Please start Docker Desktop manually."
