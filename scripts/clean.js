const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('清理缓存...');

// 清理前端缓存
console.log('清理前端缓存...');
const frontendPath = path.join(__dirname, '../frontend');
const viteCachePath = path.join(frontendPath, 'node_modules/.vite');
const distPath = path.join(frontendPath, 'dist');
const vitePath = path.join(frontendPath, '.vite');

if (fs.existsSync(viteCachePath)) {
  fs.rmSync(viteCachePath, { recursive: true, force: true });
  console.log('  ✓ 清理 node_modules/.vite');
}
if (fs.existsSync(distPath)) {
  fs.rmSync(distPath, { recursive: true, force: true });
  console.log('  ✓ 清理 dist');
}
if (fs.existsSync(vitePath)) {
  fs.rmSync(vitePath, { recursive: true, force: true });
  console.log('  ✓ 清理 .vite');
}

// 清理后端缓存
console.log('清理后端缓存...');
const backendPath = path.join(__dirname, '../backend');
const backendDistPath = path.join(backendPath, 'dist');

if (fs.existsSync(backendDistPath)) {
  fs.rmSync(backendDistPath, { recursive: true, force: true });
  console.log('  ✓ 清理 backend/dist');
}

// 清理 Docker 缓存（如果使用 Docker）
console.log('清理 Docker 缓存...');
try {
  execSync('docker-compose down -v', { stdio: 'inherit' });
  execSync('docker system prune -f', { stdio: 'inherit' });
  console.log('  ✓ 清理 Docker 缓存');
} catch (error) {
  console.log('  ! Docker 未运行或未安装，跳过 Docker 缓存清理');
}

console.log('\n缓存清理完成！');
console.log('请运行以下命令重新安装依赖：');
console.log('  cd frontend && npm install');
console.log('  cd backend && npm install');
