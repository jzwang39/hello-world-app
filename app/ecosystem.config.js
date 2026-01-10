module.exports = {
  apps: [{
    name: 'hello-world-app',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/hello-world-app',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/hello-world-app/error.log',
    out_file: '/var/log/hello-world-app/out.log',
    log_file: '/var/log/hello-world-app/combined.log',
    time: true
  }]
};