
# Initialize SRM Database
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$sqlScript = "C:\Users\konst\Documents\Trae SOLO\Weyeah-SRM\srm\sql\srm_database_init.sql"
$password = "password"

Write-Host "Creating SRM Database..." -ForegroundColor Cyan

# Step 1: Create database
Write-Host "Step 1: Creating database..." -ForegroundColor Yellow
&amp; $mysqlPath -u root -p$password -e "CREATE DATABASE IF NOT EXISTS srm_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database created successfully!" -ForegroundColor Green
} else {
    Write-Host "Error creating database!" -ForegroundColor Red
    exit 1
}

# Step 2: Import SQL script
Write-Host "Step 2: Importing SQL script..." -ForegroundColor Yellow
&amp; $mysqlPath -u root -p$password srm_system &lt; $sqlScript

if ($LASTEXITCODE -eq 0) {
    Write-Host "SQL script imported successfully!" -ForegroundColor Green
} else {
    Write-Host "Error importing SQL script!" -ForegroundColor Red
    exit 1
}

Write-Host "`nSRM Database initialization complete!" -ForegroundColor Green
