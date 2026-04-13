const http = require('http');

const ports = [4080, 4081];

ports.forEach(port => {
  const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Test server');
  });

  server.listen(port, () => {
    console.log(`✓ 测试服务器已占用端口 ${port}`);
  });

  process.on('SIGTERM', () => {
    server.close();
  });
});

console.log('按 Ctrl+C 停止测试服务器');
