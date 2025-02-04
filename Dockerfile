# 构建阶段
FROM node:22.13.1-alpine AS builder

WORKDIR /app

# 复制源代码
COPY package.json yarn.lock ./

# 安装依赖（包括开发依赖）
RUN yarn install

# 复制其他源代码
COPY . .

# 执行构建
RUN yarn build

# 清理缓存
RUN yarn cache clean

FROM node:22.13.1-alpine

# 创建工作目录
WORKDIR /app

# 设置运行时环境变量
ENV NODE_ENV=production \
    PORT=8088

# 从构建阶段复制构建输出和必要的文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./

# 安装运行时依赖（仅生产依赖）
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
RUN yarn install --frozen-lockfile --production

# 创建数据目录并设置权限
RUN mkdir -p /data && chown -R node:node /data

# 使用非 root 用户运行
USER node

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8088/api/load-config || exit 1

# 声明数据卷
VOLUME ["/data"]

# 暴露端口
EXPOSE 8088

# 启动服务
CMD ["node", "server.js"]
