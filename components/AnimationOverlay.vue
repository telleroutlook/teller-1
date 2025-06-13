<template>
  <div id="animation-overlay" :class="{ visible: isVisible }">
    <div id="animation-flare"></div>
    <div id="animated-text" ref="animatedTextRef"></div>
  </div>
</template>

<script setup lang="ts">
const isVisible = ref(false)
const animatedTextRef = ref<HTMLElement>()

const showAnimation = (text: string, callback?: () => void) => {
  isVisible.value = true
  
  // Clear previous content
  if (animatedTextRef.value) {
    animatedTextRef.value.innerHTML = ''
  }
  
  // This will be implemented with anime.js plugin
  // For now, just show the overlay
  setTimeout(() => {
    hideAnimation()
    if (callback) callback()
  }, 2000)
}

const hideAnimation = () => {
  isVisible.value = false
}

// Expose methods for parent components
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

#animation-flare {
  position: absolute;
  width: 60vmax;
  height: 60vmax;
  background: radial-gradient(circle, rgba(120, 80, 255, 0.3) 0%, rgba(120, 80, 255, 0) 70%);
  border-radius: 50%;
  filter: blur(20px);
  pointer-events: none;
  z-index: 9999;
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