# Clean up Docker Desktop residual directories
Write-Host "=== Cleaning up Docker Desktop residual directories ===" -ForegroundColor Cyan

# Remove Docker installation directory
if (Test-Path "C:\Program Files\Docker") {
    Write-Host "Removing C:\Program Files\Docker..." -ForegroundColor Yellow
    Remove-Item -Path "C:\Program Files\Docker" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Done." -ForegroundColor Green
}

# Remove Docker data directories
$paths = @(
    "$env:APPDATA\Docker",
    "$env:LOCALAPPDATA\Docker",
    "$env:ProgramData\Docker",
    "$env:ProgramData\docker-desktop"
)

foreach ($path in $paths) {
    if (Test-Path $path) {
        Write-Host "Removing $path..." -ForegroundColor Yellow
        Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "`n=== Cleanup Complete ===" -ForegroundColor Green
Write-Host "Docker Desktop has been completely removed from your system."
