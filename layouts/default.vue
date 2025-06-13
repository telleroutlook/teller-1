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
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 20px 25px 85px 25px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  position: relative;
  padding: 20px 0;
}
</style> 