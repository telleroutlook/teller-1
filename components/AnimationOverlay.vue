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
  
  // Remove existing particles
  const existingParticles = document.querySelectorAll('.particle')
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
    
    // Animate flare
    $anime({
      targets: flareRef.value,
      translateX: ['-50%', '50%'],
      translateY: ['-50%', '50%'],
      opacity: [0, 1, 0],
      duration: 4000,
      easing: 'easeInOutQuad',
      direction: 'alternate',
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

    // Create animation timeline
    const animationTimeline = $anime.timeline({
      complete: () => {
        $anime({
          targets: '#animation-overlay',
          opacity: 0,
          duration: 500,
          easing: 'easeInOutQuad',
          complete: () => {
            hideAnimation()
            // Stop perpetual animations
            $anime.remove([flareRef.value, '.particle'])
            if (callback) setTimeout(callback, 50)
          }
        })
      }
    })

    animationTimeline.add({
      targets: '#animated-text span',
      opacity: [0, 1],
      scale: [0, 1],
      translateY: ['100%', 0],
      rotateZ: [180, 0],
      duration: 1500,
      easing: 'easeOutExpo',
      delay: $anime.stagger(Math.max(50, 1000 / displayText.length))
    }).add({
      targets: '#animated-text span',
      opacity: 0,
      scale: 0.5,
      duration: 1000,
      easing: 'easeInExpo',
      delay: $anime.stagger(50, { start: 500 })
    }, '+=500')

  } catch (error) {
    console.error('Error in anime.js animation:', error)
    runFallbackAnimation(text, callback)
  }
}

const createAndAnimateParticles = () => {
  if (!isAnimeAvailable.value) return
  
  const overlay = document.getElementById('animation-overlay')
  if (!overlay) return

  const colors = ['#FFD700', '#FF69B4', '#00FFFF', '#9370DB', '#FFFFFF']
  
  for (let i = 0; i < 70; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    const size = Math.floor(Math.random() * 4) + 1 + 'px'
    
    Object.assign(particle.style, {
      width: size,
      height: size,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      opacity: '0',
      position: 'absolute',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: '10000'
    })
    
    overlay.appendChild(particle)
  }

  try {
    $anime({
      targets: '.particle',
      opacity: [
        { value: () => Math.random() * 0.8 + 0.2, duration: () => Math.random() * 600 + 200 },
        { value: 0, duration: () => Math.random() * 400 + 200 }
      ],
      scale: [
        { value: () => Math.random() * 1 + 0.5, duration: () => Math.random() * 700 + 300 },
        { value: 1, duration: () => Math.random() * 300 + 200 }
      ],
      duration: () => Math.random() * 1500 + 1500,
      easing: 'linear',
      loop: true,
      delay: (_el: HTMLElement, i: number) => i * 20
    })
  } catch (error) {
    console.error('Error animating particles:', error)
  }
}

const hideAnimation = () => {
  isVisible.value = false
  
  // Clean up particles
  const particles = document.querySelectorAll('.particle')
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
  background-color: rgba(10, 5, 20, 0.98);
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
  width: 60vmax;
  height: 60vmax;
  background: radial-gradient(circle, rgba(120, 80, 255, 0.3) 0%, rgba(120, 80, 255, 0) 70%);
  border-radius: 50%;
  filter: blur(20px);
  pointer-events: none;
  z-index: 9999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  text-shadow: 0 0 8px #fff, 0 0 15px #fff, 0 0 25px #ff00ff, 0 0 40px #ff00ff;
  margin: 0 0.1em;
}

.particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
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