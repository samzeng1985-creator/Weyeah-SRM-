# Weyeah-SRM 版本管理指南

## 问题背景

在开发过程中，可能会出现修改出错但无法回退的情况。为了避免这种情况，我们建立了版本管理机制。

---

## 方案一：自动备份脚本（推荐）

### 使用方法

1. **创建备份**
   - 双击运行 `backup.bat`
   - 脚本会自动创建备份到 `.backups` 文件夹
   - 备份文件名格式：`v20260514_143025`（年月日_时分秒）

2. **备份内容**
   - 前端源码：`srm-frontend-app/src/`
   - 后端源码：`srm/srm-gateway/src/`
   - 项目文档：`*.md`

3. **恢复备份**
   - 进入 `.backups` 文件夹
   - 找到对应版本的文件夹
   - 将文件复制回原位置覆盖

### 最佳实践

- **每次重要修改前**：运行 `backup.bat` 创建备份
- **修改完成后**：确认无误后再创建新备份
- **出问题时**：从最近的备份恢复

---

## 方案二：手动备份

### 备份命令

```powershell
# 创建备份文件夹
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = ".backups\manual_$timestamp"
New-Item -ItemType Directory -Path $backupDir -Force

# 备份前端
Copy-Item -Path "srm-frontend-app\src" -Destination "$backupDir\srm-frontend-app\src" -Recurse -Force

# 备份后端
Copy-Item -Path "srm\srm-gateway\src" -Destination "$backupDir\srm\srm-gateway\src" -Recurse -Force

# 备份文档
Copy-Item -Path "*.md" -Destination $backupDir -Force

Write-Host "备份完成: $backupDir"
```

### 恢复命令

```powershell
# 指定要恢复的版本
$version = "20260514_143025"
$backupDir = ".backups\v$version"

# 恢复前端
Copy-Item -Path "$backupDir\srm-frontend-app\src\*" -Destination "srm-frontend-app\src\" -Recurse -Force

# 恢复后端
Copy-Item -Path "$backupDir\srm\srm-gateway\src\*" -Destination "srm\srm-gateway\src\" -Recurse -Force

Write-Host "恢复完成: $version"
```

---

## 方案三：Git版本控制（推荐用于正式项目）

### 安装Git

1. 下载Git: https://git-scm.com/download/win
2. 安装后重启电脑

### 初始化仓库

```bash
cd "C:\Users\konst\Documents\Trae SOLO\Weyeah-SRM"
git init
git add .
git commit -m "初始提交"
```

### 日常使用

```bash
# 查看状态
git status

# 查看修改内容
git diff

# 提交修改
git add .
git commit -m "描述修改内容"

# 查看历史
git log --oneline

# 回退到上一个版本
git reset --hard HEAD^

# 回退到指定版本
git reset --hard <commit-id>

# 创建分支（尝试新功能时）
git checkout -b feature-xxx

# 切换分支
git checkout main
```

---

## 修改前检查清单

在每次重要修改前，请确认：

- [ ] 已创建备份或已提交Git
- [ ] 明确要修改的文件
- [ ] 了解修改的影响范围
- [ ] 准备好回退方案

---

## 修改后验证清单

修改完成后，请验证：

- [ ] 前端编译无错误：`npm run build`
- [ ] 后端编译无错误：`mvn compile`
- [ ] 功能正常运行
- [ ] 没有破坏其他功能

---

## 紧急恢复步骤

如果修改出错，按以下步骤恢复：

1. **停止服务**
   - 停止前端开发服务器
   - 停止后端服务

2. **恢复文件**
   - 从最近的备份复制文件
   - 或使用Git回退：`git checkout -- .`

3. **重启服务**
   - 重启后端服务
   - 重启前端服务

4. **验证功能**
   - 确认系统恢复正常
   - 测试核心功能

---

## AI助手工作流程

为了防止再次出现问题，AI助手将遵循以下流程：

1. **修改前**
   - 告知用户要修改哪些文件
   - 说明修改的目的和影响
   - 创建备份或提醒用户备份

2. **修改中**
   - 使用Edit工具精确修改
   - 保留原始代码的上下文
   - 添加必要的注释

3. **修改后**
   - 运行编译检查
   - 提示用户测试功能
   - 记录修改内容

---

## 文件修改记录

建议在每次重要修改后，在此记录：

| 日期 | 文件 | 修改内容 | 修改人 |
|------|------|----------|--------|
| 2026-05-14 | Dashboard.tsx | 重新设计仪表盘 | AI |
| 2026-05-14 | Suppliers.tsx | 恢复到简单版本 | AI |
| 2026-05-14 | Materials.tsx | 恢复到简单版本 | AI |
| 2026-05-14 | Contracts.tsx | 恢复到简单版本 | AI |
| 2026-05-14 | Pricing.tsx | 恢复到简单版本 | AI |

---

**创建日期**: 2026年5月14日  
**最后更新**: 2026年5月14日
