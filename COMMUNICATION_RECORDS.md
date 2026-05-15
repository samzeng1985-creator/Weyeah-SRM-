# SRM系统开发沟通记录 - 2026年5月

## 项目概述
供应商关系管理系统（SRM）开发与维护

---

## 已完成的功能

### 1. 供应商管理模块
- ✅ 供应商基本信息管理（增删改查）
- ✅ 供应商状态管理（草稿、待审核、合格、暂停、黑名单）
- ✅ 供应商审核流程
- ✅ **新增：资质文件管理**（状态：有效/即将过期/已过期）
- ✅ **新增：联系人管理**（支持多个联系人，设为主要联系人）
- ✅ **新增：合作记录管理**（记录历史合作情况）
- ✅ **新增：供应商评估与评级系统**（质量30%、交付25%、价格20%、服务15%）

### 2. 物料品类管理模块
- ✅ **三级品类体系**
- ✅ 树形结构展示
- ✅ 品类CRUD操作

### 3. 合同管理模块
- ✅ 合同CRUD操作
- ✅ 合同类型支持（NDA/采购合同/委托加工）
- ✅ 合同明细管理
- ✅ 合同PDF导出

### 4. 组织架构管理
- ✅ 部门管理
- ✅ 人员管理
- ✅ 角色权限管理

---

## 修复的问题

1. **供应商列表布局问题**（2026-05-15）
   - 问题：表格列被压缩，文字垂直排列
   - 解决方案：为表格和每列添加最小宽度约束

2. **状态标签换行问题**（2026-05-15）
   - 问题：状态标签显示为两行
   - 解决方案：添加 `whitespace-nowrap` 样式

3. **操作按钮样式不一致**（2026-05-15）
   - 问题：按钮样式与物料管理页面不一致
   - 解决方案：统一为纯图标按钮样式

4. **品类管理删除功能无法正常工作**（2026-05-15）
   - 问题：新增品类后无法删除
   - 根本原因：
     - Category实体类缺少`@TableLogic`注解
     - API拦截器检查条件错误（检查`code`而非`success`）
     - 编码生成逻辑在逻辑删除后会产生重复编码
     - 前端代码检查`response.success`但API拦截器已处理
   - 解决方案：
     - 在Category实体类添加`@TableLogic`注解
     - 修复API拦截器检查`res.success === false`
     - 在CategoryMapper添加原生SQL查询方法（查询包括已删除的记录）
     - 修改编码生成逻辑，查询所有同级品类（包括已删除）找到最大编码
     - 简化前端Categories.tsx的增删改函数，移除重复的success检查

### 修改的文件
- `srm/srm-gateway/src/main/java/com/srm/gateway/entity/Category.java` - 添加@TableLogic注解
- `srm/srm-gateway/src/main/java/com/srm/gateway/mapper/CategoryMapper.java` - 添加selectAllByParentId方法
- `srm/srm-gateway/src/main/java/com/srm/gateway/controller/CategoryController.java` - 修改编码生成逻辑
- `srm-frontend-app/src/services/api.ts` - 修复响应拦截器
- `srm-frontend-app/src/pages/Categories.tsx` - 简化增删改函数

---

## 技术栈

### 后端
- Java 21
- Spring Boot 3.x
- MyBatis-Plus 3.5.5
- H2 内存数据库

### 前端
- React 18 + TypeScript
- Vite
- Tailwind CSS 3
- Lucide Icons

---

## 服务状态

| 服务 | 地址 | 状态 |
|------|------|------|
| 后端 | http://localhost:8080 | ✅ 运行中 |
| 前端 | http://localhost:5174 | ✅ 运行中 |

---

## 版本记录

### v1.0.0 - 2026年5月
- 基础功能完成
- P0优先级功能全部实现

---

## 文件结构

```
srm/
├── srm-gateway/          # 后端服务
│   ├── src/main/java/com/srm/gateway/
│   │   ├── controller/    # REST API控制器
│   │   ├── entity/        # 实体类
│   │   ├── mapper/        # 数据访问层
│   │   └── common/        # 通用组件
│   └── src/main/resources/
│       ├── schema.sql     # 数据库初始化
│       └── data.sql       # 测试数据

srm-frontend-app/         # 前端应用
├── src/
│   ├── components/        # 组件
│   ├── pages/            # 页面
│   ├── services/         # API服务
│   └── types/            # 类型定义
└── package.json
```

---

## 访问指南

1. **供应商管理**：http://localhost:5174/suppliers
2. **品类管理**：http://localhost:5174/categories
3. **合同管理**：http://localhost:5174/contracts
4. **物料管理**：http://localhost:5174/materials
5. **组织架构**：http://localhost:5174/organization
