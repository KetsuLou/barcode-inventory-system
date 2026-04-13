@echo off
echo 🐳 Docker 配置测试
echo ==================
echo.

REM 检查 Docker 是否安装
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker 未安装
    exit /b 1
)

echo ✅ Docker 已安装
docker --version

REM 检查 Docker Compose 是否安装
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose 未安装
    exit /b 1
)

echo ✅ Docker Compose 已安装
docker-compose --version

REM 检查 docker-compose.yml 语法
echo.
echo 📝 检查 docker-compose.yml 语法...
docker-compose config >nul 2>&1
if errorlevel 1 (
    echo ❌ docker-compose.yml 语法错误
    exit /b 1
)

echo ✅ docker-compose.yml 语法正确

REM 检查必要的目录
echo.
echo 📁 检查必要的目录...
if exist "backend\database" (
    echo ✅ 目录存在: backend\database
) else (
    echo ⚠️  目录不存在: backend\database (将在构建时创建)
)

if exist "backend\uploads" (
    echo ✅ 目录存在: backend\uploads
) else (
    echo ⚠️  目录不存在: backend\uploads (将在构建时创建)
)

if exist "frontend\dist" (
    echo ✅ 目录存在: frontend\dist
) else (
    echo ⚠️  目录不存在: frontend\dist (将在构建时创建)
)

REM 检查 Dockerfile
echo.
echo 📝 检查 Dockerfile...
if exist "backend\Dockerfile" (
    echo ✅ 后端 Dockerfile 存在
) else (
    echo ❌ 后端 Dockerfile 不存在
    exit /b 1
)

if exist "frontend\Dockerfile" (
    echo ✅ 前端 Dockerfile 存在
) else (
    echo ❌ 前端 Dockerfile 不存在
    exit /b 1
)

REM 检查 nginx 配置
echo.
echo 📝 检查 nginx 配置...
if exist "frontend\nginx.conf" (
    echo ✅ nginx.conf 存在
) else (
    echo ❌ nginx.conf 不存在
    exit /b 1
)

echo.
echo ==================
echo ✅ 所有检查通过！
echo.
echo 可以运行以下命令启动服务：
echo   docker-compose up -d
echo.
echo 查看日志：
echo   docker-compose logs -f
pause
