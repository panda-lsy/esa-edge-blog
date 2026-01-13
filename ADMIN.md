# 管理后台文档

## 功能概览

### 📊 仪表板
- 网站数据统计（文章数、阅读量、评论数）
- 最新文章预览
- 评论统计（待审核、已通过、垃圾评论）
- 快捷操作入口

### 📝 文章管理
- **文章列表**：查看所有文章，支持搜索和状态筛选
- **新建文章**：Markdown 编辑器，支持预览
- **编辑文章**：修改文章内容、标签、分类、状态
- **删除文章**：确认后删除文章
- **状态管理**：草稿/已发布

### 💬 评论管理
- **评论列表**：查看所有评论
- **审核评论**：通过/拒绝评论
- **标记垃圾**：将评论标记为垃圾
- **删除评论**：删除不当评论
- **状态筛选**：全部/待审核/已通过/垃圾

### ⚙️ 设置
- 网站基本信息配置
- 作者信息配置
- 每页文章数设置
- 网站缓存清除

## 默认账号

```
用户名：admin
密码：admin123
```

## 使用指南

### 1. 登录管理后台

访问 `/admin/login`，使用默认账号登录。

### 2. 创建第一篇文章

1. 点击「文章管理」→「新建文章」
2. 填写文章标题、内容
3. 选择分类、添加标签
4. 选择状态（草稿/发布）
5. 点击「保存文章」

### 3. 管理评论

1. 进入「评论管理」页面
2. 查看待审核评论
3. 点击「通过」或「垃圾」进行审核
4. 点击「删除」删除不当评论

### 4. 配置网站

1. 进入「设置」页面
2. 修改网站名称、描述
3. 设置作者信息
4. 保存设置

## API 文档

### 认证相关

#### 登录
```
POST /api/admin/login

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "success": true,
  "data": {
    "token": "xxx",
    "admin": {
      "id": "admin_default",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

#### 验证 Token
```
POST /api/admin/verify
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "admin": {...}
  }
}
```

#### 登出
```
POST /api/admin/logout
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 文章管理

#### 获取所有文章
```
GET /api/posts
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [...],
  "total": 10
}
```

#### 创建文章
```
POST /api/posts
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "文章标题",
  "slug": "article-slug",
  "content": "文章内容（Markdown）",
  "excerpt": "文章摘要",
  "author": "Admin",
  "category": "技术",
  "tags": ["React", "Next.js"],
  "status": "published"
}
```

#### 更新文章
```
PUT /api/posts/{id}
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "新标题",
  "content": "新内容",
  "status": "published"
}
```

#### 删除文章
```
DELETE /api/posts/{id}
Headers: Authorization: Bearer {token}
```

### 评论管理

#### 获取评论列表
```
GET /api/comments?postId={postId}
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [...],
  "total": 5
}
```

#### 审核评论
```
POST /api/admin/comments/{id}/approve
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Comment approved successfully",
  "data": {...}
}
```

#### 标记为垃圾
```
PUT /api/admin/comments/{id}
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "spam"
}
```

#### 删除评论
```
DELETE /api/admin/comments/{id}
Headers: Authorization: Bearer {token}
```

### 仪表板数据

#### 获取仪表板数据
```
GET /api/admin/dashboard
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "posts": {
      "total": 20,
      "published": 15,
      "draft": 5
    },
    "comments": {
      "total": 50,
      "pending": 5,
      "approved": 43,
      "spam": 2
    },
    "stats": {
      "totalViews": 1000,
      "totalPosts": 20,
      "totalComments": 50,
      "lastUpdated": "2026-01-13T12:00:00.000Z"
    },
    "recentPosts": [...],
    "recentComments": [...]
  }
}
```

## 数据模型

### Admin
```typescript
interface Admin {
  id: string
  username: string
  email: string
  password: string
  role: 'admin' | 'editor'
  createdAt: string
}
```

### AuthSession
```typescript
interface AuthSession {
  token: string
  adminId: string
  expiresAt: string
}
```

### Comment
```typescript
interface Comment {
  id: string
  postId: string
  author: string
  email: string
  content: string
  createdAt: string
  status: 'pending' | 'approved' | 'spam'
}
```

## 安全注意事项

1. **Token 有效期**：7 天
2. **Token 存储**：使用 localStorage
3. **密码安全**：生产环境应使用加密存储
4. **权限验证**：所有管理 API 都需要 Token 验证
5. **XSS 防护**：Markdown 渲染时需要配置安全设置

## 功能规划

### 已实现 ✅
- [x] 管理员登录/登出
- [x] 仪表板数据统计
- [x] 文章列表展示
- [x] 文章创建/编辑/删除
- [x] 评论列表展示
- [x] 评论审核/删除
- [x] 基本设置功能
- [x] 深色/浅色主题

### 待实现 🚧
- [ ] 图片上传功能
- [ ] 文章预览功能
- [ ] Markdown 实时预览
- [ ] 批量操作
- [ ] 导出/导入数据
- [ ] 多管理员管理
- [ ] 操作日志
- [ ] 评论回复功能
- [ ] 防垃圾评论规则
- [ ] 备份/恢复功能

## 常见问题

### Q: 忘记管理员密码怎么办？
A: 需要在 KV 存储中直接修改管理员记录，或者联系部署人员重置。

### Q: 如何修改默认账号？
A: 在首次部署时，访问 API 初始化默认管理员账号，或在 KV 存储中直接修改。

### Q: Token 过期怎么办？
A: 自动跳转到登录页面，重新登录即可。

### Q: 可以创建多个管理员账号吗？
A: 当前版本只支持单个管理员，未来版本将支持多管理员管理。

### Q: 如何备份数据？
A: 可以通过 API 导出所有文章和评论数据，定期备份。

---

**提示**：生产环境部署前，请务必修改默认管理员密码！
