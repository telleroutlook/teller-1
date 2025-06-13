<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <!-- Hero Section -->
    <section class="relative px-4 pt-12 pb-16 sm:px-6 lg:px-8 lg:pt-20 lg:pb-24">
      <div class="mx-auto max-w-4xl text-center">
        <!-- Main Title with mobile-first responsive design -->
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
          {{ t('heroTitle') }}
        </h1>
        <p class="mx-auto mt-4 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8 lg:text-xl">
          {{ t('heroSubtitle') }}
        </p>
        
        <!-- Feature highlights -->
        <div class="mt-6 flex flex-wrap justify-center gap-3 text-xs text-gray-500 sm:gap-4 sm:text-sm">
          <span class="flex items-center gap-1">
            <span class="text-green-500">✓</span>
            {{ t('feature5Languages') }}
          </span>
          <span class="flex items-center gap-1">
            <span class="text-green-500">✓</span>
            {{ t('featureInstantResults') }}
          </span>
          <span class="flex items-center gap-1">
            <span class="text-green-500">✓</span>
            {{ t('featureMobileOptimized') }}
          </span>
        </div>
      </div>
    </section>

    <!-- Tools Grid -->
    <section class="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      <div class="mx-auto max-w-6xl">
        <div class="grid gap-6 sm:grid-cols-2 lg:gap-8">
          <NuxtLink 
            v-for="tool in tools" 
            :key="tool.name"
            :to="localePath(`/${tool.name}`)"
            class="group relative block transform overflow-hidden rounded-3xl bg-white p-8 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus:scale-[1.02] focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-2 focus:ring-offset-white"
            @click="handleToolClick(tool.name)"
          >
            <!-- Gradient overlay on hover -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            
            <!-- Content -->
            <div class="relative">
              <!-- Icon -->
              <div class="mb-6 flex justify-center">
                <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-3xl text-white shadow-lg">
                  {{ tool.icon }}
                </div>
              </div>
              
              <!-- Title -->
              <h3 class="mb-3 text-center text-lg font-semibold text-gray-900 group-hover:text-blue-600 sm:mb-4 sm:text-xl lg:text-2xl">
                {{ t(tool.titleKey) }}
              </h3>
              
              <!-- Description -->
              <p class="mb-4 text-center text-sm text-gray-600 leading-relaxed sm:mb-6 sm:text-base">
                {{ t(tool.descriptionKey) }}
              </p>
              
              <!-- Features -->
              <div class="space-y-2">
                <div 
                  v-for="feature in tool.features" 
                  :key="feature"
                  class="flex items-center gap-3 text-sm text-gray-600"
                >
                  <span class="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs">✓</span>
                  {{ t(feature) }}
                </div>
              </div>
              
                             <!-- Action indicator -->
               <div class="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                 <span>Explore</span>
                 <svg class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                 </svg>
               </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div class="mx-auto max-w-4xl text-center">
        <h2 class="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-3xl lg:text-4xl">
          {{ t('aboutTitle') }}
        </h2>
        <p class="mx-auto max-w-3xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
          {{ t('aboutText') }}
        </p>
        
        <!-- Quick stats -->
        <div class="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">4</div>
            <div class="text-sm text-gray-600">Divination Tools</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">5</div>
            <div class="text-sm text-gray-600">Languages</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">∞</div>
            <div class="text-sm text-gray-600">Free Readings</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-600">24/7</div>
            <div class="text-sm text-gray-600">Available</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom spacing for mobile navigation -->
    <div class="h-20 sm:h-8"></div>
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
const { logger } = useLogger()

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

// Handle tool clicks with proper navigation
const handleToolClick = async (toolName: string): Promise<void> => {
  try {
    // Add haptic feedback for mobile devices
    if (process.client && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }

    logger.logUserAction('Tool card clicked', { 
      tool: toolName,
      currentLocale: locale.value,
      fromPage: 'homepage'
    })

    const targetPath = localePath(`/${toolName}`)
    
    // Validate path before navigation
    if (!targetPath) {
      logger.logError('Homepage.handleToolClick', 'Invalid path generated', {
        tool: toolName,
        targetPath,
        locale: locale.value
      })
      return
    }

    logger.logRouteChange('/', targetPath, locale.value)
    
    // Use router.push for programmatic navigation
    await router.push(targetPath)
    
  } catch (error) {
    logger.logError('Homepage.handleToolClick', error as Error, { 
      tool: toolName 
    })
  }
}

// Component initialization logging
onMounted(() => {
  logger.logComponentInit('Homepage', { 
    locale: locale.value,
    toolsCount: tools.value.length,
    userAgent: process.client ? navigator.userAgent : 'unknown',
    screenSize: process.client ? `${window.innerWidth}x${window.innerHeight}` : 'unknown',
    touchSupport: process.client ? 'ontouchstart' in window : false
  })
})

// SEO Meta
useSeoMeta({
  title: t('seo.homepage.title'),
  description: t('seo.homepage.description'),
  ogTitle: t('seo.homepage.title'),
  ogDescription: t('seo.homepage.description'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: t('seo.homepage.title'),
  twitterDescription: t('seo.homepage.description')
})
</script>

<style scoped>
/* Additional styles for enhanced interactions */
.group:active {
  transform: scale(0.98);
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Enhanced focus styles for accessibility are handled by Tailwind classes in template */

/* Hover effects for desktop */
@media (hover: hover) {
  .group:hover .h-4 {
    transform: translateX(0.25rem);
  }
}

/* Touch device optimizations */
@media (pointer: coarse) {
  .group {
    min-height: 280px;
  }
  
  .group:active {
    transform: scale(0.95);
    transition-duration: 100ms;
  }
}
</style> 