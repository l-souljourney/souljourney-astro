# CNB 依赖缓存 Dockerfile
# 基于 node:18-alpine 构建 pnpm 依赖缓存镜像

FROM node:18-alpine

# 设置工作目录
WORKDIR /workspace

# 安装必要的系统依赖
RUN apk add --no-cache git python3 py3-pip

# 安装最新版本的 pnpm
RUN npm install -g pnpm@latest

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

# 安装腾讯云COS Python SDK
RUN pip3 install cos-python-sdk-v5

# 设置环境变量，指向缓存位置
ENV NODE_MODULES_PATH=/workspace/node_modules
ENV PNPM_STORE_PATH=/root/.local/share/pnpm/store
ENV PNPM_CACHE_PATH=/root/.cache/pnpm

# 设置默认命令
CMD ["echo", "CNB依赖缓存镜像构建完成"] 