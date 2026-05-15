
# Find MySQL installation
Write-Host "Finding MySQL installation..." -ForegroundColor Cyan

$possiblePaths = @(
    "C:\Program Files\MySQL",
    "C:\Program Files (x86)\MySQL",
    "D:\MySQL"
)

$mysqlExe = $null
foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        Write-Host "Checking: $path" -ForegroundColor Gray
        $mysqlExe = Get-ChildItem -Path $path -Recurse -Filter "mysql.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($mysqlExe) {
            Write-Host "Found mysql.exe at: $($mysqlExe.FullName)" -ForegroundColor Green
            break
        }
    }
}

if (-not $mysqlExe) {
    Write-Host "mysql.exe not found, trying to find from service..." -ForegroundColor Yellow
    # Try to find from service
}

Write-Host "Done."
