# 🚀 L-Souljourney 博客工作流程指南

## 📋 仓库配置状态

### 远程仓库
- **CNB (主要)**：https://cnb.cool/l-souljourney/souljourney-astro.git
- **GitHub (备用)**：git@github.com:l-souljourney/souljourney-astro.git

### 分支策略
```
main          (生产分支) → 触发腾讯云CNB自动部署
├── develop   (开发分支) → 程序功能开发和测试  
└── feature/* (功能分支) → 具体功能和文章开发
```

## 🔄 日常工作流程

### 1. 程序功能开发
```bash
# 从 develop 分支创建功能分支
git checkout develop
git pull cnb develop
git checkout -b feature/new-component

# 进行开发...
# 修改代码、添加功能等

# 提交更改
git add .
git commit -m "✨ 添加新功能组件"

# 推送到远程 (会触发GitHub Actions代码检查)
git push origin feature/new-component

# 创建 PR 到 develop 分支进行代码审查
# 合并到 develop 后推送到 CNB
git checkout develop
git merge feature/new-component
git push cnb develop
```

### 2. 博客文章编写
```bash
# 从 develop 分支创建文章分支
git checkout develop
git pull cnb develop
git checkout -b feature/blog-post-xxxx

# 创建新文章
pnpm newpost "新文章标题"

# 编辑文章内容
# 在 src/content/blog/ 目录下编辑 markdown 文件

# 本地预览
pnpm dev

# 提交文章
git add .
git commit -m "📝 新增博客文章: 新文章标题"

# 推送并创建 PR
git push origin feature/blog-post-xxxx
# 合并到 develop，然后推送到 CNB
```

### 3. 发布到生产环境
```bash
# 当 develop 分支稳定后，合并到 main 触发生产部署
git checkout main
git pull cnb main
git merge develop

# 推送到 CNB 触发自动部署
git push cnb main

# 同步到 GitHub 触发 Cloudflare Pages
git push origin main
```

## ⚡ 快捷命令

### 快速同步
```bash
# 同步到两个远程仓库
alias push-both="git push cnb && git push origin"

# 创建新文章分支
function new-post() {
    git checkout develop
    git pull cnb develop
    git checkout -b "feature/blog-post-$(date +%Y%m%d)"
    pnpm newpost "$1"
}

# 发布到生产
function deploy-prod() {
    git checkout main
    git pull cnb main
    git merge develop
    git push cnb main
    git push origin main
    echo "🚀 已触发生产部署!"
}
```

### 测试构建
```bash
# 本地测试构建
pnpm build

# 测试预览
pnpm preview
```

## 📊 部署状态检查

### 腾讯云 CNB
- 构建状态：[CNB控制台](https://console.cloud.tencent.com/cnb)
- COS部署：[COS控制台](https://console.cloud.tencent.com/cos)
- CDN状态：[CDN控制台](https://console.cloud.tencent.com/cdn)

### Cloudflare Pages  
- 构建状态：[Cloudflare Pages](https://dash.cloudflare.com/pages)
- 全球访问：通过 Cloudflare 域名

### GitHub Actions
- 代码检查：[GitHub Actions](https://github.com/l-souljourney/souljourney-astro/actions)

## 🔧 故障处理

### CNB构建失败
1. 检查 CNB 控制台构建日志
2. 验证本地构建是否成功：`pnpm build`
3. 检查依赖版本兼容性

### GitHub Actions失败
1. 检查 Actions 页面的错误日志
2. 通常是代码质量问题，修复后重新推送

### 紧急回滚
```bash
# 如果需要紧急回滚到上个版本
git checkout main
git reset --hard HEAD~1
git push cnb main --force
git push origin main --force
```

## 📝 最佳实践

1. **始终在 feature 分支开发**，不要直接在 main 或 develop 分支修改
2. **文章发布前先本地预览**，确保格式正确
3. **重要更新先在 develop 测试**，稳定后再合并到 main
4. **定期同步两个远程仓库**，保持一致性
5. **使用语义化提交信息**，便于版本管理

## 🎯 提交消息规范

```
✨ feat: 新功能
🐛 fix: 修复bug
📝 docs: 文档更新
💄 style: 样式调整
♻️ refactor: 代码重构
⚡ perf: 性能优化
🎨 art: 改进代码结构
📦 build: 构建相关
🚀 deploy: 部署相关
```

---

**记住**：main 分支的每次推送都会触发生产部署，请谨慎操作！ 