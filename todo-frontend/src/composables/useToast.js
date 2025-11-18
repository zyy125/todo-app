import { ref } from 'vue'

const toast = ref({
  show: false,
  message: '',
  type: 'info',
  visible: false  // 新增：控制 DOM 是否渲染
})

let toastTimer = null
let hideTimer = null

export function useToast() {
  const showToast = (message, type = 'success', duration = 2000) => {
    // 清除旧的定时器
    if (toastTimer) clearTimeout(toastTimer)
    if (hideTimer) clearTimeout(hideTimer)
    
    // 先渲染 DOM
    toast.value = { 
      show: false,  // 先不显示（为了触发动画）
      message, 
      type,
      visible: true 
    }
    
    // 下一帧开始淡入动画
    setTimeout(() => {
      toast.value.show = true
    }, 10)
    
    // 延迟后开始淡出
    toastTimer = setTimeout(() => {
      toast.value.show = false  // 触发淡出动画
      
      // 动画结束后移除 DOM
      hideTimer = setTimeout(() => {
        toast.value.visible = false
        toast.value.message = ''
      }, 400)  // 对应 CSS 的 0.4s
    }, duration)
  }

  const hideToast = () => {
    toast.value.show = false
    if (toastTimer) clearTimeout(toastTimer)
    if (hideTimer) clearTimeout(hideTimer)
    
    hideTimer = setTimeout(() => {
      toast.value.visible = false
      toast.value.message = ''
    }, 400)
  }

  return {
    toast,
    showToast,
    hideToast
  }
}