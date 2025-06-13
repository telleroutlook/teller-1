<template>
  <div class="content-section active">
    <TarotReading v-if="tool === 'tarot'" />
    <AstrologyReading v-else-if="tool === 'astrology'" />
    <NumerologyReading v-else-if="tool === 'numerology'" />
    <ChineseZodiacReading v-else-if="tool === 'chinese-zodiac'" />
    <div v-else class="section-title">Tool not found</div>
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