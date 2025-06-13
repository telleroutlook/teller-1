<template>
  <div id="animation-overlay" :class="{ visible: isVisible }">
    <div id="animation-flare" ref="flareRef"></div>
    <div id="animated-text" ref="animatedTextRef"></div>
  </div>
</template>

<script setup lang="ts">
const { $anime } = useNuxtApp()
const isVisible = ref(false)
const animatedTextRef = ref<HTMLElement>()
const flareRef = ref<HTMLElement>()

let currentCallbackId: string | null = null

// Check if anime is available
const isAnimeAvailable = computed(() => {
  const available = process.client && $anime && typeof $anime === 'function'
  if (process.client) {
    console.log('Anime availability check:', {
      process_client: process.client,
      $anime_exists: !!$anime,
      $anime_type: typeof $anime,
      available
    })
  }
  return available
})

// Listen for global animation events
onMounted(() => {
  if (process.client) {
    console.log('AnimationOverlay mounted, anime available:', isAnimeAvailable.value)
    window.addEventListener('mystical-animation-start', handleAnimationStart as EventListener)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('mystical-animation-start', handleAnimationStart as EventListener)
  }
})

const handleAnimationStart = (event: Event) => {
  const customEvent = event as CustomEvent
  const { text, callbackId } = customEvent.detail
  console.log('Animation start event received:', { text, callbackId })
  currentCallbackId = callbackId
  showAnimation(text, () => {
    // Notify completion through global event
    if (currentCallbackId) {
      window.dispatchEvent(new CustomEvent(currentCallbackId))
      currentCallbackId = null
    }
  })
}

const showAnimation = (text: string, callback?: () => void) => {
  if (!process.client) {
    if (callback) callback()
    return
  }

  console.log('showAnimation called:', { text, animeAvailable: isAnimeAvailable.value })
  
  isVisible.value = true
  
  // Clear previous content and particles
  if (animatedTextRef.value) {
    animatedTextRef.value.innerHTML = ''
  }
  
  // Remove existing particles of all types
  const existingParticles = document.querySelectorAll('.particle, .particle-trail, .stardust')
  existingParticles.forEach(p => p.remove())
  
  // Reset styles
  const overlay = document.getElementById('animation-overlay')
  if (overlay) {
    overlay.style.opacity = ''
  }

  nextTick(() => {
    if (isAnimeAvailable.value) {
      console.log('Using anime.js animation')
      runMysticalAnimation(text, callback)
    } else {
      console.log('Using fallback animation')
      runFallbackAnimation(text, callback)
    }
  })
}

const runFallbackAnimation = (text: string, callback?: () => void) => {
  console.log('Running fallback animation for:', text)
  // Simple fallback animation using CSS transitions
  if (!animatedTextRef.value) return

  const displayText = text || '✨'
  const fontSize = Math.max(24, Math.min((window.innerWidth / displayText.length) * 1.5, 80))
  
  displayText.split('').forEach((char, index) => {
    const span = document.createElement('span')
    span.innerHTML = char === ' ' ? '&nbsp;' : char
    span.style.fontSize = `${fontSize}px`
    span.style.opacity = '0'
    span.style.transform = 'translateY(100px) scale(0)'
    span.style.transition = `all 0.5s ease ${index * 50}ms`
    animatedTextRef.value?.appendChild(span)
  })

  // Trigger animations
  setTimeout(() => {
    const spans = animatedTextRef.value?.querySelectorAll('span')
    spans?.forEach(span => {
      ;(span as HTMLElement).style.opacity = '1'
      ;(span as HTMLElement).style.transform = 'translateY(0) scale(1)'
    })
  }, 100)

  // Hide animation after delay
  setTimeout(() => {
    const spans = animatedTextRef.value?.querySelectorAll('span')
    spans?.forEach(span => {
      ;(span as HTMLElement).style.opacity = '0'
      ;(span as HTMLElement).style.transform = 'translateY(-100px) scale(0)'
    })
    
    setTimeout(() => {
      hideAnimation()
      if (callback) callback()
    }, 500)
  }, 2000)
}

