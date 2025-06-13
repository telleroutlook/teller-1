<template>
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
.language-selector {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 1001;
  width: auto;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  outline: none;
}

.language-selector:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.language-selector:focus {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
}

.language-selector.rtl-position {
  left: auto;
  right: 10px;
}

/* Option styling for better visibility */
.language-selector option {
  color: #333;
  background: white;
  padding: 8px 12px;
  font-weight: 500;
}

/* RTL support */
:global([dir="rtl"]) .language-selector {
  left: auto;
  right: 10px;
}
</style> 