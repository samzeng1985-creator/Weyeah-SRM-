# SRM采购管理系统 - 前端

基于 React + TypeScript + Vite + Tailwind CSS 构建的 Weyeah SRM 采购管理系统前端应用。

## 📦 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **语言**: TypeScript
- **UI 框架**: Tailwind CSS
- **路由**: React Router DOM
- **HTTP 客户端**: Axios

## 🚀 快速开始

### 1. 安装依赖

```bash
cd srm-frontend-app
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

开发服务器将在 `http://localhost:3000` 启动

### 3. 构建生产版本

```bash
npm run build
```

## 📁 项目结构

```
srm-frontend-app/
├── public/
├── src/
│   ├── components/       # 通用组件
│   │   └── Layout.tsx   # 主布局组件
│   ├── pages/          # 页面组件
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Suppliers.tsx
│   │   ├── Materials.tsx
│   │   ├── Contracts.tsx
│   │   ├── Pricing.tsx
│   │   ├── Organization.tsx
│   │   └── Settings.tsx
│   ├── services/        # API 服务
│   │   ├── api.ts
│   │   └── supplier.ts
│   ├── types/           # TypeScript 类型定义
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── postcss.config.js
```

## 🎨 设计规范

### 品牌色彩

- **主色调**: #1a365d (Weyeah 蓝)
- **辅助蓝**: #2c5282
- **强调色**: #ed8936 (金橙)

### 字体

- **英文字体**: Inter
- **中文字体**: PingFang SC / Microsoft YaHei

## 🔗 API 配置

后端 API 地址: `http://localhost:8080`

Vite 代理已配置，开发环境中 `/api` 请求会被代理到后端服务。

## 👤 测试账户

- **用户名**: admin
- **密码**: 123456

## 📄 功能模块

| 模块 | 状态 | 说明 |
|------|------|------|
| ✅ 登录页面 | 已完成 | 美观的登录界面，支持记住登录 |
| ✅ 仪表盘 | 已完成 | 统计卡片、待处理事项、最近活动 |
| ✅ 供应商管理 | 已完成 | 列表展示、搜索筛选、新增功能 |
| ✅ 物料管理 | 已完成 | 物料列表、分类筛选 |
| ✅ 合同管理 | 已完成 | 合同列表、类型状态筛选 |
| ✅ 定价管理 | 已完成 | 定价记录、状态管理 |
| ✅ 组织架构 | 已完成 | 部门树、人员管理 |
| ⏳ 系统设置 | 开发中 | - |

## 📝 开发说明

### 添加新页面

1. 在 `src/pages/` 创建新页面组件
2. 在 `App.tsx` 中添加路由
3. 在 `Layout.tsx` 中添加导航链接

### 样式约定

- 使用 Tailwind CSS 工具类
- 自定义样式在 `index.css` 中定义
- 遵循响应式设计原则

## 📞 相关项目

- **后端**: Spring Boot 应用 (端口 `8080`)
- **数据库**: MySQL (端口 `3306`)
- **缓存**: Redis

## 🔄 更新记录

### 2026-05-13

- ✅ 初始化 React + Vite + TypeScript 项目
- ✅ 配置 Tailwind CSS
- ✅ 实现 Weyeah 品牌主题
- ✅ 开发登录页面
- ✅ 开发主布局组件
- ✅ 开发仪表盘
- ✅ 开发供应商管理
- ✅ 开发物料管理
- ✅ 开发合同管理
- ✅ 开发定价管理
- ✅ 开发组织架构
