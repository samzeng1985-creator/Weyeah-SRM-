@echo off
echo ============================================
echo SRM系统 - 组织架构模块调试测试
echo ============================================
echo.

echo [测试1] 检查后端服务是否运行...
curl -s http://localhost:8080/actuator/health > nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 后端服务未运行，请先启动！
    pause
    exit /b 1
)
echo [OK] 后端服务正常运行
echo.

echo [测试2] 测试获取部门列表...
curl -s -X GET http://localhost:8080/api/departments/tree -H "Content-Type: application/json"
echo.
echo.

echo [测试3] 测试创建部门...
curl -s -X POST http://localhost:8080/api/departments -H "Content-Type: application/json" -d "{\"code\":\"TEST001\",\"name\":\"测试部门\",\"parentId\":0,\"level\":1,\"status\":\"ACTIVE\"}"
echo.
echo.

echo [测试4] 再次获取部门列表，确认是否添加成功...
curl -s -X GET http://localhost:8080/api/departments/tree -H "Content-Type: application/json"
echo.
echo.

echo [测试5] 测试获取员工列表...
curl -s -X GET "http://localhost:8080/api/employees?page=1&pageSize=10" -H "Content-Type: application/json"
echo.
echo.

echo [测试6] 测试创建员工...
curl -s -X POST http://localhost:8080/api/employees -H "Content-Type: application/json" -d "{\"employeeNo\":\"EMP001\",\"name\":\"测试员工\",\"gender\":\"MALE\",\"departmentId\":1,\"position\":\"测试职位\",\"status\":\"ACTIVE\"}"
echo.
echo.

echo [测试7] 测试获取角色列表...
curl -s -X GET http://localhost:8080/api/roles -H "Content-Type: application/json"
echo.
echo.

echo [测试8] 测试创建角色...
curl -s -X POST http://localhost:8080/api/roles -H "Content-Type: application/json" -d "{\"code\":\"ROLE_TEST\",\"name\":\"测试角色\",\"description\":\"测试用角色\",\"status\":\"ACTIVE\"}"
echo.
echo.

echo ============================================
echo 测试完成！
echo ============================================
pause
