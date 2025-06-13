<template>
  <div class="container">
    <AppHeader />
    <main class="main-content">
      <slot />
    </main>
    <BottomNav />
    <AnimationOverlay />
  </div>
</template>

<script setup lang="ts">
// Simplified version - language switching will be enhanced later
onMounted(() => {
  if (process.client) {
    document.documentElement.lang = 'en'
    document.documentElement.dir = 'ltr'
  }
})
</script> 