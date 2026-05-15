# Weyeah SRM 系统 - 燃气发电机零部件采购管理系统

## 项目概述

这是一个采用Maven多模块架构的SRM（供应商关系管理）系统，专为燃气发电机零部件贸易企业设计，提供完整的采购管理、供应商管理、合同管理、定价管理等功能。

## 技术栈

- **Java 21**
- **Spring Boot 3.2.0**
- **Maven 3.9+**
- **MyBatis Plus 3.5.5**
- **MySQL 8.0**
- **Docker / Docker Compose**
- **Knife4j 4.4.0** (API文档)

## 模块结构

```
srm (根模块)
├── srm-parent (父POM，依赖版本管理)
├── srm-types-base (基础类型，核心枚举)
├── srm-common (公共基础库，工具类、响应类)
├── srm-gateway (网关/启动模块，应用入口)
├── srm-supplier (供应商管理模块)
├── srm-material (物料管理模块)
├── srm-pricing (定价管理模块)
├── srm-contract (合同管理模块)
├── srm-purchase (采购订单模块)
├── srm-organization (组织架构模块)
├── srm-workflow (工作流模块)
└── srm-notification (消息通知模块)
```

## 快速开始

### 方式一：Docker Compose 启动（推荐）

#### 前置要求
- Docker Desktop 已安装并运行
- Docker Compose 可用

#### 启动步骤

1. **Windows 用户**
   ```cmd
   # 直接运行脚本
   start-docker.bat
   ```

2. **Linux/macOS 用户**
   ```bash
   # 赋予执行权限
   chmod +x start.sh
   
   # 或使用 Docker Compose
   docker compose up -d --build
   ```

3. **访问服务**
   - 应用首页: http://localhost:8080
   - API文档: http://localhost:8080/doc.html

### 方式二：本地开发启动

#### 前置要求
- JDK 21
- Maven 3.9+
- MySQL 8.0+

#### 启动步骤

1. **创建数据库**
   ```sql
   # 执行 SQL 脚本
   source sql/srm_database_init.sql
   ```

2. **修改配置**
   
   编辑 `srm-gateway/src/main/resources/application-dev.yml`，配置数据库连接：
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/srm_system?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
       username: root
       password: your_password
   ```

3. **Windows 用户启动**
   ```cmd
   start.bat
   ```

4. **Linux/macOS 用户启动**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

### 方式三：Maven 手动启动

```bash
# 编译项目
mvn clean compile -DskipTests

# 启动应用
cd srm-gateway
mvn spring-boot:run
```

## 数据库

### 初始化脚本

完整的数据库初始化脚本位于：`sql/srm_database_init.sql`

包含以下功能模块：
- 系统管理（用户、角色、菜单、部门）
- 供应商管理
- 物料管理
- 定价管理
- 合同管理
- 采购订单管理
- 工作流管理
- 消息通知
- 飞书/企业微信配置

### Docker 初始化

使用 Docker Compose 启动时，SQL 脚本会自动执行，无需手动导入。

## 飞书/企业微信集成

详细配置指南请查看：[配置文档/飞书企业微信集成配置指南.md](配置文档/飞书企业微信集成配置指南.md)

### 配置方式

**方式一：环境变量（推荐）**
```bash
# 飞书
export FEISHU_APP_ID=your_app_id
export FEISHU_APP_SECRET=your_app_secret

# 企业微信
export WECHAT_WORK_CORP_ID=your_corp_id
export WECHAT_WORK_AGENT_ID=your_agent_id
export WECHAT_WORK_CORP_SECRET=your_corp_secret
```

**方式二：配置文件**
编辑 `application-dev.yml` 或 `application-docker.yml` 填入相应配置。

## API 文档

启动项目后访问：
- **Knife4j (推荐)**: http://localhost:8080/doc.html
- **Swagger UI**: http://localhost:8080/swagger-ui.html

## 常用命令

### Maven 命令

```bash
# 编译所有模块
mvn clean compile

# 运行所有测试
mvn test

# 完整验证（包括 lint）
mvn clean verify

# 代码质量检查
mvn checkstyle:check
mvn spotbugs:check

# 打包
mvn clean package -DskipTests
```

### Docker 命令

```bash
# 启动所有服务
docker compose up -d

# 查看日志
docker compose logs -f

# 查看特定服务日志
docker compose logs -f srm-app

# 停止服务
docker compose down

# 停止并删除数据
docker compose down -v

# 重新构建并启动
docker compose up -d --build
```

## 代码质量

我们采用严格的 lint 规则确保代码质量：

- **Checkstyle** - 代码风格检查
- **SpotBugs** - 潜在 bug 检查

所有检查在 Maven 构建过程中自动执行。

## 项目配置

- **默认端口**: 8080
- **默认数据库**: localhost:3306/srm_system
- **JWT 过期时间**: 7200秒 (2小时)
- **文件上传限制**: 10MB

## 下一步计划

- [ ] 实现核心业务模块（工作流、通知、网关）
- [ ] 添加示例数据
- [ ] 完善单元测试
- [ ] 添加前端页面集成
- [ ] 实现监控和日志系统

## 版本历史

- **v1.0.0** - 初始版本，完成基础模块和配置
  - 完成所有13个模块基础代码
  - 配置 Maven 多模块架构
  - 添加代码质量检查
  - 实现数据库初始化脚本
  - 添加 Docker 部署支持
  - 集成飞书/企业微信API客户端

## 技术支持

如有问题，请查看：
- [配置文档](配置文档/)
- API文档: http://localhost:8080/doc.html
