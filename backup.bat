@echo off
setlocal enabledelayedexpansion

set "PROJECT_DIR=%~dp0"
set "BACKUP_DIR=%PROJECT_DIR%.backups"
set "TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
set "TIMESTAMP=%TIMESTAMP: =0%"

echo ========================================
echo Weyeah-SRM 版本备份工具
echo ========================================
echo.

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

set "VERSION_DIR=%BACKUP_DIR%\v%TIMESTAMP%"
mkdir "%VERSION_DIR%"

echo 正在备份文件到: %VERSION_DIR%
echo.

xcopy "%PROJECT_DIR%srm-frontend-app\src" "%VERSION_DIR%\srm-frontend-app\src\" /E /I /Y >nul
xcopy "%PROJECT_DIR%srm\srm-gateway\src" "%VERSION_DIR%\srm\srm-gateway\src\" /E /I /Y >nul
xcopy "%PROJECT_DIR%*.md" "%VERSION_DIR%\" /Y >nul

echo.
echo ========================================
echo 备份完成！
echo 备份位置: %VERSION_DIR%
echo ========================================
echo.

dir "%BACKUP_DIR%" /B /O-D

echo.
echo 按任意键退出...
pause >nul
