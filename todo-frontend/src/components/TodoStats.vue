<template>
  <div class="stats">
    <div class="stat-item">
      <div class="stat-number">{{ stats.total || 0 }}</div>
      <div>总计</div>
    </div>
    <div class="stat-item">
      <div class="stat-number">{{ stats.completed || 0 }}</div>
      <div>已完成</div>
    </div>
    <div class="stat-item">
      <div class="stat-number">{{ stats.pending || 0 }}</div>
      <div>未完成</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    default: () => ({ total: 0, completed: 0, pending: 0 })
  }
})
</script>