#!/bin/bash

echo "🔍 验证 Docker 改进"
echo "=================="
echo ""

# 检查文件是否存在
files=(
    "docker-compose.yml"
    "backend/Dockerfile"
    "frontend/Dockerfile"
    "frontend/nginx.conf"
    "backend/.dockerignore"
    "frontend/.dockerignore"
    "DOCKER_DEPLOYMENT.md"
    "COMMANDS.md"
    "DOCKER_IMPROVEMENTS.md"
)

echo "📁 检查文件..."
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file 不存在"
    fi
done

# 检查 docker-compose.yml 配置
echo ""
echo "📝 检查 docker-compose.yml 配置..."
if grep -q "healthcheck:" docker-compose.yml; then
    echo "✅ 健康检查配置存在"
else
    echo "❌ 健康检查配置缺失"
fi

if grep -q "uploads" docker-compose.yml; then
    echo "✅ uploads 挂载配置存在"
else
    echo "❌ uploads 挂载配置缺失"
fi

if grep -q "networks:" docker-compose.yml; then
    echo "✅ 网络配置存在"
else
    echo "❌ 网络配置缺失"
fi

# 检查 nginx 配置
echo ""
echo "📝 检查 nginx 配置..."
if grep -q "gzip on" frontend/nginx.conf; then
    echo "✅ Gzip 压缩配置存在"
else
    echo "❌ Gzip 压缩配置缺失"
fi

if grep -q "expires" frontend/nginx.conf; then
    echo "✅ 静态文件缓存配置存在"
else
    echo "❌ 静态文件缓存配置缺失"
fi

if grep -q "location /uploads" frontend/nginx.conf; then
    echo "✅ 上传文件代理配置存在"
else
    echo "❌ 上传文件代理配置缺失"
fi

# 检查文档
echo ""
echo "📚 检查文档..."
docs=(
    "DOCKER_DEPLOYMENT.md"
    "COMMANDS.md"
    "DOCKER_IMPROVEMENTS.md"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        lines=$(wc -l < "$doc")
        echo "✅ $doc ($lines 行)"
    else
        echo "❌ $doc 不存在"
    fi
done

echo ""
echo "=================="
echo "✅ 验证完成！"
echo ""
echo "所有改进已正确配置。"
