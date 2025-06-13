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
const { locale } = useI18n()

// Set document language and direction
onMounted(() => {
  if (process.client) {
    updateDocumentAttributes()
  }
})

watch(locale, () => {
  if (process.client) {
    updateDocumentAttributes()
  }
})

const updateDocumentAttributes = () => {
  document.documentElement.lang = locale.value
  document.documentElement.dir = locale.value === 'ar' ? 'rtl' : 'ltr'
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 10px 15px 75px 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
}

.main-content {
  flex-grow: 1;
  position: relative;
}
</style> 