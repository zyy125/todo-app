# Todo List 待办事项管理系统

一个基于 Go + Gin + SQLite 的全栈待办事项应用。

## ✨ 功能特性

- ✅ 创建、查看、更新、删除待办事项（CRUD）
- ✅ 标记待办事项为已完成/未完成
- ✅ 按状态筛选（全部/已完成/未完成）
- ✅ 实时统计数据
- ✅ 数据持久化存储（SQLite）
- ✅ 响应式设计，美观的用户界面

## 🛠️ 技术栈

### 后端
- Go 1.x
- Gin Web Framework
- SQLite3
- RESTful API

### 前端
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

## 📁 项目结构

```
todo-app/
├── main.go                 # 程序入口
├── config/
│   └── database.go         # 数据库配置
├── models/
│   └── todo.go             # 数据模型
├── handlers/
│   └── todo.go             # 业务逻辑处理
├── routes/
│   └── routes.go           # 路由配置
├── middleware/
│   └── cors.go             # CORS 中间件
└── public/                 # 前端静态文件
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        ├── config.js       # 前端配置
        ├── api.js          # API 调用层
        ├── ui.js           # UI 操作层
        └── main.js         # 主逻辑
```

## 🚀 快速开始

### 环境要求

- Go 1.16 或更高版本
- SQLite3

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/zyy125/todo-app.git
cd todo-app
```

2. 安装依赖
```bash
go mod download
```

3. 运行项目
```bash
go run main.go
```

4. 在浏览器中访问
```
http://localhost:8080
```

## 📖 API 文档

### 获取待办事项列表
```
GET /api/todos?status=all|pending|completed
```

### 创建待办事项
```
POST /api/todos
Content-Type: application/json

{
  "title": "待办事项标题"
}
```

### 更新待办事项
```
PUT /api/todos/:id
Content-Type: application/json

{
  "completed": true
}
```

### 删除待办事项
```
DELETE /api/todos/:id
```

## 🎨 界面预览

（可以添加截图）

## 📝 开发日志

- [x] 基础 CRUD 功能
- [x] 状态筛选
- [x] 数据持久化
- [x] 前后端分离
- [x] 代码重构（多文件结构）
- [ ] 用户认证
- [ ] 待办事项分类
- [ ] 截止日期提醒

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👤 作者

**zyy125**

- GitHub: [@zyy125](https://github.com/zyy125)