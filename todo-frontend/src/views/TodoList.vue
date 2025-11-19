<template>
  <div class="container">
    <!-- 头部 -->
    <div class="header">
      <div class="header-content">
        <h1>📝 我的待办事项</h1>
        <div class="user-info">
          <span>欢迎，{{ authStore.user?.username }}</span>
          <button class="btn-logout" @click="handleLogout">登出</button>
        </div>
      </div>
      <TodoStats :stats="store.stats" />
    </div>

    <!-- 输入区 -->
    <div class="input-section">
      <div class="input-container">
        <input 
          id="todoInput"
          v-model="newTodo"
          type="text" 
          placeholder="输入新的待办事项..."
          @keyup.enter="addTodo"
        >
        <button class="btn btn-primary" @click="addTodo">添加</button>
      </div>
    </div>

    <!-- 筛选 -->
    <TodoFilter 
      :current-filter="store.currentFilter"
      @filter="store.filterTodos"
    />

    <!-- 列表 -->
    <div class="todo-list">
      <div v-if="store.loading" class="loading">加载中...</div>
      <div v-else-if="!store.todos || store.todos.length === 0" class="empty-state">
        <p>暂无待办事项</p>
      </div>
      <TodoItem 
        v-else
        v-for="todo in store.todos" 
        :key="todo.id"
        :todo="todo"
        @toggle="store.toggleTodo"
        @delete="handleDelete"
        @showDetail="showDetail"
      />
    </div>

    <!-- 分页 -->
    <TodoPagination 
      :current-page="store.currentPage"
      :total-pages="store.totalPages"
      @changePage="store.goToPage"
    />

    <!-- 详情弹窗 -->
    <TodoModal 
      :show="showModal"
      :todo="selectedTodo"
      @close="showModal = false"
      @save="handleSave"
    />

    <!-- Toast 提示 -->
    <div 
      v-if="toast.visible" 
      :class="['toast-banner', `toast-${toast.type}`, { show: toast.show }]"
    >
      <div class="toast-content">
        <span class="toast-icon">{{ toast.type === 'success' ? '✅' : '❌' }}</span>
        <span class="toast-text">{{ toast.message }}</span>
      </div>
      <button class="toast-close" @click="hideToast">×</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'  // ← 添加这行
import { useTodoStore } from '@/stores/todo'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth' 
import TodoStats from '@/components/TodoStats.vue'
import TodoFilter from '@/components/TodoFilter.vue'
import TodoItem from '@/components/TodoItem.vue'
import TodoPagination from '@/components/TodoPagination.vue'
import TodoModal from '@/components/TodoModal.vue'
import '@/assets/style.css'

const router = useRouter()  // ← 添加这行
const store = useTodoStore()
const { toast, showToast, hideToast } = useToast()
const authStore = useAuthStore() 
const newTodo = ref('')
const showModal = ref(false)
const selectedTodo = ref(null)

onMounted(() => {
  store.loadTodos()
})

// 新增登出方法
const handleLogout = () => {
  if (confirm('确定要登出吗？')) {
    authStore.logout()
    router.push('/login')
  }
}

const addTodo = async () => {
const trimmedTitle = newTodo.value.trim()
  
  if (!trimmedTitle) {
    showToast('请输入待办事项内容', 'error')
    return
  }

  // 第一次尝试添加
  const result = await store.addTodo(trimmedTitle)

  // 🆕 检查是否重复
  if (result.code === 409) {
    const existingTitle = result.data?.existing || trimmedTitle
    const confirmAdd = confirm(
      `⚠️ 检测到重复的待办事项：\n\n"${existingTitle}"\n\n确定要继续添加吗？`
    )

    if (confirmAdd) {
      // 用户确认添加，调用强制添加接口
      const forceResult = await store.addTodoForce(trimmedTitle)
      if (forceResult.code === 200) {
        newTodo.value = ''
        showToast('添加成功', 'success', 2000)
      } else {
        showToast('添加失败：' + forceResult.message, 'error')
      }
    }
    return
  }
  if (result.code === 200) {
    newTodo.value = ''
    showToast('添加成功', 'success', 2000)  // 2秒后消失
  } else {
    showToast('添加失败：' + result.message, 'error')
  }
}

const handleDelete = async (id) => {
  if (!confirm('确定要删除吗？')) return
  
  const result = await store.deleteTodo(id)
  if (result.code === 200) {
    showToast('删除成功', 'success', 2000)
  } else {
    showToast('删除失败：' + result.message, 'error')
  }
}

const showDetail = (todo) => {
  selectedTodo.value = todo
  showModal.value = true
}

const handleSave = async (id, title) => {
  const result = await store.updateTitle(id, title)
  if (result.code === 200) {
    showToast('保存成功', 'success', 1500)  // 1.5秒后消失
  } else {
    showToast('保存失败：' + result.message, 'error')
  }
}
</script>


<style scoped>
/* 新增样式 */
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info span {
  color: #f5f6f5;
  font-size: 14px;
}

.btn-logout {
  padding: 8px 16px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: #ff3838;
  transform: translateY(-2px);
}

/* 原有样式保持不变 */
</style>