const runMysticalAnimation = (text: string, callback?: () => void) => {
  if (!isAnimeAvailable.value || !animatedTextRef.value || !flareRef.value) {
    console.log('Falling back to CSS animation due to missing dependencies')
    runFallbackAnimation(text, callback)
    return
  }

  console.log('Running anime.js animation')

  try {
    // Create and animate particles
    createAndAnimateParticles()
    
    // Animate flare - simplified approach
    $anime({
      targets: flareRef.value,
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.8, 0.3],
      duration: 4000,
      easing: 'easeInOutSine',
      loop: true
    })

    // Prepare text
    const displayText = text || '✨'
    const fontSize = Math.max(24, Math.min((window.innerWidth / displayText.length) * 1.5, 80))
    
    displayText.split('').forEach(char => {
      const span = document.createElement('span')
      span.innerHTML = char === ' ' ? '&nbsp;' : char
      span.style.fontSize = `${fontSize}px`
      animatedTextRef.value?.appendChild(span)
    })

    // Simplified animation approach for better compatibility
    const spans = animatedTextRef.value?.querySelectorAll('span')
    
    if (spans && spans.length > 0) {
      // Entry animation
      $anime({
        targets: spans,
        opacity: [0, 1],
        scale: [0, 1],
        translateY: ['100%', 0],
        rotate: [180, 0],
        duration: 1500,
        easing: 'easeOutExpo',
        delay: function(el: any, i: number) {
          return i * Math.max(50, 1000 / displayText.length)
        },
        complete: () => {
          // Exit animation after delay
          setTimeout(() => {
            $anime({
              targets: spans,
              opacity: 0,
              scale: 0.5,
              duration: 1000,
              easing: 'easeInExpo',
              delay: function(el: any, i: number) {
                return i * 50
              },
              complete: () => {
                // Fade out overlay
                $anime({
                  targets: '#animation-overlay',
                  opacity: 0,
                  duration: 500,
                  easing: 'easeInOutQuad',
                  complete: () => {
                    hideAnimation()
                    if (callback) setTimeout(callback, 50)
                  }
                })
              }
            })
          }, 2000)
        }
      })
    } else {
      // Fallback if no spans found
      runFallbackAnimation(text, callback)
    }

  } catch (error) {
    console.error('Error in anime.js animation:', error)
    runFallbackAnimation(text, callback)
  }
}

