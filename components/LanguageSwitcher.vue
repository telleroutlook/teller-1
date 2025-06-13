<template>
  <select 
    id="language-selector" 
    :value="locale" 
    @change="changeLanguage"
    class="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-sm font-medium backdrop-blur-sm focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 hover:bg-white/30"
  >
    <option value="en">English</option>
    <option value="zh">中文</option>
    <option value="hi">हिन्दी</option>
    <option value="fr">Français</option>
    <option value="ar">العربية</option>
  </select>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()

const changeLanguage = async (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newLocale = target.value as 'en' | 'fr' | 'zh' | 'hi' | 'ar'
  
  await setLocale(newLocale)
}
</script>

<style scoped>
/* Option styling for better visibility */
select option {
  color: #333;
  background: white;
  padding: 0.5rem;
}
</style> 