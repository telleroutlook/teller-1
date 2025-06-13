/**
 * Sitemap configuration and types
 */

export interface LocaleConfig {
  code: string
  iso: string
  name: string
  dir?: 'rtl' | 'ltr'
}

export interface SitemapUrl {
  loc: string
  lastmod: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
  alternates?: Array<{
    hreflang: string
    href: string
  }>
}

export interface SitemapConfig {
  baseUrl: string
  locales: LocaleConfig[]
  tools: string[]
  staticPages?: string[]
  excludedPages?: string[]
}

/**
 * Default sitemap configuration
 */
export const SITEMAP_CONFIG: SitemapConfig = {
  baseUrl: 'https://teller.eu.org',
  locales: [
    { code: 'en', iso: 'en-US', name: 'English' },
    { code: 'fr', iso: 'fr-FR', name: 'Français' },
    { code: 'zh', iso: 'zh-CN', name: '中文' },
    { code: 'hi', iso: 'hi-IN', name: 'हिन्दी' },
    { code: 'ar', iso: 'ar-SA', name: 'العربية', dir: 'rtl' }
  ],
  tools: [
    'tarot',
    'astrology',
    'numerology',
    'chinese-zodiac'
  ],
  staticPages: [
    // Add any additional static pages here
  ],
  excludedPages: [
    // Add pages to exclude from sitemap here
  ]
}

/**
 * Priority levels for different page types
 */
export const PRIORITY_LEVELS = {
  HOMEPAGE: 1.0,
  TOOL_PAGES: 0.8,
  STATIC_PAGES: 0.6,
  OTHER: 0.5
} as const

/**
 * Change frequency settings for different page types
 */
export const CHANGE_FREQUENCY = {
  HOMEPAGE: 'weekly',
  TOOL_PAGES: 'monthly',
  STATIC_PAGES: 'monthly',
  OTHER: 'yearly'
} as const 