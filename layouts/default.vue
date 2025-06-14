<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50">
    <AppHeader />
    <main class="flex-1 px-4 sm:px-6 lg:px-8 pb-20 sm:pb-8">
      <div class="max-w-7xl mx-auto">
        <div class="py-4 sm:py-6 lg:py-8">
          <slot />
        </div>
      </div>
    </main>
    <BottomNav />
    <AppFooter />
    <AnimationOverlay />
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()

// Set document language and direction with proper meta management
onMounted(() => {
  if (process.client) {
    updateDocumentAttributes()
    setupViewportOptimizations()
  }
})

watch(locale, () => {
  if (process.client) {
    updateDocumentAttributes()
  }
})

const updateDocumentAttributes = (): void => {
  document.documentElement.lang = locale.value
  document.documentElement.dir = locale.value === 'ar' ? 'rtl' : 'ltr'
  
  // Add mobile-optimized meta tags if not present
  if (!document.querySelector('meta[name="viewport"]')) {
    const viewport = document.createElement('meta')
    viewport.name = 'viewport'
    viewport.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover'
    document.head.appendChild(viewport)
  }
}

const setupViewportOptimizations = (): void => {
  // Prevent zoom on input focus for iOS
  const addInputEventListeners = () => {
    const inputs = document.querySelectorAll('input, select, textarea')
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        const viewport = document.querySelector('meta[name="viewport"]')
        if (viewport) {
          viewport.setAttribute('content', 
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
          )
        }
      })
      
      input.addEventListener('blur', () => {
        const viewport = document.querySelector('meta[name="viewport"]')
        if (viewport) {
          viewport.setAttribute('content', 
            'width=device-width, initial-scale=1.0, viewport-fit=cover'
          )
        }
      })
    })
  }
  
  // Add listeners immediately and on content changes
  addInputEventListeners()
  
  // Watch for dynamic content changes
  const observer = new MutationObserver(() => {
    addInputEventListeners()
  })
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

// Provide responsive breakpoint information to child components
provide('breakpoints', {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
})
</script>

<style scoped>
/* Ensure proper mobile layout foundations */
.min-h-screen {
  /* Account for mobile browser UI */
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height when supported */
}

/* Optimize touch targets for mobile */
:deep(button),
:deep(a),
:deep(input),
:deep(select),
:deep(textarea) {
  min-height: 44px; /* iOS accessibility guidelines */
  min-width: 44px;
}

/* Improve text readability on mobile */
:deep(p),
:deep(span),
:deep(div) {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

/* Smooth scroll behavior */
:deep(html) {
  scroll-behavior: smooth;
}

/* Optimize animations for mobile performance */
@media (prefers-reduced-motion: reduce) {
  :deep(*) {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Dark mode support preparation */
@media (prefers-color-scheme: dark) {
  .bg-gradient-to-br {
    background-image: linear-gradient(
      to bottom right,
      rgb(17 24 39 / 0.5),
      rgb(31 41 55),
      rgb(17 24 39 / 0.5)
    );
  }
}
</style> 