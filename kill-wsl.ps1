# Kill all WSL processes
Get-Process | Where-Object { $_.ProcessName -like "*wsl*" -or $_.ProcessName -like "*vmmem*" } | Stop-Process -Force -ErrorAction SilentlyContinue

# Stop VMCompute service
Write-Host "Stopping VMCompute service..."
Stop-Service VMCompute -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Start-Service VMCompute -ErrorAction SilentlyContinue

Write-Host "Done. WSL processes killed."
