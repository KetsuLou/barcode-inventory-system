#!/bin/bash

echo "清理缓存..."

# 清理前端缓存
echo "清理前端缓存..."
cd frontend
rm -rf node_modules/.vite
rm -rf dist
rm -rf .vite
cd ..

# 清理后端缓存
echo "清理后端缓存..."
cd backend
rm -rf dist
cd ..

# 清理 Docker 缓存（如果使用 Docker）
echo "清理 Docker 缓存..."
docker-compose down -v
docker system prune -f

echo "缓存清理完成！"
echo "请运行以下命令重新安装依赖："
echo "  cd frontend && npm install"
echo "  cd backend && npm install"
