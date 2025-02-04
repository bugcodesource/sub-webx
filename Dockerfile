# 构建阶段
FROM node:22.13.1

WORKDIR /app

# 设置构建参数
ENV NODE_ENV=production \
    DISABLE_ESLINT=true \
    ESLINT_NO_DEV_ERRORS=true


# 复制源代码
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production=false
RUN ls -la node_modules/.bin
# 安装 tini
RUN apt-get install -y tini

# 创建数据目录并设置权限
RUN mkdir -p /data && chown -R node:node /data

COPY . .
# 执行构建
RUN yarn build

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
