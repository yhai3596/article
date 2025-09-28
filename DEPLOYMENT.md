# DailyByte AI News - 部署指南

本指南将帮助您通过GitHub将DailyByte AI News项目部署到Vercel。

## 📋 前置要求

- GitHub账户
- Vercel账户
- Supabase项目（如果需要后端功能）
- Node.js 18+ 和 pnpm

## 🚀 部署步骤

### 1. 准备GitHub仓库

#### 1.1 创建GitHub仓库
1. 登录GitHub
2. 点击右上角的"+"按钮，选择"New repository"
3. 填写仓库名称（例如：`dailybyte-ai-news`）
4. 选择"Public"或"Private"
5. 点击"Create repository"

#### 1.2 推送代码到GitHub
在项目根目录（`newsmith-ai-news`文件夹）中执行以下命令：

```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: DailyByte AI News application"

# 添加远程仓库（替换为您的GitHub仓库URL）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

### 2. 配置环境变量

#### 2.1 准备Supabase配置
1. 登录您的Supabase项目
2. 进入项目设置 > API
3. 复制以下信息：
   - Project URL
   - Anon public key

#### 2.2 创建本地环境文件（可选）
复制 `.env.example` 文件为 `.env.local`：
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填入您的Supabase配置：
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. 部署到Vercel

#### 3.1 连接GitHub仓库
1. 登录 [Vercel](https://vercel.com)
2. 点击"New Project"
3. 选择"Import Git Repository"
4. 找到您刚创建的GitHub仓库并点击"Import"

#### 3.2 配置项目设置
在Vercel的项目配置页面：

1. **Framework Preset**: 选择"Vite"
2. **Root Directory**: 如果您的项目在子目录中，请设置为 `newsmith-ai-news`
3. **Build Command**: `pnpm build`
4. **Output Directory**: `dist`
5. **Install Command**: `pnpm install`

#### 3.3 配置环境变量
在Vercel项目设置中：

1. 进入"Settings" > "Environment Variables"
2. 添加以下环境变量：
   ```
   VITE_SUPABASE_URL = https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY = your-supabase-anon-key
   ```
3. 确保为所有环境（Production, Preview, Development）都添加这些变量

#### 3.4 部署
1. 点击"Deploy"按钮
2. 等待构建完成（通常需要2-5分钟）
3. 部署成功后，您将获得一个Vercel URL

### 4. 验证部署

#### 4.1 检查应用功能
访问您的Vercel URL，确认以下功能正常：
- [ ] 页面正常加载
- [ ] 用户注册/登录功能
- [ ] 新闻获取功能
- [ ] 内容生成功能
- [ ] 响应式设计

#### 4.2 检查控制台错误
打开浏览器开发者工具，确认没有JavaScript错误。

### 5. 自动部署设置

Vercel会自动监听您的GitHub仓库：
- 推送到`main`分支会触发生产环境部署
- 推送到其他分支会创建预览部署
- Pull Request会自动创建预览部署

### 6. 自定义域名（可选）

#### 6.1 添加自定义域名
1. 在Vercel项目设置中，进入"Domains"
2. 添加您的域名
3. 按照提示配置DNS记录

#### 6.2 SSL证书
Vercel会自动为您的域名提供免费的SSL证书。

## 🔧 故障排除

### 常见问题

#### 构建失败
- 检查`package.json`中的依赖版本
- 确认Node.js版本兼容性
- 查看Vercel构建日志中的具体错误信息

#### 环境变量问题
- 确认环境变量名称正确（必须以`VITE_`开头）
- 检查Supabase URL和密钥是否正确
- 确认环境变量已添加到所有环境

#### 路由问题
- 确认`vercel.json`中的重写规则正确
- 检查React Router配置

#### Supabase连接问题
- 验证Supabase项目是否正常运行
- 检查API密钥权限
- 确认数据库表结构正确

### 调试步骤

1. **本地测试**：
   ```bash
   pnpm dev
   ```

2. **本地构建测试**：
   ```bash
   pnpm build
   pnpm preview
   ```

3. **检查Vercel日志**：
   - 在Vercel项目页面查看"Functions"和"Deployments"日志

## 📚 相关资源

- [Vercel文档](https://vercel.com/docs)
- [Vite部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Supabase文档](https://supabase.com/docs)
- [React Router文档](https://reactrouter.com/)

## 🆘 获取帮助

如果遇到问题，请：
1. 检查本指南的故障排除部分
2. 查看Vercel和Supabase的官方文档
3. 在项目GitHub仓库中创建Issue

---

**注意**: 请确保不要将敏感信息（如API密钥）提交到GitHub仓库中。始终使用环境变量来管理敏感配置。