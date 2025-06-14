<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ t('about.title') }}</h1>
      
      <div class="prose prose-lg max-w-none">
        <p class="text-gray-600 mb-6">{{ t('about.introduction') }}</p>
        
        <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">{{ t('about.ourMission') }}</h2>
        <p class="text-gray-600 mb-6">{{ t('about.missionText') }}</p>
        
        <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">{{ t('about.ourTools') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div v-for="tool in tools" :key="tool.name" class="bg-gray-50 rounded-lg p-6">
            <div class="text-2xl mb-3">{{ tool.icon }}</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ t(tool.titleKey) }}</h3>
            <p class="text-gray-600">{{ t(tool.descriptionKey) }}</p>
          </div>
        </div>
        
        <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">{{ t('about.whyChooseUs') }}</h2>
        <ul class="space-y-4">
          <li v-for="feature in features" :key="feature" class="flex items-start">
            <span class="flex-shrink-0 h-6 w-6 text-green-500 mr-3">✓</span>
            <span class="text-gray-600">{{ t(feature) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Define tools data
const tools = [
  {
    name: 'tarot',
    icon: '🃏',
    titleKey: 'tarotTab',
    descriptionKey: 'about.tarotDescription'
  },
  {
    name: 'astrology',
    icon: '⭐',
    titleKey: 'astrologyTab',
    descriptionKey: 'about.astrologyDescription'
  },
  {
    name: 'numerology',
    icon: '🔢',
    titleKey: 'numerologyTab',
    descriptionKey: 'about.numerologyDescription'
  },
  {
    name: 'chinese-zodiac',
    icon: '🐉',
    titleKey: 'chineseZodiacTab',
    descriptionKey: 'about.chineseZodiacDescription'
  }
]

// Define features
const features = [
  'about.feature1',
  'about.feature2',
  'about.feature3',
  'about.feature4',
  'about.feature5'
]

// SEO Meta
useSeoMeta({
  title: t('seo.about.title'),
  description: t('seo.about.description'),
  keywords: t('seo.about.keywords'),
  ogTitle: t('seo.about.ogTitle'),
  ogDescription: t('seo.about.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: t('seo.about.twitterTitle'),
  twitterDescription: t('seo.about.twitterDescription')
})

// Add structured data
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(t('seo.about.structuredData'))
    }
  ]
})
</script> 