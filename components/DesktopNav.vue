<template>
  <nav 
    class="hidden sm:block sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200/50 shadow-sm"
    role="navigation"
    :aria-label="t('navigation.desktopNav')"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Home Link -->
        <NuxtLink 
          :to="localePath('/')"
          class="flex items-center gap-3 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-lg px-2 py-1"
          :aria-label="t('navigation.home')"
        >
          <span class="text-2xl">🔮</span>
          <span class="hidden lg:block">Teller</span>
        </NuxtLink>
        
        <!-- Desktop Navigation Links -->
        <div class="flex items-center gap-1 lg:gap-2">
          <NuxtLink 
            v-for="tool in tools" 
            :key="tool.name"
            :to="localePath(`/${tool.name}`)"
            class="group relative flex items-center gap-2 px-3 py-2 rounded-xl text-desktop-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            :class="{ 
              'text-blue-600 bg-blue-50/80 shadow-sm': isActive(tool.name), 
              'text-gray-700 hover:text-blue-600': !isActive(tool.name) 
            }"
            @click="handleNavClick(tool.name)"
            :aria-label="`${t('navigation.navigateTo')} ${t(tool.titleKey)}`"
          >
            <!-- Icon -->
            <span 
              class="text-lg transition-transform duration-200 group-hover:scale-110"
              :class="{ 'scale-110': isActive(tool.name) }"
              role="img"
              :aria-label="tool.icon"
            >
              {{ tool.icon }}
            </span>
            
            <!-- Label - Show on larger screens -->
            <span class="hidden md:block whitespace-nowrap">
              {{ t(tool.titleKey) }}
            </span>
            
            <!-- Short label for medium screens -->
            <span class="md:hidden text-xs font-semibold">
              {{ t(tool.shortKey) }}
            </span>
            
            <!-- Active indicator -->
            <div 
              v-if="isActive(tool.name)"
              class="absolute -bottom-px left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full"
              aria-hidden="true"
            />
          </NuxtLink>
        </div>
        
        <!-- Right side actions -->
        <div class="flex items-center gap-3">
          <!-- Language Switcher -->
          <LanguageSwitcher />
          
          <!-- Menu button for small screens -->
          <button
            @click="toggleMobileMenu"
            class="sm:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            :aria-label="t('navigation.toggleMenu')"
            :aria-expanded="isMobileMenuOpen"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                v-if="!isMobileMenuOpen"
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path 
                v-else
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile dropdown menu -->
    <div 
      v-if="isMobileMenuOpen"
      class="sm:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg animate-slide-down"
      role="menu"
    >
      <div class="px-4 py-3 space-y-1">
        <NuxtLink 
          v-for="tool in tools" 
          :key="`mobile-${tool.name}`"
          :to="localePath(`/${tool.name}`)"
          class="flex items-center gap-3 px-3 py-3 rounded-lg text-desktop-base font-medium transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600 focus:outline-none"
          :class="{ 
            'text-blue-600 bg-blue-50': isActive(tool.name), 
            'text-gray-700': !isActive(tool.name) 
          }"
          @click="handleMobileNavClick(tool.name)"
          role="menuitem"
        >
          <span class="text-xl">{{ tool.icon }}</span>
          <span>{{ t(tool.titleKey) }}</span>
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface NavTool {
  name: string
  icon: string
  titleKey: string
  shortKey: string
}

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { logger } = useLogger()

// Mobile menu state
const isMobileMenuOpen = ref(false)

// Define navigation tools with enhanced data
const tools = ref<NavTool[]>([
  { name: 'tarot', icon: '🃏', titleKey: 'tarotTitle', shortKey: 'tarotShort' },
  { name: 'astrology', icon: '⭐', titleKey: 'astrologyTitle', shortKey: 'astrologyShort' },
  { name: 'numerology', icon: '🔢', titleKey: 'numerologyTitle', shortKey: 'numerologyShort' },
  { name: 'chinese-zodiac', icon: '🐉', titleKey: 'chineseZodiacTitle', shortKey: 'chineseZodiacShort' }
])

// Enhanced active state checking
const isActive = (toolName: string): boolean => {
  try {
    const fullPath = localePath(`/${toolName}`)
    return route.path === fullPath || route.path.includes(`/${toolName}`)
  } catch (error) {
    logger.logError('DesktopNav.isActive', error as Error, { toolName })
    return false
  }
}

// Handle navigation clicks
const handleNavClick = (toolName: string): void => {
  try {
    logger.logUserAction('Desktop navigation clicked', { 
      tool: toolName, 
      currentPath: route.path,
      locale: locale.value,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.logError('DesktopNav.handleNavClick', error as Error, { toolName })
  }
}

// Handle mobile menu navigation
const handleMobileNavClick = (toolName: string): void => {
  isMobileMenuOpen.value = false
  handleNavClick(toolName)
}

// Toggle mobile menu
const toggleMobileMenu = (): void => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Close mobile menu when clicking outside
const closeMobileMenuOnOutsideClick = (event: Event): void => {
  const target = event.target as HTMLElement
  if (!target.closest('nav[role="navigation"]')) {
    isMobileMenuOpen.value = false
  }
}

// Close mobile menu on route change
watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})

// Setup event listeners
onMounted(() => {
  if (process.client) {
    document.addEventListener('click', closeMobileMenuOnOutsideClick)
  }
  
  logger.logComponentInit('DesktopNav', { 
    currentRoute: route.path,
    locale: locale.value,
    toolsCount: tools.value.length
  })
})

onUnmounted(() => {
  if (process.client) {
    document.removeEventListener('click', closeMobileMenuOnOutsideClick)
  }
})
</script>

<style scoped>
/* Enhanced desktop navigation styles */
nav {
  /* Ensure proper layering and backdrop effect */
  transform: translateZ(0);
  will-change: transform;
}

/* Smooth transitions for better UX */
.group {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced hover effects */
.group:hover {
  transform: translateY(-1px);
}

.group:active {
  transform: translateY(0);
}

/* Mobile menu animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-down {
  animation: slideDown 0.2s ease-out;
}

/* Focus styles for accessibility */
.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  nav {
    border-bottom: 2px solid #000;
    background: #fff;
  }
  
  .group:hover,
  .group:focus {
    background: #000;
    color: #fff;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .group,
  .animate-slide-down {
    transition: none;
    animation: none;
  }
}
</style> 