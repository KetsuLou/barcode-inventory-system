# 📦 条形码商品库存管理系统

一个功能完整的商品库存管理系统，支持通过条形码/二维码扫描记录和管理商品信息。

## ✨ 主要功能

- 📷 **条形码/二维码扫描** - 支持扫描商品上的条形码和二维码
- 📝 **商品信息记录** - 记录商品名称、单价、备注等详细信息
- 🌐 **网页端管理** - 通过网页查看、添加、修改商品信息
- 🔐 **用户认证** - 支持用户登录和权限管理
- 📊 **数据统计** - 查看库存统计和商品列表

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

### 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 运行项目

```bash
# 启动后端服务 (端口 3001)
cd backend
npm run dev

# 启动前端服务 (端口 3000)
cd frontend
npm start
```

访问 http://localhost:3000 开始使用

## 📱 使用说明

### 1. 扫描商品
- 点击"扫描商品"按钮
- 允许摄像头权限
- 将条形码/二维码对准摄像头
- 系统自动识别并填充商品信息

### 2. 添加商品
- 填写商品名称、单价、备注等信息
- 点击"保存"按钮
- 商品信息将保存到数据库

### 3. 管理商品
- 在商品列表中查看所有商品
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

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！