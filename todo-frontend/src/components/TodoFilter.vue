<template>
  <div class="filter-section">
    <button 
      :class="['filter-btn', { active: currentFilter === 'all' }]"
      @click="$emit('filter', 'all')"
    >
      全部
    </button>
    <button 
      :class="['filter-btn', { active: currentFilter === 'pending' }]"
      @click="$emit('filter', 'pending')"
    >
      未完成
    </button>
    <button 
      :class="['filter-btn', { active: currentFilter === 'completed' }]"
      @click="$emit('filter', 'completed')"
    >
      已完成
    </button>
  </div>
</template>

<script setup>
defineProps({
  currentFilter: {
    type: String,
    default: 'all'
  }
})

defineEmits(['filter'])
</script>