<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- Animated Background -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow" style="animation-delay: 2s"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow" style="animation-delay: 4s"></div>
    </div>

    <!-- Language Switcher - Fixed top right -->
    <div class="fixed top-4 right-4 z-50">
      <LanguageSwitcher />
    </div>

    <!-- Navigation -->
    <nav class="relative z-10 px-4 pt-6 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <img src="/favicon/favicon-32x32.png" alt="Teller.eu.org" class="w-10 h-10 rounded-xl">
          <span class="text-white font-semibold text-lg">teller.eu.org</span>
        </NuxtLink>
        <div class="hidden md:flex items-center space-x-8">
          <a href="#tools" class="text-gray-300 hover:text-white transition-colors">Tools</a>
          <a href="#about" class="text-gray-300 hover:text-white transition-colors">About</a>
          <NuxtLink :to="localePath('/contact')" class="text-gray-300 hover:text-white transition-colors">Contact</NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative z-10 px-4 pt-20 pb-32 sm:px-6 lg:px-8 lg:pt-32">
      <div class="mx-auto max-w-7xl text-center">
        <!-- Floating Cards Background -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute top-20 left-10 w-16 h-24 bg-gradient-to-b from-purple-500/20 to-pink-500/20 rounded-xl rotate-12 animate-float"></div>
          <div class="absolute top-40 right-20 w-12 h-18 bg-gradient-to-b from-blue-500/20 to-purple-500/20 rounded-lg -rotate-12 animate-float" style="animation-delay: 1s"></div>
          <div class="absolute bottom-40 left-20 w-14 h-20 bg-gradient-to-b from-indigo-500/20 to-purple-500/20 rounded-xl rotate-6 animate-float" style="animation-delay: 2s"></div>
        </div>

        <!-- Main Content -->
        <div class="relative">
          <h1 class="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-8 sm:text-6xl lg:text-7xl xl:text-8xl leading-tight">
            {{ t('heroTitle') }}
          </h1>
          <p class="mx-auto mt-8 max-w-4xl text-lg leading-8 text-gray-300 sm:text-xl lg:text-2xl lg:leading-10">
            {{ t('heroSubtitle') }}
          </p>
          
          <!-- Feature Pills -->
          <div class="mt-12 flex flex-wrap justify-center gap-4">
            <div class="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span class="text-emerald-400 text-sm">✨</span>
              <span class="text-white text-sm font-medium">{{ t('feature5Languages') }}</span>
            </div>
            <div class="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span class="text-purple-400 text-sm">⚡</span>
              <span class="text-white text-sm font-medium">{{ t('featureInstantResults') }}</span>
            </div>
            <div class="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span class="text-blue-400 text-sm">📱</span>
              <span class="text-white text-sm font-medium">{{ t('featureMobileOptimized') }}</span>
            </div>
          </div>


        </div>
      </div>
    </section>

    <!-- Tools Grid -->
    <section id="tools" class="relative z-10 px-4 pb-32 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <!-- Section Header -->
        <div class="text-center mb-20">
          <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-4 sm:text-4xl lg:text-5xl">
            Divination Tools
          </h2>
          <p class="text-gray-400 text-lg lg:text-xl max-w-2xl mx-auto">
            Choose your path to spiritual insight and personal discovery
          </p>
        </div>

        <!-- Tools Grid -->
        <div class="grid gap-8 sm:grid-cols-2 lg:gap-12">
          <NuxtLink 
            v-for="(tool, index) in tools" 
            :key="tool.name"
            :to="localePath(`/${tool.name}`)"
            class="group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 p-8 lg:p-10 transition-all duration-500 hover:from-white/20 hover:to-white/10 hover:border-white/30 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
            :style="{ 'animation-delay': `${index * 0.1}s` }"
            @click="handleToolClick(tool.name)"
          >
            <!-- Animated Background Glow -->
            <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
            
            <!-- Tool Icon -->
            <div class="relative mb-8">
              <div class="inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                <span class="text-4xl lg:text-5xl filter drop-shadow-lg">{{ tool.icon }}</span>
              </div>
              <!-- Floating particles -->
              <div class="absolute -top-2 -right-2 w-3 h-3 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
              <div class="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping" style="animation-delay: 0.5s"></div>
            </div>
            
            <!-- Tool Title -->
            <h3 class="mb-4 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300 lg:text-3xl">
              {{ t(tool.titleKey) }}
            </h3>
            
            <!-- Tool Description -->
            <p class="mb-8 text-gray-400 text-base leading-relaxed lg:text-lg group-hover:text-gray-300 transition-colors duration-300">
              {{ t(tool.descriptionKey) }}
            </p>
            
            <!-- Features List -->
            <div class="space-y-4">
              <div 
                v-for="feature in tool.features" 
                :key="feature"
                class="flex items-start gap-3"
              >
                <div class="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mt-1">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="text-gray-300 text-sm lg:text-base">{{ t(feature) }}</span>
              </div>
            </div>
            
            <!-- Action Arrow -->
            <div class="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="relative z-10 px-4 py-32 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <!-- Background Elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"></div>
          <div class="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-pink-500/20 to-transparent"></div>
        </div>

        <div class="relative">
          <!-- Section Header -->
          <div class="text-center mb-20">
            <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-6 sm:text-4xl lg:text-5xl">
              {{ t('aboutTitle') }}
            </h2>
            <p class="mx-auto max-w-4xl text-gray-400 text-lg leading-8 lg:text-xl lg:leading-9">
              {{ t('aboutText') }}
            </p>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-16">
            <div class="text-center group">
              <div class="relative">
                <div class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 sm:text-5xl lg:text-6xl group-hover:scale-110 transition-transform duration-300">
                  4
                </div>
                <div class="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </div>
              <div class="text-gray-400 text-sm lg:text-base">Divination Tools</div>
            </div>
            <div class="text-center group">
              <div class="relative">
                <div class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2 sm:text-5xl lg:text-6xl group-hover:scale-110 transition-transform duration-300">
                  5
                </div>
                <div class="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </div>
              <div class="text-gray-400 text-sm lg:text-base">Languages</div>
            </div>
            <div class="text-center group">
              <div class="relative">
                <div class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400 mb-2 sm:text-5xl lg:text-6xl group-hover:scale-110 transition-transform duration-300">
                  ∞
                </div>
                <div class="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </div>
              <div class="text-gray-400 text-sm lg:text-base">Free Readings</div>
            </div>
            <div class="text-center group">
              <div class="relative">
                <div class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-2 sm:text-5xl lg:text-6xl group-hover:scale-110 transition-transform duration-300">
                  24/7
                </div>
                <div class="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </div>
              <div class="text-gray-400 text-sm lg:text-base">Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="text-center">
          <div class="flex items-center justify-center space-x-3 mb-4">
            <img src="/favicon/favicon-32x32.png" alt="Teller.eu.org" class="w-8 h-8 rounded-lg">
            <span class="text-white font-semibold">teller.eu.org</span>
          </div>
          <p class="text-gray-400 text-sm">
            Discover your path through the wisdom of the universe
          </p>
        </div>
      </div>
    </footer>
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

