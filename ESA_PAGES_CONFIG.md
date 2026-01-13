# ESA Pages 部署配置指南

## 快速配置

### 1. 静态资源文件路径
**填写方式**：留空或填 `public`

**说明**：
- Next.js 会自动处理 `public/` 目录下的静态资源
- 无需在 ESA Pages 控制台手动配置
- 项目中的静态资源位于 `F:\Desktop\Blog\public\` 目录
- 例如：`/images/` 路径对应 `public/images/`

### 2. 函数文件路径
**填写方式**：`app/api`

**说明**：
- Next.js App Router 的 API 路由位于 `app/api/` 目录
- 所有 `.ts` 或 `.js` 文件会被自动识别为 Edge Functions
- 不需要单独指定每个路由

### 3. KV 命名空间 ID

#### 方式一：使用环境变量（推荐）

**步骤**：

1. 在 ESA Pages 控制台配置环境变量：
   ```
   变量名：KV_NAMESPACE_ID
   变量值：your-actual-kv-namespace-id

   变量名：KV_NAMESPACE_PREVIEW_ID
   变量值：your-preview-kv-namespace-id
   ```

2. `esa.jsonc` 中已配置为：
   ```jsonc
   "kv_namespaces": [
     {
       "binding": "BLOG_KV",
       "id": "${KV_NAMESPACE_ID}",
       "preview_id": "${KV_NAMESPACE_PREVIEW_ID}"
     }
   ]
   ```

3. ESA Pages 会在构建时自动替换环境变量

#### 方式二：直接填写 ID

**步骤**：

1. 在 ESA 控制台创建 KV 命名空间
2. 复制命名空间 ID（例如：`kvns-xxxxxxxxxxxx`）
3. 直接在 `esa.jsonc` 中填写：
   ```jsonc
   "kv_namespaces": [
     {
       "binding": "BLOG_KV",
       "id": "kvns-xxxxxxxxxxxx",
       "preview_id": "kvns-yyyyyyyyyyyy"
     }
   ]
   ```

---

## 完整配置示例

### ESA Pages 控制台配置表

| 配置项 | 填写值 | 说明 |
|--------|--------|------|
| **项目名称** | `esa-edge-blog` | 任意名称 |
| **构建命令** | `npm run build` | 固定 |
| **输出目录** | `.next` | 固定 |
| **Node.js 版本** | `20.x` | 或更高 |
| **静态资源路径** | `public` 或留空 | Next.js 自动处理 |
| **函数文件路径** | `app/api` | 固定 |

### 环境变量配置

| 变量名 | 值 | 必需 | 说明 |
|--------|-----|------|------|
| `KV_NAMESPACE_ID` | `kvns-xxxx` | 是 | 生产环境 KV ID |
| `KV_NAMESPACE_PREVIEW_ID` | `kvns-yyyy` | 否 | 预览环境 KV ID |

---

## 配置文件说明

### esa.jsonc 配置解读

```jsonc
{
  "$schema": "https://schema.esa.aliyun.com/pages-config.1.0.json",
  "name": "esa-edge-blog",
  "version": "1.0.0",

  // 构建配置
  "build": {
    "command": "npm run build",  // 构建命令
    "output": ".next"           // 输出目录（Next.js 默认）
  },

  // Edge Functions 配置
  "functions": [
    {
      "name": "api",              // 函数名称
      "source": "app/api",       // 源代码目录
      "runtime": "nodejs20.x"    // 运行时环境
    }
  ],

  // KV 命名空间绑定
  "kv_namespaces": [
    {
      "binding": "BLOG_KV",              // 绑定名称（代码中使用）
      "id": "${KV_NAMESPACE_ID}",        // 命名空间 ID
      "preview_id": "${KV_NAMESPACE_PREVIEW_ID}"  // 预览环境 ID
    }
  ],

  // 路由配置
  "routes": [
    {
      "pattern": "/api/*",     // API 路由
      "function": "api"
    },
    {
      "pattern": "/",          // 首页
      "function": "api"       // 使用 Next.js 处理
    },
    {
      "pattern": "/*",          // 其他页面
      "function": "api"       // 使用 Next.js 处理
    }
  ],

  // 环境变量
  "env": {
    "production": {
      "NODE_ENV": "production"
    },
    "preview": {
      "NODE_ENV": "development"
    }
  }
}
```

---

## 创建 KV 命名空间

### 步骤

1. **登录 ESA 控制台**
   - 访问：https://www.aliyun.com/product/esa
   - 进入 ESA Pages 项目设置

2. **创建 KV 命名空间**
   ```
   导航路径：项目 → 设置 → KV 存储
   点击：创建命名空间

   配置：
   - 名称：esa-blog-kv
   - 容量：1GB（免费额度）
   - 区域：全球（自动分配）
   ```

3. **获取命名空间 ID**
   ```
   创建后，在 KV 存储列表中可以看到：
   - 命名空间名称
   - 命名空间 ID（类似：kvns-1a2b3c4d5e6f7g8h）
   - 创建时间
   ```

4. **配置到环境变量**
   ```
   在 ESA Pages 控制台：
   项目 → 设置 → 环境变量

   添加：
   - KV_NAMESPACE_ID = kvns-1a2b3c4d5e6f7g8h
   ```

---

## 常见问题

### Q1: 静态资源路径需要填什么？

**A**: 推荐填写 `public` 或留空
- Next.js 会自动处理 `public/` 目录
- 填写 `public` 更明确
- 留空也可以正常工作

### Q2: 函数文件路径填 `app` 还是 `app/api`？

**A**: 填 `app/api`
- 指定到 API 路由的根目录
- Next.js 会自动识别该目录下的所有 `.ts`/`.js` 文件

### Q3: KV ID 可以用环境变量吗？

**A**: 可以，而且是推荐做法
- ✅ 使用环境变量更安全（不会暴露 ID 在代码中）
- ✅ 方便切换不同环境（生产/预览）
- ✅ `esa.jsonc` 中已配置为 `${KV_NAMESPACE_ID}`

### Q4: 路由配置中的 `function` 字段填什么？

**A**: 填写 `functions` 中定义的函数名称
- 当前配置中定义为 `api`
- 所以所有路由都指向 `api` 函数

### Q5: 如何验证 KV 绑定成功？

**A**: 部署后检查：
```bash
# 访问站点统计 API
curl https://your-domain.com/api/stats

