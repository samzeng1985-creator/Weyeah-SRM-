@echo off
chcp 65001 >nul
echo ========================================
echo     Weyeah SRM Docker 启动脚本
echo ========================================
echo.

REM 检查 Docker
echo [1/3] 检查 Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到 Docker，请先安装并启动 Docker Desktop
    pause
    exit /b 1
)
docker --version
echo [成功] Docker 环境检查通过
echo.

REM 检查 Docker Compose
echo [2/3] 检查 Docker Compose...
docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] Docker Compose 不可用
    pause
    exit /b 1
)
docker compose version
echo [成功] Docker Compose 检查通过
echo.

REM 启动服务
echo [3/3] 启动服务...
echo.
echo [提示] 首次启动会比较慢，需要下载镜像和编译项目
echo.
docker compose up -d --build

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo     启动成功！
    echo ========================================
    echo.
    echo 访问地址：
    echo   - 应用首页: http://localhost:8080
    echo   - API文档:  http://localhost:8080/doc.html
    echo.
    echo 查看日志:
    echo   docker compose logs -f srm-app
    echo.
    echo 停止服务:
    echo   docker compose down
    echo.
) else (
    echo.
    echo [错误] 启动失败，请检查日志
    echo.
)

pause
