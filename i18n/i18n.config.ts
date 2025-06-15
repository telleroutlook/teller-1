import { defineI18nConfig } from '#imports'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_redirected',
    redirectOn: 'root',
    alwaysRedirect: true,
    fallbackLocale: 'en'
  },
  warnHtmlMessage: false,
  silentTranslationWarn: true,
  missingWarn: false,
  silentFallbackWarn: true,
  globalInjection: true,
  precompile: {
    strictMessage: false
  }
})) 