import { defineStore } from 'pinia'
import { authAPI } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    // 注册
    async register(username, password) {
      try {
        const result = await authAPI.register(username, password)
        return result
      } catch (error) {
        return { code: 500, message: error.message }
      }
    },

    // 登录
    async login(username, password) {
      try {
        const result = await authAPI.login(username, password)
        
        if (result.code === 200) {
          this.token = result.data.token
          this.user = result.data.user
          
          // 保存到 localStorage
          localStorage.setItem('token', result.data.token)
          localStorage.setItem('user', JSON.stringify(result.data.user))
        }
        
        return result
      } catch (error) {
        return { code: 500, message: error.message }
      }
    },

    // 登出
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})