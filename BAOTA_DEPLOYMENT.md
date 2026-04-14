# 宝塔面板部署指南

## 前置要求

- 服务器：CentOS 7+ / Ubuntu 18.04+ / Debian 9+
- 内存：建议 2GB 以上
- 硬盘：建议 20GB 以上
- 已安装宝塔面板 7.0+

## 快速开始

### 1. 安装宝塔面板

如果还没有安装宝塔面板，请先安装：

```bash
# CentOS
yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sh install.sh

# Ubuntu/Debian
wget -O install.sh http://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh
```

安装完成后，访问宝塔面板：`http://服务器IP:8888`

### 2. 安装必要软件

在宝塔面板中安装以下软件：

- **Nginx** 1.20+
- **Node.js** 16.x 或 18.x
- **PM2 管理器**（在软件商店搜索安装）

## 部署步骤

### 第一步：上传项目文件

#### 方法一：使用宝塔文件管理器

1. 登录宝塔面板
2. 进入「文件」管理
3. 创建网站目录：`/www/wwwroot/barcode-inventory`
4. 将项目文件上传到该目录

#### 方法二：使用Git克隆

```bash
cd /www/wwwroot
git clone <repository-url> barcode-inventory
cd barcode-inventory
```

### 第二步：安装依赖

#### 1. 安装后端依赖

```bash
cd /www/wwwroot/barcode-inventory/backend
npm install --production
```

#### 2. 安装前端依赖并构建

```bash
cd /www/wwwroot/barcode-inventory/frontend
npm install
npm run build
```

### 第三步：初始化数据库

```bash
cd /www/wwwroot/barcode-inventory/backend
npm run init-db
```

### 第四步：配置环境变量

创建后端环境配置文件：

```bash
cd /www/wwwroot/barcode-inventory/backend
cat > .env << 'EOF'
PORT=4081
NODE_ENV=production
JWT_SECRET=your-strong-secret-key-change-this
EOF
```

**重要：** 请修改 JWT_SECRET 为强密码。

### 第五步：配置PM2管理后端

#### 1. 创建PM2配置文件

```bash
cd /www/wwwroot/barcode-inventory
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'barcode-backend',
    script: './backend/dist/server.js',
    cwd: '/www/wwwroot/barcode-inventory',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 4081
    }
  }]
};
EOF
```

#### 2. 启动后端服务

