<template>
  <header class="relative mystical-bg border-b border-white/10">
    <!-- Language switcher positioned better for mobile -->
    <div class="absolute top-4 right-4 z-10">
      <LanguageSwitcher />
    </div>
    
    <!-- Main header content with mobile-first spacing -->
    <div class="px-4 py-8 text-center sm:py-10 lg:py-16">
      <div class="mx-auto max-w-4xl">
        <!-- Logo with mobile-optimized sizing -->
        <h1 class="text-2xl font-bold mb-3 logo-glow">
          <span class="inline-block mr-2 animate-pulse-soft">🔮</span>
          <span class="tracking-tight mystical-text-primary">Teller.eu.org</span>
        </h1>
        
        <!-- Tagline with mobile-first typography -->
        <p class="text-sm opacity-90 font-medium max-w-2xl mx-auto leading-relaxed mystical-text-primary">
          {{ t('tagline') }}
        </p>
        
        <!-- Subtitle for mobile screens -->
        <p class="text-xs opacity-75 mt-2 mystical-text-secondary">
          {{ t('subtitle') }}
        </p>
      </div>
    </div>
    
    <!-- Decorative gradient overlay for depth -->
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />
  </header>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Add SEO meta tags
useSeoMeta({
  title: t('seo.homepage.title'),
  description: t('seo.homepage.description')
})
</script>

<style scoped>
/* Enhanced mobile-first header styles with mystical theme */
header {
  /* Remove custom text shadow, let mystical theme handle styling */
  color: inherit;
}

/* Enhanced logo glow effect matching mystical theme */
.logo-glow {
  text-shadow: 
    0 0 20px rgba(255, 255, 255, 0.5),
    0 0 40px rgba(139, 92, 246, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Responsive typography */
@media (max-width: 640px) {
  .logo-glow {
    text-shadow: 
      0 0 15px rgba(255, 255, 255, 0.4),
      0 0 30px rgba(139, 92, 246, 0.2),
      0 1px 2px rgba(0, 0, 0, 0.3);
  }
}

/* Animation for the crystal ball emoji */
@keyframes pulse-soft {
  0%, 100% { 
    transform: scale(1);
    opacity: 1;
  }
  50% { 
    transform: scale(1.05);
    opacity: 0.9;
  }
}

.animate-pulse-soft {
  animation: pulse-soft 3s ease-in-out infinite;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  header {
    border-bottom: 2px solid white;
  }
  
  .logo-glow {
    text-shadow: none;
    font-weight: 900;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .animate-pulse-soft {
    animation: none;
  }
  
  .logo-glow {
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
}
</style> 