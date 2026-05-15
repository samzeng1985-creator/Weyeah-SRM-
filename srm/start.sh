#!/bin/bash

echo "========================================"
echo "    Weyeah SRM 系统启动脚本 (Linux/macOS)"
echo "========================================"
echo ""

# 检查 Java 环境
echo "[1/4] 检查 Java 环境..."
if ! command -v java &> /dev/null; then
    echo "[错误] 未找到 Java，请先安装 Java 21"
    exit 1
fi
java -version
echo "[成功] Java 环境检查通过"
echo ""

# 检查 Maven 环境
echo "[2/4] 检查 Maven 环境..."
if ! command -v mvn &> /dev/null; then
    echo "[警告] 未找到 Maven，请确保已配置环境变量"
else
    echo "[成功] Maven 环境检查通过"
fi
echo ""

# 检查项目目录
echo "[3/4] 检查项目目录..."
if [ ! -f "pom.xml" ]; then
    echo "[错误] 请在项目根目录运行此脚本"
    exit 1
fi
echo "[成功] 项目目录检查通过"
echo ""

# 编译项目
echo "[4/4] 编译项目..."
mvn clean compile -DskipTests
if [ $? -ne 0 ]; then
    echo "[错误] 编译失败！"
    exit 1
fi
echo "[成功] 编译完成"
echo ""

echo "========================================"
echo "    启动应用"
echo "========================================"
echo ""

cd srm-gateway
mvn spring-boot:run
