<template>
  <select 
    id="language-selector" 
    :value="locale" 
    @change="changeLanguage"
    class="language-switcher"
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
.language-switcher {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}
</style> 