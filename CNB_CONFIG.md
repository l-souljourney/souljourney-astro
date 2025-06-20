# CNB (云原生构建) 配置指南

## 配置文件说明

项目使用 `.cnb.yml` 文件进行CNB构建配置，支持以下分支策略：

### 分支配置

- **main分支**: 完整构建+部署+CDN刷新+GitHub同步
- **develop分支**: 仅构建测试，不部署
- **所有分支PR**: 构建检查

### 构建环境

使用 `node:18-alpine` 镜像，包含：
- Node.js 18.x
- npm 包管理器
- Alpine Linux 轻量级系统

## 必需的环境变量

在CNB密钥仓库中配置以下环境变量：

### 腾讯云COS配置 (必需)
```
COS_SECRET_ID=你的腾讯云SecretId
COS_SECRET_KEY=你的腾讯云SecretKey  
COS_BUCKET=你的COS存储桶名称
COS_REGION=ap-guangzhou
```

### 腾讯云CDN配置 (可选)
```
CDN_DOMAIN=blog.l-souljourney.cn
```

### GitHub同步配置 (可选)
```
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

## 插件说明

### cnbcool/tencent-cos
- 自动部署到腾讯云COS
- 支持增量同步
- 自动清理过期文件

### cnbcool/tencent-cdn
- 自动刷新CDN缓存
- 支持目录和URL刷新

## 构建流程

### 主分支 (main)
1. **环境准备**: 安装pnpm等工具
2. **安装依赖**: 使用pnpm安装项目依赖
3. **构建项目**: 执行`pnpm build`生成静态文件
4. **部署到COS**: 使用插件部署到腾讯云COS
5. **刷新CDN**: 自动刷新CDN缓存
6. **同步GitHub**: 推送到GitHub仓库 (如果配置了Token)

### 开发分支 (develop)
1. **构建测试**: 验证代码能正常构建

### PR检查
1. **PR检查**: 验证PR代码能正常构建

## 注意事项

1. **镜像选择**: 使用`node:18-alpine`确保有Node.js环境
2. **插件使用**: COS和CDN部署使用专用插件
3. **环境变量**: 在CNB控制台的密钥仓库中配置
4. **GitHub同步**: 可选功能，需要配置`GITHUB_TOKEN`

## 故障排查

### 常见问题

1. **node: command not found**
   - 确保使用包含Node.js的镜像 (如`node:18-alpine`)

2. **COS部署失败**
   - 检查COS相关环境变量是否正确配置
   - 确认COS存储桶权限

3. **GitHub同步失败**  
   - 检查`GITHUB_TOKEN`是否有效
   - 确认Token有推送权限

### 查看日志
在CNB控制台可以查看详细的构建日志，包括每个阶段的执行情况。

## 🔧 CNB 配置指南

## 📋 问题诊断

### 为什么CNB构建没有触发？

1. **配置格式错误**：之前的 `.cnb.yml` 使用了错误的格式
2. **环境变量缺失**：需要在CNB密钥仓库中配置必要的环境变量
3. **权限问题**：腾讯云密钥权限不足

## 🛠️ 修复方案

### 1. 正确的CNB配置格式

CNB使用特定的YAML格式，需要按分支配置：

```yaml
# 主分支配置
main:
  push:
    - imports: https://cnb.cool/l-souljourney/env/-/blob/main/env.yml
      stages:
        - name: 阶段名称
          script: |
            # 构建脚本
```

### 2. 环境变量配置

在CNB密钥仓库 `https://cnb.cool/l-souljourney/env` 的 `env.yml` 文件中配置：

#### 必需变量：
```yaml
# 腾讯云COS配置
COS_SECRET_ID: "AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
COS_SECRET_KEY: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
COS_BUCKET: "你的存储桶名称"

# GitHub同步配置
GITHUB_TOKEN: "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

#### 可选变量：
```yaml
COS_REGION: "ap-guangzhou"
CDN_DOMAIN: "blog.l-souljourney.cn"
```

## 🔑 获取密钥步骤

### 腾讯云 API 密钥

1. **登录腾讯云控制台**
   - 访问：https://console.cloud.tencent.com/cam/capi

2. **创建或查看密钥**
   - 点击"新建密钥"或查看现有密钥
   - 记录 `SecretId` 和 `SecretKey`

3. **设置权限**
   确保密钥具有以下权限：
   - `COS全读写权限`
   - `CDN刷新权限`
   - 或者创建自定义策略包含这些权限

### GitHub Personal Access Token

1. **登录GitHub**
   - 访问：Settings > Developer settings > Personal access tokens

2. **创建Token**
   - 选择权限：`repo` (完整仓库权限)
   - 选择权限：`workflow` (GitHub Actions权限)
   - 生成token并保存

### COS存储桶名称

1. **登录COS控制台**
   - 访问：https://console.cloud.tencent.com/cos

2. **查看存储桶**
   - 找到你的博客存储桶
   - 复制完整的存储桶名称（格式：name-appid）

## 🚀 部署流程

### 构建阶段：
1. **环境准备** - 安装Node.js和pnpm
2. **安装依赖** - 使用国内镜像加速
3. **构建项目** - 生成静态文件
4. **部署COS** - 上传到腾讯云对象存储
5. **刷新CDN** - 清理CDN缓存
6. **同步GitHub** - 推送代码触发Cloudflare Pages

### 触发条件：
- 推送到 `main` 分支：完整构建和部署
- 推送到 `develop` 分支：仅构建测试

## 🔍 故障排查

### 构建失败常见原因：

1. **环境变量未配置**
   ```
   ❌ 缺少必要的COS环境变量
   ```
   **解决**：检查密钥仓库环境变量配置

2. **权限不足**
   ```
   Access Denied
   ```
   **解决**：检查腾讯云密钥权限

3. **GitHub同步失败**
   ```
   ⚠️ 未配置GITHUB_TOKEN
   ```
   **解决**：配置GitHub Personal Access Token

4. **网络问题**
   ```
   connection timeout
   ```
   **解决**：使用国内镜像，检查网络配置

### 检查方法：

1. **查看CNB构建日志**
   - 登录CNB控制台查看详细错误信息

2. **验证环境变量**
   - 确保所有必需变量都已配置
   - 检查变量值的正确性

3. **测试权限**
   - 在腾讯云控制台测试COS访问
   - 在GitHub测试token权限

## ✅ 验证清单

部署成功后，检查以下项目：

- [ ] CNB构建日志显示成功
- [ ] 腾讯云COS中有最新文件
- [ ] CDN缓存已刷新
- [ ] GitHub仓库代码已同步
- [ ] Cloudflare Pages开始构建
- [ ] 网站可正常访问

## 📞 技术支持

如果遇到问题：

1. 首先检查CNB构建日志
2. 验证环境变量配置
3. 检查腾讯云密钥权限
4. 查看GitHub token权限