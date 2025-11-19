package handlers

import (
	"todo-app/config"
	"todo-app/models"
	"todo-app/utils"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *gin.Context) {
	var user models.RegisterRequest

	err := c.ShouldBindJSON(&user)
	if err != nil {
		c.JSON(200, gin.H{
			"code": 400,
			"message": "register format err" + err.Error(),
		})
		return
	}

	var isExist int

	if err = config.DB.QueryRow("SELECT COUNT(*) FROM users WHERE username = ?", user.Username).
	Scan(&isExist); err != nil {
		c.JSON(200, gin.H{
			"code": 500,
			"message": "database select username error" + err.Error(),
		})
		return
	}

	if isExist > 0 {
		c.JSON(200, gin.H{
			"code": 409,
			"message": "用户名已存在",
		})
		return
	}

	//使用 bcrypt 加密密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(200, gin.H{
			"code": 500,
			"message": "password encryption failed",
		})
		return
	}

	//插入数据库
	result, err := config.DB.Exec("INSERT INTO users (username, password) VALUES (?, ?)", user.Username, string(hashedPassword))
	if err != nil {
		c.JSON(200, gin.H{
			"code": 500,
			"message": "database insert error" + err.Error(),
		})
		return
	}

	id, err := result.LastInsertId()
	if err != nil {
		c.JSON(200, gin.H{
			"code":    500,
			"message": "failed to get insert id: " + err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"code": 200,
		"message": "register success",
   		"data": gin.H{
        	"id": int(id),
        	"username": user.Username,
    	},
	})
}

func Login(c *gin.Context){
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(200, gin.H {
			"code": 400,
			"message": "login request error",
		})
		return
	}

	var user models.User
	if err := config.DB.QueryRow("SELECT id, username, password FROM users WHERE username = ?", req.Username).
	Scan(&user.ID,&user.Username, &user.Password); err != nil {
		c.JSON(200, gin.H {
			"code": 404,
			"message": "用户不存在",
		})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(200, gin.H {
			"code": 401,
			"message": "密码错误",
		})
		return
	}

	tokenResponse, err := utils.GenerateToken(user.ID, user.Username)
	if err != nil {
		c.JSON(200, gin.H {
			"code": 500,
			"message": "create token error" + err.Error(),
		})
		return
	}

	loginResponse := models.LoginResponse{
		Token: tokenResponse,
		User: models.User{
        ID: user.ID,
        Username: user.Username,
        // 不包含 Password
    },
	}

	c.JSON(200, gin.H{
		"code": 200,
		"data": loginResponse,
	})
}