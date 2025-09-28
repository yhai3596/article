# DailyByte AI News

🚀 **智能AI新闻聚合与内容生成平台**

一个现代化的AI驱动新闻平台，集成新闻聚合、智能内容生成和多平台发布功能。

## ✨ 主要功能

- 📰 **智能新闻聚合** - 自动从多个来源获取最新AI新闻
- 🤖 **AI内容生成** - 生成X(Twitter)线程、LinkedIn帖子、Instagram脚本等
- 📧 **邮件推送** - 自动发送每日AI新闻摘要
- 🎨 **图片生成** - AI驱动的新闻配图生成
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🔐 **用户认证** - 基于Supabase的安全认证系统

## 🛠️ 技术栈

- **前端**: React 18 + TypeScript + Vite
- **UI组件**: Radix UI + Tailwind CSS + Shadcn/ui
- **后端**: Supabase (数据库 + 认证 + Edge Functions)
- **部署**: Vercel
- **包管理**: pnpm

## 🚀 快速开始

### 环境要求
- Node.js 18+
- pnpm

### 安装依赖
```bash
pnpm install
```

### 环境配置
复制 `.env.example` 为 `.env` 并配置：
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 开发运行
```bash
pnpm dev
```

### 构建部署
```bash
pnpm build
```

## 📦 部署

详细部署指南请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🏗️ 项目结构

```
src/
├── components/          # React组件
├── hooks/              # 自定义Hooks
├── lib/                # 工具库和配置
└── main.tsx           # 应用入口

public/
├── data/              # 示例数据
├── images/            # 图片资源
└── templates/         # 内容模板
```

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License
