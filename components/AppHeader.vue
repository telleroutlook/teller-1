<template>
  <header class="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
    <div class="absolute top-4 left-4 z-10">
      <LanguageSwitcher />
    </div>
    
    <div class="px-4 py-8 text-center sm:py-12">
      <div class="mx-auto max-w-4xl">
        <div class="text-3xl font-bold mb-2 sm:text-4xl">
          🔮 Teller.eu.org
        </div>
        <div class="text-lg opacity-90 font-medium">
          {{ t('tagline') }}
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

<style scoped>
/* Additional custom styles if needed */
.logo-glow {
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}
</style> 