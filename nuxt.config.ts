import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss'
  ],
  
  // 开发环境配置
  sourcemap: {
    server: process.env.NODE_ENV === 'development',
    client: process.env.NODE_ENV === 'development'
  },
  
  // Vite配置优化
  vite: {
    build: {
      sourcemap: process.env.NODE_ENV === 'development',
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // 将node_modules中的库分组，避免过度分割
            if (id.includes('node_modules')) {
              // Vue相关库保持在一起
              if (id.includes('vue') || id.includes('@vue')) {
                return 'vue-vendor'
              }
              // 动画库单独分组
              if (id.includes('animejs')) {
                return 'animation-vendor'
              }
              // 其他第三方库
              return 'vendor'
            }
            
            // 将各个工具组件及其相关数据分割成独立chunk
            if (id.includes('TarotReading') || (id.includes('useDivinationData') && id.includes('tarot'))) {
              return 'tarot-module'
            }
            if (id.includes('AstrologyReading') || (id.includes('useAstrologyData'))) {
              return 'astrology-module'
            }
            if (id.includes('NumerologyReading') || (id.includes('useNumerologyData'))) {
              return 'numerology-module'
            }
            if (id.includes('ChineseZodiacReading') || (id.includes('useChineseZodiacData'))) {
              return 'chinese-zodiac-module'
            }
            
            // 动画相关代码（但不包括animejs库本身）
            if (id.includes('AnimationOverlay') || id.includes('useAnimations')) {
              return 'animations'
            }
          }
        }
      }
    }
  },
  
  // SEO 和 Meta 配置
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      title: 'Teller - Tarot Card Divination & Fortune Telling',
      titleTemplate: '%s | Teller',
      meta: [
        { name: 'description', content: 'Professional divination platform offering tarot cards, astrology, numerology, and fortune telling services. For entertainment purposes only.' },
        { name: 'keywords', content: 'divination,fortune telling,tarot cards,astrology,horoscope,numerology,palmistry,crystal ball,psychic reading' },
        { name: 'author', content: 'Teller Team' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        
        // Theme colors
        { name: 'theme-color', content: '#3b82f6' },
        { name: 'msapplication-TileColor', content: '#3b82f6' },
        { name: 'msapplication-config', content: '/browserconfig.xml' },
        
        // Mobile app settings
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Teller' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'format-detection', content: 'telephone=no' },
        
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Teller' },
        { property: 'og:title', content: 'Teller - Tarot Card Divination & Fortune Telling' },
        { property: 'og:description', content: 'Professional divination platform offering tarot cards, astrology, numerology and fortune telling services' },
        { property: 'og:image', content: '/images/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Teller - Tarot Card Divination & Fortune Telling' },
        { property: 'og:locale', content: 'en_US' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@teller' },
        { name: 'twitter:creator', content: '@teller' },
        { name: 'twitter:title', content: 'Teller - Tarot Card Divination & Fortune Telling' },
        { name: 'twitter:description', content: 'Professional divination platform offering tarot cards, astrology, numerology and fortune telling services' },
        { name: 'twitter:image', content: '/images/twitter-card.png' },
        { name: 'twitter:image:alt', content: 'Teller - Tarot Card Divination & Fortune Telling' }
      ],
      link: [
        // Favicons
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
        { rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg', color: '#3b82f6' },
        
        // Web App Manifest
        { rel: 'manifest', href: '/manifest.json' },
        
        // 移除未使用的字体预连接以避免警告
        
        // Canonical URL (will be set dynamically per page)
        { rel: 'canonical', href: 'https://teller.example.com' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Teller',
            description: 'Professional divination platform offering tarot cards, astrology, numerology and fortune telling services',
            url: 'https://teller.example.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://teller.example.com/search?q={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          })
        }
      ]
    }
  },
  
  i18n: {
    vueI18n: '~/i18n/i18n.config.ts',
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'fr', iso: 'fr-FR', file: 'fr.json', name: 'Français' },
      { code: 'zh', iso: 'zh-CN', file: 'zh.json', name: '中文' },
      { code: 'hi', iso: 'hi-IN', file: 'hi.json', name: 'हिन्दी' },
      { code: 'ar', iso: 'ar-SA', file: 'ar.json', name: 'العربية', dir: 'rtl' },
    ],
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'prefix',
    bundle: {
      optimizeTranslationDirective: true,
      runtimeOnly: false,
      fullInstall: true,
      compositionOnly: false
    },
    // 减少翻译回退警告
    debug: false
  },
  css: [
    '~/assets/css/main.css',
    '~/assets/css/mystical-theme.css'
  ],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
  nitro: {
    routeRules: {
      '/sitemap.xml': { 
        proxy: '/api/sitemap'
      },
      // 优化各页面的渲染策略
      '/': { prerender: true },
      '/tarot': { ssr: true },
      '/astrology': { ssr: true },
      '/numerology': { ssr: true },
      '/chinese-zodiac': { ssr: true }
    }
  },
  
  // 优化资源提示
  experimental: {
    // 减少预加载资源以避免未使用警告
    writeEarlyHints: false,
    viewTransition: false
  },
  
  // Vue配置 - 抑制警告和优化hydration
  vue: {
    compilerOptions: {
      // 在生产环境中移除开发时警告
      isCustomElement: (tag) => false
    }
  },
  
  // 全局配置
  runtimeConfig: {
    public: {
      // 抑制Vue实验性功能警告
      VUE_PROD_HYDRATION_MISMATCH_DETAILS: false
    }
  },
  
  // 开发服务器配置
  devServer: {
    port: 3001
  },
  
  // 构建时配置
  build: {
    transpile: process.env.NODE_ENV === 'production' ? [] : ['vue-i18n']
  }
})
