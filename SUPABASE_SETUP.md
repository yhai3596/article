# 🚀 Supabase 设置指南

本指南将帮助您为 DailyByte AI News 项目设置 Supabase 数据库。

## 📋 前置要求

- 一个 Supabase 账户（免费）
- 已克隆的项目代码

## 🔧 第一步：创建 Supabase 项目

1. **访问 Supabase**
   - 前往 [supabase.com](https://supabase.com)
   - 点击 **"Start your project"**

2. **登录或注册**
   - 使用 GitHub、Google 或邮箱注册

3. **创建新项目**
   - 点击 **"New project"**
   - 选择组织（个人账户）
   - 填写项目信息：
     - **Name**: `dailybyte-ai-news`
     - **Database Password**: 设置一个强密码（请保存好）
     - **Region**: 选择离您最近的区域
   - 点击 **"Create new project"**

4. **等待初始化**
   - 项目创建需要 1-2 分钟
   - 完成后会显示项目仪表板

## 🗄️ 第二步：设置数据库

1. **打开 SQL 编辑器**
   - 在项目仪表板左侧菜单点击 **"SQL Editor"**
   - 点击 **"New query"**

2. **执行数据库脚本**
   - 复制项目根目录中的 `supabase_setup.sql` 文件内容
   - 粘贴到 SQL 编辑器中
   - 点击 **"Run"** 按钮执行

3. **验证表创建**
   - 执行成功后，点击左侧的 **"Table Editor"**
   - 您应该看到以下表：
     - ✅ `profiles` - 用户资料
     - ✅ `news_categories` - 新闻分类
     - ✅ `news_stories` - 新闻故事
     - ✅ `generated_content` - 生成的内容
     - ✅ `user_preferences` - 用户偏好
     - ✅ `user_category_preferences` - 用户分类偏好

## 🔐 第三步：配置身份验证

1. **启用邮箱认证**
   - 点击左侧菜单的 **"Authentication"**
   - 选择 **"Providers"** 选项卡
   - 确保 **"Email"** 已启用
   - 在 Email 设置中：
     - ✅ 启用 **"Enable email confirmations"**
     - ✅ 启用 **"Enable email change confirmations"**

2. **配置邮件模板（可选）**
   - 在 **"Email Templates"** 中自定义确认邮件

## 🔑 第四步：获取 API 密钥

1. **获取项目配置**
   - 点击左侧菜单的 **"Settings"**
   - 选择 **"API"** 选项卡

2. **复制必要信息**
   - **Project URL**: 格式为 `https://your-project-id.supabase.co`
   - **anon public key**: 以 `eyJ` 开头的长字符串

## ⚙️ 第五步：配置项目环境变量

### 方法一：本地开发

1. **创建 .env 文件**
   ```bash
   cp .env.example .env
   ```

2. **更新 .env 文件**
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 方法二：Vercel 部署

1. **在 Vercel 项目设置中**
   - 进入项目的 **"Settings"** > **"Environment Variables"**
   - 添加以下变量：
     - `VITE_SUPABASE_URL`: 您的项目 URL
     - `VITE_SUPABASE_ANON_KEY`: 您的匿名密钥

2. **重新部署**
   - 在 Vercel 仪表板中点击 **"Redeploy"**

## ✅ 第六步：验证配置

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **检查控制台**
   - 打开浏览器开发者工具
   - 如果配置正确，您会看到：`✅ Supabase configured successfully`
   - 如果配置错误，您会看到警告信息

3. **测试功能**
   - 尝试注册新用户
   - 检查用户是否能正常登录
   - 验证数据是否正确保存到数据库

## 🔍 故障排除

### 常见问题

1. **"Invalid API key" 错误**
   - 检查 API 密钥是否正确复制
   - 确保没有多余的空格

2. **"Project not found" 错误**
   - 检查项目 URL 是否正确
   - 确保项目已完全初始化

3. **数据库连接失败**
   - 确保已执行 `supabase_setup.sql` 脚本
   - 检查表是否正确创建

4. **认证问题**
   - 确保邮箱认证已启用
   - 检查邮件模板配置

### 获取帮助

如果遇到问题，请：
1. 检查 Supabase 项目日志
2. 查看浏览器控制台错误
3. 参考 [Supabase 官方文档](https://supabase.com/docs)

## 🎉 完成！

恭喜！您已成功设置 Supabase 数据库。现在可以：
- 运行本地开发服务器
- 部署到 Vercel
- 开始使用 DailyByte AI News 应用

---

**需要帮助？** 请查看项目 README 或联系开发团队。