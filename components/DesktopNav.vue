<template>
  <nav 
    class="desktop-nav sticky top-0 z-50 mystical-bg border-b border-white/10"
    role="navigation"
    :aria-label="t('navigation.desktopNav')"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Home Link -->
        <NuxtLink 
          :to="localePath('/')"
          class="flex items-center gap-3 text-xl font-bold mystical-text-primary hover:opacity-80 transition-all duration-200"
          :aria-label="t('navigation.home')"
        >
          <span class="text-2xl animate-pulse-soft">🔮</span>
          <span class="logo-glow">Teller</span>
        </NuxtLink>
        
        <!-- Navigation Links -->
        <div class="flex items-center gap-6">
          <NuxtLink 
            v-for="tool in tools" 
            :key="tool.name"
            :to="localePath(`/${tool.name}`)"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 mystical-text-primary hover:bg-white/10"
            :class="{
              'bg-white/15 border border-white/20': isActive(tool.name),
              'hover:bg-white/5': !isActive(tool.name)
            }"
            @click="handleNavClick(tool.name)"
          >
            <span class="text-lg">{{ tool.icon }}</span>
            <span>{{ t(tool.titleKey) }}</span>
          </NuxtLink>
        </div>
        
        <!-- Language Switcher -->
        <div class="flex items-center">
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
/* Desktop-only navigation with mystical theme */
.desktop-nav {
  display: none;
  backdrop-filter: blur(10px);
}

/* Show on screens 640px and above (desktop/tablet) */
@media (min-width: 640px) {
  .desktop-nav {
    display: block;
  }
}

/* Logo glow effect matching AppHeader */
.logo-glow {
  text-shadow: 
    0 0 20px rgba(255, 255, 255, 0.5),
    0 0 40px rgba(139, 92, 246, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Animation for the crystal ball emoji */
@keyframes pulse-soft {
  0%, 100% { 
    transform: scale(1);
    opacity: 1;
  }
  50% { 
    transform: scale(1.05);
    opacity: 0.9;
  }
}

.animate-pulse-soft {
  animation: pulse-soft 3s ease-in-out infinite;
}

/* Ensure proper layering */
nav {
  transform: translateZ(0);
  will-change: transform;
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .animate-pulse-soft {
    animation: none;
  }
  
  .logo-glow {
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
}
</style> 