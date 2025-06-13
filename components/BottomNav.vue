<template>
  <nav id="bottom-nav">
    <NuxtLink 
      :to="localePath('/tarot')" 
      class="nav-btn"
      @click="handleNavClick('tarot')"
      :class="{ active: isActive('/tarot') }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2"></rect>
        <line x1="12" y1="4" x2="12" y2="20"></line>
        <line x1="4" y1="12" x2="20" y2="12"></line>
      </svg>
      <span>{{ t('tarotTab') }}</span>
    </NuxtLink>
    <NuxtLink 
      :to="localePath('/astrology')" 
      class="nav-btn"
      @click="handleNavClick('astrology')"
      :class="{ active: isActive('/astrology') }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
      </svg>
      <span>{{ t('astrologyTab') }}</span>
    </NuxtLink>
    <NuxtLink 
      :to="localePath('/numerology')" 
      class="nav-btn"
      @click="handleNavClick('numerology')"
      :class="{ active: isActive('/numerology') }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 7V4h16v3"></path>
        <path d="M9 20h6"></path>
        <path d="M12 4v16"></path>
      </svg>
      <span>{{ t('numerologyTab') }}</span>
    </NuxtLink>
    <NuxtLink 
      :to="localePath('/chinese-zodiac')" 
      class="nav-btn"
      @click="handleNavClick('chinese-zodiac')"
      :class="{ active: isActive('/chinese-zodiac') }"
    >
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
const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

// Import logger composable
const { logger, LogCategory } = useLogger()

// Log component initialization
onMounted(() => {
  logger.logComponentInit('BottomNav', { 
    currentRoute: route.path,
    locale: locale.value 
  })
  
  // Validate locale paths on mount
  const tools = ['tarot', 'astrology', 'numerology', 'chinese-zodiac']
  tools.forEach(tool => {
    const path = localePath(`/${tool}`)
    logger.debug(LogCategory.ROUTE, `Generated path for ${tool}`, { 
      tool, 
      path, 
      locale: locale.value 
    })
  })
})

// Watch for locale changes
watch(locale, (newLocale, oldLocale) => {
  logger.logLanguageChange(oldLocale || 'unknown', newLocale)
  
  // Re-validate paths after locale change
  const tools = ['tarot', 'astrology', 'numerology', 'chinese-zodiac']
  tools.forEach(tool => {
    const path = localePath(`/${tool}`)
    logger.debug(LogCategory.ROUTE, `Updated path for ${tool} after locale change`, { 
      tool, 
      path, 
      locale: newLocale 
    })
  })
})

// Check if current route is active
const isActive = (path: string) => {
  try {
    const fullPath = localePath(path)
    const isCurrentActive = route.path === fullPath || route.path.endsWith(path)
    
    if (isCurrentActive) {
      logger.debug(LogCategory.ROUTE, `Active route detected`, { 
        path, 
        fullPath, 
        currentRoute: route.path 
      })
    }
    
    return isCurrentActive
  } catch (error) {
    logger.logError('BottomNav.isActive', error as Error, { path })
    return false
  }
}

// Handle navigation clicks
const handleNavClick = (tool: string) => {
  try {
    const targetPath = localePath(`/${tool}`)
    logger.logUserAction('Navigation clicked', { 
      tool, 
      targetPath, 
      currentPath: route.path,
      locale: locale.value 
    })
    
    // Validate the generated path
    if (!targetPath || targetPath === '/') {
      logger.logError('BottomNav.handleNavClick', 'Invalid path generated', { 
        tool, 
        targetPath,
        locale: locale.value 
      })
    }
  } catch (error) {
    logger.logError('BottomNav.handleNavClick', error as Error, { tool })
  }
}
</script>

<style scoped>
#bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(20, 10, 30, 0.95);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.nav-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 8px;
  min-width: 60px;
}

.nav-btn svg {
  width: 24px;
  height: 24px;
  stroke-width: 1.5;
  transition: all 0.3s ease;
}

.nav-btn:hover,
.nav-btn.active {
  color: #FCD34D;
  transform: scale(1.05);
  background-color: rgba(252, 211, 77, 0.1);
}

.nav-btn.active svg {
  stroke-width: 2;
}

.nav-btn span {
  font-weight: 500;
  letter-spacing: 0.025em;
}

/* RTL Support */
[dir="rtl"] #bottom-nav {
  direction: rtl;
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .nav-btn {
    padding: 6px 8px;
    font-size: 10px;
    min-width: 50px;
  }
  
  .nav-btn svg {
    width: 20px;
    height: 20px;
  }
}
</style> 