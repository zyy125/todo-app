import { defineStore } from 'pinia'
import { todoAPI } from '@/api/todo'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [],
    stats: {
      total: 0,
      completed: 0,
      pending: 0
    },
    currentFilter: 'all',
    currentPage: 1,
    pageSize: 6,
    totalPages: 1,
    loading: false
  }),

  actions: {
    // 加载列表
    async loadTodos() {
      this.loading = true
      try {
        const result = await todoAPI.getTodos(
          this.currentFilter,
          this.currentPage,
          this.pageSize
        )
        
        if (result.code === 200) {
          this.todos = result.data.todos || []
          this.stats.total = result.data.total
          this.stats.completed = result.data.completed
          this.stats.pending = result.data.pending
          this.totalPages = result.data.totalPages
        }
      } catch (error) {
        console.error('加载失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 添加
    async addTodo(title) {
      const result = await todoAPI.createTodo(title)
      if (result.code === 200) {
        this.currentPage = 1
        await this.loadTodos()
      }
      return result
    },

     // 🆕 强制添加（跳过重复检查）
    async addTodoForce(title) {
      const result = await todoAPI.createTodoForce(title)
      if (result.code === 200) {
        this.currentPage = 1
        await this.loadTodos()
      }
      return result
    },

    // 切换完成状态
    async toggleTodo(id, completed) {
      const result = await todoAPI.updateTodo(id, completed)
      if (result.code === 200) {
        await this.loadTodos()
      }
      return result
    },

    // 更新标题
    async updateTitle(id, title) {
      const result = await todoAPI.updateTodoTitle(id, title)
      if (result.code === 200) {
        await this.loadTodos()
      }
      return result
    },

    // 删除
    async deleteTodo(id) {
      const result = await todoAPI.deleteTodo(id)
      if (result.code === 200) {
        await this.loadTodos()
      }
      return result
    },

    // 筛选
    filterTodos(filter) {
      this.currentFilter = filter
      this.currentPage = 1
      this.loadTodos()
    },

    // 翻页
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.loadTodos()
      }
    }
  }
})