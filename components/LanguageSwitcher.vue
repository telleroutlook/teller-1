<template>
  <ClientOnly>
    <select 
      id="language-selector" 
      :value="locale" 
      @change="changeLanguage"
      :class="[
        'language-selector',
        { 'rtl-position': locale === 'ar' }
      ]"
    >
      <option value="en">English</option>
      <option value="zh">中文</option>
      <option value="hi">हिन्दी</option>
      <option value="fr">Français</option>
      <option value="ar">العربية</option>
    </select>
    
    <template #fallback>
      <!-- 服务端渲染时的占位符 -->
      <select 
        class="language-selector"
        disabled
      >
        <option value="en">English</option>
      </select>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()
const { logger } = useLogger()

// Initialize language from localStorage on component mount  
onMounted(async () => {
  const savedLocale = localStorage.getItem('preferred_language')
  
  if (savedLocale && ['en', 'fr', 'zh', 'hi', 'ar'].includes(savedLocale)) {
    // Only set if different from current locale to avoid unnecessary updates
    if (savedLocale !== locale.value) {
      await setLocale(savedLocale as 'en' | 'fr' | 'zh' | 'hi' | 'ar')
    }
  } else {
    // If no saved locale, save the current locale as default
    localStorage.setItem('preferred_language', locale.value)
  }
})

// Watch for locale changes to keep localStorage in sync
watch(locale, (newLocale) => {
  if (process.client) {
    localStorage.setItem('preferred_language', newLocale)
  }
})

const changeLanguage = async (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newLocale = target.value as 'en' | 'fr' | 'zh' | 'hi' | 'ar'
  
  // Validate the locale value
  if (!['en', 'fr', 'zh', 'hi', 'ar'].includes(newLocale)) {
    console.warn('Invalid locale selected:', newLocale)
    return
  }
  
  // Save the selected language to localStorage
  if (process.client) {
    localStorage.setItem('preferred_language', newLocale)
  }
  
  // Set the new locale
  await setLocale(newLocale)
  logger.logLanguageChange(locale.value, newLocale)
}
</script>

<style scoped>
.language-selector {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  width: auto;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  outline: none;
  cursor: pointer;
}

.language-selector:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.language-selector:focus {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
  outline: 2px solid rgba(147, 197, 253, 0.8);
  outline-offset: 2px;
}

/* Option styling for better visibility */
.language-selector option {
  color: #333;
  background: white;
  padding: 8px 12px;
  font-weight: 500;
}
</style> 