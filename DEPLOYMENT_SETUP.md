# 腾讯云COS自动部署配置指南

## 概述
本项目已配置GitHub Actions自动部署到腾讯云COS，实现国内外双线部署：
- **境外线路**: Cloudflare Pages (自动部署) → `blog.l-souljourney.cn`
- **境内线路**: 腾讯云COS (GitHub Actions部署) → 您的COS域名

## 配置步骤

### 1. 获取腾讯云API密钥
1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 进入 **访问管理** → **API密钥管理**
3. 创建密钥，获取：
   - `SecretId`
   - `SecretKey`

### 2. 创建COS存储桶
1. 进入 [COS控制台](https://console.cloud.tencent.com/cos)
2. 创建存储桶，记录：
   - **存储桶名称** (如: `myblog-1234567890`)
   - **所属地域** (如: `ap-beijing`)

### 3. 配置GitHub Secrets
在GitHub仓库中设置以下Secrets：

1. 进入仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret** 添加以下密钥：

| Secret名称 | 值 | 说明 |
|-----------|----|----|
| `TENCENT_CLOUD_SECRET_ID` | 您的SecretId | 腾讯云API密钥ID |
| `TENCENT_CLOUD_SECRET_KEY` | 您的SecretKey | 腾讯云API密钥 |
| `COS_BUCKET` | 存储桶名称 | 如: myblog-1234567890 |
| `COS_REGION` | 存储桶地域 | 如: ap-beijing |

### 4. 配置COS静态网站托管
1. 在COS控制台选择您的存储桶
2. 进入 **基础配置** → **静态网站**
3. 开启静态网站功能
4. 设置：
   - **索引文档**: `index.html`
   - **错误文档**: `404.html`

### 5. 配置CDN加速（可选）
1. 进入 [CDN控制台](https://console.cloud.tencent.com/cdn)
2. 添加域名，源站选择您的COS存储桶
3. 配置CNAME解析

## 部署流程

### 自动部署触发条件
- 推送代码到 `main` 分支时自动触发
- 构建完成后自动上传到腾讯云COS

### 部署步骤
1. **代码检出**: 获取最新代码
2. **环境准备**: 安装Node.js和pnpm
3. **依赖安装**: 安装项目依赖
4. **项目构建**: 执行 `pnpm build`
5. **COS部署**: 上传构建产物到腾讯云COS

## 验证部署

### 检查GitHub Actions
1. 进入仓库 → **Actions** 标签
2. 查看最新的工作流运行状态
3. 如有错误，点击查看详细日志

### 检查COS文件
1. 进入COS控制台
2. 确认存储桶中有构建文件
3. 测试静态网站访问

## 故障排除

### 常见问题
1. **API密钥错误**: 检查Secrets配置是否正确
2. **存储桶权限**: 确保API密钥有COS操作权限
3. **构建失败**: 检查依赖安装和构建命令

### 调试方法
1. 查看GitHub Actions日志
2. 检查腾讯云COS访问日志
3. 验证静态网站配置

## 注意事项
- 确保API密钥安全，不要泄露
- 定期检查COS存储用量和费用
- 建议配置CDN加速提升访问速度 