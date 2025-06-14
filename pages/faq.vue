<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ t('faq.title') }}</h1>
      
      <div class="prose prose-lg max-w-none">
        <p class="text-gray-600 mb-8">{{ t('faq.introduction') }}</p>
        
        <div class="space-y-4">
          <div v-for="(category, index) in categories" :key="index" class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ t(category.titleKey) }}</h2>
            <div class="space-y-4">
              <div v-for="(faq, faqIndex) in category.items" :key="faqIndex"
                   class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  class="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  @click="toggleFaq(index, faqIndex)"
                  :aria-expanded="isOpen(index, faqIndex)"
                >
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-medium text-gray-900">{{ t(faq.questionKey) }}</h3>
                    <svg
                      class="w-5 h-5 text-gray-500 transform transition-transform duration-200"
                      :class="{ 'rotate-180': isOpen(index, faqIndex) }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div
                  v-show="isOpen(index, faqIndex)"
                  class="px-6 pb-4 text-gray-600"
                >
                  <p>{{ t(faq.answerKey) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Define FAQ categories and items
const categories = [
  {
    titleKey: 'faq.general.title',
    items: [
      { questionKey: 'faq.general.q1', answerKey: 'faq.general.a1' },
      { questionKey: 'faq.general.q2', answerKey: 'faq.general.a2' },
      { questionKey: 'faq.general.q3', answerKey: 'faq.general.a3' }
    ]
  },
  {
    titleKey: 'faq.tarot.title',
    items: [
      { questionKey: 'faq.tarot.q1', answerKey: 'faq.tarot.a1' },
      { questionKey: 'faq.tarot.q2', answerKey: 'faq.tarot.a2' },
      { questionKey: 'faq.tarot.q3', answerKey: 'faq.tarot.a3' }
    ]
  },
  {
    titleKey: 'faq.astrology.title',
    items: [
      { questionKey: 'faq.astrology.q1', answerKey: 'faq.astrology.a1' },
      { questionKey: 'faq.astrology.q2', answerKey: 'faq.astrology.a2' },
      { questionKey: 'faq.astrology.q3', answerKey: 'faq.astrology.a3' }
    ]
  },
  {
    titleKey: 'faq.numerology.title',
    items: [
      { questionKey: 'faq.numerology.q1', answerKey: 'faq.numerology.a1' },
      { questionKey: 'faq.numerology.q2', answerKey: 'faq.numerology.a2' },
      { questionKey: 'faq.numerology.q3', answerKey: 'faq.numerology.a3' }
    ]
  }
]

// State for accordion
const openFaqs = ref<Record<string, boolean>>({})

// Toggle FAQ item
const toggleFaq = (categoryIndex: number, faqIndex: number) => {
  const key = `${categoryIndex}-${faqIndex}`
  openFaqs.value[key] = !openFaqs.value[key]
}

// Check if FAQ item is open
const isOpen = (categoryIndex: number, faqIndex: number) => {
  const key = `${categoryIndex}-${faqIndex}`
  return openFaqs.value[key] || false
}

// SEO Meta
useSeoMeta({
  title: t('seo.faq.title'),
  description: t('seo.faq.description'),
  keywords: t('seo.faq.keywords'),
  ogTitle: t('seo.faq.ogTitle'),
  ogDescription: t('seo.faq.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: t('seo.faq.twitterTitle'),
  twitterDescription: t('seo.faq.twitterDescription')
})

// Add structured data
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(t('seo.faq.structuredData'))
    }
  ]
})
</script> 