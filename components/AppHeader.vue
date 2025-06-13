<template>
  <header class="app-header">
    <LanguageSwitcher />
    <div class="logo">🔮 Teller.eu.org</div>
    <div class="tagline">{{ t('tagline') }}</div>
  </header>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

<style scoped>
.app-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  gap: 1rem;
}

.logo {
  font-size: 2rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.tagline {
  font-size: 1.1rem;
  font-style: italic;
  opacity: 0.9;
}

@media (min-width: 768px) {
  .app-header {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
  
  .logo {
    flex: 1;
    text-align: center;
  }
  
  .tagline {
    flex: 1;
    text-align: right;
  }
}
</style> 