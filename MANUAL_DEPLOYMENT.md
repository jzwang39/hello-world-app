# 手动部署指南 - 解决 SSH 连接问题

## 第一步：服务器准备

### 1.1 登录服务器（使用控制台或 VNC）
通过阿里云控制台登录到您的虚拟机。

### 1.2 安装必要软件
```bash
# 更新系统
apt update && apt upgrade -y

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# 安装 Nginx
apt install nginx -y

# 安装 PM2
npm install -g pm2

# 安装 Git（可选）
apt install git -y
```

### 1.3 创建应用目录
```bash
mkdir -p /var/www/hello-world-app
cd /var/www/hello-world-app
```

## 第二步：文件上传

### 方法一：使用 SCP（如果 SSH 可用）
```bash
# 从本地执行
scp -r /Users/jian-zhiwang/15.AI（2601）/9AI编程/网站/app/* root@服务器IP:/var/www/hello-world-app/
```

### 方法二：使用 FTP/SFTP
1. 使用 FileZilla 或其他 FTP 客户端
2. 连接到服务器
3. 上传整个 `app` 目录到 `/var/www/hello-world-app/`

### 方法三：使用阿里云文件管理
1. 通过阿里云控制台的文件管理功能
2. 上传项目文件到指定目录

## 第三步：服务器端配置

### 3.1 安装依赖
```bash
cd /var/www/hello-world-app
npm install
```

### 3.2 构建应用
```bash
npm run build
```

### 3.3 配置 Nginx
创建文件 `/etc/nginx/sites-available/hello-world-app`：

```nginx
server {
    listen 80;
    server_name _;
    
    location /_next/static/ {
        alias /var/www/hello-world-app/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
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

启用配置：
```bash
ln -s /etc/nginx/sites-available/hello-world-app /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 3.4 启动应用
```bash
cd /var/www/hello-world-app
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 第四步：验证部署

### 4.1 检查应用状态
```bash
pm2 status
```

### 4.2 测试访问
在浏览器中访问：`http://您的服务器IP`

## SSH 连接问题排查

### 检查服务器 SSH 配置
```bash
# 在服务器上检查 SSH 服务状态
systemctl status ssh

# 检查防火墙设置
ufw status

# 检查 SSH 端口是否开放
netstat -tulpn | grep :22
```

### 检查本地 SSH 配置
```bash
# 检查本地 SSH 配置
cat ~/.ssh/config

# 测试连接
ssh -v root@服务器IP
```

## 备选方案

如果 SSH 持续有问题，考虑：
1. **重置服务器密码**
2. **检查安全组规则**（确保22端口开放）
3. **使用阿里云控制台的 VNC 登录**
4. **联系阿里云技术支持**

## 部署完成后的操作

1. **设置域名**（可选）
2. **配置 SSL 证书**（可选）
3. **设置监控和告警**
4. **定期备份**

---

**重要提示**：如果 SSH 连接问题持续存在，建议先通过阿里云控制台登录服务器，检查网络和安全组配置。