import request from '@/utils/request'

export const todoAPI = {
  // 获取列表
  async getTodos(status = 'all', page = 1, pageSize = 6) {
    const data = await request.get('/todos', {
      params: { status, page, pageSize }
    })
    return data
  },

  // 创建
  async createTodo(title) {
    const data = await request.post('/todos', { title })
    return data
  },

  // 🆕 强制创建（跳过重复检查）
  async createTodoForce(title) {
    const data = await request.post('/todos?force=true', { title })
    return data
  },

  // 更新完成状态
  async updateTodo(id, completed) {
    const data = await request.put(`/todos/${id}`, { completed })
    return data
  },

  // 更新标题
  async updateTodoTitle(id, title) {
    const data = await request.patch(`/todos/${id}`, { title })
    return data
  },

  // 删除
  async deleteTodo(id) {
    const data = await request.delete(`/todos/${id}`)
    return data
  }
}