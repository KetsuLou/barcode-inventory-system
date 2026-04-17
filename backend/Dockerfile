FROM node:18-alpine

WORKDIR /app

# 安装 wget 用于健康检查
RUN apk add --no-cache wget

# 创建必要的目录
RUN mkdir -p /app/database /app/uploads

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# 初始化数据库（如果不存在）
RUN npm run init-db || true

EXPOSE 4080

CMD ["npm", "start"]
