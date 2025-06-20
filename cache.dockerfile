# CNB 依赖缓存 Dockerfile
# 基于 node:18-alpine 构建 pnpm 依赖缓存镜像

FROM node:18-alpine

# 设置工作目录
WORKDIR /workspace

# 安装必要的系统依赖
RUN apk add --no-cache git python3 py3-pip

# 安装最新版本的 pnpm 并确保在 PATH 中
RUN npm install -g pnpm@latest && \
    ln -sf /usr/local/bin/pnpm /usr/bin/pnpm && \
    which pnpm

# 配置 pnpm 镜像源和缓存目录
RUN pnpm config set registry https://mirrors.cloud.tencent.com/npm/ && \
    pnpm config set store-dir /root/.local/share/pnpm/store && \
    pnpm config set cache-dir /root/.cache/pnpm && \
    pnpm config set state-dir /root/.local/state/pnpm && \
    pnpm config set prefer-offline true && \
    pnpm config set network-timeout 300000 && \
    pnpm config set fetch-retries 5 && \
    pnpm config set network-concurrency 16

# 复制依赖配置文件（CNB会根据by参数自动复制这些文件）
COPY package.json pnpm-lock.yaml ./

# 安装依赖到缓存目录
RUN echo "🚀 开始安装依赖..." && \
    time pnpm install --frozen-lockfile && \
    echo "✅ 依赖安装完成" && \
    echo "📊 依赖统计：" && \
    ls -la node_modules/ | head -5 && \
    du -sh node_modules/ && \
    find node_modules/ -type f | wc -l | xargs echo "文件总数："

# 备份node_modules到临时目录，避免volume挂载覆盖
RUN cp -r node_modules /tmp/cached_node_modules && \
    echo "缓存的node_modules已备份到/tmp/cached_node_modules"

# 安装COS SDK用于部署
RUN pip3 install --break-system-packages cos-python-sdk-v5

# 创建缓存设置脚本
RUN echo '#!/bin/sh' > /usr/local/bin/setup-cache.sh && \
    echo 'set -e' >> /usr/local/bin/setup-cache.sh && \
    echo 'echo "🔧 === 环境准备 ==="' >> /usr/local/bin/setup-cache.sh && \
    echo 'echo "当前工作目录：$(pwd)"' >> /usr/local/bin/setup-cache.sh && \
    echo 'echo "Node版本：$(node --version)"' >> /usr/local/bin/setup-cache.sh && \
    echo 'echo "pnpm版本：$(pnpm --version)"' >> /usr/local/bin/setup-cache.sh && \
    echo 'echo ""' >> /usr/local/bin/setup-cache.sh && \
    echo 'echo "📦 === 恢复缓存依赖 ==="' >> /usr/local/bin/setup-cache.sh && \
    echo 'if [ -d "/tmp/cached_node_modules" ]; then' >> /usr/local/bin/setup-cache.sh && \
    echo '  echo "✅ 发现缓存的node_modules，正在复制..."' >> /usr/local/bin/setup-cache.sh && \
    echo '  cp -r /tmp/cached_node_modules ./node_modules' >> /usr/local/bin/setup-cache.sh && \
    echo '  echo "✅ 缓存复制完成"' >> /usr/local/bin/setup-cache.sh && \
    echo 'else' >> /usr/local/bin/setup-cache.sh && \
    echo '  echo "❌ 未找到缓存的node_modules"' >> /usr/local/bin/setup-cache.sh && \
    echo '  exit 1' >> /usr/local/bin/setup-cache.sh && \
    echo 'fi' >> /usr/local/bin/setup-cache.sh && \
    echo 'echo ""' >> /usr/local/bin/setup-cache.sh && \
    echo 'echo "🔍 === 检查依赖状态 ==="' >> /usr/local/bin/setup-cache.sh && \
    echo 'if [ -d "node_modules" ]; then' >> /usr/local/bin/setup-cache.sh && \
    echo '  echo "✅ node_modules存在"' >> /usr/local/bin/setup-cache.sh && \
    echo '  du -sh node_modules/' >> /usr/local/bin/setup-cache.sh && \
    echo '  echo "🚀 开始增量安装..."' >> /usr/local/bin/setup-cache.sh && \
    echo '  time pnpm install --frozen-lockfile --prefer-offline' >> /usr/local/bin/setup-cache.sh && \
    echo '  echo "✅ 依赖安装完成"' >> /usr/local/bin/setup-cache.sh && \
    echo 'else' >> /usr/local/bin/setup-cache.sh && \
    echo '  echo "❌ node_modules不存在"' >> /usr/local/bin/setup-cache.sh && \
    echo '  exit 1' >> /usr/local/bin/setup-cache.sh && \
    echo 'fi' >> /usr/local/bin/setup-cache.sh && \
    chmod +x /usr/local/bin/setup-cache.sh

# 创建Astro构建脚本
RUN echo '#!/bin/sh' > /usr/local/bin/build-astro.sh && \
    echo 'set -e' >> /usr/local/bin/build-astro.sh && \
    echo 'echo ""' >> /usr/local/bin/build-astro.sh && \
    echo 'echo "🏗️ === 开始构建Astro项目 ==="' >> /usr/local/bin/build-astro.sh && \
    echo 'echo "📋 构建信息："' >> /usr/local/bin/build-astro.sh && \
    echo 'echo "- 工作目录：$(pwd)"' >> /usr/local/bin/build-astro.sh && \
    echo 'echo "- Node版本：$(node --version)"' >> /usr/local/bin/build-astro.sh && \
    echo 'echo "- pnpm版本：$(pnpm --version)"' >> /usr/local/bin/build-astro.sh && \
    echo 'echo ""' >> /usr/local/bin/build-astro.sh && \
    echo 'echo "🚀 开始执行构建..."' >> /usr/local/bin/build-astro.sh && \
    echo 'if time pnpm run build; then' >> /usr/local/bin/build-astro.sh && \
    echo '  echo ""' >> /usr/local/bin/build-astro.sh && \
    echo '  echo "✅ === Astro构建成功 ==="' >> /usr/local/bin/build-astro.sh && \
    echo '  echo "📊 === 构建产物统计 ==="' >> /usr/local/bin/build-astro.sh && \
    echo '  if [ -d "dist" ]; then' >> /usr/local/bin/build-astro.sh && \
    echo '    ls -la dist/' >> /usr/local/bin/build-astro.sh && \
    echo '    du -sh dist/' >> /usr/local/bin/build-astro.sh && \
    echo '    find dist/ -type f | wc -l | xargs echo "文件总数："' >> /usr/local/bin/build-astro.sh && \
    echo '  else' >> /usr/local/bin/build-astro.sh && \
    echo '    echo "❌ dist目录不存在"' >> /usr/local/bin/build-astro.sh && \
    echo '    exit 1' >> /usr/local/bin/build-astro.sh && \
    echo '  fi' >> /usr/local/bin/build-astro.sh && \
    echo 'else' >> /usr/local/bin/build-astro.sh && \
    echo '  echo ""' >> /usr/local/bin/build-astro.sh && \
    echo '  echo "❌ === Astro构建失败 ==="' >> /usr/local/bin/build-astro.sh && \
    echo '  echo "🔍 查看错误日志上方的输出信息"' >> /usr/local/bin/build-astro.sh && \
    echo '  exit 1' >> /usr/local/bin/build-astro.sh && \
    echo 'fi' >> /usr/local/bin/build-astro.sh && \
    chmod +x /usr/local/bin/build-astro.sh

# 设置默认命令
CMD ["echo", "CNB依赖缓存镜像构建完成"] 