# sub-webx

基于 Vue.js 、[CareyWang/sub-web](https://github.com/CareyWang/sub-web)、 [tindy2013/subconverter](https://github.com/tindy2013/subconverter) 后端实现的订阅转换前端，支持自定义配置，多种客户端订阅转换。

## 功能特点

- 支持多种客户端配置转换（Clash、Surge、Quantumult 等）
- 支持自定义远程配置
- 支持配置自定义后端地址
- 支持配置文件上传下载
- 支持短链接生成
- 数据持久化存储
- Docker 部署支持

## 目录

- [sub-webx](#sub-webx)
  - [功能特点](#功能特点)
  - [目录](#目录)
  - [Docker 部署](#docker-部署)
    - [快速启动](#快速启动)
    - [自定义构建](#自定义构建)
    - [数据持久化](#数据持久化)
  - [环境要求](#环境要求)
  - [本地开发](#本地开发)
  - [生产部署](#生产部署)
    - [构建](#构建)
    - [服务器配置](#服务器配置)
    - [环境变量](#环境变量)
  - [相关项目](#相关项目)
  - [贡献指南](#贡献指南)
  - [开源协议](#开源协议)

## Docker 部署

### 快速启动

```bash
# 拉取镜像并运行
docker-compose up -d

# 访问 http://localhost:8088
```

### 自定义构建

如需修改代码或自定义配置，可以本地构建镜像：

```bash
# 构建镜像
docker build -t subwebx:latest .

# 运行容器
docker-compose up -d
```

### 数据持久化

配置文件会保存在 `./data` 目录，重启容器不会丢失数据。

## 环境要求

- Node.js >= 22.13.1
- Yarn >= 1.22.22

## 本地开发

```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn serve

# 访问 http://localhost:8080
```

## 生产部署

### 构建

```bash
# 构建生产版本
yarn build
```

### 服务器配置

项目使用 Express 作为后端服务器，主要提供以下功能：

- 静态文件服务
- 配置文件的保存和读取
- API 接口
- 支持 Vue Router 的历史模式

### 环境变量

可以通过环境变量配置以下参数：

- `PORT`: 服务器端口号（默认：8088）
- `NODE_ENV`: 运行环境
- `VUE_APP_PROJECT`: 项目地址
- `VUE_APP_SUBCONVERTER_DEFAULT_BACKEND`: 默认后端地址

## 相关项目

- [tindy2013/subconverter](https://github.com/tindy2013/subconverter) - 订阅转换后端
- [CareyWang/MyUrls](https://github.com/CareyWang/MyUrls) - 短链接服务
- [CareyWang/bitly](https://github.com/CareyWang/bitly) 
- [CareyWang/sub-web](https://github.com/CareyWang/sub-web) - 原订阅转换前端

## 贡献指南

欢迎提交 Pull Request。在编辑 README.md 时，请遵循 [standard-readme](https://github.com/RichardLitt/standard-readme) 规范。

## 开源协议

MIT © 2020-2024 nginxcore


