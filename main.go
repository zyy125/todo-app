package main

import (
	"todo-app/config"
	"todo-app/middleware"
	"todo-app/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// 初始化数据库
	config.InitDB()

	// 创建 Gin 引擎
	r := gin.Default()

	// 配置 CORS
	middleware.SetupCORS(r)

	// 设置路由
	routes.SetupRoutes(r)

	// 启动服务器
	println("🚀 Server is running on http://localhost:8080")
	r.Run(":8080")
}