package models

// Todo 待办事项结构体
type Todo struct {
	ID        int    `json:"id"`
	Title     string `json:"title"`
	Completed bool   `json:"completed"`
}

// CreateTodoRequest 创建待办事项的请求
type CreateTodoRequest struct {
	Title string `json:"title" binding:"required"`
}

// UpdateTodoRequest 更新待办事项的请求
type UpdateTodoRequest struct {
	Completed *bool `json:"completed"`
}

// TodoListResponse 待办事项列表响应
type TodoListResponse struct {
	Todos     []Todo `json:"todos"`
	Total     int    `json:"total"`
	Completed int    `json:"completed"`
	Pending   int    `json:"pending"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Totalpages int `json:"totalPages"`
}