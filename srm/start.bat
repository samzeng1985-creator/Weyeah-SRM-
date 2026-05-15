@echo off
chcp 65001 >nul
echo ========================================
echo     Weyeah SRM 系统启动脚本
echo ========================================
echo.

REM 检查 Java 环境
echo [1/4] 检查 Java 环境...
where java >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到 Java，请先安装 Java 21
    pause
    exit /b 1
)
java -version
echo [成功] Java 环境检查通过
echo.

REM 检查 Maven 环境
echo [2/4] 检查 Maven 环境...
where mvn >nul 2>&1
if %errorlevel% neq 0 (
    echo [警告] 未找到 Maven，请确保已配置环境变量
    echo 或者手动设置 JAVA_HOME 和 MAVEN_HOME
) else (
    echo [成功] Maven 环境检查通过
)
echo.

REM 设置 Java 环境变量（如果需要）
set JAVA_HOME=%USERPROFILE%\Documents\Trae SOLO\jdk-21.0.2
if not exist "%JAVA_HOME%\bin\java.exe" (
    echo [提示] 未找到 JDK 在 %JAVA_HOME%，使用系统默认 Java
) else (
    set PATH=%JAVA_HOME%\bin;%PATH%
)

REM 检查项目目录
echo [3/4] 检查项目目录...
if not exist "pom.xml" (
    echo [错误] 请在项目根目录运行此脚本
    pause
    exit /b 1
)
echo [成功] 项目目录检查通过
echo.

REM 编译项目
echo [4/4] 编译项目...
call mvn clean compile -DskipTests
if %errorlevel% neq 0 (
    echo [错误] 编译失败！
    pause
    exit /b 1
)
echo [成功] 编译完成
echo.

echo ========================================
echo     启动应用
echo ========================================
echo.

cd srm-gateway
call mvn spring-boot:run

pause
