<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
    <div class="flex justify-around items-center px-2 py-3">
      <NuxtLink 
        v-for="tool in tools" 
        :key="tool.name"
        :to="localePath(`/${tool.name}`)"
        class="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        :class="{ 'text-blue-600 bg-blue-50': isActive(tool.name), 'text-gray-600': !isActive(tool.name) }"
        @click="handleNavClick(tool.name)"
      >
        <div class="text-lg sm:text-xl">{{ tool.icon }}</div>
        <span class="text-xs font-medium sm:text-xs">{{ t(tool.tabKey) }}</span>
      </NuxtLink>
    </div>
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

// Define navigation tools
const tools = ref<NavTool[]>([
  { name: 'tarot', icon: '🃏', tabKey: 'tarotTab' },
  { name: 'astrology', icon: '⭐', tabKey: 'astrologyTab' },
  { name: 'numerology', icon: '🔢', tabKey: 'numerologyTab' },
  { name: 'chinese-zodiac', icon: '🐉', tabKey: 'chineseZodiacTab' }
])

// Check if current route is active
const isActive = (toolName: string): boolean => {
  try {
    const fullPath = localePath(`/${toolName}`)
    return route.path === fullPath || route.path.includes(`/${toolName}`)
  } catch (error) {
    logger.logError('BottomNav.isActive', error as Error, { toolName })
    return false
  }
}

// Handle navigation clicks for logging
const handleNavClick = (toolName: string): void => {
  try {
    logger.logUserAction('Navigation clicked', { 
      tool: toolName, 
      currentPath: route.path,
      locale: locale.value 
    })
  } catch (error) {
    logger.logError('BottomNav.handleNavClick', error as Error, { toolName })
  }
}

// Component initialization
onMounted(() => {
  logger.logComponentInit('BottomNav', { 
    currentRoute: route.path,
    locale: locale.value 
  })
})
</script>

<style scoped>
/* Smooth hover transitions */
.nav-link {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Active state styling */
.router-link-active {
  color: rgb(37 99 235);
  background-color: rgb(239 246 255);
}

/* Touch device optimizations */
@media (pointer: coarse) {
  .flex {
    min-height: 60px;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
</style> 