<template>
  <nav id="bottom-nav">
    <NuxtLink :to="localePath('/tarot')" class="nav-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2"></rect>
        <line x1="12" y1="4" x2="12" y2="20"></line>
        <line x1="4" y1="12" x2="20" y2="12"></line>
      </svg>
      <span>{{ t('tarotTab') }}</span>
    </NuxtLink>
    <NuxtLink :to="localePath('/astrology')" class="nav-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
      </svg>
      <span>{{ t('astrologyTab') }}</span>
    </NuxtLink>
    <NuxtLink :to="localePath('/numerology')" class="nav-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 7V4h16v3"></path>
        <path d="M9 20h6"></path>
        <path d="M12 4v16"></path>
      </svg>
      <span>{{ t('numerologyTab') }}</span>
    </NuxtLink>
    <NuxtLink :to="localePath('/chinese-zodiac')" class="nav-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"></path>
        <path d="M12 12a10.94 10.94 0 0 1-8.7-4.88"></path>
        <path d="M2.5 12.5a10.94 10.94 0 0 1 0-1.22"></path>
        <path d="M12 2.5a10.94 10.94 0 0 1 8.7 4.88"></path>
        <path d="M21.5 12.5a10.94 10.94 0 0 1 0 1.22"></path>
        <path d="M12 21.5a10.94 10.94 0 0 1-8.7-4.88"></path>
        <path d="M2.5 11.5a10.94 10.94 0 0 0 0 1.22"></path>
        <path d="M12 12a10.94 10.94 0 0 0 8.7 4.88"></path>
        <path d="M21.5 11.5a10.94 10.94 0 0 0 0-1.22"></path>
      </svg>
      <span>{{ t('chineseZodiacTab') }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Simplified localePath function
const localePath = (path: string) => path
</script> 