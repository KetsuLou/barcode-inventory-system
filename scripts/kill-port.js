const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const ports = [4080];

async function killPort(port) {
  const platform = process.platform;
  
  try {
    let pid;
    
    if (platform === 'win32') {
      // Windows
      const { stdout } = await execPromise(`netstat -ano | findstr :${port}`);
      const lines = stdout.trim().split('\n');
      
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5 && parts[1].includes(`:${port}`)) {
          pid = parts[parts.length - 1];
          break;
        }
      }
      
      if (pid) {
        await execPromise(`taskkill /F /PID ${pid}`);
        console.log(`✓ 已终止端口 ${port} 上的进程 (PID: ${pid})`);
        return true;
      }
    } else {
      // Linux/Mac
      const { stdout } = await execPromise(`lsof -ti:${port}`);
      pid = stdout.trim();
      
      if (pid) {
        await execPromise(`kill -9 ${pid}`);
        console.log(`✓ 已终止端口 ${port} 上的进程 (PID: ${pid})`);
        return true;
      }
    }
    
    console.log(`✓ 端口 ${port} 未被占用`);
    return false;
  } catch (error) {
    console.log(`✓ 端口 ${port} 未被占用`);
    return false;
  }
}

async function main() {
  console.log('🔍 检查端口占用情况...');
  
  for (const port of ports) {
    await killPort(port);
  }
  
  console.log('✅ 端口检查完成，可以启动服务了');
}

main().catch(console.error);
