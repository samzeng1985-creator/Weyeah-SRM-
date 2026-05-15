@echo off
title Weyeah SRM Frontend
cd /d "C:\Users\konst\Documents\Trae SOLO\Weyeah-SRM\srm-frontend-app"
echo ========================================
echo  Weyeah SRM 前端服务器启动中...
echo ========================================
echo.
echo 正在安装依赖（首次运行）...
call "C:\Program Files\nodejs\npm.cmd" install
echo.
echo 启动开发服务器...
echo 访问地址: http://localhost:3000
echo.
echo 按 Ctrl+C 停止服务器
echo ========================================
call "C:\Program Files\nodejs\npm.cmd" run dev
pause
