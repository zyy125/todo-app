import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/TodoList.vue'),  // ← 改成 TodoList
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = authStore.isLoggedIn

  // 需要登录的页面
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  }
  // 已登录用户访问登录/注册页
  else if (to.meta.requiresGuest && isLoggedIn) {
    next('/')
  }
  else {
    next()
  }
})

export default router