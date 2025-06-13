<template>
  <header class="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
    <LanguageSwitcher />
    
    <div class="px-4 py-6 text-center sm:py-8 lg:py-12">
      <div class="mx-auto max-w-4xl">
        <div class="text-2xl font-bold mb-2 sm:text-3xl lg:text-4xl logo-glow">
          🔮 Teller.eu.org
        </div>
        <div class="text-sm opacity-90 font-medium sm:text-base lg:text-lg">
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