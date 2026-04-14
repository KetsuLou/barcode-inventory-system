# 📦 条形码商品库存管理系统

一个功能完整的商品库存管理系统，支持通过条形码/二维码扫描记录和管理商品信息。

## ✨ 主要功能

- 📷 **条形码/二维码扫描** - 支持扫描商品上的条形码和二维码
- 📝 **商品信息记录** - 记录商品名称、单价、备注等详细信息
- 🖼️ **商品图片上传** - 支持上传商品图片，点击可预览
- 🌐 **网页端管理** - 通过网页查看、添加、修改商品信息
- 🔐 **用户认证** - 支持用户登录和权限管理
- 📊 **数据统计** - 查看库存统计和商品列表
- 🚀 **一键启动** - 支持npm命令一键启动前后端服务

## 🛠️ 技术栈

### 后端
- Node.js + Express
- TypeScript
- SQLite (数据库)
- JWT (身份认证)

### 前端
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Axios

### 扫描功能
- html5-qrcode (条形码/二维码扫描)

## 📦 安装和运行

### 前置要求
- Node.js >= 16
- npm 或 yarn
- Docker 20.10+ (可选，用于Docker部署)

### 安装依赖

```bash
# 方式一：使用npm脚本（推荐）
npm run install:all

# 方式二：手动安装
cd backend
npm install

cd ../frontend
npm install
```

### 运行项目

#### 方式一：Docker 部署（推荐用于生产环境）

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

详细部署说明请查看 [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)

#### 方式二：本地开发（推荐用于开发环境）

```bash
# 在项目根目录执行
npm install
npm run init-db
npm run dev
```

**说明：**
- `npm run dev` 会自动检查并清理端口4080和4081的占用进程
- 然后同时启动前后端开发服务器
- 如需单独清理端口，可运行 `npm run kill-port`

#### 方式二：分别启动

```bash
# 启动后端服务 (端口 4081)
cd backend
npm run dev

# 启动前端服务 (端口 4080) - 在新终端中运行
cd frontend
npm run dev
```

#### 其他命令

```bash
# 单独清理端口占用
npm run kill-port

# 生产环境启动
npm run build
npm run start
```

### 端口说明

#### 本地开发
- **前端端口**: 4080
- **后端端口**: 4081
- 系统会自动检测并清理端口占用，无需手动处理

#### Docker 部署
- **统一端口**: 4080
- 前端和后端通过nginx代理，只需访问4080端口即可
- 后端服务仅在Docker内部网络中运行，不对外暴露

访问 http://localhost:4080 开始使用

## 📱 使用说明

### 1. 扫描商品
- 点击"扫描商品"按钮
- 允许摄像头权限
- 将条形码或二维码对准摄像头
- 系统自动识别并填充商品信息

### 2. 添加商品
- 填写商品名称、单价、备注等信息
- 可选择上传商品图片
- 点击"保存"按钮
- 商品信息将保存到数据库

### 3. 管理商品
- 在商品列表中查看所有商品
- 点击商品图片可预览大图
- 点击"编辑"修改商品信息
- 点击"删除"移除商品

## 📁 项目结构

```
barcode-inventory-system/
├── backend/              # 后端服务
│   ├── src/
│   │   ├── controllers/  # 控制器
│   │   ├── models/       # 数据模型
│   │   ├── routes/       # 路由
│   │   ├── middleware/   # 中间件
│   │   └── server.ts     # 服务器入口
│   ├── database/         # SQLite数据库
│   └── package.json
├── frontend/             # 前端应用
│   ├── src/
│   │   ├── components/   # 组件
│   │   ├── pages/        # 页面
│   │   ├── services/     # API服务
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## 🔐 默认账户

- 用户名: `admin`
- 密码: `admin123`

## 📄 许可证

MIT License

## 📚 文档

- [快速开始指南](QUICK_START.md) - 5分钟快速上手
- [Docker 部署指南](DOCKER_DEPLOYMENT.md) - Docker 部署详细说明
- [宝塔面板部署指南](BAOTA_DEPLOYMENT.md) - 宝塔面板部署详细说明
- [宝塔面板Docker部署指南](BAOTA_DOCKER_DEPLOYMENT.md) - 宝塔面板Docker一键部署
- [端口清理说明](PORT_CLEANUP.md) - 端口清理功能说明
- [命令参考手册](COMMANDS.md) - 所有可用命令
- [更新日志](CHANGELOG.md) - 版本更新记录

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！