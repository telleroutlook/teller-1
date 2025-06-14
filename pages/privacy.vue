<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ t('privacy.title') }}</h1>
      
      <div class="prose prose-lg max-w-none">
        <p class="text-gray-600 mb-8">{{ t('privacy.lastUpdated') }}</p>
        
        <section class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ t('privacy.introduction.title') }}</h2>
          <p class="text-gray-600 mb-4">{{ t('privacy.introduction.text') }}</p>
        </section>
        
        <section class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ t('privacy.information.title') }}</h2>
          <div class="space-y-4">
            <div v-for="(item, index) in informationItems" :key="index">
              <h3 class="text-xl font-medium text-gray-900 mb-2">{{ t(item.titleKey) }}</h3>
              <p class="text-gray-600">{{ t(item.textKey) }}</p>
            </div>
          </div>
        </section>
        
        <section class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ t('privacy.cookies.title') }}</h2>
          <p class="text-gray-600 mb-4">{{ t('privacy.cookies.text') }}</p>
          <ul class="list-disc pl-6 space-y-2 text-gray-600">
            <li v-for="(cookie, index) in cookies" :key="index">
              {{ t(cookie) }}
            </li>
          </ul>
        </section>
        
        <section class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ t('privacy.rights.title') }}</h2>
          <div class="space-y-4">
            <div v-for="(right, index) in rights" :key="index" class="flex items-start">
              <span class="flex-shrink-0 h-6 w-6 text-blue-600 mr-3">•</span>
              <span class="text-gray-600">{{ t(right) }}</span>
            </div>
          </div>
        </section>
        
        <section class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ t('privacy.contact.title') }}</h2>
          <p class="text-gray-600">
            {{ t('privacy.contact.text') }}
            <a href="mailto:privacy@teller.eu.org" class="text-blue-600 hover:text-blue-800">
              privacy@teller.eu.org
            </a>
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Define information items
const informationItems = [
  {
    titleKey: 'privacy.information.personal.title',
    textKey: 'privacy.information.personal.text'
  },
  {
    titleKey: 'privacy.information.usage.title',
    textKey: 'privacy.information.usage.text'
  },
  {
    titleKey: 'privacy.information.sharing.title',
    textKey: 'privacy.information.sharing.text'
  }
]

// Define cookies
const cookies = [
  'privacy.cookies.essential',
  'privacy.cookies.analytics',
  'privacy.cookies.preferences',
  'privacy.cookies.marketing'
]

// Define rights
const rights = [
  'privacy.rights.access',
  'privacy.rights.correction',
  'privacy.rights.deletion',
  'privacy.rights.restriction',
  'privacy.rights.portability',
  'privacy.rights.objection'
]

// SEO Meta
useSeoMeta({
  title: t('seo.privacy.title'),
  description: t('seo.privacy.description'),
  keywords: t('seo.privacy.keywords'),
  ogTitle: t('seo.privacy.ogTitle'),
  ogDescription: t('seo.privacy.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: t('seo.privacy.twitterTitle'),
  twitterDescription: t('seo.privacy.twitterDescription')
})

// Add structured data
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(t('seo.privacy.structuredData'))
    }
  ]
})
</script> 