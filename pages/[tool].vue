<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-4xl mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
      <TarotReading v-if="tool === 'tarot'" />
      <AstrologyReading v-else-if="tool === 'astrology'" />
      <NumerologyReading v-else-if="tool === 'numerology'" />
      <ChineseZodiacReading v-else-if="tool === 'chinese-zodiac'" />
      <div v-else class="text-center">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Tool not found</h1>
        <NuxtLink to="/" class="text-blue-600 hover:text-blue-800 underline">
          Return to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const tool = computed(() => route.params.tool as string)

// Validate tool parameter
const validTools = ['tarot', 'astrology', 'numerology', 'chinese-zodiac']
if (!validTools.includes(tool.value)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Tool not found'
  })
}

// SEO based on tool
const { t } = useI18n()
const seoData = computed(() => {
  const seoKey = tool.value.replace('-', '')
  return {
    title: t(`seo.${seoKey}.title`),
    description: t(`seo.${seoKey}.description`)
  }
})

useSeoMeta({
  title: seoData.value.title,
  description: seoData.value.description,
  ogTitle: seoData.value.title,
  ogDescription: seoData.value.description,
  twitterTitle: seoData.value.title,
  twitterDescription: seoData.value.description
})
</script> 