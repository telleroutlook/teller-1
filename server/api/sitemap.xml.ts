import { SitemapGenerator } from '~/utils/sitemapGenerator'

export default defineEventHandler(async (event) => {
  try {
    // Set appropriate headers for XML sitemap
    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    setHeader(event, 'Cache-Control', 's-maxage=86400') // Cache for 24 hours
    
    // Generate sitemap using the SitemapGenerator class
    const generator = new SitemapGenerator()
    const sitemap = generator.generateXmlSitemap()
    
    // Log sitemap generation for monitoring
    console.log(`Generated sitemap with ${generator.getUrlCount()} URLs`)
    
    // Return XML content directly
    return sitemap
  } catch (error) {
    // Handle errors gracefully
    console.error('Error generating sitemap:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate sitemap'
    })
  }
}) 