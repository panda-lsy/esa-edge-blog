# 部署指南

## 前置准备

1. **阿里云账号**
   - 注册阿里云账号：https://www.aliyun.com
   - 完成实名认证
   - 开通 ESA 服务

2. **GitHub 仓库**
   - 将项目代码推送到 GitHub 仓库
   - 确保仓库为公开状态（赛事要求）

3. **领取代金券（可选）**
   - 学生：通过「阿里云云工开物」领取 ¥300 无门槛抵扣金 + 10元代金券
   - 非学生：在 X.com/微博/小红书发布大赛动态，发送链接到钉钉群 @ESA小助手 领取 10元代金券

## ESA Pages 部署步骤

### 1. 创建 ESA Pages 项目

1. 登录 [阿里云 ESA Pages 控制台](https://www.aliyun.com/product/esa)
2. 点击"创建新项目"
3. 选择"连接 GitHub"
4. 授权阿里云访问您的 GitHub 仓库
5. 选择本项目的 GitHub 仓库
6. 配置项目信息：
   - **项目名称**：esa-edge-blog
   - **构建命令**：`npm run build`
   - **输出目录**：`.next`
   - **Node.js 版本**：20.x

### 2. 配置边缘存储（KV）

1. 在项目设置中，找到"KV 存储"选项
2. 创建新的 KV 命名空间：
   - **命名空间名称**：blog-kv-namespace
   - **容量**：1GB（免费额度）

3. 复制命名空间 ID，更新 `esa.jsonc`：
```jsonc
{
  "kv_namespaces": [
    {
      "binding": "BLOG_KV",
      "id": "你的命名空间ID",
      "preview_id": "你的预览环境命名空间ID"
    }
  ]
}
```

### 3. 配置环境变量（可选）

如果需要配置自定义域名或其他环境变量：

1. 在项目设置中找到"环境变量"
2. 添加以下变量：
   - `NEXT_PUBLIC_SITE_URL`: https://your-domain.com

### 4. 部署项目

1. 点击"部署"按钮
2. 等待构建完成（通常 1-3 分钟）
3. 获得部署 URL：`https://your-project.pages.esa.aliyun.com`

### 5. 配置自定义域名（可选）

1. 在项目设置中，点击"添加域名"
2. 输入您的域名（如：blog.yourdomain.com）
3. 配置 DNS 解析：
   - 方式1：添加 CNAME 记录指向 ESA Pages 提供的域名
   - 方式2：使用 NS 方式（推荐）
4. 等待 DNS 生效（通常 10-30 分钟）
5. ESA Pages 会自动配置 HTTPS 证书

## 初始化数据

部署成功后，您需要初始化一些博客文章数据。可以通过以下方式：

### 方式 1：使用 API 添加文章

```bash
# 添加第一篇文章
curl -X POST https://your-domain.com/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "欢迎使用 ESA Blog",
    "content": "<p>这是我的第一篇博客文章...</p>",
    "excerpt": "基于边缘计算的现代化博客平台",
    "author": "您的名字",
    "category": "技术",
    "tags": ["ESA", "Next.js", "边缘计算"]
  }'
```

### 方式 2：在 ESA 控制台的 KV 存储中直接添加

1. 在 ESA 控制台打开 KV 存储
2. 添加数据：
   - Key: `post:1`
   - Value:
```json
{
  "id": "1",
  "title": "欢迎使用 ESA Blog",
  "slug": "welcome-to-esa-blog",
  "content": "<p>这是我的第一篇博客文章...</p>",
  "excerpt": "基于边缘计算的现代化博客平台",
  "author": "您的名字",
  "publishedAt": "2026-01-13T12:00:00.000Z",
  "updatedAt": "2026-01-13T12:00:00.000Z",
  "tags": ["ESA", "Next.js", "边缘计算"],
  "category": "技术",
  "views": 0,
  "status": "published"
}
```

## 验证部署

### 1. 检查基本功能

访问您的网站 URL，验证以下功能：

- ✅ 首页正常加载
- ✅ 导航栏可以切换页面
- ✅ 博客列表页显示文章
- ✅ 博客详情页正常渲染
- ✅ 深色/浅色模式切换正常
- ✅ GSAP 动画效果流畅

### 2. 检查边缘函数

```bash
# 测试文章列表 API
curl https://your-domain.com/api/posts

# 测试站点统计 API
curl https://your-domain.com/api/stats
```

### 3. 检查性能

使用以下工具测试网站性能：

- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse](chrome://lighthouse/)
- [WebPageTest](https://www.webpagetest.org/)

目标指标：
- LCP (最大内容绘制) < 2.5s
- FID (首次输入延迟) < 100ms
- CLS (累积布局偏移) < 0.1

## 提交参赛作品

### 1. 准备提交文件

创建一个 TXT 文件，包含以下信息：

```
作品访问URL地址: https://your-domain.com
Github仓库地址: https://github.com/your-username/esa-edge-blog
作品说明:
本作品是基于阿里云ESA Pages和KV存储构建的现代化个人博客平台。
主要特性包括：
1. 创意卓越：使用GSAP实现流畅的页面动画和滚动效果
2. 应用价值：完整的博客功能、评论系统、访客统计
3. 技术探索：充分利用边缘计算、边缘存储和边缘缓存

技术栈：Next.js 14+、TypeScript、Tailwind CSS、GSAP、Edge Functions、Edge KV Storage
```

### 2. 在天池平台提交

1. 登录 [天池平台](https://tianchi.aliyun.com)
2. 进入 ESA Pages 边缘开发大赛页面
3. 点击左侧"提交结果"
4. 上传准备好的 TXT 文件
5. 提交完成！

### 3. 多作品提交（可选）

如果您有多个作品：

- 每个作品单独创建 TXT 文件
- 每个作品单独提交
- 每个作品都可以独立参与评分和获奖

## 参与人气作品奖（可选）

### GitHub Star 奖

1. 确保您的 GitHub 仓库是公开的
2. 在 README.md 中添加清晰的项目介绍
3. 在相关技术社区分享您的项目
4. 获取 20+ Stars 即可参与评选

### X.com 阅读量奖

1. 发布一条推文，包含：
   - 项目截图
   - 项目简介
   - ESA Pages 部署 URL
   - 话题：#阿里云ESA Pages #阿里云云工开物

2. 获取 1000+ 阅读量即可参与评选

### 小红书点赞数奖

1. 发布一条笔记，包含：
   - 项目截图
   - 项目介绍
   - ESA Pages 部署 URL
   - 话题：#阿里云ESA Pages #阿里云云工开物

2. 获取 100+ 点赞即可参与评选

### 登记人气作品信息

填写[上传人气作品文章信息](https://survey.aliyun.com/apps/zhiliao/6D-WsVpxI)

## 常见问题

### Q: 部署失败怎么办？

A: 检查以下几点：
1. 构建命令是否正确（`npm run build`）
2. 输出目录是否正确（`.next`）
3. package.json 中的依赖是否完整
4. 查看构建日志获取详细错误信息

### Q: KV 存储数据丢失怎么办？

A: ESA Pages 的 KV 存储是持久化的，数据不会丢失。如果需要备份：
1. 定期通过 API 导出数据
2. 在 GitHub 仓库中保存重要的初始数据

### Q: 如何更新网站？

A: 推送代码到 GitHub 后，ESA Pages 会自动重新部署：
```bash
git add .
git commit -m "更新内容"
git push
```

### Q: 如何查看访问日志？

A: 在 ESA Pages 控制台的"日志"选项中可以查看访问日志和错误日志。

## 联系支持

如果遇到问题：

1. 加入赛事钉钉群：118400030886
2. 在群内 @ESA小助手 寻求帮助
3. 查看 [ESA Pages 官方文档](https://help.aliyun.com/zh/edge-security-acceleration/esa/user-guide/functions-and-pages-quick-start)

---

**祝您在大赛中取得优异成绩！** 🎉
