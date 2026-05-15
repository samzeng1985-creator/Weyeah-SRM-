@echo off
chcp 65001 >nul
title Weyeah SRM 前端服务器

echo ========================================
echo   Weyeah SRM 采购管理系统
echo   前端服务器启动脚本
echo ========================================
echo.

cd /d "C:\Users\konst\Documents\Trae SOLO\Weyeah-SRM\srm-frontend-app"

echo 检查 Node.js 安装...
if exist "C:\Program Files\nodejs\npm.cmd" (
    echo ✓ Node.js 已找到
) else (
    echo ✗ Node.js 未找到，请先安装 Node.js
    pause
    exit /b 1
)

echo.
echo 设置环境变量...
set PATH=C:\Program Files\nodejs;%PATH%

echo.
echo 正在启动开发服务器...
echo 访问地址: http://localhost:3000
echo 按 Ctrl+C 可以停止服务器
echo ========================================
echo.

"C:\Program Files\nodejs\npm.cmd" run dev

pause
