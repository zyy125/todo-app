<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>📝 待办事项 - 登录</h1>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>用户名</label>
          <input 
            v-model="username" 
            type="text" 
            placeholder="请输入用户名"
            required
            autocomplete="username"
          >
        </div>

        <div class="form-group">
          <label>密码</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="请输入密码"
            required
            autocomplete="current-password"
          >
        </div>

        <!-- 错误提示 -->
        <div v-if="errorMsg" class="error-msg">
          <span>{{ errorMsg }}</span>
          <button type="button" class="close-btn" @click="errorMsg = ''">×</button>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <div class="auth-footer">
        还没有账号？
        <router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  errorMsg.value = ''
  
  console.log('🔵 开始登录...')
  
  if (!username.value || !password.value) {
    errorMsg.value = '请填写完整信息'
    console.log('❌ 表单验证失败:', errorMsg.value)
    return
  }

  loading.value = true

  try {
    console.log('🔵 调用 authStore.login...')
    const result = await authStore.login(username.value, password.value)
    
    console.log('🔵 登录结果:', result)
    
    loading.value = false

    if (result.code === 200) {
      console.log('✅ 登录成功，跳转...')
      router.push('/')
    } else {
      console.log('❌ 登录失败:', result.message)
      errorMsg.value = result.message || '登录失败'
      console.log('❌ errorMsg 设置为:', errorMsg.value)
      
      // 🔴 添加这个，确保错误消息不会被清空
      setTimeout(() => {
        console.log('❌ 5秒后 errorMsg 是:', errorMsg.value)
      }, 5000)
    }
  } catch (error) {
    console.log('💥 捕获异常:', error)
    loading.value = false
    errorMsg.value = '网络错误：' + (error.message || '请稍后重试')
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-card h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.error-msg {
  margin-bottom: 15px;
  padding: 12px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c33;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.close-btn {
  background: none;
  border: none;
  color: #c33;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #a00;
}
</style>