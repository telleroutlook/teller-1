<template>
  <nav 
    class="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200/80 shadow-lg sm:hidden"
    role="navigation"
    :aria-label="t('navigation.bottomNav')"
  >
    <div class="flex justify-around items-center px-2 py-2 safe-area-inset-bottom">
      <NuxtLink 
        v-for="tool in tools" 
        :key="tool.name"
        :to="localePath(`/${tool.name}`)"
        class="group flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-95"
        :class="{ 
          'text-blue-700 bg-blue-50/80': isActive(tool.name), 
          'text-gray-700 hover:text-gray-900': !isActive(tool.name) 
        }"
        @click="handleNavClick(tool.name)"
        :aria-label="`${t('navigation.navigateTo')} ${t(tool.tabKey)}`"
      >
        <!-- Icon with enhanced animation -->
        <div 
          class="text-xl transition-all duration-200 group-hover:scale-110 group-active:scale-95"
          :class="{ 'scale-110': isActive(tool.name) }"
          role="img"
          :aria-label="tool.icon"
        >
          {{ tool.icon }}
        </div>
        
        <!-- Label with better typography -->
        <span 
          class="text-xs font-medium transition-colors duration-200 leading-tight text-center"
          :class="{ 
            'text-blue-700 font-semibold': isActive(tool.name),
            'text-gray-700 group-hover:text-gray-900': !isActive(tool.name)
          }"
        >
          {{ t(tool.tabKey) }}
        </span>
        
        <!-- Active indicator -->
        <div 
          v-if="isActive(tool.name)"
          class="absolute -top-px left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-700 rounded-full"
          aria-hidden="true"
        />
      </NuxtLink>
    </div>
    
    <!-- Bottom safe area for devices with home indicators -->
    <div class="h-safe-area-inset-bottom bg-white/95 backdrop-blur-lg" />
  </nav>
</template>

<script setup lang="ts">
interface NavTool {
  name: string
  icon: string
  tabKey: string
}

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { logger } = useLogger()

// Define navigation tools with enhanced accessibility
const tools = ref<NavTool[]>([
  { name: 'tarot', icon: '🃏', tabKey: 'tarotTab' },
  { name: 'astrology', icon: '⭐', tabKey: 'astrologyTab' },
  { name: 'numerology', icon: '🔢', tabKey: 'numerologyTab' },
  { name: 'chinese-zodiac', icon: '🐉', tabKey: 'chineseZodiacTab' }
])

// Enhanced active state checking with better error handling
const isActive = (toolName: string): boolean => {
  try {
    const fullPath = localePath(`/${toolName}`)
    return route.path === fullPath || route.path.includes(`/${toolName}`)
  } catch (error) {
    logger.logError('BottomNav.isActive', error as Error, { toolName })
    return false
  }
}

// Enhanced navigation click handler with haptic feedback
const handleNavClick = (toolName: string): void => {
  try {
    // Add haptic feedback for supported devices
    if ('vibrate' in navigator) {
      navigator.vibrate(10)
    }
    
    logger.logUserAction('Navigation clicked', { 
      tool: toolName, 
      currentPath: route.path,
      locale: locale.value,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.logError('BottomNav.handleNavClick', error as Error, { toolName })
  }
}

// Component initialization with enhanced logging
onMounted(() => {
  logger.logComponentInit('BottomNav', { 
    currentRoute: route.path,
    locale: locale.value,
    toolsCount: tools.value.length
  })
  
  // Add swipe gesture detection for enhanced mobile UX
  setupSwipeGestures()
})

// Setup swipe gestures for mobile navigation
const setupSwipeGestures = (): void => {
  if (!process.client) return
  
  let startX = 0
  let startY = 0
  const threshold = 50
  
  const nav = document.querySelector('nav[role="navigation"]')
  if (!nav) return
  
  nav.addEventListener('touchstart', (e: Event) => {
    const touchEvent = e as TouchEvent
    startX = touchEvent.touches[0].clientX
    startY = touchEvent.touches[0].clientY
  }, { passive: true })
  
  nav.addEventListener('touchend', (e: Event) => {
    const touchEvent = e as TouchEvent
    if (!touchEvent.changedTouches[0]) return
    
    const deltaX = touchEvent.changedTouches[0].clientX - startX
    const deltaY = touchEvent.changedTouches[0].clientY - startY
    
    // Only process horizontal swipes
    if (Math.abs(deltaY) > Math.abs(deltaX)) return
    
    const currentIndex = tools.value.findIndex(tool => isActive(tool.name))
    if (currentIndex === -1) return
    
    let nextIndex = currentIndex
    
    if (deltaX > threshold && currentIndex > 0) {
      // Swipe right - go to previous tool
      nextIndex = currentIndex - 1
    } else if (deltaX < -threshold && currentIndex < tools.value.length - 1) {
      // Swipe left - go to next tool
      nextIndex = currentIndex + 1
    }
    
    if (nextIndex !== currentIndex) {
      const nextTool = tools.value[nextIndex]
      navigateTo(localePath(`/${nextTool.name}`))
      handleNavClick(nextTool.name)
    }
  }, { passive: true })
}
</script>

<style scoped>
/* Enhanced mobile-first styles */
nav {
  /* Ensure proper layering above other content */
  transform: translateZ(0);
  will-change: transform;
}

/* Safe area support for modern mobile devices */
.safe-area-inset-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.h-safe-area-inset-bottom {
  height: env(safe-area-inset-bottom, 0);
}

/* Enhanced touch targets */
.group {
  min-height: 48px;
  min-width: 48px;
  position: relative;
}

/* Smooth transitions with better performance */
.group {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateZ(0);
}

/* Active state with enhanced visual feedback */
.group:active {
  transform: scale(0.95) translateZ(0);
}

/* Improved focus states for accessibility */
.group:focus-visible {
  outline: 2px solid rgb(59, 130, 246);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  nav {
    border-top-width: 2px;
    border-top-color: currentColor;
  }
  
  .group {
    border: 1px solid transparent;
  }
  
  .group:focus {
    border-color: currentColor;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}

/* Dark mode preparation */
@media (prefers-color-scheme: dark) {
  nav {
    background-color: rgb(17 24 39 / 0.95);
    border-color: rgb(55 65 81 / 0.8);
  }
  
  .group:hover {
    background-color: rgb(55 65 81 / 0.5);
  }
  
  .group:focus {
    background-color: rgb(55 65 81 / 0.5);
  }
}

/* Landscape orientation adjustments */
@media (orientation: landscape) and (max-height: 500px) {
  .group {
    gap: 0.125rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }
  
  .text-xl {
    font-size: 1rem;
  }
  
  .text-xs {
    font-size: 0.625rem;
  }
}
</style> 