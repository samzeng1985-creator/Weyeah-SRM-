@echo off
echo ====================================
echo SRM采购管理系统 - 前端启动脚本
echo ====================================
echo.

REM 检查是否已安装依赖
if not exist "node_modules" (
    echo [1/2] 正在安装依赖...
    call npm install
    echo.
)

echo [2/2] 正在启动开发服务器...
echo.
echo 前端将在 http://localhost:3000 启动
echo 后端服务地址: http://localhost:8080
echo.
echo 按 Ctrl+C 停止服务器
echo.

call npm run dev

pause
