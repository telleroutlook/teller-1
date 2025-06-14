<template>
  <nav 
    class="desktop-nav sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
    style="background: white !important; border-bottom: 1px solid #e5e7eb !important; position: sticky !important; top: 0 !important; z-index: 50 !important;"
    role="navigation"
    :aria-label="t('navigation.desktopNav')"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style="max-width: 80rem !important; margin: 0 auto !important; padding: 0 16px !important;">
      <div class="flex justify-between items-center h-16" style="display: flex !important; justify-content: space-between !important; align-items: center !important; height: 64px !important; min-height: 64px !important;">
        <!-- Logo/Home Link -->
        <NuxtLink 
          :to="localePath('/')"
          class="flex items-center gap-3 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200"
          style="display: flex !important; align-items: center !important; gap: 12px !important; font-size: 20px !important; font-weight: bold !important; color: #1f2937 !important;"
          :aria-label="t('navigation.home')"
        >
          <span style="font-size: 24px !important;">🔮</span>
          <span style="display: block !important;">Teller</span>
        </NuxtLink>
        
        <!-- Navigation Links -->
        <div class="flex items-center gap-6" style="display: flex !important; align-items: center !important; gap: 24px !important;">
          <NuxtLink 
            v-for="tool in tools" 
            :key="tool.name"
            :to="localePath(`/${tool.name}`)"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
            :style="{
              'display': 'flex !important',
              'align-items': 'center !important',
              'gap': '8px !important',
              'padding': '8px 12px !important',
              'border-radius': '8px !important',
              'font-size': '14px !important',
              'font-weight': '500 !important',
              'color': isActive(tool.name) ? '#2563eb !important' : '#374151 !important',
              'background': isActive(tool.name) ? '#dbeafe !important' : 'transparent !important'
            }"
            @click="handleNavClick(tool.name)"
          >
            <span style="font-size: 18px !important;">{{ tool.icon }}</span>
            <span style="display: block !important;">{{ t(tool.titleKey) }}</span>
          </NuxtLink>
        </div>
        
        <!-- Language Switcher -->
        <div class="flex items-center" style="display: flex !important; align-items: center !important;">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface NavTool {
  name: string
  icon: string
  titleKey: string
}

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { logger } = useLogger()

// Define navigation tools
const tools = ref<NavTool[]>([
  { name: 'tarot', icon: '🃏', titleKey: 'tarotTitle' },
  { name: 'astrology', icon: '⭐', titleKey: 'astrologyTitle' },
  { name: 'numerology', icon: '🔢', titleKey: 'numerologyTitle' },
  { name: 'chinese-zodiac', icon: '🐉', titleKey: 'chineseZodiacTitle' }
])

// Check if navigation item is active
const isActive = (toolName: string): boolean => {
  try {
    const fullPath = localePath(`/${toolName}`)
    return route.path === fullPath || route.path.includes(`/${toolName}`)
  } catch (error) {
    return false
  }
}

// Handle navigation clicks
const handleNavClick = (toolName: string): void => {
  try {
    logger.logUserAction('Desktop navigation clicked', { 
      tool: toolName, 
      currentPath: route.path,
      locale: locale.value
    })
  } catch (error) {
    console.error('Navigation click error:', error)
  }
}

onMounted(() => {
  logger.logComponentInit('DesktopNav', { 
    currentRoute: route.path,
    locale: locale.value,
    toolsCount: tools.value.length
  })
})
</script>

<style scoped>
/* Desktop-only navigation with explicit media queries */
.desktop-nav {
  display: none !important;
  background: white !important;
  border-bottom: 1px solid #e5e7eb !important;
}

/* Show on screens 640px and above (desktop/tablet) */
@media (min-width: 640px) {
  .desktop-nav {
    display: block !important;
  }
}

/* Ensure proper layering */
nav {
  transform: translateZ(0);
  will-change: transform;
}
</style> 