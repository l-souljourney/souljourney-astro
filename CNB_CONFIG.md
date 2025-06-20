# CNB (云原生构建) 配置指南

## 🚨 重要修复说明

根据CNB官方文档和构建日志分析，之前的配置语法完全错误。CNB使用类似Docker的声明式语法，而非流水线语法。

### 修复的关键问题：
1. **语法结构**: 使用 `docker:` + `stages:` 的官方标准格式
2. **镜像指定**: 正确的镜像配置让CNB能识别并使用Node.js环境
3. **插件调用**: 使用正确的插件格式和参数传递

## 📋 配置文件说明

项目使用 `.cnb.yml` 文件，采用CNB官方标准语法：

### 标准语法格式

```yaml
分支名称:
  触发事件:
    - docker:
        image: 镜像名称
      stages:
        - 命令1
        - 命令2
      plugins:
        - name: 插件名称
          with:
            参数1: 值1
            参数2: 值2
```

### 分支配置策略

- **main分支**: 完整部署流程（构建→COS→CDN）
- **develop分支**: 开发环境构建测试
- **PR检查**: 拉取请求构建验证（`"**"` 匹配所有分支）

### 构建环境

- **镜像**: `node:18-alpine` 
- **包管理器**: pnpm (配置为使用国内镜像源)
- **构建工具**: Astro

## 🔐 环境变量配置

在CNB控制台的密钥仓库中配置：

### 必需变量 - 腾讯云COS
```
COS_SECRET_ID=你的腾讯云SecretId
COS_SECRET_KEY=你的腾讯云SecretKey
COS_BUCKET=你的COS存储桶名称
COS_REGION=ap-guangzhou
```

### 可选变量 - CDN刷新
```
CDN_DOMAIN=blog.l-souljourney.cn
```

### 可选变量 - GitHub同步
```
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

## 🔧 插件配置详解

### cnbcool/tencent-cos 插件
```yaml
- name: cnbcool/tencent-cos
  with:
    secret_id: ${COS_SECRET_ID}      # 腾讯云SecretId
    secret_key: ${COS_SECRET_KEY}    # 腾讯云SecretKey  
    bucket: ${COS_BUCKET}            # COS存储桶名称
    region: ${COS_REGION}            # COS地域
    src: dist/                       # 本地源目录
    dest: /                          # COS目标路径
    delete: true                     # 清理旧文件
```

### cnbcool/tencent-cdn 插件
```yaml
- name: cnbcool/tencent-cdn
  if: ${CDN_DOMAIN}                  # 条件执行
  with:
    domain: ${CDN_DOMAIN}            # CDN域名
    secret_id: ${COS_SECRET_ID}      # 腾讯云SecretId
    secret_key: ${COS_SECRET_KEY}    # 腾讯云SecretKey
    type: directory                  # 刷新类型
    path: /                          # 刷新路径
```

## 🚀 构建流程说明

### 主分支 (main)
1. **环境准备**: 检查Node.js版本，安装pnpm
2. **依赖安装**: 使用国内镜像源安装项目依赖
3. **项目构建**: 执行Astro构建，生成静态文件到dist/
4. **COS部署**: 上传构建产物到腾讯云COS
5. **CDN刷新**: 自动刷新CDN缓存（如果配置了CDN_DOMAIN）
6. **GitHub同步**: 推送代码到GitHub触发Cloudflare Pages（如果配置了GITHUB_TOKEN）

### 开发分支 (develop)
1. **构建测试**: 执行完整构建流程验证代码正确性
2. **无部署**: 仅进行构建测试，不执行部署操作

### PR检查
1. **快速验证**: 执行构建检查确保PR不会破坏构建
2. **轻量化**: 最小化构建步骤，快速反馈

## 📊 与之前配置的区别

| 项目 | ❌ 之前错误配置 | ✅ 现在正确配置 |
|------|-------------|-------------|
| 语法格式 | `name:` + `script:` | `docker:` + `stages:` |
| 镜像指定 | `image: node:18-alpine` | `docker: {image: node:18-alpine}` |
| 命令执行 | 单一script块 | stages数组，每行一个命令 |
| 插件调用 | 错误的plugins语法 | 标准的name+with格式 |

## 🔍 故障排查

### 常见问题
1. **镜像无法识别**: 确保使用 `docker:` 块包裹 `image:` 配置
2. **命令执行失败**: 检查stages中每个命令的语法正确性
3. **插件参数错误**: 确保使用 `with:` 传递参数，而非直接并列

### 验证方法
- 查看CNB构建日志确认使用的镜像是否为 `node:18-alpine`
- 检查构建过程中的输出信息
- 确认环境变量是否正确配置

### 成功标志
构建日志应该显示：
```
docker run ... node:18-alpine ...
```
而不是：
```
docker run ... cnbcool/default-build-env:latest ...
```

## 📚 参考资料

- [CNB官方文档](https://docs.cnb.cool/zh/build/)
- [CNB流水线语法](https://docs.cnb.cool/zh/build/grammar.html)
- [CNB构建环境](https://docs.cnb.cool/zh/build/environment.html)