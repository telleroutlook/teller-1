<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-4xl mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
      <ClientOnly>
        <template #default>
          <!-- 加载状态 -->
          <div v-if="isLoading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">{{ $t('loading') }}...</p>
          </div>
          
          <!-- 懒加载组件 -->
          <component v-else-if="currentComponent" :is="currentComponent" />
          
          <!-- 未找到工具 -->
          <div v-else class="text-center">
            <h1 class="text-2xl font-bold text-gray-900 mb-4">Tool not found</h1>
            <NuxtLink to="/" class="text-blue-600 hover:text-blue-800 underline">
              Return to Home
            </NuxtLink>
          </div>
        </template>
        
        <template #fallback>
          <!-- 服务端渲染占位符 -->
          <div class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">{{ $t('loading') }}...</p>
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const tool = computed(() => route.params.tool as string)
const isLoading = ref(true)
const currentComponent = shallowRef<any>(null)

// Validate tool parameter
const validTools = ['tarot', 'astrology', 'numerology', 'chinese-zodiac']
if (!validTools.includes(tool.value)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Tool not found'
  })
}

// 懒加载组件映射
const componentMap = {
  'tarot': () => import('~/components/TarotReading.vue'),
  'astrology': () => import('~/components/AstrologyReading.vue'),
  'numerology': () => import('~/components/NumerologyReading.vue'),
  'chinese-zodiac': () => import('~/components/ChineseZodiacReading.vue')
}

// 动态加载组件
const loadComponent = async () => {
  try {
    isLoading.value = true
    const componentLoader = componentMap[tool.value as keyof typeof componentMap]
    if (componentLoader) {
      const component = await componentLoader()
      // 添加延迟以确保DOM完全渲染
      await nextTick()
      currentComponent.value = markRaw(component.default || component)
    }
  } catch (error) {
    console.error('Failed to load component:', error)
    currentComponent.value = null
  } finally {
    isLoading.value = false
  }
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

// 在客户端挂载时加载组件
onMounted(() => {
  loadComponent()
})

// 监听路由变化，重新加载组件
watch(tool, loadComponent)

// 页面离开时清理
onBeforeUnmount(() => {
  currentComponent.value = null
})
</script> 