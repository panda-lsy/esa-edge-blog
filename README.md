# ESA Pages + KV Storage Blog

## 项目简介

这是一个现代化的个人博客平台，基于阿里云 ESA Pages (Edge Security Acceleration) 和边缘 KV 存储构建。项目充分利用了边缘计算的优势，实现了全球范围的低延迟访问和高性能内容分发。

本项目由[阿里云ESA](https://www.aliyun.com/product/esa)提供加速、计算和保护”![img](https://img.alicdn.com/imgextra/i3/O1CN01H1UU3i1Cti9lYtFrs_!!6000000000139-2-tps-7534-844.png)

## 核心特性

### 创意卓越

- **高级动画效果**: 使用 GSAP (GreenSock) 实现流畅的页面过渡和滚动动画
- **动态视觉设计**: 3D 背景效果、粒子系统、视差滚动
- **深色/浅色模式**: 完整的主题切换系统，平滑过渡动画
- **响应式布局**: 完美适配桌面、平板、移动设备

### 应用价值

- **完整博客功能**: 文章展示、分类、标签、搜索、评论系统
- **内容管理**: 基于 KV 存储的轻量级 CMS 系统
- **访客统计**: 实时访客统计和文章阅读量追踪
- **SEO 优化**: 完善的元标签、sitemap、结构化数据

### 技术探索

- **边缘计算**: 使用 ESA Edge Functions 处理动态请求
- **边缘存储**: 利用 Edge KV 实现全球分布式数据存储
- **智能缓存**: 多层缓存策略，最大化边缘缓存命中率
- **性能优化**: 代码分割、图片优化、懒加载、Service Worker

## 技术栈

### 前端

- **Next.js 16+**: React 框架，支持 App Router
- **TypeScript**: 类型安全的 JavaScript 超集
- **Tailwind CSS**: 实用优先的 CSS 框架
- **GSAP**: 高性能动画库
- **Lenis**: 平滑滚动体验

### 后端

- **Edge Functions**: 边缘函数处理动态请求
- **Edge KV Storage**: 边缘键值存储
- **Edge Cache**: 智能缓存策略

### 管理后台

- **Token 认证**: 7天会话管理
- **图片上传**: 支持直接上传和管理图片
- **实时预览**: Markdown 编辑器与预览
- **完整 CRUD**: 文章和评论的完整管理

### 内容处理

- **MDX**: Markdown 扩展语法
- **Shiki**: 快速代码高亮
- **Rehype**: HTML 处理管道

## 项目结构

```
Blog/
├── app/
│   ├── api/              # API 路由 (边缘函数)
│   │   ├── posts/       # 文章相关 API
│   │   └── comments/    # 评论相关 API
│   ├── components/       # React 组件
│   │   ├── layout/      # 布局组件
│   │   ├── blog/        # 博客组件
│   │   └── ui/          # UI 组件
│   ├── lib/             # 工具库
│   │   ├── storage.ts   # KV 存储操作
│   │   └── types.ts     # TypeScript 类型
│   ├── styles/          # 全局样式
│   ├── layout.tsx       # 根布局
│   └── page.tsx         # 首页
├── public/              # 静态资源
├── next.config.js       # Next.js 配置
├── tailwind.config.js   # Tailwind CSS 配置
├── esa.jsonc           # ESA Pages 配置
└── package.json         # 项目依赖
```

## 部署步骤

### 1. 准备工作

确保您已完成：

- 阿里云账号注册
- ESA 服务激活
- GitHub 仓库准备

### 2. 项目部署

```bash
# 克隆项目
git clone https://github.com/your-username/esa-edge-blog.git
cd esa-edge-blog

# 安装依赖
npm install

# 本地开发
npm run dev

# 构建项目
npm run build
```

### 3. ESA Pages 部署

1. 登录 [阿里云 ESA Pages 控制台](https://www.aliyun.com/product/esa)
2. 创建新项目，连接 GitHub 仓库
3. 配置构建命令：`npm run build`
4. 配置输出目录：`.next`
5. 配置边缘 KV 命名空间
6. 设置环境变量（如果需要）
7. 部署！

### 4. 域名配置

- 添加自定义域名
- 配置 DNS 解析（CNAME 或 NS）
- 启用 HTTPS 证书

## KV 存储数据模型

### BlogPost (博客文章)

```typescript
{
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
  coverImage?: string;
  views: number;
  status: 'draft' | 'published';
}
```

### Comment (评论)

```typescript
{
  id: string;
  postId: string;
  author: string;
  email: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'spam';
}
```

### SiteStats (站点统计)

```typescript
{
  totalViews: number;
  totalPosts: number;
  totalComments: number;
  lastUpdated: string;
}
```

## API 端点

### 文章 API

- `GET /api/posts` - 获取所有文章列表
- `GET /api/posts/[id]` - 获取单篇文章详情
- `GET /api/posts/slug/[slug]` - 通过 slug 获取文章
- `POST /api/posts` - 创建新文章（需要认证）
- `PUT /api/posts/[id]` - 更新文章（需要认证）
- `DELETE /api/posts/[id]` - 删除文章（需要认证）

### 评论 API

- `GET /api/comments?postId=[postId]` - 获取文章评论
- `POST /api/comments` - 提交新评论
- `PUT /api/comments/[id]/approve` - 审核评论（需要认证）

### 统计 API

- `GET /api/stats` - 获取站点统计数据
- `POST /api/stats/view` - 记录页面访问

## 性能优化策略

### 1. 边缘缓存

- 静态资源：长期缓存 (365天)
- API 响应：短期缓存 (5-30分钟)
- HTML 页面：中等缓存 (1小时)

### 2. 代码优化

- 路由级别代码分割
- 组件懒加载
- 图片优化 (Next.js Image 组件)

### 3. 网络优化

- HTTP/2 和 HTTP/3 支持
- Brotli 压缩
- CDN 全球分发

## 动画系统

### GSAP 核心特性

- 时间线动画编排
- ScrollTrigger 滚动触发动画
- 批量动画和交错效果
- 性能优化的动画循环

### 动画场景

- 页面加载动画
- 滚动视差效果
- 元素进入动画
- 交互动效反馈

## 评分维度

### 创意卓越

✅ GSAP 高级动画系统
✅ 3D 视觉效果和粒子背景
✅ 创新的交互设计
✅ 流畅的页面过渡

### 应用价值

✅ 完整的博客功能
✅ 评论和统计系统
✅ SEO 友好
✅ 移动端完美适配

### 技术探索

✅ ESA Edge Functions
✅ Edge KV Storage
✅ 智能边缘缓存
✅ 性能优化最佳实践

## 常见问题

### Q: 如何添加新文章？

A: 登录管理后台（/admin/login，默认账号：admin/admin123）使用完整的管理界面创建、编辑和管理文章。

### Q: 如何配置自定义域名？

A: 在 ESA Pages 控制台添加域名，然后按照提示配置 DNS 解析。

### Q: 边缘存储的容量限制是多少？

A: 单个命名空间最大 1GB，单值最大 1.8MB。

### Q: 如何备份博客数据？

A: 可以使用 KV 存储的 API 导出数据到本地或 GitHub 仓库。

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 联系方式

- 作者: [您的名字]
- 邮箱: [您的邮箱]
- GitHub: [您的 GitHub]

---

**本项目由[阿里云ESA](https://www.aliyun.com/product/esa)提供加速、计算和保护**

![](https://img.alicdn.com/imgextra/i3/O1CN01H1UU3i1Cti9lYtFrs_!!6000000000139-2-tps-7534-844.png)