// SEO Meta - 使用安全的SEO处理
const { setSafeSeoMeta, setSafeStructuredData } = useSafeSeo()

// 设置SEO meta数据
setSafeSeoMeta('seo.homepage')

// 设置结构化数据
setSafeStructuredData('seo.homepage.structuredData', {
  name: 'Digital Fortune Teller',
  description: 'A comprehensive digital divination platform',
  applicationCategory: 'LifestyleApplication',
  url: 'https://teller.eu.org'
})
</script>

<style scoped>
/* Custom animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(2deg);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

/* Enhanced scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Custom gradient text animations */
.bg-clip-text {
  background-clip: text;
  -webkit-background-clip: text;
}

/* Glass morphism effects */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Enhanced interactions */
.group:active {
  transform: scale(0.98);
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Touch device optimizations */
@media (pointer: coarse) {
  .group {
    min-height: 300px;
  }
  
  .group:active {
    transform: scale(0.95);
    transition-duration: 100ms;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .text-gray-300 {
    color: #ffffff;
  }
  
  .text-gray-400 {
    color: #e5e5e5;
  }
  
  .border-white\/20 {
    border-color: rgba(255, 255, 255, 0.5);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .animate-float,
  .animate-pulse-slow,
  .animate-ping {
    animation: none;
  }
  
  * {
    transition-duration: 0.01ms !important;
  }
}

/* Dark mode support (already dark, but for consistency) */
@media (prefers-color-scheme: dark) {
  /* Already optimized for dark theme */
}
</style> 