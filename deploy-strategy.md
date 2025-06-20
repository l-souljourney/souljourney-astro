# 双线部署策略

## 🌍 访问路线规划

### 国内访问
- **主域名**: blog.l-souljourney.cn (解析到腾讯云)
- **CDN**: 腾讯云 CDN
- **存储**: 腾讯云 COS
- **构建**: 腾讯云 CNB

### 海外访问  
- **备用域名**: blog-global.l-souljourney.cn (解析到 Cloudflare)
- **CDN**: Cloudflare 全球 CDN
- **存储**: Cloudflare Pages
- **构建**: Cloudflare Pages

## 🔄 工作流程

1. **开发阶段**
   ```bash
   # 本地开发
   pnpm dev
   
   # 提交代码
   git add .
   git commit -m "更新博客内容"
   git push cnb main
   ```

2. **自动构建流程**
   ```
   腾讯云 CNB 检测到推送
   ↓
   自动构建 Astro 项目
   ↓
   部署到腾讯云 COS
   ↓
   刷新腾讯云 CDN
   ↓
   同步代码到 GitHub
   ↓
   触发 Cloudflare Pages 构建
   ↓
   部署到 Cloudflare 全球 CDN
   ```

## ⚡ 性能优化

### DNS 智能解析
```
国内用户 → 腾讯云线路
海外用户 → Cloudflare 线路
```

### CDN 配置
- **腾讯云 CDN**: 针对中国大陆优化
- **Cloudflare CDN**: 全球边缘节点

## 🔒 安全配置

- **HTTPS**: 全站 HTTPS
- **防护**: Cloudflare 提供 DDoS 防护
- **备份**: 双线部署自动备份

## 💰 成本控制

- **腾讯云 COS**: 按量付费
- **腾讯云 CDN**: 有免费额度
- **Cloudflare Pages**: 免费版足够使用
- **GitHub**: 公开仓库免费

## 📱 监控建议

- 使用 Uptime Robot 监控两个线路的可用性
- 配置 Webhook 通知构建状态
- 定期检查同步状态 