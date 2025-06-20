# 双工作流协调策略

## 🎯 工作流概述

```
📝 文章发布线：Obsidian → main分支 → 双线部署
🔧 程序开发线：本地开发 → develop分支 → main分支 → 双线部署
```

## 📋 详细工作流程

### 📝 **文章发布工作流**（内容创作）

#### 特点：
- **频率高**：可能每天都有文章发布
- **风险低**：只涉及内容文件，不影响程序逻辑
- **要求快**：希望快速发布到线上

#### 推荐流程：
```bash
# 1. Obsidian中编写文章
# 文件路径: src/content/blog/文章标题.md

# 2. 使用Obsidian Git插件直接推送到main分支
# 自动操作：
git add src/content/blog/新文章.md
git commit -m "post: 发布新文章《文章标题》"
git push origin main

# 3. 自动触发双线部署
# → Cloudflare Pages (境外)
# → 腾讯云COS (境内)
```

### 🔧 **程序开发工作流**（功能开发）

#### 特点：
- **频率低**：可能几周或几个月才有一次
- **风险高**：涉及代码逻辑，可能影响网站稳定性
- **要求稳**：需要充分测试验证

#### 推荐流程：
```bash
# 1. 本地开发环境
git checkout develop
git pull origin develop

# 2. 本地测试
pnpm dev          # 本地预览
pnpm build        # 测试构建

# 3. 推送到develop分支测试
git add .
git commit -m "feat: 添加新功能"
git push origin develop

# 4. GitHub Actions自动运行测试构建

# 5. 测试通过后合并到main
git checkout main
git pull origin main
git merge develop
git push origin main

# 6. 自动触发生产部署
```

## 🚀 **协调策略**

### 策略一：分离式管理（推荐）

#### 📝 **文章内容**：
- **直接推送到main分支**
- **位置**：`src/content/blog/`
- **工具**：Obsidian + Git插件
- **优势**：快速发布，不影响开发

#### 🔧 **程序代码**：
- **develop → main 流程**
- **位置**：除 `src/content/blog/` 外的所有文件
- **工具**：本地IDE + Git命令
- **优势**：安全稳定，充分测试

### 策略二：统一develop分支（保守方案）

如果您希望所有变更都经过develop分支：

```bash
# 文章发布也走develop分支
# Obsidian → develop分支 → 测试 → main分支

# 优势：所有变更都有测试环节
# 劣势：文章发布流程较长
```

## 📊 **冲突解决机制**

### 场景1：同时进行文章和程序开发

```bash
# 程序开发进行中，需要发布文章
# 解决方案：

# 1. 先发布文章到main
git checkout main
# Obsidian推送文章

# 2. 将main合并到develop，避免冲突
git checkout develop
git merge main
git push origin develop

# 3. 继续程序开发
```

### 场景2：紧急程序修复

```bash
# 有紧急bug需要修复
# 解决方案：

# 1. 创建hotfix分支
git checkout main
git checkout -b hotfix/紧急修复

# 2. 修复并测试
git add .
git commit -m "fix: 紧急修复"

# 3. 合并到main和develop
git checkout main
git merge hotfix/紧急修复
git push origin main

git checkout develop  
git merge hotfix/紧急修复
git push origin develop
```

## 🛠️ **技术实现**

### Obsidian Git插件配置

建议配置：
- **自动拉取**：每次打开时拉取最新内容
- **自动推送**：保存文件后自动推送
- **分支设置**：默认推送到main分支
- **路径限制**：只同步 `src/content/blog/` 目录

### GitHub分支保护

建议设置：
- **main分支**：允许直接推送（用于文章发布）
- **路径规则**：只有 `src/content/blog/` 允许直接推送
- **其他文件**：需要通过PR合并

## 📈 **最佳实践建议**

### ✅ **推荐做法**：

1. **文章发布**：Obsidian直接推送到main分支
2. **程序开发**：严格按照develop → main流程
3. **定期同步**：开发前先同步main到develop
4. **清晰命名**：commit信息使用规范前缀
   - `post:` 文章相关
   - `feat:` 新功能
   - `fix:` 修复bug
   - `config:` 配置变更

### ⚠️ **注意事项**：

1. **开发前同步**：每次开发前确保develop分支是最新的
2. **避免同时修改**：程序开发期间避免大量文章发布
3. **备份重要**：定期备份Obsidian库和GitHub仓库
4. **测试验证**：程序变更必须经过本地测试

## 🎉 **总结**

这种双工作流设计既保证了：
- **文章发布的便捷性**（Obsidian直接推送）
- **程序开发的安全性**（develop分支测试）
- **整体系统的稳定性**（分离关注点）

是一个非常实用和优雅的解决方案！ 