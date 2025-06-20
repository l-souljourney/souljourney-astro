# 🚀 L-Souljourney 博客双线部署方案

## 📋 部署架构

### 🌟 核心理念
- **CNB为主导**：开发、调试、构建、部署都在腾讯云CNB进行
- **GitHub为镜像**：仅作为代码同步，触发Cloudflare Pages
- **双线访问**：国内腾讯云COS + 海外Cloudflare Pages

### 🔄 工作流程

```
本地开发 → 推送到CNB → CNB自动构建 → 部署到COS → 同步到GitHub → Cloudflare Pages构建
```

## �� 配置说明

### 1. CNB配置 (.cnb.yml)
- ✅ 自动构建Astro项目
- ✅ 部署到腾讯云COS（国内访问）
- ✅ 自动刷新CDN缓存
- ✅ 同步代码到GitHub
- ✅ 触发Cloudflare Pages构建

### 2. GitHub Actions (.github/workflows/deploy.yml)
- ✅ 代码质量检查
- ✅ 触发Cloudflare Pages构建
- ❌ 不再直接部署到COS

## 🌐 访问地址

### 🇨🇳 国内访问
- **主域名**: https://blog.l-souljourney.cn
- **CDN**: 腾讯云CDN加速
- **存储**: 腾讯云COS

### 🌍 海外访问
- **域名**: Cloudflare Pages提供的域名
- **CDN**: Cloudflare全球CDN
- **存储**: Cloudflare Pages

## 🔄 日常操作流程

### 开发流程
```bash
# 1. 本地开发
git checkout develop
# 修改代码...

# 2. 推送到CNB
git push cnb develop

# 3. 合并到主分支触发部署
git checkout main
git merge develop
git push cnb main  # 触发自动部署
```

## 🎯 优势特点
- ✅ 国内访问快：腾讯云COS + CDN
- ✅ 海外访问快：Cloudflare全球加速
- ✅ 构建稳定：CNB提供稳定的构建环境
- ✅ 代码安全：主要开发在CNB进行
- ✅ 自动化：一次推送，双线部署
