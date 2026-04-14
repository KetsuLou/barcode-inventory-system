# 命令参考手册

## 本地开发

### 安装依赖
```bash
npm run install:all
```

### 初始化数据库
```bash
npm run init-db
```

### 启动开发服务器
```bash
npm run dev
```

### 清理端口占用
```bash
npm run kill-port
```

### 构建生产版本
```bash
npm run build
```

### 启动生产服务器
```bash
npm run start
```

## Docker 部署

### 构建镜像
```bash
docker-compose build
```

### 启动服务
```bash
docker-compose up -d
```

### 停止服务
```bash
docker-compose down
```

### 重启服务
```bash
docker-compose restart
```

### 查看日志
```bash
# 所有服务
docker-compose logs -f

# 后端服务
docker-compose logs -f backend

# 前端服务
docker-compose logs -f frontend
```

### 查看服务状态
```bash
docker-compose ps
```

### 更新服务
```bash
docker-compose pull
docker-compose up -d
```

### 清理资源
```bash
# 停止并删除容器
docker-compose down

# 删除容器和卷
docker-compose down -v

# 删除容器、卷和镜像
docker-compose down -v --rmi all
```

## 测试脚本

### 测试 Docker 配置
```bash
# Linux/Mac
./scripts/test-docker.sh

# Windows
scripts\test-docker.bat
```

### 测试端口占用
```bash
# Windows
netstat -ano | findstr :4080
netstat -ano | findstr :4081

# Linux/Mac
lsof -i :4080
lsof -i :4081
```

## 数据库操作

### 初始化数据库
```bash
npm run init-db
```

### 运行数据库迁移
```bash
cd backend
npx ts-node src/database/migrate.ts
```

### 备份数据库
```bash
cp backend/database/inventory.db backup/inventory-$(date +%Y%m%d).db
```

## 故障排除

### 查看端口占用
```bash
npm run kill-port
```

### 清理 Docker 缓存
```bash
docker system prune -a
```

### 重新构建镜像
```bash
docker-compose build --no-cache
```

### 查看容器资源使用
```bash
docker stats
```

### 导出日志
```bash
docker-compose logs > logs/docker-$(date +%Y%m%d).log
```

## 快速命令

### 开发环境
```bash
npm run dev
```

### Docker 环境
```bash
docker-compose up -d
```

### 停止所有服务
```bash
# 本地开发
Ctrl+C

# Docker
docker-compose down
```

### 查看帮助
```bash
npm run
docker-compose --help
```

## 环境变量

### 本地开发
编辑 `backend/.env`:
```env
PORT=4081
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Docker 环境
编辑 `docker-compose.yml`:
```yaml
environment:
  - NODE_ENV=production
  - PORT=4081
  - JWT_SECRET=your-secret-key
```

## 端口说明

### 本地开发
- **4080**: 前端开发服务器
- **4081**: 后端API服务器

### Docker 环境
- **4080**: 统一访问端口（前端和后端通过nginx代理）
- 后端服务仅在Docker内部网络中运行，不对外暴露

## 默认账户

- **用户名**: admin
- **密码**: admin123

## 访问地址

### 本地开发
- 前端: http://localhost:4080
- 后端: http://localhost:4081

### Docker 环境
- 统一访问: http://localhost:4080
- 前端和后端都通过4080端口访问，nginx自动代理API请求

## 健康检查

### 本地开发
```bash
curl http://localhost:4081/api/health
curl http://localhost:4080/health
```

### Docker 环境
```bash
# 前端健康检查
curl http://localhost:4080/health

# 后端健康检查（仅在Docker内部网络中可访问）
docker-compose exec backend wget -qO- http://localhost:4081/api/health
```

## 文档

- README.md - 项目说明
- QUICK_START.md - 快速开始
- DOCKER_DEPLOYMENT.md - Docker 部署
- BAOTA_DEPLOYMENT.md - 宝塔面板部署
- BAOTA_DOCKER_DEPLOYMENT.md - 宝塔面板Docker部署
- PORT_CLEANUP.md - 端口清理
- CHANGELOG.md - 更新日志
- COMMANDS.md - 命令参考（本文件）
