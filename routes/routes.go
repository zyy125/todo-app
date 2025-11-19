package routes

import (
	"todo-app/handlers"
	"todo-app/middleware"

	"github.com/gin-gonic/gin"
)

// SetupRoutes 设置所有路由
func SetupRoutes(r *gin.Engine) {
	// API 路由
	api := r.Group("/api")
	{
		todos := api.Group("/todos") 
		todos.Use(middleware.AuthMiddleware())
		{
			todos.GET("", handlers.GetTodos)
			todos.POST("", handlers.CreateTodo)
			todos.PUT("/:id", handlers.UpdateTodo)
			todos.PATCH("/:id", handlers.UpdateTodoRequestTitle)
			todos.DELETE("/:id", handlers.DeleteTodo)
		}

		auth := api.Group("/auth")
		{
			auth.POST("/register", handlers.Register)
			auth.POST("/login", handlers.Login)
		}
	}
}