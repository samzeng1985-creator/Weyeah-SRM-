# 完全重置Docker Desktop
Write-Host "=== 完全重置Docker Desktop ===" -ForegroundColor Cyan

# 1. 停止Docker Desktop
Write-Host "[1/5] 停止Docker Desktop..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.ProcessName -like "*docker*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

# 2. 尝试关闭WSL
Write-Host "[2/5] 关闭WSL..." -ForegroundColor Yellow
wsl --shutdown 2>$null
Start-Sleep -Seconds 3

# 3. 注销所有Docker相关的WSL发行版
Write-Host "[3/5] 注销Docker WSL发行版..." -ForegroundColor Yellow
wsl --unregister docker-desktop 2>$null
wsl --unregister docker-desktop-data 2>$null
Start-Sleep -Seconds 2

# 4. 删除Docker Desktop的数据目录（备份设置）
Write-Host "[4/5] 清理Docker Desktop数据..." -ForegroundColor Yellow
$dockerDataPath = "$env:APPDATA\Docker"
$dockerLocalPath = "$env:LOCALAPPDATA\Docker"

if (Test-Path $dockerDataPath) {
    Write-Host "   备份配置到 $dockerDataPath.backup"
    Rename-Item -Path $dockerDataPath -NewName "$dockerDataPath.backup" -ErrorAction SilentlyContinue
}

if (Test-Path $dockerLocalPath) {
    Write-Host "   备份本地数据到 $dockerLocalPath.backup"
    Rename-Item -Path $dockerLocalPath -NewName "$dockerLocalPath.backup" -ErrorAction SilentlyContinue
}

# 5. 重新启动Docker Desktop
Write-Host "[5/5] 启动Docker Desktop..." -ForegroundColor Yellow
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

Write-Host "`n=== 重置完成 ===" -ForegroundColor Green
Write-Host "Docker Desktop将重新初始化WSL环境。"
Write-Host "这可能需要3-5分钟，请耐心等待。"
Write-Host "`n如果Docker Desktop再次失败，我们将使用本地部署方案。"
