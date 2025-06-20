# 🚀 部署流程说明

## 📋 当前部署架构

### 主要部署平台：腾讯云 CNB
- **触发条件**：推送到 `main` 分支
- **构建环境**：腾讯云云原生构建
- **部署目标**：腾讯云 COS
- **CDN加速**：腾讯云 CDN

### 备用部署平台：Cloudflare Pages  
- **触发条件**：腾讯云CNB自动同步到GitHub后触发
- **构建环境**：Cloudflare Pages
- **部署目标**：Cloudflare全球CDN
- **访问优势**：海外访问速度优化

## 🔄 开发工作流

### 1. 日常开发
```bash
# 在feature分支或develop分支开发
git checkout -b feature/new-post
# 进行开发...
git add .
git commit -m "新增博客文章"
git push origin feature/new-post
```

### 2. 代码检查
- 推送到 `develop` 或 `feature/*` 分支会触发 GitHub Actions 代码质量检查
- Pull Request 到 `main` 分支也会触发检查
- 确保构建无误后再合并

### 3. 生产部署
```bash
# 合并到main分支触发自动部署
git checkout main
git merge feature/new-post
git push origin main  # 这将触发腾讯云CNB自动部署
```

## 🌐 访问路线

### 国内用户
- **域名**：blog.l-souljourney.cn
- **解析**：腾讯云
- **CDN**：腾讯云CDN
- **优势**：国内访问速度最优

### 海外用户
- **域名**：blog-global.l-souljourney.cn（或Cloudflare Pages默认域名）
- **解析**：Cloudflare
- **CDN**：Cloudflare全球CDN
- **优势**：海外访问速度优化

## ⚠️ 注意事项

1. **不要在main分支直接开发**，使用feature分支或develop分支
2. **main分支的每次推送都会触发生产部署**
3. **GitHub Actions现在仅用于代码质量检查**，不再处理生产部署
4. **备份配置已保存在 `backup/github-actions/` 目录**

## 🔧 紧急恢复

如果腾讯云CNB出现问题，可以临时恢复GitHub Actions部署：

```bash
# 恢复GitHub Actions部署配置
cp backup/github-actions/deploy-to-cos.yml .github/workflows/
git add .github/workflows/deploy-to-cos.yml
git commit -m "临时恢复GitHub Actions部署"
git push origin main
```

## 📊 监控建议

- 监控腾讯云CNB构建状态
- 检查Cloudflare Pages同步状态  
- 定期验证两个线路的访问可用性 