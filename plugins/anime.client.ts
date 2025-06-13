export default defineNuxtPlugin(async () => {
  if (process.client) {
    try {
      // Use dynamic import for animejs with proper typing
      const animeModule = await import('animejs') as any
      
      // Handle different export formats
      let anime
      if (animeModule.default) {
        anime = animeModule.default
      } else if (typeof animeModule === 'function') {
        anime = animeModule
      } else {
        anime = animeModule
      }
      
      // Verify that anime is a function
      if (typeof anime !== 'function') {
        console.warn('AnimejS: Loaded module is not a function:', typeof anime)
        return {
          provide: {
            anime: null
          }
        }
      }
      
      console.log('AnimejS: Successfully loaded')
      
      return {
        provide: {
          anime
        }
      }
    } catch (error) {
      console.warn('AnimejS: Failed to load:', error)
      return {
        provide: {
          anime: null
        }
      }
    }
  }
  
  // Server-side
  return {
    provide: {
      anime: null
    }
  }
}) 