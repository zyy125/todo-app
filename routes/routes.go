package routes

import (
	"todo-app/handlers"

	"github.com/gin-gonic/gin"
)

// SetupRoutes 设置所有路由
func SetupRoutes(r *gin.Engine) {
	// API 路由
	api := r.Group("/api")
	{
		api.GET("/todos", handlers.GetTodos)
		api.POST("/todos", handlers.CreateTodo)
		api.PUT("/todos/:id", handlers.UpdateTodo)
		api.PATCH("/todos/:id", handlers.UpdateTodoRequestTitle)
		api.DELETE("/todos/:id", handlers.DeleteTodo)
	}
}