# 如果返回数据，说明 KV 连接成功
{
  "success": true,
  "data": {
    "totalViews": 0,
    "totalPosts": 0,
    "totalComments": 0,
    "lastUpdated": "2026-01-13T..."
  }
}
```

---

## 配置清单

部署前确认以下配置：

- [ ] GitHub 仓库已连接
- [ ] 构建命令：`npm run build`
- [ ] 输出目录：`.next`
- [ ] Node.js 版本：`20.x` 或更高
- [ ] 静态资源路径：`public` 或留空
- [ ] 函数文件路径：`app/api`
- [ ] KV 命名空间已创建
- [ ] KV 绑定名称：`BLOG_KV`
- [ ] 环境变量 `KV_NAMESPACE_ID` 已配置（或直接填写）
- [ ] 路由配置正确

---

## 故障排查

### 问题 1：构建失败

**检查项**：
1. `package.json` 中是否有 `build` 脚本
2. 依赖是否完整（`node_modules`）
3. TypeScript 编译是否有错误

**解决方案**：
```bash
# 本地测试构建
npm run build

# 如果失败，修复错误后重新部署
```

### 问题 2：KV 连接失败

**检查项**：
1. KV 命名空间 ID 是否正确
2. 环境变量是否已保存
3. 绑定名称 `BLOG_KV` 是否与代码一致

**解决方案**：
- 在 ESA 控制台检查 KV 绑定状态
- 查看部署日志中的错误信息

### 问题 3：静态资源 404

**检查项**：
1. 文件是否在 `public/` 目录
2. 路径是否正确（不要包含 `public`）
3. 大小是否超过限制

**解决方案**：
- 确保文件路径：`/images/logo.jpg` 对应 `public/images/logo.jpg`

---

## 下一步

配置完成后：

1. **部署项目**
   - 点击 ESA Pages 控制台的"部署"按钮
   - 等待构建完成（1-3 分钟）

2. **验证功能**
   - 访问部署 URL
   - 测试管理后台登录
   - 检查 KV 存储连接

3. **提交参赛**
   - 准备 TXT 提交文件
   - 在天池平台提交作品

---

**需要帮助？**
- 赛事钉钉群：118400030886
- @ESA小助手
- 官方文档：https://help.aliyun.com/zh/edge-security-acceleration/esa/user-guide/functions-and-pages-quick-start
