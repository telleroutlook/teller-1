<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// All SEO and icon configurations have been moved to nuxt.config.ts, keeping only dynamic configurations here

// Preload critical resources for better performance
useHead({
  link: [
    { rel: 'preload', href: '/fonts/system-font.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }
  ]
})
</script>
