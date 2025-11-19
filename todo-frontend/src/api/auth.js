import request from '@/utils/request'

export const authAPI = {
  // 注册
  async register(username, password) {
    const data = await request.post('/auth/register', {
      username,
      password
    })
    return data
  },

  // 登录
  async login(username, password) {
    const data = await request.post('/auth/login', {
      username,
      password
    })
    return data
  }
}