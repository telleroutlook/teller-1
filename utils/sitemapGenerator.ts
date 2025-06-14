import type { SitemapUrl, SitemapConfig } from '~/types/sitemap'
import { SITEMAP_CONFIG, PRIORITY_LEVELS, CHANGE_FREQUENCY } from '~/types/sitemap'

/**
 * Generate sitemap URLs for all language and tool combinations
 */
export class SitemapGenerator {
  private config: SitemapConfig
  private currentDate: string

  constructor(config: SitemapConfig = SITEMAP_CONFIG) {
    this.config = config
    this.currentDate = new Date().toISOString().split('T')[0]
  }

  /**
   * Generate all sitemap URLs
   */
  generateUrls(): SitemapUrl[] {
    const urls: SitemapUrl[] = []

    // Add homepage URLs for each language
    urls.push(...this.generateHomepageUrls())

    // Add tool page URLs for each language  
    urls.push(...this.generateToolPageUrls())

    // Add default English routes (without prefix)
    urls.push(...this.generateDefaultRoutes())

    // Add static pages if any
    if (this.config.staticPages?.length) {
      urls.push(...this.generateStaticPageUrls())
    }

    return urls
  }

  /**
   * Generate homepage URLs with language alternates
   */
  private generateHomepageUrls(): SitemapUrl[] {
    return this.config.locales.map(locale => ({
      loc: `${this.config.baseUrl}/${locale.code}`,
      lastmod: this.currentDate,
      changefreq: CHANGE_FREQUENCY.HOMEPAGE,
      priority: PRIORITY_LEVELS.HOMEPAGE,
      alternates: this.generateAlternateLinks('', locale.code)
    }))
  }

  /**
   * Generate tool page URLs with language alternates
   */
  private generateToolPageUrls(): SitemapUrl[] {
    const urls: SitemapUrl[] = []

    for (const locale of this.config.locales) {
      for (const tool of this.config.tools) {
        urls.push({
          loc: `${this.config.baseUrl}/${locale.code}/${tool}`,
          lastmod: this.currentDate,
          changefreq: CHANGE_FREQUENCY.TOOL_PAGES,
          priority: PRIORITY_LEVELS.TOOL_PAGES,
          alternates: this.generateAlternateLinks(tool, locale.code)
        })
      }
    }

    return urls
  }

  /**
   * Generate default routes (English without prefix)
   */
  private generateDefaultRoutes(): SitemapUrl[] {
    const urls: SitemapUrl[] = []

    // Default homepage
    urls.push({
      loc: this.config.baseUrl,
      lastmod: this.currentDate,
      changefreq: CHANGE_FREQUENCY.HOMEPAGE,
      priority: PRIORITY_LEVELS.HOMEPAGE
    })

    // Default tool pages
    for (const tool of this.config.tools) {
      urls.push({
        loc: `${this.config.baseUrl}/${tool}`,
        lastmod: this.currentDate,
        changefreq: CHANGE_FREQUENCY.TOOL_PAGES,
        priority: PRIORITY_LEVELS.TOOL_PAGES
      })
    }

    // Default static pages
    if (this.config.staticPages?.length) {
      for (const page of this.config.staticPages) {
        urls.push({
          loc: `${this.config.baseUrl}/${page}`,
          lastmod: this.currentDate,
          changefreq: CHANGE_FREQUENCY.STATIC_PAGES,
          priority: PRIORITY_LEVELS.STATIC_PAGES
        })
      }
    }

    return urls
  }

  /**
   * Generate static page URLs
   */
  private generateStaticPageUrls(): SitemapUrl[] {
    const urls: SitemapUrl[] = []

    if (!this.config.staticPages?.length) return urls

    for (const locale of this.config.locales) {
      for (const page of this.config.staticPages) {
        urls.push({
          loc: `${this.config.baseUrl}/${locale.code}/${page}`,
          lastmod: this.currentDate,
          changefreq: CHANGE_FREQUENCY.STATIC_PAGES,
          priority: PRIORITY_LEVELS.STATIC_PAGES,
          alternates: this.generateAlternateLinks(page, locale.code)
        })
      }
    }

    return urls
  }

  /**
   * Generate alternate language links for a page
   */
  private generateAlternateLinks(path: string, currentLocale: string) {
    return this.config.locales
      .filter(locale => locale.code !== currentLocale)
      .map(locale => ({
        hreflang: locale.iso,
        href: path 
          ? `${this.config.baseUrl}/${locale.code}/${path}`
          : `${this.config.baseUrl}/${locale.code}`
      }))
  }

  /**
   * Convert URLs to XML sitemap format
   */
  generateXmlSitemap(): string {
    const urls = this.generateUrls()
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'

    for (const url of urls) {
      xml += '  <url>\n'
      xml += `    <loc>${this.escapeXml(url.loc)}</loc>\n`
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`
      xml += `    <priority>${url.priority}</priority>\n`

      // Add alternate language links
      if (url.alternates?.length) {
        for (const alternate of url.alternates) {
          xml += `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${this.escapeXml(alternate.href)}" />\n`
        }
      }

      xml += '  </url>\n'
    }

    xml += '</urlset>'
    
    return xml
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  /**
   * Get total URL count
   */
  getUrlCount(): number {
    return this.generateUrls().length
  }

  /**
   * Get URLs by language
   */
  getUrlsByLanguage(localeCode: string): SitemapUrl[] {
    return this.generateUrls().filter(url => 
      url.loc.includes(`/${localeCode}/`) || 
      (localeCode === 'en' && !url.loc.match(/\/(en|fr|zh|hi|ar)\//))
    )
  }
} 