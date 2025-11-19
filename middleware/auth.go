package middleware

import (
	"strings"
	"todo-app/utils"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware 认证中间件
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. 获取 Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(401, gin.H{
				"code":    401,
				"message": "未登录",
			})
			c.Abort() // 阻止继续执行
			return
		}

		// 2. 检查格式：Bearer <token>
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(401, gin.H{
				"code":    401,
				"message": "token 格式错误",
			})
			c.Abort()
			return
		}

		// 3. 解析 token
		token := parts[1]
		claims, err := utils.ParseToken(token)
		if err != nil {
			c.JSON(401, gin.H{
				"code":    401,
				"message": "token 无效或已过期",
			})
			c.Abort()
			return
		}

		// 4. 将用户信息存入上下文
		c.Set("user_id", claims.UserID)
		c.Set("username", claims.Username)

		// 5. 继续处理请求
		c.Next()
	}
}
