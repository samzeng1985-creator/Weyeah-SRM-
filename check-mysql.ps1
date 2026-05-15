
# Check if MySQL is installed and running
Write-Host "Checking MySQL Service..." -ForegroundColor Cyan

# Try to find MySQL service
$mysqlService = Get-Service | Where-Object { $_.Name -like "*mysql*" -or $_.DisplayName -like "*mysql*" }

if ($mysqlService) {
    Write-Host "MySQL Service Found: $($mysqlService.Name) - $($mysqlService.Status)" -ForegroundColor Green
    
    if ($mysqlService.Status -ne "Running") {
        Write-Host "Starting MySQL Service..." -ForegroundColor Yellow
        Start-Service $mysqlService.Name -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "MySQL Service not found, checking installed programs..." -ForegroundColor Yellow
    
    # Try common installation paths
    $mysqlPaths = @(
        "C:\Program Files\MySQL",
        "C:\Program Files (x86)\MySQL",
        "D:\MySQL"
    )
    
    foreach ($path in $mysqlPaths) {
        if (Test-Path $path) {
            Write-Host "MySQL installed at: $path" -ForegroundColor Green
            $mysqlServerPath = Get-ChildItem -Path $path -Recurse -Filter "mysql.exe" -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
            if ($mysqlServerPath) {
                Write-Host "Found mysql.exe at: $mysqlServerPath" -ForegroundColor Green
            }
        }
    }
}

Write-Host "Check complete."
