# 快速开始指南

## 5分钟快速启动

### 1. 安装依赖
```bash
npm run install:all
```

### 2. 初始化数据库
```bash
npm run init-db
```

### 3. 启动服务
```bash
npm run dev
```

### 4. 访问系统
打开浏览器访问：http://localhost:4080

### 5. 登录系统
- 用户名：`admin`
- 密码：`admin123`

## 常用命令

```bash
# 一键启动（自动清理端口）
npm run dev

# 单独清理端口
npm run kill-port

# 安装所有依赖
npm run install:all

# 初始化数据库
npm run init-db

# 构建生产版本
npm run build

# 启动生产环境
npm run start
```

## 功能演示

### 扫描商品
1. 点击"扫描商品"按钮
2. 允许摄像头权限
3. 将条形码对准摄像头
4. 自动填充条形码信息

### 添加商品
1. 点击"添加商品"按钮
2. 填写商品信息
3. 可选上传商品图片
4. 点击"保存"

### 查看商品
1. 在商品列表中查看所有商品
2. 点击图片可预览大图
3. 使用搜索框查找商品

### 编辑商品
1. 点击商品行的"编辑"按钮
2. 修改商品信息
3. 点击"保存"

### 删除商品
1. 点击商品行的"删除"按钮
2. 确认删除

## 端口说明

### 本地开发
- 前端：4080
- 后端：4081

### Docker 部署
- 统一端口：4080
- 前端和后端通过nginx代理，只需访问4080端口

系统会自动清理端口占用，无需手动处理。

## 故障排除

### 端口被占用
```bash
npm run kill-port
```

### 数据库问题
```bash
npm run init-db
```

### 依赖问题
```bash
npm run install:all
```

## 获取帮助

- 查看详细文档：README.md
- 端口清理说明：PORT_CLEANUP.md
- 更新日志：CHANGELOG.md
