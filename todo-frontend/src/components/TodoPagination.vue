<template>
  <div v-if="totalPages > 1" class="pagination">
    <div class="pagination-wrapper">
      <button 
        class="pagination-btn pagination-btn-nav"
        :disabled="currentPage === 1"
        @click="$emit('changePage', currentPage - 1)"
      >
        <span class="nav-arrow">←</span>
        <span class="nav-text">上一页</span>
      </button>

      <div class="pagination-numbers">
        <button 
          v-for="page in visiblePages" 
          :key="page"
          :class="['pagination-btn', { active: page === currentPage }]"
          @click="$emit('changePage', page)"
        >
          {{ page }}
        </button>
      </div>

      <button 
        class="pagination-btn pagination-btn-nav"
        :disabled="currentPage === totalPages"
        @click="$emit('changePage', currentPage + 1)"
      >
        <span class="nav-text">下一页</span>
        <span class="nav-arrow">→</span>
      </button>
    </div>
    <div class="pagination-info">
      第 {{ currentPage }} / {{ totalPages }} 页
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: Number,
  totalPages: Number
})

defineEmits(['changePage'])

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(props.totalPages, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})
</script>