 # 腾讯云 CNB 配置说明

## 📄 配置文件

项目中包含两个 CNB 配置文件：

1. **`.cnb.yml`** - 完整功能版本（推荐）
2. **`.cnb-simple.yml`** - 简化版本（备用）

## 🔧 CNB 控制台配置步骤

### 1. 创建构建项目

1. 登录 [腾讯云 CNB 控制台](https://console.cloud.tencent.com/cnb)
2. 点击"创建构建项目"
3. 选择代码源：
   - **仓库类型**：Git
   - **仓库地址**：`https://cnb.cool/l-souljourney/souljourney-astro.git`
   - **分支**：`main`

### 2. 构建配置

#### 基础配置
```
项目名称: l-souljourney-blog
构建环境: Node.js 18
构建超时: 30分钟
```

#### 构建命令
```bash
npm install -g pnpm
pnpm install --frozen-lockfile
pnpm build
```

#### 构建产物
```
构建产物路径: dist/
```

### 3. 部署配置

#### COS 部署
```
存储桶: souljourney-1251969283
地域: ap-shanghai (华东-上海)
上传路径: /
同步删除: 是
```

#### CDN 刷新
```
自动刷新: 是
刷新路径: /*
```

## 🔑 环境变量配置

在 CNB 控制台的"环境变量"页面添加：

### 必需变量
```bash
NODE_ENV=production
ASTRO_TELEMETRY_DISABLED=1
TZ=Asia/Shanghai
```

### 可选变量（用于 GitHub 同步）
```bash
GITHUB_TOKEN=your_github_personal_access_token
WEBHOOK_SUCCESS_URL=your_success_webhook_url
WEBHOOK_FAILURE_URL=your_failure_webhook_url
```

## 📋 触发配置

### Git 触发器
```
分支: main
触发条件: 代码推送
忽略路径: 
  - README.md
  - *.md
  - .github/**
```

### 手动触发
- 支持手动触发构建
- 可指定特定提交进行构建

## 🔄 工作流程

```
本地推送到 main 分支
        ↓
CNB 检测到代码变更
        ↓
自动拉取最新代码
        ↓
执行构建脚本
        ↓
上传到 COS 存储桶
        ↓
刷新 CDN 缓存
        ↓
同步到 GitHub (可选)
        ↓
触发 Cloudflare Pages 构建
```

## 🚨 常见问题

### 构建失败排查

1. **依赖安装失败**
   ```bash
   # 检查 pnpm-lock.yaml 是否存在
   # 尝试删除 node_modules 重新安装
   ```

2. **内存不足**
   ```bash
   # 在环境变量中添加
   NODE_OPTIONS=--max_old_space_size=4096
   ```

3. **构建超时**
   ```bash
   # 增加构建超时时间到 30 分钟
   # 优化构建脚本，移除不必要的步骤
   ```

### 部署失败排查

1. **COS 权限问题**
   - 检查 CNB 服务角色是否有 COS 写入权限
   - 确认存储桶名称和地域正确

2. **CDN 刷新失败**
   - 检查 CDN 服务是否正常
   - 确认刷新路径配置正确

## 📊 监控和日志

### 构建日志
- 在 CNB 控制台查看详细构建日志
- 支持实时查看构建进度

### 部署状态
- 监控 COS 上传状态
- 检查 CDN 刷新结果

### 告警配置
- 配置构建失败告警
- 设置部署异常通知

## 🔧 配置优化建议

1. **启用构建缓存**
   - 缓存 `node_modules`
   - 缓存 `pnpm` store

2. **优化构建时间**
   - 使用 `--frozen-lockfile` 避免重新解析依赖
   - 并行构建和压缩

3. **资源配置**
   - 根据项目大小调整 CPU 和内存
   - 设置合理的构建超时时间

## 🆘 紧急处理

### 回滚操作
```bash
# 如果部署出现问题，可以：
1. 在 CNB 控制台手动触发上一个成功版本的构建
2. 或者在本地回滚代码后推送：
   git reset --hard HEAD~1
   git push cnb main --force
```

### 临时禁用
```bash
# 临时禁用自动构建：
1. 在 CNB 控制台暂停项目
2. 或者删除 .cnb.yml 文件
```