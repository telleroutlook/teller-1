<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ t('projects.title') }}</h1>
      
      <div class="prose prose-lg max-w-none">
        <p class="text-gray-600 mb-8">{{ t('projects.introduction') }}</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="project in projects" :key="project.name" 
               class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-gray-900">{{ project.name }}</h2>
                <span class="text-2xl">{{ project.icon }}</span>
              </div>
              <p class="text-gray-600 mb-4">{{ t(project.descriptionKey) }}</p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span v-for="tag in project.tags" :key="tag" 
                      class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                  {{ t(tag) }}
                </span>
              </div>
              <a :href="project.url" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                {{ t('projects.visitSite') }}
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Define projects data
const projects = [
  {
    name: 'ByteSlim',
    icon: '💻',
    descriptionKey: 'projects.byteslim',
    url: 'https://byteslim.com/',
    tags: ['projects.tags.utility', 'projects.tags.performance']
  },
  {
    name: 'MVKing',
    icon: '🎬',
    descriptionKey: 'projects.mvking',
    url: 'https://mvking.com/',
    tags: ['projects.tags.entertainment', 'projects.tags.media']
  },
  {
    name: 'MD Editor',
    icon: '📝',
    descriptionKey: 'projects.mdeditor',
    url: 'https://mdeditor.uk/',
    tags: ['projects.tags.productivity', 'projects.tags.writing']
  },
  {
    name: '3WE',
    icon: '🌐',
    descriptionKey: 'projects.3we',
    url: 'https://3we.org/',
    tags: ['projects.tags.community', 'projects.tags.networking']
  },
  {
    name: 'Calculate Today',
    icon: '🧮',
    descriptionKey: 'projects.calculatetoday',
    url: 'https://calculatetoday.com/',
    tags: ['projects.tags.calculator', 'projects.tags.utility']
  },
  {
    name: 'TrustAvo',
    icon: '✉️',
    descriptionKey: 'projects.trustavo',
    url: 'https://trustavo.com/',
    tags: ['projects.tags.email', 'projects.tags.privacy']
  }
]

// SEO Meta
useSeoMeta({
  title: t('seo.projects.title'),
  description: t('seo.projects.description'),
  keywords: t('seo.projects.keywords'),
  ogTitle: t('seo.projects.ogTitle'),
  ogDescription: t('seo.projects.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: t('seo.projects.twitterTitle'),
  twitterDescription: t('seo.projects.twitterDescription')
})

// Add structured data
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(t('seo.projects.structuredData'))
    }
  ]
})
</script> 