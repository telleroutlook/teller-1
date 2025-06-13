<template>
  <div class="homepage">
    <div class="hero-section">
      <h1 class="hero-title">{{ t('heroTitle') }}</h1>
      <p class="hero-subtitle">{{ t('heroSubtitle') }}</p>
    </div>

    <div class="tools-grid">
      <div 
        v-for="tool in tools" 
        :key="tool.name"
        class="tool-card"
        @click="navigateToTool(tool.name)"
        :aria-label="t(tool.descriptionKey)"
        tabindex="0"
        @keydown.enter="navigateToTool(tool.name)"
        @keydown.space="navigateToTool(tool.name)"
      >
        <div class="tool-icon">{{ tool.icon }}</div>
        <h3 class="tool-title">{{ t(tool.titleKey) }}</h3>
        <p class="tool-description">{{ t(tool.descriptionKey) }}</p>
        <div class="tool-features">
          <span 
            v-for="feature in tool.features" 
            :key="feature" 
            class="feature-tag"
          >
            {{ t(feature) }}
          </span>
        </div>
      </div>
    </div>

    <div class="about-section">
      <h2 class="about-title">{{ t('aboutTitle') }}</h2>
      <p class="about-text">{{ t('aboutText') }}</p>
      
      <div class="features-list">
        <div v-for="feature in mainFeatures" :key="feature" class="feature-item">
          <span class="feature-icon">✨</span>
          <span>{{ t(feature) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const router = useRouter()
const localePath = useLocalePath()
const { logger, LogCategory } = useLogger()

// Define tools data
const tools = ref([
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

const mainFeatures = ref([
  'feature5Languages',
  'featureModernDesign', 
  'featureInstantResults',
  'featureMobileOptimized'
])

// Navigation function with logging
const navigateToTool = async (toolName: string) => {
  try {
    logger.logUserAction('Tool card clicked', { 
      tool: toolName,
      currentLocale: locale.value,
      fromPage: 'homepage'
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

// SEO Meta - using fallback if keys don't exist
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
  })
})

// Lifecycle logging
onMounted(() => {
  logger.logComponentInit('Homepage', {
    locale: locale.value,
    toolsCount: tools.value.length,
    userAgent: process.client ? navigator.userAgent : 'SSR'
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
})

// Watch locale changes
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
</script>

<style scoped>
.homepage {
  padding: 40px 0 60px 0;
  min-height: auto;
}

.hero-section {
  text-align: center;
  margin-bottom: 60px;
  padding: 50px 30px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 20px;
  margin: 0 20px 60px 20px;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #4a5568;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  margin: 0 20px 60px 20px;
  padding: 0 20px;
}

.tool-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20px;
  padding: 60px 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  min-height: 450px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.tool-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.tool-card:hover,
.tool-card:focus {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: rgba(102, 126, 234, 0.2);
  outline: none;
}

.tool-card:hover::before,
.tool-card:focus::before {
  transform: scaleX(1);
}

.tool-icon {
  font-size: 4.5rem;
  margin-bottom: 35px;
  text-align: center;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}

.tool-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 25px;
  text-align: center;
}

.tool-description {
  color: #6b7280;
  line-height: 1.8;
  margin-bottom: 35px;
  text-align: center;
  font-size: 1.1rem;
  flex-grow: 1;
}

.tool-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.feature-tag {
  background: linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  color: #5b6bc0;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.about-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 60px 50px;
  margin: 0 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.about-title {
  font-size: 2rem;
  font-weight: 600;
  color: #374151;
  text-align: center;
  margin-bottom: 25px;
}

.about-text {
  color: #6b7280;
  line-height: 1.7;
  text-align: center;
  margin-bottom: 40px;
  font-size: 1.05rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 40px;
}

.features-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.feature-icon {
  font-size: 1.3rem;
  flex-shrink: 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .homepage {
    padding: 15px 0;
  }
  
  .hero-section {
    margin: 0 10px 40px 10px;
    padding: 30px 20px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
    gap: 30px;
    margin: 0 15px 50px 15px;
    padding: 0 10px;
  }
  
  .tool-card {
    padding: 50px 30px;
    min-height: 380px;
  }
  
  .about-section {
    margin: 0 10px;
    padding: 35px 25px;
  }
  
  .about-title {
    font-size: 1.5rem;
  }
  
  .features-list {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .feature-item {
    padding: 15px;
  }
}

/* RTL Support */
[dir="rtl"] .tool-card {
  direction: rtl;
}

[dir="rtl"] .feature-item {
  direction: rtl;
}
</style> 