<template>
  <footer class="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-8 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Navigation Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">{{ t('footer.navigation') }}</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink :to="localePath('/about')" class="hover:text-blue-200 transition-colors">
                {{ t('footer.about') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/projects')" class="hover:text-blue-200 transition-colors">
                {{ t('footer.projects') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/faq')" class="hover:text-blue-200 transition-colors">
                {{ t('footer.faq') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/contact')" class="hover:text-blue-200 transition-colors">
                {{ t('footer.contact') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/privacy')" class="hover:text-blue-200 transition-colors">
                {{ t('footer.privacy') }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">{{ t('footer.quickLinks') }}</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink :to="localePath('/tarot')" class="hover:text-blue-200 transition-colors">
                {{ t('tarotTab') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/astrology')" class="hover:text-blue-200 transition-colors">
                {{ t('astrologyTab') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/numerology')" class="hover:text-blue-200 transition-colors">
                {{ t('numerologyTab') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/chinese-zodiac')" class="hover:text-blue-200 transition-colors">
                {{ t('chineseZodiacTab') }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-semibold mb-4">{{ t('footer.contactUs') }}</h3>
          <p class="mb-4">{{ t('footer.contactText') }}</p>
          <div class="flex space-x-4">
            <a href="mailto:contact@teller.eu.org" class="hover:text-blue-200 transition-colors">
              <span class="sr-only">Email</span>
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="mt-8 pt-8 border-t border-white/10 text-center text-sm">
        <p>&copy; {{ new Date().getFullYear() }} Teller.eu.org. {{ t('footer.rights') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script> 