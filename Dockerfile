# syntax=docker/dockerfile:1

# 构建阶段
FROM node:22.13.1-alpine AS builder

WORKDIR /app

# 设置构建参数
ENV NODE_ENV=production \
    DISABLE_ESLINT=true \
    ESLINT_NO_DEV_ERRORS=true

# 复制依赖文件
COPY package.json yarn.lock ./

# 安装依赖
RUN set -eux; \
    apk add --no-cache --virtual .build-deps \
        python3 \
        make \
        g++; \
    yarn install --frozen-lockfile; \
    apk del .build-deps

# 复制源代码并构建
RUN yarn install
COPY . .
RUN yarn build

# 运行阶段
FROM node:22.13.1-alpine

# 安装 tini
RUN apk add --no-cache tini

WORKDIR /app

# 安装生产环境依赖
COPY package.json yarn.lock ./
RUN yarn add express cors && yarn install --production --frozen-lockfile

# 复制构建产物和服务器文件
COPY --from=builder /app/dist ./dist
COPY server.js .

# 创建数据目录并设置权限
RUN mkdir -p /data && chown -R node:node /data

# 使用非 root 用户运行
USER node

# 设置环境变量
ENV NODE_ENV=production \
    PORT=8088

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8088/api/load-config || exit 1

# 声明数据卷
VOLUME ["/data"]

# 暴露端口
EXPOSE 8088

# 使用 tini 作为 init 进程
ENTRYPOINT ["/sbin/tini", "--"]

# 启动服务
CMD ["node", "server.js"]
