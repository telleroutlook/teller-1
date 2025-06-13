#!/usr/bin/env tsx

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { SitemapGenerator } from '../utils/sitemapGenerator'

/**
 * Generate static sitemap file during build process
 */
async function generateStaticSitemap() {
  try {
    console.log('🚀 Generating static sitemap...')
    
    const generator = new SitemapGenerator()
    const sitemapXml = generator.generateXmlSitemap()
    
    // Ensure output directory exists
    const outputPath = join(process.cwd(), 'public', 'sitemap.xml')
    mkdirSync(dirname(outputPath), { recursive: true })
    
    // Write sitemap file
    writeFileSync(outputPath, sitemapXml, 'utf-8')
    
    console.log(`✅ Sitemap generated successfully!`)
    console.log(`   - File: ${outputPath}`)
    console.log(`   - URLs: ${generator.getUrlCount()}`)
    console.log(`   - Languages: en, fr, zh, hi, ar`)
    console.log(`   - Tools: tarot, astrology, numerology, chinese-zodiac`)
    
    // Generate sitemap statistics
    const stats = {
      totalUrls: generator.getUrlCount(),
      urlsByLanguage: {
        en: generator.getUrlsByLanguage('en').length,
        fr: generator.getUrlsByLanguage('fr').length,
        zh: generator.getUrlsByLanguage('zh').length,
        hi: generator.getUrlsByLanguage('hi').length,
        ar: generator.getUrlsByLanguage('ar').length
      }
    }
    
    console.log('\n📊 Sitemap Statistics:')
    console.log(JSON.stringify(stats, null, 2))
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error)
    process.exit(1)
  }
}

// Run the script
generateStaticSitemap()

export { generateStaticSitemap } 