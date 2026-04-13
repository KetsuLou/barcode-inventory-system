#!/bin/bash

echo "🐳 Docker 配置测试"
echo "=================="
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装"
    exit 1
fi

echo "✅ Docker 已安装: $(docker --version)"

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装"
    exit 1
fi

echo "✅ Docker Compose 已安装: $(docker-compose --version)"

# 检查 docker-compose.yml 语法
echo ""
echo "📝 检查 docker-compose.yml 语法..."
if docker-compose config > /dev/null 2>&1; then
    echo "✅ docker-compose.yml 语法正确"
else
    echo "❌ docker-compose.yml 语法错误"
    exit 1
fi

# 检查必要的目录
echo ""
echo "📁 检查必要的目录..."
directories=("backend/database" "backend/uploads" "frontend/dist")
for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ 目录存在: $dir"
    else
        echo "⚠️  目录不存在: $dir (将在构建时创建)"
    fi
done

# 检查 Dockerfile
echo ""
echo "📝 检查 Dockerfile..."
if [ -f "backend/Dockerfile" ]; then
    echo "✅ 后端 Dockerfile 存在"
else
    echo "❌ 后端 Dockerfile 不存在"
    exit 1
fi

if [ -f "frontend/Dockerfile" ]; then
    echo "✅ 前端 Dockerfile 存在"
else
    echo "❌ 前端 Dockerfile 不存在"
    exit 1
fi

# 检查 nginx 配置
echo ""
echo "📝 检查 nginx 配置..."
if [ -f "frontend/nginx.conf" ]; then
    echo "✅ nginx.conf 存在"
else
    echo "❌ nginx.conf 不存在"
    exit 1
fi

echo ""
echo "=================="
echo "✅ 所有检查通过！"
echo ""
echo "可以运行以下命令启动服务："
echo "  docker-compose up -d"
echo ""
echo "查看日志："
echo "  docker-compose logs -f"
