# 🚀 L-Souljourney 博客新部署方案

## 📋 方案概述

**CNB → GitHub → 双线部署**

```
开发者 → CNB仓库 → 自动同步 → GitHub仓库
                              ├─ GitHub Actions → 腾讯云COS (国内)
                              └─ Cloudflare Pages → 全球CDN (海外)
```

### 🎯 方案优势

- ✅ **开发体验好**: CNB提供优秀的云端IDE和协作环境
- ✅ **部署稳定**: 利用GitHub Actions成熟的生态系统
- ✅ **双线访问**: 国内腾讯云COS + 海外Cloudflare Pages
- ✅ **维护简单**: 减少在CNB上调试复杂构建问题
- ✅ **成本控制**: CNB专注代码托管，GitHub免费额度充足

## 🔧 配置步骤

### 1. CNB配置 - 代码同步

**1.1 创建密钥仓库**
```bash
# 在CNB创建密钥仓库: l-souljourney/env
# 在仓库中创建 env.yml 文件
```

**1.2 配置GitHub Token**
```yaml
# env.yml 内容
GITHUB_TOKEN: "ghp_xxxxxxxxxxxx"  # GitHub Personal Access Token

allow_images:
  - alpine/git
allow_slugs:
  - l-souljourney/souljourney-astro
```

**1.3 启用自动同步**
在 `.cnb.yml` 中取消注释：
```yaml
imports: https://cnb.cool/l-souljourney/env/-/blob/main/env.yml
```

### 2. GitHub配置 - 自动部署

**2.1 配置仓库密钥**
在GitHub仓库的 `Settings → Secrets and variables → Actions` 中添加：

```
Secrets:
- COS_SECRET_ID: 腾讯云SecretId
- COS_SECRET_KEY: 腾讯云SecretKey

Variables:
- COS_BUCKET: souljourney-1251969283
- COS_REGION: ap-shanghai
```

**2.2 GitHub Actions工作流**
已配置 `.github/workflows/deploy.yml`，包含：
- ✅ Astro项目构建
- ✅ 自动部署到腾讯云COS
- ✅ CDN刷新
- ✅ PR构建检查

### 3. Cloudflare Pages配置

**3.1 连接GitHub仓库**
1. 登录 [Cloudflare Pages](https://pages.cloudflare.com/)
2. 创建新项目，连接GitHub仓库
3. 选择 `l-souljourney/souljourney-astro` 仓库

**3.2 构建配置**
```yaml
Build command: pnpm build
Build output directory: dist
Root directory: /
Environment variables:
  NODE_VERSION: 18
  ASTRO_TELEMETRY_DISABLED: 1
```

## 🔄 工作流程

### 日常开发

```bash
# 方式1: 本地开发
git add .
git commit -m "feat: 新功能"
git push cnb main  # 推送到CNB，自动同步到GitHub

# 方式2: CNB在线开发
# 直接在CNB的WebIDE中编辑代码并提交
```

### 自动部署流程

1. **代码推送到CNB** → CNB自动同步到GitHub
2. **GitHub Actions触发** → 构建Astro项目并部署到腾讯云COS
3. **Cloudflare Pages检测** → 自动构建并部署到全球CDN

### 访问地址

- 🇨🇳 **国内用户**: https://blog.l-souljourney.cn (腾讯云COS + CDN)
- 🌍 **海外用户**: https://souljourney-astro.pages.dev (Cloudflare Pages)

## 📊 资源使用情况

| 服务 | 用途 | 免费额度 | 实际使用 |
|------|------|----------|----------|
| **CNB** | 代码托管 + 云端IDE | 1600核时/月 | 代码同步 (~5分钟/月) |
| **GitHub** | 代码仓库 + Actions | 2000分钟/月 | 构建部署 (~50分钟/月) |
| **腾讯云COS** | 国内存储 | 50GB免费 | 静态文件 (~100MB) |
| **Cloudflare Pages** | 海外CDN | 500次构建/月 | 自动构建 (~30次/月) |

## 🔍 故障排查

### CNB同步失败
```bash
# 检查密钥仓库配置
1. 确认GITHUB_TOKEN已配置
2. 确认Token有repo权限
3. 查看CNB构建日志
```

### GitHub Actions失败
```bash
# 检查Secrets配置
1. 确认COS_SECRET_ID/KEY已配置
2. 确认腾讯云权限正确
3. 查看Actions运行日志
```

### Cloudflare Pages问题
```bash
# 检查构建配置
1. 确认Node.js版本为18
2. 确认构建命令和输出目录
3. 查看Pages构建日志
```

## 🚀 下一步计划

- [ ] 配置自定义域名HTTPS证书
- [ ] 添加构建状态通知
- [ ] 优化CDN缓存策略
- [ ] 集成评论系统
- [ ] 添加站点统计

---

**方案特点**: 简单可靠，充分利用各平台优势，实现国内外双线部署。 