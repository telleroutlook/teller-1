<template>
  <div 
    id="simple-animation-overlay" 
    v-show="isVisible"
    :class="{ 'animate-fade-in': isVisible, 'animate-fade-out': !isVisible }"
  >
    <div 
      id="simple-animation-text" 
      ref="animatedTextRef"
      class="animated-text"
    ></div>
    
    <!-- 添加一些装饰性星星 - 只在客户端渲染 -->
    <ClientOnly>
      <div class="stars">
        <div class="star" v-for="i in 20" :key="i" :style="getStarStyle(i)">✨</div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const isVisible = ref(false)
const animatedTextRef = ref<HTMLElement>()

let animationTimeouts: (number | NodeJS.Timeout)[] = []
let isAnimationRunning = false

// 清理所有超时
const clearAnimationTimeouts = () => {
  animationTimeouts.forEach(timeout => clearTimeout(timeout))
  animationTimeouts = []
}

// 简单的伪随机数生成器，基于种子
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// 生成一致的星星样式（使用种子确保SSR和客户端一致）
const getStarStyle = (index: number) => {
  // 使用索引作为种子，确保相同索引总是产生相同的随机值
  const seed = index * 12345
  const top = seededRandom(seed + 1) * 100
  const left = seededRandom(seed + 2) * 100
  const delay = seededRandom(seed + 3) * 2
  const duration = 2 + seededRandom(seed + 4) * 3
  const opacity = seededRandom(seed + 5) * 0.8 + 0.2
  
  return {
    position: 'absolute' as const,
    top: `${top}%`,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity
  }
}

// 监听全局动画事件
onMounted(() => {
  if (process.client) {
    window.addEventListener('mystical-animation-start', handleAnimationStart as EventListener)
    console.log('SimpleAnimationOverlay mounted and listening for events')
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('mystical-animation-start', handleAnimationStart as EventListener)
    clearAnimationTimeouts()
    isAnimationRunning = false
  }
})

const handleAnimationStart = (event: Event) => {
  if (isAnimationRunning) {
    console.log('Animation already running, skipping')
    return
  }
  
  const customEvent = event as CustomEvent
  const { text, callbackId } = customEvent.detail
  
  console.log('SimpleAnimationOverlay received animation request:', { text, callbackId })
  
  showAnimation(text, () => {
    if (callbackId) {
      console.log('Animation completed, dispatching callback:', callbackId)
      window.dispatchEvent(new CustomEvent(callbackId))
    }
  })
}

const showAnimation = (text: string, callback?: () => void) => {
  if (!process.client || isAnimationRunning) {
    if (callback) callback()
    return
  }

  console.log('Starting animation for text:', text)
  
  isAnimationRunning = true
  isVisible.value = true
  clearAnimationTimeouts()
  
  if (animatedTextRef.value) {
    animatedTextRef.value.innerHTML = ''
  }

  nextTick(() => {
    runAnimation(text, callback)
  })
}

const runAnimation = (text: string, callback?: () => void) => {
  if (!animatedTextRef.value) return

  const displayText = text || '✨ 神秘时刻 ✨'
  
  // 创建文字元素
  displayText.split('').forEach((char, index) => {
    const span = document.createElement('span')
    span.innerHTML = char === ' ' ? '&nbsp;' : char
    span.className = 'animated-char'
    span.style.animationDelay = `${index * 100}ms`
    animatedTextRef.value?.appendChild(span)
  })

  // 显示动画后隐藏
  const hideTimeout = setTimeout(() => {
    hideAnimation()
    isAnimationRunning = false
    if (callback) {
      console.log('Animation completed, calling callback')
      callback()
    }
  }, 4000)
  
  animationTimeouts.push(hideTimeout)
}

const hideAnimation = () => {
  isVisible.value = false
  if (animatedTextRef.value) {
    animatedTextRef.value.innerHTML = ''
  }
}
</script>

<style scoped>
#simple-animation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(45deg, 
    rgba(30, 27, 75, 0.95), 
    rgba(74, 20, 140, 0.95), 
    rgba(139, 69, 19, 0.85)
  );
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(10px);
  transition: opacity 0.5s ease;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease forwards;
}

.animate-fade-out {
  animation: fadeOut 0.5s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

.animated-text {
  font-family: 'Arial', sans-serif;
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  text-shadow: 
    0 0 10px rgba(255, 255, 255, 0.8),
    0 0 20px rgba(255, 255, 255, 0.6),
    0 0 30px rgba(255, 255, 255, 0.4);
  letter-spacing: 0.1em;
  line-height: 1.2;
}

.animated-char {
  display: inline-block;
  margin: 0 0.05em;
  animation: charAppear 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(50px) scale(0.5);
}

@keyframes charAppear {
  0% {
    opacity: 0;
    transform: translateY(50px) scale(0.5) rotate(-10deg);
  }
  50% {
    opacity: 0.7;
    transform: translateY(-10px) scale(1.1) rotate(5deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0deg);
  }
}

.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.star {
  position: absolute;
  animation: sparkle 3s ease-in-out infinite;
  font-size: 1rem;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* 响应式设计 */
@media (max-width: 640px) {
  .animated-text {
    font-size: clamp(1.2rem, 5vw, 2rem);
    padding: 0 1rem;
  }
  
  .star {
    font-size: 0.8rem;
  }
}
</style> 