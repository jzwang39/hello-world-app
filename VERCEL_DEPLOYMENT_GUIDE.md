# Vercel部署指南

## ✅ 项目准备状态
- ✅ Next.js 14.0.0 项目配置正确
- ✅ 动态API功能已启用（支持 `/api/test` 和 `/api/another-test`）
- ✅ 本地构建测试通过
- ✅ Vercel配置文件已创建

## 部署到Vercel的步骤

### 方法一：通过GitHub部署（推荐）

1. **准备GitHub仓库**
   ```bash
   # 在项目根目录初始化Git仓库
   cd /Users/jian-zhiwang/15.AI（2601）/9AI编程/网站/app
   git init
   git add .
   git commit -m "Initial commit for Vercel deployment"
   
   # 创建GitHub仓库并推送代码
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git branch -M main
   git push -u origin main
   ```

2. **连接Vercel到GitHub**
   - 访问 [Vercel官网](https://vercel.com)
   - 使用GitHub账号登录
   - 点击 "New Project"
   - 选择刚刚创建的GitHub仓库
   - 保持默认配置，点击 "Deploy"

3. **等待部署完成**
   - Vercel会自动检测Next.js项目并部署
   - 部署完成后，您会获得一个类似 `https://your-app.vercel.app` 的URL

### 方法二：通过Vercel CLI部署

1. **安装Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   cd /Users/jian-zhiwang/15.AI（2601）/9AI编程/网站/app
   vercel
   ```
   
   - 按照提示选择默认配置
   - 确认项目根目录为当前目录
   - 等待部署完成

### 方法三：通过Vercel Dashboard部署

1. **访问Vercel Dashboard**
   - 登录 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"

2. **导入项目**
   - 选择 "Import Git Repository"
   - 或者选择 "Import from GitHub"
   - 或者直接拖拽项目文件夹到上传区域

3. **配置部署**
   - 框架预设：Next.js
   - 根目录：保持默认（自动检测）
   - 构建命令：`npm run build`
   - 输出目录：`.next`
   - 安装命令：`npm install`

## 环境变量配置（可选）

如果您的API需要环境变量，可以在Vercel Dashboard中配置：

1. 进入项目设置
2. 选择 "Environment Variables"
3. 添加需要的环境变量
4. 重新部署生效

## 自定义域名（可选）

1. **在Vercel中添加域名**
   - 进入项目设置 → Domains
   - 添加您的自定义域名

2. **配置DNS**
   - 在域名注册商处添加CNAME记录
   - 指向Vercel提供的DNS地址

## 项目特点

- ✅ **支持动态API**：Vercel完全支持Next.js的API路由
- ✅ **自动HTTPS**：所有部署都自动启用SSL证书
- ✅ **全球CDN**：应用在全球多个边缘节点部署
- ✅ **自动部署**：GitHub推送后自动重新部署
- ✅ **性能优化**：自动优化静态资源和图片

## 部署后的验证

部署完成后，请测试以下功能：

1. **访问主页**：`https://your-app.vercel.app`
2. **测试API调用**：
   - 在文本框中输入内容
   - 点击"直接运行"按钮测试 `/api/test`
   - 点击"优化前后对比"按钮测试 `/api/another-test`
3. **检查响应**：确保API返回正确的结果

## 常见问题

### Q: 部署后API返回404错误？
A: 检查API路由文件是否存在，确保路径正确。

### Q: 构建失败？
A: 检查本地构建是否正常，查看构建日志中的错误信息。

### Q: 如何查看部署日志？
A: 在Vercel Dashboard中进入项目 → Deployments → 选择部署 → 查看日志。

## 优势对比

| 特性 | Vercel | 阿里云虚拟主机 |
|------|--------|----------------|
| 动态API支持 | ✅ 完全支持 | ❌ 不支持 |
| Node.js运行时 | ✅ 内置支持 | ❌ 不支持 |
| 自动HTTPS | ✅ 自动配置 | ⚠️ 需要手动配置 |
| 全球CDN | ✅ 自动部署 | ❌ 无 |
| 自动部署 | ✅ Git推送触发 | ❌ 手动上传 |
| 免费额度 | ✅ 有免费套餐 | ❌ 付费 |

## 下一步

1. 选择适合您的部署方法
2. 按照上述步骤部署到Vercel
3. 测试所有功能是否正常工作
4. 如有需要，配置自定义域名

您的应用现在已准备好部署到Vercel，享受完整的Next.js功能和优秀的性能！