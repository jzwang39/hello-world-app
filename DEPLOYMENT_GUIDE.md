# Next.js 应用部署到阿里云虚拟机指南

## 1. 服务器环境准备

### 1.1 登录阿里云服务器
```bash
ssh root@your-server-ip
```

### 1.2 安装必要的软件
```bash
# 更新系统
apt update && apt upgrade -y

# 安装 Node.js (推荐使用 Node.js 18 LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# 安装 Nginx
apt install nginx -y

# 安装 PM2 (进程管理)
npm install -g pm2

# 安装 Git
apt install git -y
```

### 1.3 验证安装
```bash
node --version    # 应该显示 v18.x.x
npm --version     # 应该显示 9.x.x
nginx -v          # 应该显示版本信息
pm2 --version     # 应该显示版本信息
```

## 2. 项目部署

### 2.1 创建应用目录
```bash
mkdir -p /var/www/hello-world-app
cd /var/www/hello-world-app
```

### 2.2 上传项目文件
将本地项目文件上传到服务器，可以使用以下方法之一：

**方法一：使用 scp 命令（从本地执行）**
```bash
scp -r /Users/jian-zhiwang/15.AI（2601）/9AI编程/网站/app/* root@your-server-ip:/var/www/hello-world-app/
```

**方法二：使用 Git（推荐）**
```bash
# 在服务器上克隆项目
git clone your-repository-url /var/www/hello-world-app
cd /var/www/hello-world-app
```

### 2.3 安装依赖和构建
```bash
cd /var/www/hello-world-app

# 安装依赖
npm install

# 构建生产版本
npm run build
```

## 3. 配置 Nginx

### 3.1 创建 Nginx 配置文件
创建文件 `/etc/nginx/sites-available/hello-world-app`：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为您的域名或服务器IP
    
    # 静态文件缓存
    location /_next/static/ {
        alias /var/www/hello-world-app/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API 代理
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 主应用代理
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3.2 启用站点配置
```bash
# 创建符号链接
ln -s /etc/nginx/sites-available/hello-world-app /etc/nginx/sites-enabled/

# 测试 Nginx 配置
nginx -t

# 重启 Nginx
systemctl restart nginx

# 设置 Nginx 开机自启
systemctl enable nginx
```

## 4. 配置 PM2 进程管理

### 4.1 创建 PM2 配置文件
创建文件 `/var/www/hello-world-app/ecosystem.config.js`：

```javascript
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
```

### 4.2 创建日志目录
```bash
mkdir -p /var/log/hello-world-app
```

### 4.3 启动应用
```bash
cd /var/www/hello-world-app
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 5. 防火墙配置

### 5.1 开放端口
```bash
# 开放 80 端口 (HTTP)
ufw allow 80

# 开放 443 端口 (HTTPS，如果需要)
ufw allow 443

# 启用防火墙
ufw enable
```

## 6. SSL 证书配置（可选）

### 6.1 安装 Certbot
```bash
apt install certbot python3-certbot-nginx -y
```

### 6.2 获取 SSL 证书
```bash
certbot --nginx -d your-domain.com
```

## 7. 监控和维护

### 7.1 查看应用状态
```bash
pm2 status
pm2 logs hello-world-app
```

### 7.2 重启应用
```bash
pm2 restart hello-world-app
```

### 7.3 更新应用
```bash
cd /var/www/hello-world-app
# 拉取最新代码
git pull
# 重新安装依赖
npm install
# 重新构建
npm run build
# 重启应用
pm2 restart hello-world-app
```

## 8. 故障排查

### 8.1 检查服务状态
```bash
# 检查 PM2 状态
pm2 status

# 检查 Nginx 状态
systemctl status nginx

# 查看 Nginx 错误日志
tail -f /var/log/nginx/error.log

# 查看应用日志
tail -f /var/log/hello-world-app/error.log
```

### 8.2 端口检查
```bash
# 检查端口是否监听
netstat -tulpn | grep :3000
netstat -tulpn | grep :80
```

## 9. 安全建议

1. **定期更新系统**：`apt update && apt upgrade`
2. **使用强密码**：避免使用默认密码
3. **配置 SSH 密钥认证**：禁用密码登录
4. **定期备份**：备份应用代码和数据库
5. **监控资源使用**：使用 `htop` 监控系统资源

## 10. 性能优化

1. **启用 Gzip 压缩**：在 Nginx 配置中添加 gzip 设置
2. **配置缓存**：合理设置静态资源缓存时间
3. **使用 CDN**：将静态资源部署到 CDN
4. **数据库优化**：如果使用数据库，优化查询和索引

---

**部署完成！** 现在您可以通过浏览器访问您的域名或服务器 IP 来查看应用。