import { SitemapGenerator } from '~/utils/sitemapGenerator'

export default defineEventHandler(async (event) => {
  try {
    // Generate sitemap info using the SitemapGenerator class
    const generator = new SitemapGenerator()
    const urls = generator.generateUrls()
    
    // Group URLs by language for easier analysis
    const urlsByLanguage = {
      en: generator.getUrlsByLanguage('en'),
      fr: generator.getUrlsByLanguage('fr'),
      zh: generator.getUrlsByLanguage('zh'),
      hi: generator.getUrlsByLanguage('hi'),
      ar: generator.getUrlsByLanguage('ar')
    }
    
    // Create statistics
    const stats = {
      totalUrls: generator.getUrlCount(),
      urlsByLanguage: Object.entries(urlsByLanguage).reduce((acc, [lang, urls]) => {
        acc[lang] = urls.length
        return acc
      }, {} as Record<string, number>),
      pageTypes: {
        homepage: urls.filter(url => url.priority === 1.0).length,
        toolPages: urls.filter(url => url.priority === 0.8).length,
        staticPages: urls.filter(url => url.priority === 0.6).length,
        other: urls.filter(url => url.priority === 0.5).length
      }
    }
    
    return {
      success: true,
      timestamp: new Date().toISOString(),
      stats,
      urlsByLanguage,
      sampleUrls: urls.slice(0, 10), // Show first 10 URLs as sample
      config: {
        baseUrl: 'https://teller.eu.org',
        languages: ['en', 'fr', 'zh', 'hi', 'ar'],
        tools: ['tarot', 'astrology', 'numerology', 'chinese-zodiac']
      }
    }
  } catch (error) {
    console.error('Error getting sitemap info:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get sitemap information'
    })
  }
}) 