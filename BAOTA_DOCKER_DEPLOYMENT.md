# 宝塔面板Docker一键部署指南

## 前置要求

- 服务器：CentOS 7+ / Ubuntu 18.04+ / Debian 9+
- 内存：建议 2GB 以上
- 硬盘：建议 20GB 以上
- 已安装宝塔面板 7.0+
- 已安装Docker和Docker Compose

## 快速开始

### 第一步：安装Docker

#### 方法一：使用宝塔软件商店安装

1. 登录宝塔面板
2. 进入「软件商店」
3. 搜索「Docker」
4. 点击「安装」
5. 等待安装完成

#### 方法二：手动安装Docker

```bash
# CentOS
yum install -y yum-utils
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install -y docker-ce docker-ce-cli containerd.io

# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### 第二步：安装Docker Compose

```bash
# 下载Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 添加执行权限
chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
```

### 第三步：启动Docker服务

```bash
# 启动Docker
systemctl start docker

# 设置开机自启
systemctl enable docker

# 验证Docker运行
docker --version
```

## 部署步骤

### 方法一：使用宝塔Docker管理器（推荐）

#### 1. 上传项目文件

1. 登录宝塔面板
2. 进入「文件」管理
3. 创建项目目录：`/www/wwwroot/barcode-inventory`
4. 将项目文件上传到该目录

#### 2. 使用宝塔Docker管理器部署

##### 步骤1：创建Docker镜像

1. 进入「Docker」管理
2. 点击「镜像」
3. 点击「构建镜像」
4. 填写镜像信息：
   - 镜像名称：`barcode-inventory-backend`
   - 路径：`/www/wwwroot/barcode-inventory/backend`
   - Dockerfile路径：`Dockerfile`
5. 点击「构建」

##### 步骤2：创建后端容器

1. 点击「容器」
2. 点击「创建容器」
3. 填写容器信息：
   - 容器名称：`barcode-backend`
   - 镜像：`barcode-inventory-backend:latest`
   - 端口映射：`4081:4081`
   - 环境变量：
     - `NODE_ENV=production`
     - `JWT_SECRET=your-strong-secret-key`
   - 卷挂载：
     - `/www/wwwroot/barcode-inventory/backend/database:/app/database`
     - `/www/wwwroot/barcode-inventory/backend/uploads:/app/uploads`
   - 重启策略：`always`
4. 点击「创建」

##### 步骤3：创建前端镜像

1. 点击「镜像」
2. 点击「构建镜像」
3. 填写镜像信息：
   - 镜像名称：`barcode-inventory-frontend`
   - 路径：`/www/wwwroot/barcode-inventory/frontend`
   - Dockerfile路径：`Dockerfile`
4. 点击「构建」

##### 步骤4：创建前端容器

1. 点击「容器」
2. 点击「创建容器」
3. 填写容器信息：
   - 容器名称：`barcode-frontend`
   - 镜像：`barcode-inventory-frontend:latest`
   - 端口映射：`4080:80`
   - 网络：选择与后端相同的网络
   - 重启策略：`always`
4. 点击「创建」

##### 步骤5：配置Nginx反向代理

1. 进入「网站」管理
2. 点击「添加站点」
3. 填写域名（如：`inventory.example.com`）
4. 选择PHP版本：纯静态
5. 点击「提交」

6. 点击网站设置，进入「配置文件」，替换为以下内容：

```nginx
server {
    listen 80;
    server_name inventory.example.com;
    
    location / {
        proxy_pass http://127.0.0.1:4080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

7. 重载Nginx配置

### 方法二：使用Docker Compose（更简单）

#### 1. 上传项目文件

1. 登录宝塔面板
2. 进入「文件」管理
3. 创建项目目录：`/www/wwwroot/barcode-inventory`
4. 将项目文件上传到该目录

#### 2. 修改docker-compose.yml

编辑 `/www/wwwroot/barcode-inventory/docker-compose.yml`，确保配置正确：

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - PORT=4081
      - JWT_SECRET=your-strong-secret-key-change-this
    volumes:
      - ./backend/database:/app/database
      - ./backend/uploads:/app/uploads
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:4081/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - barcode-inventory-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "4080:80"
    depends_on:
      backend:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - barcode-inventory-network

networks:
  barcode-inventory-network:
    driver: bridge
```

**重要：** 修改 `JWT_SECRET` 为强密码。

#### 3. 使用Docker Compose部署

在宝塔面板「终端」中执行：

```bash
cd /www/wwwroot/barcode-inventory

# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 查看容器状态
docker-compose ps
```

#### 4. 配置Nginx反向代理

1. 进入「网站」管理
2. 点击「添加站点」
3. 填写域名（如：`inventory.example.com`）
4. 选择PHP版本：纯静态
5. 点击「提交」

6. 点击网站设置，进入「配置文件」，替换为以下内容：

```nginx
server {
    listen 80;
    server_name inventory.example.com;
    
    location / {
        proxy_pass http://127.0.0.1:4080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

7. 重载Nginx配置

## 验证部署

### 1. 检查容器状态

```bash
# 查看所有容器
docker ps

# 查看特定容器
docker ps | grep barcode

# 查看容器日志
docker logs barcode-backend
docker logs barcode-frontend
```

### 2. 检查服务健康

```bash
# 检查后端健康
curl http://localhost:4081/api/health

# 检查前端健康
curl http://localhost:4080/health
```

### 3. 测试访问

在浏览器中访问：

- 前端：`http://your-domain.com`
- API健康检查：`http://your-domain.com/api/health`

### 4. 登录测试

使用默认账户登录：
- 用户名：`admin`
- 密码：`admin123`

**重要：** 首次登录后请立即修改密码！

## 常用管理命令

### Docker Compose命令

```bash
cd /www/wwwroot/barcode-inventory

# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f

# 查看服务状态
docker-compose ps

# 重新构建
docker-compose build

# 更新服务
docker-compose pull
docker-compose up -d
```

### Docker命令

```bash
# 查看容器
docker ps

# 查看镜像
docker images

# 查看网络
docker network ls

# 查看卷
docker volume ls

# 进入容器
docker exec -it barcode-backend sh

# 查看容器日志
docker logs -f barcode-backend

# 重启容器
docker restart barcode-backend

# 停止容器
docker stop barcode-backend

# 启动容器
docker start barcode-backend

# 删除容器
docker rm barcode-backend

# 删除镜像
docker rmi barcode-inventory-backend
```

## 宝塔Docker管理器使用

### 1. 容器管理

#### 查看容器
1. 进入「Docker」管理
2. 点击「容器」
3. 查看所有运行中的容器

#### 容器操作
- **启动**：点击「启动」按钮
- **停止**：点击「停止」按钮
- **重启**：点击「重启」按钮
- **删除**：点击「删除」按钮
- **查看日志**：点击「日志」按钮
- **进入终端**：点击「终端」按钮

### 2. 镜像管理

#### 查看镜像
1. 进入「Docker」管理
2. 点击「镜像」
3. 查看所有已下载的镜像

#### 镜像操作
- **构建镜像**：点击「构建镜像」
- **拉取镜像**：点击「拉取镜像」
- **删除镜像**：点击「删除」
- **推送镜像**：点击「推送」

### 3. 网络管理

#### 查看网络
1. 进入「Docker」管理
2. 点击「网络」
3. 查看所有Docker网络

#### 创建网络
1. 点击「创建网络」
2. 填写网络名称
3. 选择网络驱动
4. 点击「创建」

### 4. 卷管理

#### 查看卷
1. 进入「Docker」管理
2. 点击「卷」
3. 查看所有Docker卷

#### 创建卷
1. 点击「创建卷」
2. 填写卷名称
3. 点击「创建」

## 配置SSL证书

### 1. 申请Let's Encrypt免费证书

1. 进入网站设置
2. 点击「SSL」
3. 选择「Let's Encrypt」
4. 填写邮箱地址
5. 点击「申请」

### 2. 强制HTTPS

申请成功后，开启「强制HTTPS」。

### 3. 更新Nginx配置

SSL证书申请后，Nginx配置会自动更新，包含443端口的配置。

## 配置防火墙

### 1. 开放必要端口

在宝塔面板「安全」设置中开放：

- **80** - HTTP
- **443** - HTTPS
- **4080** - 前端服务（可选）

### 2. 使用宝塔防火墙

建议安装宝塔防火墙插件，加强安全防护。

## 数据持久化

### 1. 数据库持久化

数据库文件已通过卷挂载持久化：

```yaml
volumes:
  - ./backend/database:/app/database
```

### 2. 上传文件持久化

上传文件已通过卷挂载持久化：

```yaml
volumes:
  - ./backend/uploads:/app/uploads
```

### 3. 备份数据

```bash
# 备份数据库
cp /www/wwwroot/barcode-inventory/backend/database/inventory.db \
   /www/wwwroot/barcode-inventory/backup/inventory-$(date +%Y%m%d).db

# 备份上传文件
tar -czf /www/wwwroot/barcode-inventory/backup/uploads-$(date +%Y%m%d).tar.gz \
        /www/wwwroot/barcode-inventory/backend/uploads/
```

## 性能优化

### 1. 资源限制

在docker-compose.yml中添加资源限制：

```yaml
services:
  backend:
    # ... 其他配置
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### 2. 启用缓存

Nginx已配置静态文件缓存，无需额外配置。

### 3. 使用多阶段构建

Dockerfile已使用多阶段构建，减小镜像体积。

## 监控和日志

### 1. 宝塔监控

使用宝塔面板的监控功能，监控：
- CPU使用率
- 内存使用率
- 磁盘使用率
- 网络流量

### 2. Docker监控

```bash
# 查看容器资源使用
docker stats

# 查看特定容器
docker stats barcode-backend
```

### 3. 日志管理

```bash
# 查看容器日志
docker logs -f barcode-backend

# 查看最近100行日志
docker logs --tail 100 barcode-backend

# 查看特定时间段的日志
docker logs --since 2024-04-14T00:00:00 barcode-backend
```

## 定时任务

### 1. 数据库自动备份

在宝塔面板「计划任务」中添加：

```bash
0 2 * * * cd /www/wwwroot/barcode-inventory && cp backend/database/inventory.db backup/inventory-$(date +\%Y\%m\%d).db
```

### 2. 日志清理

```bash
0 3 * * 0 find /www