const createAndAnimateParticles = () => {
  if (!isAnimeAvailable.value) return
  
  const overlay = document.getElementById('animation-overlay')
  if (!overlay) return

  // 增强的神秘色彩调色板 - 更丰富的渐变色和特效色
  const mysticalColors = [
    '#FF0080', // 洋红色
    '#8000FF', // 紫色
    '#00FF80', // 青绿色
    '#FF8000', // 橙色
    '#0080FF', // 蓝色
    '#FF4080', // 粉红色
    '#80FF00', // 柠檬绿
    '#4080FF', // 天蓝色
    '#FF8040', // 珊瑚色
    '#8040FF', // 靛蓝色
    '#40FF80', // 春绿色
    '#FFD700', // 金色
    '#FF1493', // 深粉色
    '#00CED1', // 暗青色
    '#9370DB', // 中紫色
    '#32CD32', // 酸橙绿
    '#FF6347', // 番茄色
    '#4169E1', // 皇家蓝
    '#DA70D6', // 兰花紫
    '#00FA9A'  // 中春绿
  ]

  // 创建更多数量的粒子，增强视觉效果
  for (let i = 0; i < 150; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    
    // 大小不一的粒子 - 从1px到12px
    const size = Math.floor(Math.random() * 12) + 1
    const color = mysticalColors[Math.floor(Math.random() * mysticalColors.length)]
    
    // 添加发光效果和更丰富的样式
    Object.assign(particle.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      backgroundColor: color,
      opacity: '0',
      position: 'absolute',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: '10000',
      // 添加发光效果
      boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}`,
      // 添加渐变背景
      background: `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0.3) 50%, ${color} 100%)`,
      filter: 'brightness(1.2) saturate(1.5)'
    })
    
    overlay.appendChild(particle)
  }

  // 创建流动轨迹粒子
  for (let i = 0; i < 30; i++) {
    const trail = document.createElement('div')
    trail.className = 'particle-trail'
    
    const color = mysticalColors[Math.floor(Math.random() * mysticalColors.length)]
    
    Object.assign(trail.style, {
      width: '2px',
      height: `${Math.random() * 50 + 20}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
      opacity: '0',
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: '9998',
      borderRadius: '1px',
      boxShadow: `0 0 4px ${color}`
    })
    
    overlay.appendChild(trail)
  }

  // 创建星尘效果
  for (let i = 0; i < 50; i++) {
    const stardust = document.createElement('div')
    stardust.className = 'stardust'
    
    const size = Math.random() * 3 + 1
    const color = mysticalColors[Math.floor(Math.random() * mysticalColors.length)]
    
    Object.assign(stardust.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      backgroundColor: color,
      opacity: '0',
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: '9999',
      borderRadius: '50%',
      boxShadow: `0 0 ${size * 3}px ${color}`,
      transform: 'rotate(45deg)'
    })
    
    // 添加星形效果
    stardust.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
    
    overlay.appendChild(stardust)
  }

  try {
    // 动画常规粒子 - 增强流动效果
    const particles = document.querySelectorAll('.particle')
    particles.forEach((particle, index) => {
      const startX = parseFloat((particle as HTMLElement).style.left)
      const startY = parseFloat((particle as HTMLElement).style.top)
      
      $anime({
        targets: particle,
        opacity: [
          { value: 0, duration: 200 },
          { value: Math.random() * 0.9 + 0.3, duration: 300 },
          { value: Math.random() * 0.8 + 0.4, duration: 1000 },
          { value: 0, duration: 500 }
        ],
        scale: [
          { value: 0, duration: 200 },
          { value: Math.random() * 1.5 + 0.5, duration: 300 },
          { value: Math.random() * 2 + 0.8, duration: 1000 },
          { value: 0.2, duration: 500 }
        ],
        // 添加流动轨迹
        translateX: [
          { value: 0, duration: 0 },
          { value: (Math.random() - 0.5) * 200, duration: 2000 }
        ],
        translateY: [
          { value: 0, duration: 0 },
          { value: (Math.random() - 0.5) * 150, duration: 2000 }
        ],
        rotate: [0, Math.random() * 720 - 360],
        duration: Math.random() * 2000 + 2000,
        easing: 'easeInOutSine',
        loop: true,
        delay: index * 30
      })
    })

    // 动画流动轨迹
    const trails = document.querySelectorAll('.particle-trail')
    trails.forEach((trail, index) => {
      $anime({
        targets: trail,
        opacity: [
          { value: 0, duration: 100 },
          { value: 0.8, duration: 300 },
          { value: 0.6, duration: 1200 },
          { value: 0, duration: 400 }
        ],
        translateY: [
          { value: 0, duration: 0 },
          { value: -100, duration: 2000 }
        ],
        translateX: [
          { value: 0, duration: 0 },
          { value: (Math.random() - 0.5) * 50, duration: 2000 }
        ],
        scaleY: [1, 1.5, 0.8, 1],
        duration: Math.random() * 1500 + 2000,
        easing: 'easeInOutQuad',
        loop: true,
        delay: index * 100
      })
    })

    // 动画星尘效果
    const stardusts = document.querySelectorAll('.stardust')
    stardusts.forEach((stardust, index) => {
      $anime({
        targets: stardust,
        opacity: [
          { value: 0, duration: 300 },
          { value: 1, duration: 200 },
          { value: 0.7, duration: 800 },
          { value: 0, duration: 700 }
        ],
        scale: [
          { value: 0, duration: 300 },
          { value: 1.5, duration: 200 },
          { value: 1, duration: 800 },
          { value: 0, duration: 700 }
        ],
        rotate: [0, 360],
        duration: Math.random() * 3000 + 2000,
        easing: 'easeInOutBack',
        loop: true,
        delay: index * 80
      })
    })

  } catch (error) {
    console.error('Error animating particles:', error)
  }
}

const hideAnimation = () => {
  isVisible.value = false
  
  // Clean up all particle types
  const particles = document.querySelectorAll('.particle, .particle-trail, .stardust')
  particles.forEach(p => p.remove())
}

// Expose methods for parent components (backwards compatibility)
defineExpose({
  showAnimation,
  hideAnimation
})
</script>

