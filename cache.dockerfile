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

# 将node_modules复制到备用位置，避免被volume挂载覆盖
RUN cp -r node_modules /tmp/cached_node_modules && \
    echo "缓存的node_modules已备份到/tmp/cached_node_modules"

# 安装腾讯云COS Python SDK（使用--break-system-packages绕过PEP 668限制）
RUN pip3 install --break-system-packages cos-python-sdk-v5

# 设置环境变量，指向缓存位置
ENV NODE_MODULES_PATH=/tmp/cached_node_modules
ENV PNPM_STORE_PATH=/root/.local/share/pnpm/store
ENV PNPM_CACHE_PATH=/root/.cache/pnpm
ENV PATH="/usr/local/bin:$PATH"

# 创建启动脚本来处理缓存复用，放在系统路径下
RUN echo '#!/bin/sh' > /usr/local/bin/setup-cache.sh && \
    echo 'echo "🔧 === 环境准备 ==="' >> /usr/local/bin/setup-cache.sh && \
    echo 'echo "当前工作目录：$(pwd)"' >> /usr/local/bin/setup-cache.sh && \
    echo 'node --version' >> /usr/local/bin/setup-cache.sh && \
    echo 'pnpm --version' >> /usr/local/bin/setup-cache.sh && \
    echo 'echo "📦 === 使用缓存依赖 ==="' >> /usr/local/bin/setup-cache.sh && \
    echo 'if [ -d "/tmp/cached_node_modules" ]; then' >> /usr/local/bin/setup-cache.sh && \
    echo '  echo "发现缓存的node_modules，复制到当前目录..."' >> /usr/local/bin/setup-cache.sh && \
    echo '  cp -r /tmp/cached_node_modules ./node_modules' >> /usr/local/bin/setup-cache.sh && \
    echo '  echo "✅ 缓存复制完成"' >> /usr/local/bin/setup-cache.sh && \
    echo 'else' >> /usr/local/bin/setup-cache.sh && \
    echo '  echo "⚠️ 未找到缓存的node_modules"' >> /usr/local/bin/setup-cache.sh && \
    echo 'fi' >> /usr/local/bin/setup-cache.sh && \
    echo 'if [ -d "/root/.local/share/pnpm/store" ]; then' >> /usr/local/bin/setup-cache.sh && \
    echo '  echo "✅ 发现pnpm store缓存"' >> /usr/local/bin/setup-cache.sh && \
    echo '  mkdir -p /root/.local/share/pnpm/' >> /usr/local/bin/setup-cache.sh && \
    echo 'else' >> /usr/local/bin/setup-cache.sh && \
    echo '  echo "⚠️ pnpm store缓存不存在"' >> /usr/local/bin/setup-cache.sh && \
    echo 'fi' >> /usr/local/bin/setup-cache.sh && \
    echo 'echo "🔍 === 检查依赖状态 ==="' >> /usr/local/bin/setup-cache.sh && \
    echo 'if [ -d "node_modules" ]; then' >> /usr/local/bin/setup-cache.sh && \
    echo '  echo "✅ 发现node_modules缓存"' >> /usr/local/bin/setup-cache.sh && \
    echo '  ls -la node_modules/ | head -5' >> /usr/local/bin/setup-cache.sh && \
    echo '  du -sh node_modules/' >> /usr/local/bin/setup-cache.sh && \
    echo '  echo "使用缓存进行增量安装..."' >> /usr/local/bin/setup-cache.sh && \
    echo 'else' >> /usr/local/bin/setup-cache.sh && \
    echo '  echo "❌ node_modules不存在，将重新安装"' >> /usr/local/bin/setup-cache.sh && \
    echo 'fi' >> /usr/local/bin/setup-cache.sh && \
    echo 'echo "📦 === 配置pnpm ==="' >> /usr/local/bin/setup-cache.sh && \
    echo 'pnpm config set registry https://mirrors.cloud.tencent.com/npm/' >> /usr/local/bin/setup-cache.sh && \
    echo 'pnpm config set store-dir /root/.local/share/pnpm/store' >> /usr/local/bin/setup-cache.sh && \
    echo 'pnpm config set cache-dir /root/.cache/pnpm' >> /usr/local/bin/setup-cache.sh && \
    echo 'pnpm config set prefer-offline true' >> /usr/local/bin/setup-cache.sh && \
    echo 'pnpm config set network-timeout 300000' >> /usr/local/bin/setup-cache.sh && \
    echo 'pnpm config set fetch-retries 5' >> /usr/local/bin/setup-cache.sh && \
    echo 'pnpm config set network-concurrency 16' >> /usr/local/bin/setup-cache.sh && \
    echo 'echo "🚀 === 安装/更新依赖 ==="' >> /usr/local/bin/setup-cache.sh && \
    echo 'time pnpm install --frozen-lockfile --prefer-offline' >> /usr/local/bin/setup-cache.sh && \
    echo 'echo "✅ === 依赖安装完成 ==="' >> /usr/local/bin/setup-cache.sh && \
    chmod +x /usr/local/bin/setup-cache.sh

# 设置默认命令
CMD ["echo", "CNB依赖缓存镜像构建完成"] 