```bash
cd /www/wwwroot/barcode-inventory
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 3. 验证后端运行

```bash
pm2 list
pm2 logs barcode-backend
```

测试后端API：

```bash
curl http://localhost:4081/api/health
```

### 第六步：配置Nginx

#### 1. 在宝塔面板创建网站

1. 进入「网站」管理
2. 点击「添加站点」
3. 填写域名（如：`inventory.example.com`）
4. 选择PHP版本：纯静态
5. 点击「提交」

#### 2. 配置Nginx

点击网站设置，进入「配置文件」，替换为以下内容：

```nginx
server {
    listen 80;
    server_name inventory.example.com;
    
    access_log /www/wwwroot/barcode-inventory/logs/access.log;
    error_log /www/wwwroot/barcode-inventory/logs/error.log;
    
    location / {
        root /www/wwwroot/barcode-inventory/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    location /api {
        proxy_pass http://127.0.0.1:4081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    location /uploads {
        proxy_pass http://127.0.0.1:4081;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### 3. 创建日志目录

```bash
mkdir -p /www/wwwroot/barcode-inventory/logs
chown -R www:www /www/wwwroot/barcode-inventory/logs
```

#### 4. 重载Nginx配置

在宝塔面板中点击「重载配置」或运行：

```bash
nginx -t && nginx -s reload
```

### 第七步：配置SSL证书（推荐）

#### 1. 申请Let's Encrypt免费证书

1. 进入网站设置
2. 点击「SSL」
3. 选择「Let's Encrypt」
4. 填写邮箱地址
5. 点击「申请」

#### 2. 强制HTTPS

申请成功后，开启「强制HTTPS」。

### 第八步：配置防火墙

#### 1. 开放必要端口

在宝塔面板「安全」设置中开放：

- **80** - HTTP
- **443** - HTTPS
- **4081** - 后端API（可选）

#### 2. 使用宝塔防火墙

建议安装宝塔防火墙插件，加强安全防护。

## 验证部署

### 1. 检查后端服务

```bash
pm2 list
pm2 logs barcode-backend
```

### 2. 检查Nginx配置

```bash
nginx -t
```

### 3. 测试访问

在浏览器中访问：

- 前端：`http://your-domain.com` 或 `https://your-domain.com`
- API健康检查：`http://your-domain.com/api/health`

### 4. 登录测试

使用默认账户登录：
- 用户名：`admin`
- 密码：`admin123`

**重要：** 首次登录后请立即修改密码！

## 常用管理命令

### PM2管理

```bash
pm2 list
pm2 logs barcode-backend
pm2 restart barcode-backend
pm2 stop barcode-backend
pm2 delete barcode-backend
pm2 info barcode-backend
```

### 日志查看

```bash
tail -f /www/wwwroot/barcode-inventory/logs/access.log
tail -f /www/wwwroot/barcode-inventory/logs/error.log
pm2 logs barcode-backend
```

### 数据库备份

```bash
mkdir -p /www/wwwroot/barcode-inventory/backup
cp /www/wwwroot/barcode-inventory/backend/database/inventory.db \
   /www/wwwroot/barcode-inventory/backup/inventory-$(date +%Y%m%d).db
```

### 更新项目

```bash
cd /www/wwwroot/barcode-inventory
git pull
cd backend
npm install --production
npm run build
pm2 restart barcode-backend
cd ../frontend
npm install
npm run build
```

## 性能优化

### 1. 启用Gzip压缩

在Nginx配置中已包含Gzip压缩。

### 2. 配置静态文件缓存

在Nginx配置中已包含静态文件缓存。

### 3. PM2集群模式

如果服务器性能允许，可以使用PM2集群模式：

```javascript
module.exports = {
  apps: [{
    name: 'barcode-backend',
    script: './backend/dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
  }]
};
```

### 4. 开启HTTP/2

在宝塔面板中开启HTTP/2：

```nginx
listen 443 ssl http2;
```

## 安全加固

### 1. 修改默认密码

首次登录后立即修改admin密码。

### 2. 配置防火墙

只开放必要的端口，关闭其他端口。

### 3. 启用SSL证书

使用HTTPS加密传输，保护数据安全。

### 4. 定期备份

设置定时任务，定期备份数据库和上传文件。

### 5. 监控日志

定期检查访问日志和错误日志，及时发现异常。

### 6. 更新系统

定期更新系统和软件，修复安全漏洞。

## 故障排除

### 1. 后端服务无法启动

```bash
pm2 logs barcode-backend
netstat -tlnp | grep 4081
ls -la /www/wwwroot/barcode-inventory/backend/database/
```

### 2. 前端无法访问

```bash
nginx -t
ls -la /www/wwwroot/barcode-inventory/frontend/dist/
tail -f /www/wwwroot/barcode-inventory/logs/error.log
```

### 3. API请求失败

```bash
pm2 list
curl http://localhost:4081/api/health
nginx -t
```

### 4. 图片上传失败

```bash
ls -la /www/wwwroot/barcode-inventory/backend/uploads/
chmod -R 755 /www/wwwroot/barcode-inventory/backend/uploads/
chown -R www:www /www/wwwroot/barcode-inventory/backend/uploads/
```

### 5. SSL证书申请失败

1. 确保域名已正确解析到服务器IP
2. 确保防火墙已开放80和443端口
3. 检查域名DNS记录是否正确
4. 等待DNS生效（最多48小时）

## 定时任务

### 1. 数据库自动备份

在宝塔面板「计划任务」中添加：

```bash
0 2 * * * cp /www/wwwroot/barcode-inventory/backend/database/inventory.db /www/wwwroot/barcode-inventory/backup/inventory-$(date +\%Y\%m\%d).db
```

### 2. 日志清理

```bash
0 3 * * 0 find /www/wwwroot/barcode-inventory/logs -name "*.log" -mtime +7 -delete
```

### 3. 自动更新

```bash
0 3 * * 0 cd /www/wwwroot/barcode-inventory && git pull && cd backend && npm install --production && npm run build && pm2 restart barcode-backend
```

## 监控和告警

### 1. 宝塔监控

使用宝塔面板的监控功能，监控：
- CPU使用率
- 内存使用率
- 磁盘使用率
- 网络流量

### 2. PM2监控

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 3. 告警设置

在宝塔面板中设置告警通知：
- CPU使用率超过80%
- 内存使用率超过90%
- 磁盘使用率超过85%
- 服务离线

## 域名配置

### 1. 添加域名解析

在域名服务商处添加A记录：

```
类型：A
主机记录：@ 或 www
记录值：你的服务器IP
TTL：600
```

### 2. 配置多域名

在Nginx配置中添加：

```nginx
server_name inventory.example.com www.inventory.example.com;
```

### 3. 配置子域名

```nginx
server_name api.inventory.example.com;
```

## 备份和恢复

### 1. 完整备份

```bash
mkdir -p /www/backup/barcode-inventory
cp /www/wwwroot/barcode-inventory/backend/database/inventory.db \
   /www/backup/barcode-inventory/inventory.db
tar -czf /www/backup/barcode-inventory/uploads.tar.gz \
        /www/wwwroot/barcode-inventory/backend/uploads/
tar -czf /www/backup/barcode-inventory/config.tar.gz \
        /www/wwwroot/barcode-inventory/backend/.env \
        /www/wwwroot/barcode-inventory/ecosystem.config.js
```

### 2. 恢复备份

```bash
cp /www/backup/b

## 获取帮助

如有问题，请查看：
- [宝塔面板官方文档](https://www.bt.cn/bbs/thread-416-1-1.html)
- [PM2官方文档](https://pm2.keymetrics.io/)
- [Nginx官方文档](http://nginx.org/en/docs/)
- [Docker官方文档](https://docs.docker.com/)
- [Docker Compose官方文档](https://docs.docker.com/compose/)
- 项目其他文档：README.md、BAOTA_DOCKER_DEPLOYMENT.md、DOCKER_DEPLOYMENT.md、COMMANDS.md
