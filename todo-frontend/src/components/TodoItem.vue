<template>
  <div :class="['todo-item', { completed: todo.completed }]">
    <input 
      type="checkbox" 
      class="todo-checkbox"
      :checked="todo.completed"
      @change="$emit('toggle', todo.id, !todo.completed)"
    >
    <span 
      class="todo-text" 
      @click="$emit('showDetail', todo)"
      title="点击查看详情"
    >
      {{ todo.title }}
    </span>
    <button 
      class="btn-delete" 
      @click="$emit('delete', todo.id)"
    >
      删除
    </button>
  </div>
</template>

<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})

defineEmits(['toggle', 'delete', 'showDetail'])
</script>