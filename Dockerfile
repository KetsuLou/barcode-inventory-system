FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache wget

# 安装后端依赖（包括 devDependencies 用于构建）
COPY backend/package*.json ./backend/
RUN cd backend && npm ci

# 安装前端依赖
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# 复制全部代码
COPY . .

# 构建后端
RUN cd backend && npm run build

# 构建前端
RUN cd frontend && npm run build

# 初始化数据库
RUN cd backend && npm run init-db || true

EXPOSE 4080

# 直接运行后端，让后端托管前端静态文件
CMD ["node", "backend/dist/server.js"]
