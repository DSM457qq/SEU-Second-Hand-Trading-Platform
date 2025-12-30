# 东南大学校园二手交易平台 - AI 编码代理指南

## 项目概览

**SEU 校园二手交易平台** 是一个 Flask + MySQL + 前端的校园电商系统。核心特点：
- **用户系统**：SEU 校园邮箱（@seu.edu.cn）验证的身份认证
- **交易流程**：商品发布 → 搜索浏览 → 购物车 → 订单 → 评价
- **核心技术**：Flask 2.3.3、MySQL 8.0+（utf8mb4）、ES6 JavaScript
- **环境启动**：`start-dev.bat` (Windows) 或 `python run.py` → http://localhost:5000

## 关键架构模式

### 1. API 响应格式（统一标准）

**所有后端 API 必须返回此格式**：
```json
{
  "code": 0,
  "message": "成功",
  "data": {},
  "timestamp": 1234567890
}
```

实现位置：[app/utils/response.py](../../app/utils/response.py) 中的 `api_response()` 函数

### 2. 前后端分层架构

| 层级 | 位置 | 职责 | 例子 |
|------|------|------|------|
| **API 层** | [app/api/](../../app/api/) | RESTful 端点，蓝图定义 | [items.py](../../app/api/items.py)：`/api/items` |
| **服务层** | [app/services/](../../app/services/) | 业务逻辑、数据验证 | [item_service.py](../../app/services/item_service.py) |
| **模型层** | [app/models.py](../../app/models.py) | SQLAlchemy ORM 定义 |  |
| **中间件** | [app/middleware/](../../app/middleware/) | 错误处理、认证检查 | [error_handler.py](../../app/middleware/error_handler.py) |

**重要**：API 入口在 [app/routes.py](../../app/routes.py) 的 `register_routes()` 中注册所有蓝图

### 3. 前端 API 调用设计

[app/static/js/api.js](../../app/static/js/api.js) 实现企业级 API 客户端：
- **请求拦截**：统一请求头、参数验证
- **自动重试**：网络错误/超时最多重试 3 次
- **错误分类**：ERROR_TYPES 定义了 6 种错误类型
- **使用方式**：`API.user.login(email, password)` / `API.item.search({...})`

### 4. 临时购物车机制

- **存储方式**：`sessionStorage`（浏览器关闭清空）
- **管理模块**：[app/static/js/main.js](../../app/static/js/main.js) 中的 `CartManager`
- **原因**：项目需求为临时购物车，不持久化到数据库

### 5. Mock API 系统

[app/static/js/mock-api.js](../../app/static/js/mock-api.js) 提供完整模拟数据：
- 启用方式：浏览器控制台 → `window.USE_MOCK_API = true; location.reload();`
- 用途：前端独立开发/测试（无需后端）
- 切换机制：条件判断选择真实 API 或 Mock API

## 编码规范

### Python 后端
1. **数据库操作**：优先使用 SQLAlchemy ORM，参数化查询防 SQL 注入
2. **响应标准**：所有端点返回 `{ code, message, data, timestamp }`
3. **错误处理**：在 [app/middleware/error_handler.py](../../app/middleware/error_handler.py) 统一捕获异常
4. **中文支持**：[app/__init__.py](../../app/__init__.py) 中已配置 `JSON_AS_ASCII = False`

### JavaScript 前端
1. **模块化**：使用 IIFE 模式，导出 `API`/`NotificationManager`/`CartManager` 等单一实例
2. **DOM 操作**：使用 `DOMUtils` 模块（在 [main.js](../../app/static/js/main.js) 中定义）
3. **表单验证**：`FormValidator` 检查 SEU 邮箱格式、密码强度等
4. **通知提示**：使用 `NotificationManager` 显示 toast 消息

### 数据库
1. **字符集**：MySQL 使用 `utf8mb4_unicode_ci`（支持中文、emoji）
2. **索引优化**：[database/schema.sql](../../database/schema.sql) 中已建立全文索引
3. **事务一致性**：订单操作需使用 InnoDB 事务保证库存一致性

## 关键文件参考

| 文件 | 核心用途 |
|------|---------|
| [config.py](../../config.py) | Flask 配置（需补充 MySQL 连接串） |
| [run.py](../../run.py) | 应用入口点 |
| [database/schema.sql](../../database/schema.sql) | 数据库完整结构（含中文注释） |
| [FRONTEND_API_DOCS.md](../../FRONTEND_API_DOCS.md) | 完整 API 接口规范（988 行） |
| [QUICK_START.md](../../QUICK_START.md) | 快速启动和测试指南 |

## 常见开发任务

### 添加新 API 端点
1. 在 [app/api/](../../app/api/) 对应模块（如 `items.py`）创建函数
2. 使用 `api_response(code, message, data)` 返回统一格式
3. 在 [app/routes.py](../../app/routes.py) 中注册蓝图：`app.register_blueprint(bp)`
4. 更新 [FRONTEND_API_DOCS.md](../../FRONTEND_API_DOCS.md) 文档

### 添加新页面模板
1. 在 [app/templates/](../../app/templates/) 创建 HTML 文件
2. 继承 `base.html`（含导航栏、页脚、公共脚本）
3. 在 [app/routes.py](../../app/routes.py) 添加路由：`@app.route('/new-page')`
4. 用 `<link>` 和 `<script>` 引入 [style.css](../../app/static/css/style.css) 和 API 模块

### 修改数据库模型
1. 编辑 [app/models.py](../../app/models.py)（定义 SQLAlchemy 模型）
2. 更新 [database/schema.sql](../../database/schema.sql)（对应 CREATE TABLE 语句）
3. 对应的 Service 文件添加查询方法

## 关键约束与注意事项

- ⚠️ **SEU 邮箱限制**：用户注册和登录需验证 `@seu.edu.cn` 域名
- ⚠️ **密码要求**：最少 8 字符，必须包含大小写和数字
- ⚠️ **没有外部支付接口**：支付、邮件发送目前都是模拟实现
- ⚠️ **数据库配置缺失**：[config.py](../../config.py) 需补充 MySQL 连接字符串
- ⚠️ **CSRF 防护**：已启用 Flask-WTF，表单需包含 CSRF token
- ⚠️ **全文搜索**：MySQL FULLTEXT 索引已建立在 `items.title` 和 `items.description`

## 测试方法

**前端独立测试**（不依赖后端）：
```javascript
// 浏览器控制台执行
window.USE_MOCK_API = true;
location.reload();
```

**单元测试**：运行 `pytest tests/` (若已实现)

**集成测试**：启动完整应用后，使用 [QUICK_START.md](../../QUICK_START.md) 中的浏览器控制台命令

## 数据流示例

```
用户访问 /items
  ↓
模板 item_detail.html 加载
  ↓
JavaScript 调用 API.item.search() 或 API.item.getDetail()
  ↓
api.js 发送 GET /api/items/search 请求（含参数）
  ↓
app/api/items.py 接收，调用 item_service.py 业务逻辑
  ↓
item_service 查询 app/models.py 的 Item 模型
  ↓
返回 { code: 0, message: "成功", data: [...], timestamp: ... }
  ↓
api.js 拦截响应，执行本地处理
  ↓
模板动态渲染结果到 DOM
```

---

**上次更新**：2025年12月30日 | **来源**：基于 CLAUDE.md 和代码库分析
