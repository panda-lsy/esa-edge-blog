# ESA Pages 配置快速参考

## 📋 三个关键配置项

### 1️⃣ 静态资源文件路径

```
填写：public（或留空）
```

**原因**：
- Next.js 自动处理 `public/` 目录
- 无需额外配置
- 文件路径：`/images/logo.jpg` → 对应 `public/images/logo.jpg`

---

### 2️⃣ 函数文件路径

```
填写：app/api
```

**原因**：
- Next.js App Router 的 API 路由都在 `app/api/` 目录
- 所有 `.ts`/`.js` 文件自动识别为 Edge Functions
- 不需要分别配置每个路由

**示例**：
```
app/api/
├── admin/     → /api/admin/*
├── posts/      → /api/posts/*
├── comments/   → /api/comments/*
└── stats/      → /api/stats/*
```

---

### 3️⃣ KV 容器 ID（命名空间 ID）

#### ✅ 方式一：使用环境变量（推荐）

**ESA Pages 控制台配置**：
```
环境变量 → 添加变量

变量名：KV_NAMESPACE_ID
变量值：kvns-xxxxxxxxxxxx（您的实际 KV ID）
```

**esa.jsonc 已配置**：
```jsonc
"kv_namespaces": [
  {
    "binding": "BLOG_KV",
    "id": "${KV_NAMESPACE_ID}",        // 自动替换
    "preview_id": "${KV_NAMESPACE_PREVIEW_ID}"
  }
]
```

**优点**：
- ✅ 更安全（ID 不暴露在代码中）
- ✅ 方便切换环境
- ✅ 便于团队协作

---

#### ✅ 方式二：直接填写 ID

**获取 KV ID**：
1. ESA 控制台 → 项目 → 设置 → KV 存储
2. 创建命名空间（如：esa-blog-kv）
3. 复制命名空间 ID（例如：`kvns-1a2b3c4d5e6f`）

**在 esa.jsonc 填写**：
```jsonc
"kv_namespaces": [
  {
    "binding": "BLOG_KV",
    "id": "kvns-1a2b3c4d5e6f",        // 直接填写
    "preview_id": "kvns-preview-id"
  }
]
```

---

## 🎯 完整配置表

| 配置项 | 控制台填写值 | 说明 |
|--------|-------------|------|
| **静态资源路径** | `public` 或留空 | Next.js 自动处理 |
| **函数文件路径** | `app/api` | 固定值 |
| **构建命令** | `npm run build` | 固定值 |
| **输出目录** | `.next` | 固定值 |
| **KV 绑定名** | `BLOG_KV` | 代码中使用的名称 |
| **KV 命名空间 ID** | 见下方说明 | 见两种方式 |

---

## 🔧 配置步骤

### 步骤 1：连接 GitHub 仓库

```
ESA Pages 控制台
↓
创建新项目
↓
连接 GitHub
↓
选择：panda-lsy/esa-edge-blog
```

### 步骤 2：填写基本配置

```
项目名称：esa-edge-blog
构建命令：npm run build
输出目录：.next
Node.js 版本：20.x
静态资源路径：public（或留空）
函数文件路径：app/api
```

### 步骤 3：配置 KV 存储

**3.1 创建 KV 命名空间**
```
项目 → 设置 → KV 存储
↓
创建命名空间
↓
名称：esa-blog-kv
容量：1GB
```

**3.2 获取 KV ID**
```
创建后，复制命名空间 ID
格式：kvns-xxxxxxxxxxxx
```

**3.3 绑定 KV（二选一）**

方式 A（推荐）- 使用环境变量：
```
项目 → 设置 → 环境变量
↓
添加变量
↓
KV_NAMESPACE_ID = kvns-xxxxxxxxxxxx
```

方式 B - 直接填写：
```
修改 esa.jsonc：
"id": "kvns-xxxxxxxxxxxx"
```

### 步骤 4：部署

```
点击"部署"按钮
↓
等待构建完成（1-3 分钟）
↓
获得部署 URL
```

---

## ✅ 验证配置

### 检查点 1：构建成功
```
部署日志显示：
✓ Build completed successfully
✓ Functions compiled
✓ Static assets generated
```

### 检查点 2：KV 连接成功
```bash
# 测试统计 API（需要 KV）
curl https://your-domain.esa.aliyun.com/api/stats

# 预期返回：
{
  "success": true,
  "data": {
    "totalViews": 0,
    "totalPosts": 0,
    "totalComments": 0
  }
}
```

### 检查点 3：管理后台可用
```
访问：https://your-domain.esa.aliyun.com/admin/login
↓
使用默认账号登录
↓
用户名：admin
密码：admin123
↓
成功进入仪表板
```

---

## 🚨 常见问题

### Q: 静态资源路径填错会怎样？
**A**:
- 填错：静态资源 404
- 留空：也能正常工作（推荐留空或填 `public`）

### Q: 函数文件路径填错会怎样？
**A**:
- 填错：API 404 或无法访问
- 正确：`app/api`（这是固定值）

### Q: KV ID 填错会怎样？
**A**:
- 填错：API 返回 500 错误
- 错误信息：`KV storage not available`
- 解决：检查 KV ID 是否正确复制

### Q: 环境变量没生效？
**A**:
1. 检查变量名是否完全一致（区分大小写）
2. 确认已保存并重新部署
3. 查看部署日志确认变量是否读取

---

## 📞 获取帮助

- **赛事钉钉群**：118400030886
- **ESA 官方文档**：https://help.aliyun.com/zh/edge-security-acceleration/esa/user-guide/functions-and-pages-quick-start
- **配置详细文档**：查看 `ESA_PAGES_CONFIG.md`

---

**准备好了？**
🎉 点击"部署"按钮，开始您的 ESA Pages 之旅！
