# 服务器端部署详细步骤

## 前提条件
- 您使用的是阿里云虚拟主机产品，不是ECS云服务器
- `deploy-package.tar.gz` 文件已上传到虚拟主机的 `/htdocs` 目录

## 虚拟主机管理方法

### 方法1: 阿里云虚拟主机控制台
1. 登录阿里云控制台 (https://hosting.console.aliyun.com)
2. 在左侧菜单点击"虚拟主机"或"云虚拟主机"
3. 找到您的虚拟主机实例，点击进入管理页面

### 方法2: 文件管理功能
1. 在虚拟主机管理页面，寻找以下功能：
   - "文件管理" 或 "FTP管理"
   - "在线文件管理"
   - "主机管理面板"

### 方法3: FTP客户端连接
1. 使用FTP客户端（如FileZilla）连接
2. 主机：`47.98.49.28`
3. 端口：`21`
4. 用户名：`wh-ns2qk7g9bluizy0ffx2`
5. 密码：`dadao123456#`

## 虚拟主机部署步骤

### 重要说明
虚拟主机通常不支持SSH登录和命令行操作，部署方式与ECS不同。

### 步骤1: 解压部署包
由于虚拟主机可能不支持命令行解压，您需要：

**选项A: 在本地解压后上传**
```bash
# 在本地解压部署包
tar -xzf deploy-package.tar.gz

# 然后将解压后的 deploy-package/ 目录内容上传到虚拟主机的 /htdocs 目录
```

**选项B: 使用控制台的文件解压功能**
1. 登录虚拟主机控制台
2. 找到"文件管理"或"在线解压"功能
3. 上传 `deploy-package.tar.gz` 到 `/htdocs` 目录
4. 使用控制台的解压功能解压文件

### 步骤2: 配置网站
1. 确保文件上传到正确目录（通常是 `/htdocs` 或 `/www`）
2. 虚拟主机会自动识别并运行网站
3. 访问您的域名查看网站是否正常运行

### 步骤2: 设置文件权限
```bash
# 给部署脚本添加执行权限
chmod +x deploy-server.sh
```

### 步骤3: 执行部署脚本
```bash
# 运行部署脚本
./deploy-server.sh
```

## 部署脚本执行过程

部署脚本会自动执行以下操作：

1. **检查 Node.js**：如果未安装，会自动安装 Node.js 18
2. **检查 PM2**：如果未安装，会自动安装 PM2 进程管理器
3. **安装依赖**：使用 `npm ci` 安装项目依赖
4. **启动应用**：使用 PM2 启动 Next.js 应用
5. **保存配置**：配置 PM2 开机自启动

## 验证部署

### 检查应用状态
```bash
# 查看 PM2 进程状态
pm2 status

# 查看应用日志
pm2 logs nextjs-app
```

### 测试访问
```bash
# 测试本地访问
curl http://localhost:3000

# 或者使用浏览器访问
# http://您的服务器IP:3000
```

## 配置 Web 服务器（可选）

### 配置 Nginx（推荐）
如果您希望通过 80 端口访问网站，可以配置 Nginx：

```bash
# 安装 Nginx
sudo apt update
sudo apt install nginx

# 创建 Nginx 配置
sudo tee /etc/nginx/sites-available/nextjs-app << 'NGINX'
server {
    listen 80;
    server_name your-domain.com;  # 替换为您的域名或服务器IP
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

# 启用站点
sudo ln -s /etc/nginx/sites-available/nextjs-app /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

## 故障排除

### 如果部署失败：

1. **检查 Node.js 版本**
```bash
node --version
```

2. **检查依赖安装**
```bash
npm list
```

3. **查看详细错误信息**
```bash
# 重新运行部署脚本并显示详细输出
bash -x ./deploy-server.sh
```

4. **手动安装依赖**
```bash
npm install
```

### 如果端口无法访问：
1. **检查防火墙**：确保 3000 端口在安全组中开放
2. **检查应用是否运行**：`pm2 status`
3. **查看错误日志**：`pm2 logs nextjs-app`

## 重要提示

1. **备份重要数据**：部署前确保重要文件已备份
2. **记录部署过程**：记录每一步操作，便于排查问题
3. **测试访问**：部署完成后立即测试网站访问
4. **监控运行状态**：定期检查应用运行状态

## 完成后的验证

部署完成后，您应该能够：
- 通过 `http://服务器IP:3000` 访问网站
- 通过 `pm2 status` 查看应用运行状态
- 通过 `pm2 logs` 查看应用日志

如果遇到任何问题，请参考上述故障排除步骤或联系技术支持。