<style scoped>
#animation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 25% 25%, rgba(138, 43, 226, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(75, 0, 130, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(25, 25, 112, 0.4) 0%, transparent 70%),
    linear-gradient(135deg, rgba(10, 5, 20, 0.95) 0%, rgba(25, 10, 35, 0.98) 100%);
  z-index: 9999;
  display: none;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.5s ease;
  overflow: hidden;
  pointer-events: none;
}

#animation-overlay.visible {
  display: flex;
  opacity: 1;
  pointer-events: all;
}

#animation-flare {
  position: absolute;
  width: 80vmax;
  height: 80vmax;
  background: 
    radial-gradient(circle, rgba(255, 0, 128, 0.4) 0%, rgba(128, 0, 255, 0.3) 30%, rgba(0, 255, 128, 0.2) 60%, transparent 80%),
    radial-gradient(circle, rgba(138, 43, 226, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(25px);
  pointer-events: none;
  z-index: 9999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: mystical-pulse 4s ease-in-out infinite alternate;
}

@keyframes mystical-pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.9;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0.7;
  }
}

#animated-text {
  position: relative;
  width: 90%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  text-align: center;
  z-index: 10001;
}

#animated-text span {
  position: relative;
  display: inline-block;
  color: white;
  font-weight: bold;
  pointer-events: none;
  text-shadow: 
    0 0 5px rgba(255, 255, 255, 0.8),
    0 0 10px rgba(255, 0, 255, 0.6),
    0 0 15px rgba(128, 0, 255, 0.5),
    0 0 20px rgba(255, 0, 128, 0.4),
    0 0 35px rgba(0, 255, 128, 0.3),
    0 0 50px rgba(255, 215, 0, 0.2);
  margin: 0 0.1em;
  animation: text-glow 3s ease-in-out infinite alternate;
}

@keyframes text-glow {
  0% {
    text-shadow: 
      0 0 5px rgba(255, 255, 255, 0.8),
      0 0 10px rgba(255, 0, 255, 0.6),
      0 0 15px rgba(128, 0, 255, 0.5),
      0 0 20px rgba(255, 0, 128, 0.4),
      0 0 35px rgba(0, 255, 128, 0.3),
      0 0 50px rgba(255, 215, 0, 0.2);
  }
  50% {
    text-shadow: 
      0 0 8px rgba(255, 255, 255, 1),
      0 0 15px rgba(255, 0, 255, 0.8),
      0 0 25px rgba(128, 0, 255, 0.7),
      0 0 35px rgba(255, 0, 128, 0.6),
      0 0 50px rgba(0, 255, 128, 0.5),
      0 0 75px rgba(255, 215, 0, 0.4);
  }
  100% {
    text-shadow: 
      0 0 10px rgba(255, 255, 255, 0.9),
      0 0 20px rgba(255, 0, 255, 0.7),
      0 0 30px rgba(128, 0, 255, 0.6),
      0 0 40px rgba(255, 0, 128, 0.5),
      0 0 60px rgba(0, 255, 128, 0.4),
      0 0 80px rgba(255, 215, 0, 0.3);
  }
}

.particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
  transition: all 0.3s ease;
}

.particle-trail {
  position: absolute;
  pointer-events: none;
  z-index: 9998;
  border-radius: 1px;
  animation: trail-flow 3s linear infinite;
}

.stardust {
  position: absolute;
  pointer-events: none;
  z-index: 9999;
  animation: stardust-twinkle 2s ease-in-out infinite alternate;
}

@keyframes trail-flow {
  0% {
    transform: translateY(100vh) translateX(0px);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-100px) translateX(50px);
    opacity: 0;
  }
}

@keyframes stardust-twinkle {
  0% {
    transform: scale(0.5) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: scale(0.8) rotate(360deg);
    opacity: 0.5;
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  #animated-text {
    width: 95%;
    padding: 0 10px;
  }
  
  #animated-text span {
    font-size: 24px !important;
    margin: 0 0.05em;
  }
  
  #animation-flare {
    width: 80vmax;
    height: 80vmax;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  #animation-overlay {
    background-color: rgba(0, 0, 0, 0.95);
  }
  
  #animated-text span {
    text-shadow: 0 0 4px #fff;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  #animation-overlay {
    transition: none;
  }
  
  #animated-text span {
    animation: none !important;
    transform: none !important;
  }
  
  #animation-flare {
    animation: none !important;
    transform: none !important;
  }
}
</style> 