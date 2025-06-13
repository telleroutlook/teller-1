<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Hero Section -->
    <section class="relative px-4 pt-8 pb-12 sm:px-6 lg:px-8 lg:pt-16 lg:pb-20">
      <div class="mx-auto max-w-4xl text-center">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          {{ t('heroTitle') }}
        </h1>
        <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg lg:text-xl lg:mt-6">
          {{ t('heroSubtitle') }}
        </p>
      </div>
    </section>

    <!-- Tools Grid -->
    <section class="px-4 pb-12 sm:px-6 lg:px-8 lg:pb-20">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-4 sm:gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-2">
          <div 
            v-for="tool in tools" 
            :key="tool.name"
            class="group relative transform overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl focus-within:scale-[1.02] focus-within:shadow-xl sm:p-8 lg:p-10"
            @click="navigateToTool(tool.name)"
            :aria-label="t(tool.descriptionKey)"
            tabindex="0"
            @keydown.enter="navigateToTool(tool.name)"
            @keydown.space.prevent="navigateToTool(tool.name)"
            role="button"
          >
            <!-- Gradient Border Effect -->
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100" 
                 style="padding: 2px;">
              <div class="h-full w-full rounded-2xl bg-white"></div>
            </div>
            
            <!-- Card Content -->
            <div class="relative z-10 flex h-full min-h-[280px] flex-col sm:min-h-[320px]">
              <!-- Tool Icon -->
              <div class="mb-4 flex justify-center">
                <span class="text-5xl drop-shadow-sm sm:text-6xl lg:text-7xl" 
                      role="img" 
                      :aria-label="`${t(tool.titleKey)} icon`">
                  {{ tool.icon }}
                </span>
              </div>
              
              <!-- Tool Title -->
              <h3 class="mb-3 text-center text-xl font-semibold text-gray-900 sm:text-2xl lg:mb-4">
                {{ t(tool.titleKey) }}
              </h3>
              
              <!-- Tool Description -->
              <p class="flex-1 text-center text-sm leading-relaxed text-gray-600 sm:text-base lg:text-lg">
                {{ t(tool.descriptionKey) }}
              </p>
              
              <!-- Feature Tags -->
              <div class="mt-4 flex flex-wrap justify-center gap-2 lg:mt-6">
                <span 
                  v-for="feature in tool.features" 
                  :key="feature" 
                  class="inline-flex rounded-full bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200 sm:px-4 sm:py-1.5 sm:text-sm"
                >
                  {{ t(feature) }}
                </span>
              </div>
              
              <!-- Touch Indicator for Mobile -->
              <div class="mt-4 flex justify-center sm:hidden">
                <div class="h-1 w-12 rounded-full bg-gray-200 transition-colors duration-300 group-hover:bg-blue-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="bg-white/80 px-4 py-12 backdrop-blur-sm sm:px-6 lg:px-8 lg:py-20">
      <div class="mx-auto max-w-4xl">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            {{ t('aboutTitle') }}
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg lg:mt-6 lg:text-xl">
            {{ t('aboutText') }}
          </p>
        </div>
        
        <!-- Features List -->
        <div class="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:gap-8">
          <div 
            v-for="feature in mainFeatures" 
            :key="feature" 
            class="flex items-start gap-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-4 ring-1 ring-blue-100 sm:gap-4 sm:p-6"
          >
            <span class="flex-shrink-0 text-lg sm:text-xl" role="img" aria-hidden="true">✨</span>
            <span class="text-sm font-medium text-gray-700 sm:text-base">{{ t(feature) }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom Spacing for Mobile Navigation -->
    <div class="h-8 sm:h-0"></div>
  </div>
</template>

<script setup lang="ts">
interface Tool {
  name: string
  icon: string
  titleKey: string
  descriptionKey: string
  features: string[]
}

const { t, locale } = useI18n()
const router = useRouter()
const localePath = useLocalePath()
const { logger, LogCategory } = useLogger()

// Define tools data with proper typing
const tools = ref<Tool[]>([
  {
    name: 'tarot',
    icon: '🃏',
    titleKey: 'tarotTitle',
    descriptionKey: 'tarotDescription', 
    features: ['tarotFeature1', 'tarotFeature2', 'tarotFeature3']
  },
  {
    name: 'astrology',
    icon: '⭐',
    titleKey: 'astrologyTitle',
    descriptionKey: 'astrologyDescription',
    features: ['astrologyFeature1', 'astrologyFeature2', 'astrologyFeature3']
  },
  {
    name: 'numerology',
    icon: '🔢',
    titleKey: 'numerologyTitle', 
    descriptionKey: 'numerologyDescription',
    features: ['numerologyFeature1', 'numerologyFeature2', 'numerologyFeature3']
  },
  {
    name: 'chinese-zodiac',
    icon: '🐉',
    titleKey: 'chineseZodiacTitle',
    descriptionKey: 'chineseZodiacDescription', 
    features: ['chineseFeature1', 'chineseFeature2', 'chineseFeature3']
  }
])

const mainFeatures = ref<string[]>([
  'feature5Languages',
  'featureModernDesign', 
  'featureInstantResults',
  'featureMobileOptimized'
])

// Enhanced navigation with touch feedback
const navigateToTool = async (toolName: string): Promise<void> => {
  try {
    // Add haptic feedback for mobile devices
    if (process.client && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }

    logger.logUserAction('Tool card clicked', { 
      tool: toolName,
      currentLocale: locale.value,
      fromPage: 'homepage',
      deviceType: process.client ? (window.innerWidth < 768 ? 'mobile' : 'desktop') : 'unknown'
    })

    const targetPath = localePath(`/${toolName}`)
    
    // Validate path before navigation
    if (!targetPath || targetPath === '/') {
      logger.logError('Homepage.navigateToTool', 'Invalid path generated', {
        tool: toolName,
        targetPath,
        locale: locale.value
      })
      return
    }

    logger.logRouteChange('/', targetPath, locale.value)
    
    await router.push(targetPath)
    
  } catch (error) {
    logger.logError('Homepage.navigateToTool', error as Error, { 
      tool: toolName 
    })
  }
}

// SEO Meta with responsive optimization
useSeoMeta({
  title: computed(() => {
    try {
      return t('seo.homepage.title')
    } catch {
      return 'Teller.eu.org - Digital Fortune Teller'
    }
  }),
  description: computed(() => {
    try {
      return t('seo.homepage.description')
    } catch {
      return 'Discover your destiny through ancient wisdom with our digital fortune teller. Free tarot readings, astrology, numerology, and Chinese zodiac insights.'
    }
  }),
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes'
})

// Mobile-specific optimizations
onMounted(() => {
  logger.logComponentInit('Homepage', {
    locale: locale.value,
    toolsCount: tools.value.length,
    userAgent: process.client ? navigator.userAgent : 'SSR',
    screenSize: process.client ? `${window.innerWidth}x${window.innerHeight}` : 'unknown',
    touchSupport: process.client ? 'ontouchstart' in window : false
  })
  
  // Log tool paths for validation
  tools.value.forEach(tool => {
    const path = localePath(`/${tool.name}`)
    logger.debug(LogCategory.ROUTE, `Tool path generated`, {
      tool: tool.name,
      path,
      locale: locale.value
    })
  })

  // Add scroll performance optimization for mobile
  if (process.client && window.innerWidth < 768) {
    document.body.style.overscrollBehavior = 'none'
  }
})

// Watch locale changes with mobile considerations
watch(locale, (newLocale, oldLocale) => {
  logger.logLanguageChange(oldLocale || 'unknown', newLocale)
  
  // Re-validate tool paths
  tools.value.forEach(tool => {
    const path = localePath(`/${tool.name}`)
    logger.debug(LogCategory.ROUTE, `Tool path updated after locale change`, {
      tool: tool.name,
      path,
      locale: newLocale
    })
  })
})

// Handle screen orientation changes
if (process.client) {
  const handleOrientationChange = () => {
    logger.debug(LogCategory.COMPONENT, 'Orientation changed', {
      orientation: screen.orientation?.type || 'unknown',
      screenSize: `${window.innerWidth}x${window.innerHeight}`
    })
  }
  
  window.addEventListener('orientationchange', handleOrientationChange)
  
  onUnmounted(() => {
    window.removeEventListener('orientationchange', handleOrientationChange)
  })
}
</script> 