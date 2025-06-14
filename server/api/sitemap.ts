import { SitemapGenerator } from '~/utils/sitemapGenerator'

export default defineEventHandler(async (event) => {
  try {
    const generator = new SitemapGenerator()
    const sitemap = generator.generateXmlSitemap()
    
    // 设置响应头确保浏览器识别为XML
    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    setHeader(event, 'Cache-Control', 'public, max-age=86400') // 24小时缓存
    setHeader(event, 'X-Content-Type-Options', 'nosniff')
    
    console.log(`Generated sitemap with ${generator.getUrlCount()} URLs`)
    
    return sitemap
  } catch (error) {
    console.error('生成站点地图时出错:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '生成站点地图失败'
    })
  }
}) 