export default defineNuxtPlugin(async () => {
  if (process.client) {
    try {
      // Use dynamic import for animejs with type assertion
      const animeModule = await import('animejs') as any
      const anime = animeModule.default || animeModule
      
      return {
        provide: {
          anime
        }
      }
    } catch (error) {
      console.warn('Failed to load animejs:', error)
      return {
        provide: {
          anime: null
        }
      }
    }
  }
  
  return {
    provide: {
      anime: null
    }
  }
}) 