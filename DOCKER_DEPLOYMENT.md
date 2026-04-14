# Docker 部署指南

## 前置要求

- Docker 20.10+
- Docker Compose 2.0+

## 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd barcode-inventory-system
```

### 2. 构建并启动
```bash
docker-compose up -d
```

### 3. 访问应用
- 统一访问地址：http://localhost:4080
- 前端和后端通过nginx代理，只需访问4080端口即可

### 4. 停止服务
```bash
docker-compose down
```

## 配置说明

### 环境变量

在 `docker-compose.yml` 中可以配置以下环境变量：

```yaml
environment:
  - NODE_ENV=production
  - PORT=4081
  - JWT_SECRET=your-secret-key-change-in-production
```

**重要：** 请在生产环境中修改 `JWT_SECRET` 为强密码。

### 端口映射

- **统一端口**: `4080:80`
- 前端容器对外暴露4080端口
- 后端服务仅在Docker内部网络中运行，通过nginx代理访问
- 如需修改端口，只需更新 `docker-compose.yml` 中的端口映射

### 数据持久化

以下目录会持久化到宿主机：

- `./backend/database` - SQLite 数据库文件
- `./backend/uploads` - 上传的图片文件

## 常用命令

### 构建镜像
```bash
docker-compose build
```

### 启动服务
```bash
docker-compose up -d
```

### 查看日志
```bash
# 查看所有服务日志
docker-compose logs

# 查看后端日志
docker-compose logs backend

# 查看前端日志
docker-compose logs frontend

# 实时查看日志
docker-compose logs -f
```

### 停止服务
```bash
docker-compose down
```

### 重启服务
```bash
docker-compose restart
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

## 健康检查

服务配置了健康检查，可以通过以下命令查看状态：

```bash
docker-compose ps
```

健康检查端点：
- 后端：`http://localhost:4081/api/health`
- 前端：`http://localhost:4080/health`

## 数据库初始化

数据库会在容器首次启动时自动初始化，包括：
- 创建用户表
- 创建商品表
- 创建默认管理员账户（admin/admin123）

## 故障排除

### 容器无法启动
```bash
# 查看容器状态
docker-compose ps

# 查看详细日志
docker-compose logs backend
docker-compose logs frontend
```

### 端口被占用
如果端口4080或4081被占用，请修改 `docker-compose.yml` 中的端口映射。

### 数据库问题
```bash
# 删除数据库重新初始化
rm -rf backend/database/*
docker-compose restart backend
```

### 权限问题
```bash
# 修复上传目录权限
chmod -R 755 backend/uploads
```

### 镜像构建失败
```bash
# 清理Docker缓存
docker system prune -a

# 重新构建
docker-compose build --no-cache
```

## 生产环境部署

### 1. 修改配置
```yaml
# docker-compose.yml
environment:
  - NODE_ENV=production
  - JWT_SECRET=<your-strong-secret>
```

### 2. 使用反向代理
建议使用 Nginx 或 Traefik 作为反向代理：

```nginx
# nginx.conf 示例
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:4080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. 启用HTTPS
使用 Let's Encrypt 或其他SSL证书提供商。

### 4. 定期备份
```bash
# 备份数据库
cp backend/database/inventory.db backup/inventory-$(date +%Y%m%d).db

# 备份上传文件
tar -czf backup/uploads-$(date +%Y%m%d).tar.gz backend/uploads/
```

### 5. 监控和日志
```bash
# 查看资源使用
docker stats

# 导出日志
docker-compose logs > logs/docker-$(date +%Y%m%d).log
```

## 性能优化

### 1. 资源限制
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### 2. 使用多阶段构建
已配置多阶段构建，减小镜像体积。

### 3. 启用缓存
Nginx 已配置静态文件缓存。

## 安全建议

1. **修改默认密码** - 首次登录后立即修改admin密码
2. **使用强JWT密钥** - 修改 `JWT_SECRET` 为强密码
3. **限制网络访问** - 使用防火墙限制访问
4. **定期更新** - 定期更新Docker镜像和依赖
5. **监控日志** - 定期检查应用日志
6. **备份数据** - 定期备份数据库和上传文件

## 支持

如有问题，请查看：
- README.md - 项目说明
- BAOTA_DEPLOYMENT.md - 宝塔面板部署指南
- BAOTA_DOCKER_DEPLOYMENT.md - 宝塔面板Docker部署指南
- PORT_CLEANUP.md - 端口清理说明
- CHANGELOG.md - 更新日志
- GitHub Issues - 问题反馈
