<template>
  <footer class="mystical-bg border-t border-white/10 pb-16 sm:pb-0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Mobile-first collapsed layout -->
      <div class="pt-8 pb-6">
        <!-- Main navigation - Accordion style for mobile -->
        <div class="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
          <!-- Quick Access Section -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold mystical-text-gradient uppercase tracking-wider">
              {{ t('footer.quickAccess') }}
            </h3>
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-2">
              <NuxtLink 
                v-for="tool in quickTools" 
                :key="tool.name"
                :to="localePath(`/${tool.name}`)"
                class="mystical-card group flex items-center gap-3 p-3"
              >
                <span class="text-xl group-hover:scale-110 transition-transform duration-200 filter drop-shadow-lg">
                  {{ tool.icon }}
                </span>
                <span class="text-sm font-bold mystical-text-primary">
                  {{ t(tool.tabKey) }}
                </span>
              </NuxtLink>
            </div>
          </div>

          <!-- Company Info -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold mystical-text-gradient uppercase tracking-wider">
              {{ t('footer.company') }}
            </h3>
            <ul class="space-y-3">
              <li>
                <NuxtLink 
                  :to="localePath('/about')" 
                  class="text-sm mystical-text-primary mystical-footer-link flex items-center gap-2 font-medium"
                >
                  <span>{{ t('footer.about') }}</span>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink 
                  :to="localePath('/projects')" 
                  class="text-sm mystical-text-primary mystical-footer-link flex items-center gap-2 font-medium"
                >
                  <span>{{ t('footer.projects') }}</span>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink 
                  :to="localePath('/contact')" 
                  class="text-sm mystical-text-primary mystical-footer-link flex items-center gap-2 font-medium"
                >
                  <span>{{ t('footer.contact') }}</span>
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold mystical-text-gradient uppercase tracking-wider">
              {{ t('footer.support') }}
            </h3>
            <ul class="space-y-3">
              <li>
                <NuxtLink 
                  :to="localePath('/faq')" 
                  class="text-sm mystical-text-primary mystical-footer-link flex items-center gap-2 font-medium"
                >
                  <span>{{ t('footer.faq') }}</span>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink 
                  :to="localePath('/privacy')" 
                  class="text-sm mystical-text-primary mystical-footer-link flex items-center gap-2 font-medium"
                >
                  <span>{{ t('footer.privacy') }}</span>
                </NuxtLink>
              </li>
              <li>
                <a 
                  href="mailto:contact@teller.eu.org" 
                  class="text-sm mystical-text-primary mystical-footer-link flex items-center gap-2 font-medium"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{{ t('footer.email') }}</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Newsletter & Social -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold mystical-text-gradient uppercase tracking-wider">
              {{ t('footer.connect') }}
            </h3>
            <div class="space-y-3">
              <p class="text-sm mystical-text-primary font-medium">
                {{ t('footer.connectText') }}
              </p>
              <div class="flex gap-3">
                <button 
                  type="button"
                  class="mystical-card p-2 mystical-text-primary"
                  :aria-label="t('footer.shareAria')"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
                <button 
                  type="button"
                  class="mystical-card p-2 mystical-text-primary"
                  :aria-label="t('footer.bookmarkAria')"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom section -->
      <div class="border-t border-white/10 py-6">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <p class="text-sm mystical-text-primary font-medium">
              &copy; {{ new Date().getFullYear() }} Teller.eu.org
            </p>
            <span class="hidden sm:inline mystical-text-primary font-bold">•</span>
            <p class="text-sm mystical-text-primary font-medium">
              {{ t('footer.rights') }}
            </p>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 text-xs mystical-text-secondary font-medium">
              <span>{{ t('footer.version') }}</span>
              <span class="font-mono">v2.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
interface QuickTool {
  name: string
  icon: string
  tabKey: string
}

const { t } = useI18n()
const localePath = useLocalePath()

// Quick access tools for mobile-first design
const quickTools = ref<QuickTool[]>([
  { name: 'tarot', icon: '🃏', tabKey: 'tarotTab' },
  { name: 'astrology', icon: '⭐', tabKey: 'astrologyTab' },
  { name: 'numerology', icon: '🔢', tabKey: 'numerologyTab' },
  { name: 'chinese-zodiac', icon: '🐉', tabKey: 'chineseZodiacTab' }
])
</script>

