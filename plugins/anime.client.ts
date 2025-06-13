export default defineNuxtPlugin(async () => {
  if (process.client) {
    try {
      // Use dynamic import for animejs v4
      const animeModule = await import('animejs') as any
      
      // In animejs v4, the main function is 'animate'
      const anime = animeModule.animate || animeModule.default?.animate || animeModule.default
      const stagger = animeModule.stagger || animeModule.default?.stagger
      const timeline = animeModule.createTimeline || animeModule.timeline || animeModule.default?.timeline
      const utils = animeModule.utils || animeModule.default?.utils || {}
      
      // Verify that animate function exists
      if (typeof anime !== 'function') {
        console.warn('AnimejS: animate function not found in module:', animeModule)
        // Try fallback to default export
        const fallbackAnime = animeModule.default
        if (typeof fallbackAnime === 'function') {
          console.log('AnimejS: Using default export as fallback')
          return {
            provide: {
              anime: fallbackAnime as any
            }
          }
        }
        return {
          provide: {
            anime: null as any
          }
        }
      }
      
      console.log('AnimejS v4: Successfully loaded with animate function')
      
      // Create a wrapper that mimics the old anime.js API
      const animeWrapper = ((options: any) => {
        return anime(options)
      }) as any
      
      // Add helper methods with proper fallbacks
      animeWrapper.timeline = timeline ? (() => {
        const tl = timeline()
        return {
          add: (opts: any, offset?: any) => {
            if (tl && tl.add) {
              return tl.add(opts, offset)
            }
            // Fallback: just run the animation directly
            return anime(opts)
          },
          on: (event: string, callback: Function) => {
            if (tl && tl.on) {
              return tl.on(event, callback)
            }
            // Fallback: execute callback immediately for 'complete'
            if (event === 'complete') {
              setTimeout(callback, 1000)
            }
          }
        }
      }) : null
      
      animeWrapper.stagger = stagger || ((delay: number, start?: number) => {
        return (target: any, index: number) => (start || 0) + (index * delay)
      })
      
      animeWrapper.random = utils.random || ((min: number, max: number) => {
        return Math.random() * (max - min) + min
      })
      
      animeWrapper.remove = utils.remove || (() => {})
      
      return {
        provide: {
          anime: animeWrapper as any
        }
      }
    } catch (error) {
      console.warn('AnimejS: Failed to load:', error)
      return {
        provide: {
          anime: null as any
        }
      }
    }
  }
  
  // Server-side
  return {
    provide: {
      anime: null as any
    }
  }
}) 