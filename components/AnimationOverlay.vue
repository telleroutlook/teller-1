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
  const existingParticles = document.querySelectorAll('.particle, .particle-trail, .stardust, .magic-particle, .meteor-trail, .css-particle, .stardust-particle')
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
  }, 6000)
}

const runMysticalAnimation = (text: string, callback?: () => void) => {
  if (!isAnimeAvailable.value || !animatedTextRef.value || !flareRef.value) {
    console.log('Falling back to CSS animation due to missing dependencies')
    runFallbackAnimation(text, callback)
    return
  }

  console.log('Running anime.js v4 animation')

  try {
    // Create and animate particles first
    createAndAnimateParticles()
    
    // Animate flare with v4 syntax
    $anime.animate(flareRef.value, {
      scale: [1, 1.3, 1],
      opacity: [0.3, 0.9, 0.3],
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

    // Get spans for animation
    const spans = animatedTextRef.value?.querySelectorAll('span')
    
    if (spans && spans.length > 0) {
      // Entry animation with v4 syntax - designed for exactly 2.5 seconds
      $anime.animate(spans, {
        opacity: [0, 1],
        scale: [0, 1],
        translateY: ['100%', 0],
        rotate: [180, 0],
        duration: 1500, // Reduced to 1.5s for faster entry
        easing: 'easeOutExpo',
        delay: (el: any, i: number) => i * Math.min(50, 1000 / displayText.length), // Limited delay to control total time
        complete: () => {
          // Hold animation for exactly 3 seconds (定格时间 - increased for better visibility)
          console.log('Animation freeze period started - 3 seconds')
          setTimeout(() => {
            console.log('Animation freeze period ended, starting exit')
            // Exit animation after the 3-second freeze
            $anime.animate(spans, {
              opacity: 0,
              scale: 0.5,
              duration: 1500, // 1.5s exit
              easing: 'easeInExpo',
              delay: (el: any, i: number) => i * Math.min(30, 500 / displayText.length), // Faster exit
              complete: () => {
                // Final fade out overlay - 1 second
                $anime.animate('#animation-overlay', {
                  opacity: 0,
                  duration: 1000,
                  easing: 'easeInOutQuad',
                  complete: () => {
                    hideAnimation()
                    console.log('Animation completed - total ~7 seconds')
                    if (callback) setTimeout(callback, 50)
                  }
                })
              }
            })
          }, 3000) // 3-second freeze period (定格时间)
        }
      })
    } else {
      // Fallback if no spans found
      runFallbackAnimation(text, callback)
    }

  } catch (error) {
    console.error('Error in anime.js v4 animation:', error)
    runFallbackAnimation(text, callback)
  }
}

const createAndAnimateParticles = () => {
  if (!isAnimeAvailable.value) {
    console.log('Anime not available, creating fallback particles')
    createFallbackParticles()
    return
  }
  
  const overlay = document.getElementById('animation-overlay')
  if (!overlay) return

  console.log('Creating enhanced particle system with anime.js v4...')

  // 神秘色彩系统 - 增加更多绚丽颜色
  const mysticalColors = [
    '#FF0066', '#6600FF', '#00FF66', '#FF6600', '#0066FF',
    '#FF3399', '#9933FF', '#33FF99', '#FF9933', '#3399FF',
    '#FFD700', '#FF1493', '#00CED1', '#32CD32', '#FF6347',
    '#DA70D6', '#00FA9A', '#FF69B4', '#8A2BE2', '#20B2AA',
    '#FF4500', '#1E90FF', '#FFB6C1', '#98FB98', '#F0E68C'
  ]

  // 创建主要粒子群
  for (let i = 0; i < 120; i++) {
    const particle = document.createElement('div')
    particle.className = 'magic-particle'
    
    const size = Math.random() * 5 + 2  // 2-7px
    const color = mysticalColors[Math.floor(Math.random() * mysticalColors.length)]
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: 0;
      pointer-events: none;
      z-index: 10000;
      box-shadow: 0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}30;
    `
    
    overlay.appendChild(particle)
  }

  // 创建流星轨迹
  for (let i = 0; i < 30; i++) {
    const meteor = document.createElement('div')
    meteor.className = 'meteor-trail'
    
    const color = mysticalColors[Math.floor(Math.random() * mysticalColors.length)]
    const length = Math.random() * 40 + 30
    
    meteor.style.cssText = `
      position: absolute;
      width: 3px;
      height: ${length}px;
      background: linear-gradient(to bottom, transparent, ${color}, ${color}80, transparent);
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: 0;
      pointer-events: none;
      z-index: 9999;
      transform: rotate(${Math.random() * 360}deg);
      box-shadow: 0 0 8px ${color};
    `
    
    overlay.appendChild(meteor)
  }

  // 创建星尘粒子
  for (let i = 0; i < 40; i++) {
    const stardust = document.createElement('div')
    stardust.className = 'stardust-particle'
    
    const size = Math.random() * 3 + 1
    const color = mysticalColors[Math.floor(Math.random() * mysticalColors.length)]
    
    stardust.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: 0;
      pointer-events: none;
      z-index: 10001;
      clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
      box-shadow: 0 0 ${size * 4}px ${color};
    `
    
    overlay.appendChild(stardust)
  }

  try {
    console.log('Starting anime.js v4 particle animations...')
    
    // 动画主要粒子群 - 使用v4语法
    $anime.animate('.magic-particle', {
      opacity: [0, (el: any, i: number) => Math.random() * 0.9 + 0.3, 0],
      scale: [0, (el: any, i: number) => Math.random() * 2 + 0.5, 0.2],
      translateX: (el: any, i: number) => (Math.random() - 0.5) * 400,
      translateY: (el: any, i: number) => (Math.random() - 0.5) * 400,
      rotate: (el: any, i: number) => Math.random() * 720,
      duration: (el: any, i: number) => 3000 + Math.random() * 3000,
      delay: (el: any, i: number) => i * 40,
      easing: 'easeOutQuart',
      loop: true
    })

    // 动画流星轨迹
    $anime.animate('.meteor-trail', {
      opacity: [0, 0.9, 0],
      translateX: (el: any, i: number) => (Math.random() - 0.5) * 300,
      translateY: (el: any, i: number) => (Math.random() - 0.5) * 300,
      rotate: (el: any, i: number) => Math.random() * 360,
      scaleY: [1, 1.5, 0.8, 1],
      duration: (el: any, i: number) => 2000 + Math.random() * 2000,
      delay: (el: any, i: number) => i * 150,
      easing: 'easeOutCubic',
      loop: true
    })

    // 动画星尘粒子
    $anime.animate('.stardust-particle', {
      opacity: [0, 1, 0.7, 0],
      scale: [0, 1.8, 1, 0],
      rotate: [0, 360, 720],
      translateX: (el: any, i: number) => (Math.random() - 0.5) * 200,
      translateY: (el: any, i: number) => (Math.random() - 0.5) * 200,
      duration: (el: any, i: number) => 4000 + Math.random() * 2000,
      delay: (el: any, i: number) => i * 100,
      easing: 'easeInOutBack',
      loop: true
    })

    console.log('Anime.js v4 particle animations started successfully!')

  } catch (error) {
    console.error('Anime.js v4 particle animation failed, using fallback:', error)
    createFallbackParticles()
  }
}

// 纯CSS动画后备方案
const createFallbackParticles = () => {
  const overlay = document.getElementById('animation-overlay')
  if (!overlay) return

  console.log('Creating CSS fallback particles...')
  
  const colors = ['#FF0066', '#6600FF', '#00FF66', '#FF6600', '#0066FF']
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div')
    particle.className = 'css-particle'
    
    const size = Math.random() * 4 + 2
    const color = colors[Math.floor(Math.random() * colors.length)]
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: 0;
      pointer-events: none;
      z-index: 10000;
      animation: css-particle-float ${2 + Math.random() * 3}s ease-in-out infinite;
      animation-delay: ${Math.random() * 2}s;
      box-shadow: 0 0 ${size * 2}px ${color};
    `
    
    overlay.appendChild(particle)
  }
}

const hideAnimation = () => {
  isVisible.value = false
  
  // Clean up all particle types
  const particles = document.querySelectorAll('.particle, .particle-trail, .stardust, .magic-particle, .meteor-trail, .css-particle, .stardust-particle')
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

.particle, .magic-particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
  transition: all 0.3s ease;
}

.css-particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
}

.meteor-trail {
  position: absolute;
  pointer-events: none;
  z-index: 9999;
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

.stardust-particle {
  position: absolute;
  pointer-events: none;
  z-index: 10001;
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

@keyframes css-particle-float {
  0% {
    opacity: 0;
    transform: translateY(0px) translateX(0px) scale(0);
  }
  10% {
    opacity: 1;
    transform: translateY(-10px) translateX(5px) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-50px) translateX(25px) scale(1.2);
  }
  90% {
    opacity: 0.3;
    transform: translateY(-80px) translateX(45px) scale(0.8);
  }
  100% {
    opacity: 0;
    transform: translateY(-100px) translateX(50px) scale(0);
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