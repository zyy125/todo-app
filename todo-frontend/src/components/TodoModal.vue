<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content" @click.stop>
      <!-- 查看模式 -->
      <template v-if="!isEditing">
        <h3 class="modal-title">📋 待办事项详情</h3>
        <div class="modal-body">
          <div class="detail-section">
            <label class="detail-label">📝 内容</label>
            <div class="detail-content">{{ todo.title }}</div>
          </div>
          <div class="detail-section">
            <label class="detail-label">📊 状态</label>
            <div :class="['status-badge', todo.completed ? 'status-completed' : 'status-pending']">
              {{ todo.completed ? '✅ 已完成' : '⏳ 未完成' }}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn modal-btn-secondary" @click="isEditing = true">
            ✏️ 编辑
          </button>
          <button class="modal-btn modal-btn-primary" @click="closeModal">
            关闭
          </button>
        </div>
      </template>

      <!-- 编辑模式 -->
      <template v-else>
        <h3 class="modal-title">✏️ 编辑待办事项</h3>
        <div class="modal-body">
          <div class="edit-section">
            <div class="edit-header">
              <label class="edit-label">📝 内容</label>
              <span class="char-counter">{{ editTitle.length }} / 200</span>
            </div>
            <textarea 
              v-model="editTitle"
              class="edit-todo-input"
              rows="4"
              maxlength="200"
              placeholder="请输入待办事项内容..."
              @keydown.ctrl.enter="saveEdit"
            ></textarea>
            <div v-if="error" class="edit-error">{{ error }}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn" @click="isEditing = false; error = ''">
            取消
          </button>
          <button class="modal-btn modal-btn-primary" @click="saveEdit">
            💾 保存
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  todo: Object
})

const emit = defineEmits(['close', 'save'])

const isEditing = ref(false)
const editTitle = ref('')
const error = ref('')

watch(() => props.todo, (newTodo) => {
  if (newTodo) {
    editTitle.value = newTodo.title
    isEditing.value = false
    error.value = ''
  }
})

const closeModal = () => {
  isEditing.value = false
  error.value = ''
  emit('close')
}

const saveEdit = async () => {
  const trimmed = editTitle.value.trim()
  if (!trimmed) {
    error.value = '❌ 内容不能为空'
    return
  }
  if (trimmed.length > 200) {
    error.value = '❌ 内容不能超过 200 个字符'
    return
  }
  
  emit('save', props.todo.id, trimmed)
  closeModal()
}
</script>