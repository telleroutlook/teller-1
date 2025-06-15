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

// SEO based on tool - 使用安全的SEO处理
const { setSafeSeoMeta, setSafeStructuredData } = useSafeSeo()

const seoKey = computed(() => tool.value.replace('-', ''))

// 设置SEO meta数据
watchEffect(() => {
  if (seoKey.value) {
    setSafeSeoMeta(`seo.${seoKey.value}`)
  }
})

// 设置结构化数据
watchEffect(() => {
  if (seoKey.value) {
    setSafeStructuredData(`seo.${seoKey.value}.structuredData`, {
      name: `${tool.value} service`,
      description: `Professional ${tool.value} service for personal guidance and insights`
    })
  }
})
</script> 