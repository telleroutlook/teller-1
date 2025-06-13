import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss'
  ],
  i18n: {
    vueI18n: './i18n/i18n.config.ts',
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
    strategy: 'prefix_except_default',
    bundle: {
      optimizeTranslationDirective: false
    }
  },
  css: ['~/assets/css/main.css']
})
