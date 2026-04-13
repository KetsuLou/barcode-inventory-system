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
