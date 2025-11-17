package handlers

import (
	"fmt"
	"strconv"
	"strings"
	"todo-app/config"
	"todo-app/models"

	"github.com/gin-gonic/gin"
)

// GetTodos 获取待办事项列表
func GetTodos(c *gin.Context) {
	status := c.DefaultQuery("status", "all")
	pageStr := c.DefaultQuery("page", "1")
	pageSizeStr := c.DefaultQuery("pageSize", "6")

	// 验证 status 参数
	if status != "all" && status != "completed" && status != "pending" {
		c.JSON(400, gin.H{
			"code":    400,
			"message": "invalid status",
		})
		return
	}

	page, err := strconv.Atoi(pageStr)
	if page < 1 || err != nil {
		page = 1
	}

	pageSize, err := strconv.Atoi(pageSizeStr)
	if err != nil || pageSize < 1 || pageSize > 100 {
		pageSize = 8
	}

	// 构建查询
	var query string
	if status == "all" {
		query = "SELECT id, title, completed FROM todos"
	} else if status == "completed" {
		query = "SELECT id, title, completed FROM todos WHERE completed = 1"
	} else {
		query = "SELECT id, title, completed FROM todos WHERE completed = 0"
	}

	var totalSize int
	countQuery := strings.Replace(query, "SELECT id, title, completed", "SELECT COUNT(*)", 1) 
	err = config.DB.QueryRow(countQuery).Scan(&totalSize)

	totalPages := (totalSize + pageSize - 1) / pageSize
	if totalPages < 1 {
		totalPages = 1
	}

	offset := (page - 1) * pageSize
	query += fmt.Sprintf(" ORDER BY id DESC LIMIT %d OFFSET %d", pageSize, offset)

	// 执行查询
	rows, err := config.DB.Query(query)
	if err != nil {
		c.JSON(500, gin.H{
			"code":    500,
			"message": "database query error: " + err.Error(),
		})
		return
	}
	defer rows.Close()

	// 读取结果
	var filteredTodos []models.Todo
	for rows.Next() {
		var todo models.Todo
		err := rows.Scan(&todo.ID, &todo.Title, &todo.Completed)
		if err != nil {
			c.JSON(500, gin.H{
				"code":    500,
				"message": "database scan error: " + err.Error(),
			})
			return
		}
		filteredTodos = append(filteredTodos, todo)
	}

	// 统计信息
	var completedNum, pendingNum int
	config.DB.QueryRow("SELECT COUNT(*) FROM todos WHERE completed = 1").Scan(&completedNum)
	config.DB.QueryRow("SELECT COUNT(*) FROM todos WHERE completed = 0").Scan(&pendingNum)

	// 构建响应
	response := models.TodoListResponse{
		Todos:     filteredTodos,
		Total:     len(filteredTodos),
		Completed: completedNum,
		Pending:   pendingNum,
		Page: page,
		PageSize: pageSize,
		Totalpages: totalPages,
	}

	c.JSON(200, gin.H{
		"code": 200,
		"data": response,
	})
}

// CreateTodo 创建待办事项
func CreateTodo(c *gin.Context) {
	var request models.CreateTodoRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(400, gin.H{
			"code":    400,
			"message": "request format error",
		})
		return
	}

	// 验证标题不为空
	trimmed := strings.TrimSpace(request.Title)
	if trimmed == "" {
		c.JSON(400, gin.H{
			"code":    400,
			"message": "title is empty",
		})
		return
	}

	// 插入数据库
	result, err := config.DB.Exec("INSERT INTO todos (title, completed) VALUES (?, ?)",
		request.Title, false)
	if err != nil {
		c.JSON(500, gin.H{
			"code":    500,
			"message": "database insert error: " + err.Error(),
		})
		return
	}

	// 获取插入的 ID
	id, err := result.LastInsertId()
	if err != nil {
		c.JSON(500, gin.H{
			"code":    500,
			"message": "failed to get insert id: " + err.Error(),
		})
		return
	}

	// 构建响应
	todo := models.Todo{
		ID:        int(id),
		Title:     request.Title,
		Completed: false,
	}

	c.JSON(200, gin.H{
		"code":    200,
		"message": "create successfully",
		"data":    todo,
	})
}

// UpdateTodo 更新待办事项
func UpdateTodo(c *gin.Context) {
	// 解析 ID
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{
			"code":    400,
			"message": "id format error",
		})
		return
	}

	// 解析请求体
	var request models.UpdateTodoRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(400, gin.H{
			"code":    400,
			"message": "request format error",
		})
		return
	}

	// 验证 completed 字段
	if request.Completed == nil {
		c.JSON(400, gin.H{
			"code":    400,
			"message": "completed content is empty",
		})
		return
	}

	// 执行更新
	result, err := config.DB.Exec("UPDATE todos SET completed = ? WHERE id = ?",
		*request.Completed, id)
	if err != nil {
		c.JSON(500, gin.H{
			"code":    500,
			"message": "database update error: " + err.Error(),
		})
		return
	}

	// 检查是否找到记录
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		c.JSON(500, gin.H{
			"code":    500,
			"message": "failed to get rows affected: " + err.Error(),
		})
		return
	}

	if rowsAffected == 0 {
		c.JSON(404, gin.H{
			"code":    404,
			"message": "todo not found",
		})
		return
	}

	// 查询更新后的数据
	var updatedTodo models.Todo
	err = config.DB.QueryRow("SELECT id, title, completed FROM todos WHERE id = ?", id).
		Scan(&updatedTodo.ID, &updatedTodo.Title, &updatedTodo.Completed)
	if err != nil {
		c.JSON(500, gin.H{
			"code":    500,
			"message": "failed to query updated todo: " + err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"code":    200,
		"message": "update successfully",
		"data":    updatedTodo,
	})
}

// DeleteTodo 删除待办事项
func DeleteTodo(c *gin.Context) {
	// 解析 ID
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{
			"code":    400,
			"message": "id format error",
		})
		return
	}

	// 执行删除
	result, err := config.DB.Exec("DELETE FROM todos WHERE id = ?", id)
	if err != nil {
		c.JSON(500, gin.H{
			"code":    500,
			"message": "database delete error: " + err.Error(),
		})
		return
	}

	// 检查是否找到记录
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		c.JSON(500, gin.H{
			"code":    500,
			"message": "failed to get rows affected: " + err.Error(),
		})
		return
	}

	if rowsAffected == 0 {
		c.JSON(404, gin.H{
			"code":    404,
			"message": "todo not found",
		})
		return
	}

	c.JSON(200, gin.H{
		"code":    200,
		"message": "delete successfully",
	})
}