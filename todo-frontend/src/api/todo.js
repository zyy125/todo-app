import axios from 'axios'

const API_BASE = '/api'  // Vite 会代理到 localhost:8080

export const todoAPI = {
  // 获取列表
  async getTodos(status = 'all', page = 1, pageSize = 6) {
    const { data } = await axios.get(`${API_BASE}/todos`, {
      params: { status, page, pageSize }
    })
    return data
  },

  // 创建
  async createTodo(title) {
    const { data } = await axios.post(`${API_BASE}/todos`, { title })
    return data
  },

  // 🆕 强制创建（跳过重复检查）
  async createTodoForce(title) {
    const { data } = await axios.post(`${API_BASE}/todos?force=true`, { title })
    return data
  },

  // 更新完成状态
  async updateTodo(id, completed) {
    const { data } = await axios.put(`${API_BASE}/todos/${id}`, { completed })
    return data
  },

  // 更新标题
  async updateTodoTitle(id, title) {
    const { data } = await axios.patch(`${API_BASE}/todos/${id}`, { title })
    return data
  },

  // 删除
  async deleteTodo(id) {
    const { data } = await axios.delete(`${API_BASE}/todos/${id}`)
    return data
  }
}