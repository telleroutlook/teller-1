<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Mobile-first app configuration
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' },
    { name: 'theme-color', content: '#3b82f6' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'mobile-web-app-capable', content: 'yes' }
  ],
  link: [
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/manifest.json' }
  ]
})

// Preload critical resources for better mobile performance
useHead({
  link: [
    { rel: 'preload', href: '/fonts/system-font.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' }
  ]
})
</script>
