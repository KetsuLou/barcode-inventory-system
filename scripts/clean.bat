@echo off
echo 清理缓存...

REM 清理前端缓存
echo 清理前端缓存...
cd frontend
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist dist rmdir /s /q dist
if exist .vite rmdir /s /q .vite
cd ..

REM 清理后端缓存
echo 清理后端缓存...
cd backend
if exist dist rmdir /s /q dist
cd ..

REM 清理 Docker 缓存（如果使用 Docker）
echo 清理 Docker 缓存...
docker-compose down -v
docker system prune -f

echo 缓存清理完成！
echo 请运行以下命令重新安装依赖：
echo   cd frontend ^&^& npm install
echo   cd backend ^&^& npm install
pause
