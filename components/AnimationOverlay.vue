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