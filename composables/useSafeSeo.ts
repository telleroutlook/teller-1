/**
 * 安全的SEO翻译访问composable
 * 避免SSR期间的翻译回退警告
 */
export const useSafeSeo = () => {
  const { t, locale } = useI18n()

  /**
   * 安全的翻译访问函数，避免SSR期间的警告
   */
  const getSafeTranslation = (key: string, fallback: string = ''): string => {
    try {
      const translation = t(key)
      return translation || fallback
    } catch (error) {
      return fallback
    }
  }

  /**
   * 获取安全的结构化数据，在SSR期间使用简化版本
   */
  const getSafeStructuredData = (
    key: string, 
    fallbackData: Record<string, any>
  ): Record<string, any> => {
    if (process.server) {
      // 在服务器端返回最小化的结构化数据以避免翻译警告
      return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        ...fallbackData
      }
    }
    
    // 客户端加载完整的结构化数据
    try {
      // 确保当前语言的翻译已加载
      const translation = t(key, {}, { locale: locale.value })
      
      // 安全地检查翻译结果是否为对象
      if (typeof translation === 'object' && translation !== null && translation !== key) {
        return translation as Record<string, any>
      }
      
      // 如果翻译失败或返回键本身，使用fallback
      return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        ...fallbackData
      }
    } catch (error) {
      console.warn(`Failed to load structured data for key: ${key}`, error)
      return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        ...fallbackData
      }
    }
  }

  /**
   * 为指定的SEO键前缀设置安全的SEO meta数据
   */
  const setSafeSeoMeta = (keyPrefix: string) => {
    const seoData = {
      title: getSafeTranslation(`${keyPrefix}.title`),
      description: getSafeTranslation(`${keyPrefix}.description`),
      keywords: getSafeTranslation(`${keyPrefix}.keywords`),
      ogTitle: getSafeTranslation(`${keyPrefix}.ogTitle`),
      ogDescription: getSafeTranslation(`${keyPrefix}.ogDescription`),
      twitterTitle: getSafeTranslation(`${keyPrefix}.twitterTitle`),
      twitterDescription: getSafeTranslation(`${keyPrefix}.twitterDescription`)
    }

    useSeoMeta({
      title: seoData.title,
      description: seoData.description,
      keywords: seoData.keywords,
      ogTitle: seoData.ogTitle,
      ogDescription: seoData.ogDescription,
      ogType: 'website',
      twitterCard: 'summary_large_image' as const,
      twitterTitle: seoData.twitterTitle,
      twitterDescription: seoData.twitterDescription
    })

    return seoData
  }

  /**
   * 安全地设置结构化数据
   */
  const setSafeStructuredData = (
    key: string, 
    fallbackData: Record<string, any>
  ) => {
    const structuredData = computed(() => 
      getSafeStructuredData(key, fallbackData)
    )

    // 延迟到客户端水合完成后设置结构化数据
    if (process.client) {
      nextTick(() => {
        useHead({
          script: [
            {
              type: 'application/ld+json',
              innerHTML: JSON.stringify(structuredData.value)
            }
          ]
        })
      })
    }

    return structuredData
  }

  return {
    getSafeTranslation,
    getSafeStructuredData,
    setSafeSeoMeta,
    setSafeStructuredData
  }
} 