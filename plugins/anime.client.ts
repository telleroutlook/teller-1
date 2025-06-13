export default defineNuxtPlugin(async () => {
  if (process.client) {
    try {
      // Use dynamic import for animejs v4
      const animeModule = await import('animejs') as any
      
      // In animejs v4, the main function is 'animate'
      const animate = animeModule.animate || animeModule.default?.animate || animeModule.default
      const stagger = animeModule.stagger || animeModule.default?.stagger
      const timeline = animeModule.createTimeline || animeModule.timeline || animeModule.default?.timeline
      const utils = animeModule.utils || animeModule.default?.utils || {}
      
      // Verify that animate function exists
      if (typeof animate !== 'function') {
        console.warn('AnimejS v4: animate function not found in module:', animeModule)
        return {
          provide: {
            anime: null as any
          }
        }
      }
      
      console.log('AnimejS v4: Successfully loaded with animate function')
      
      // Create v4 compatible API
      const animeAPI = {
        // Main animate function - v4 style: animate(targets, parameters)
        animate: (targets: any, parameters?: any) => {
          if (parameters) {
            // v4 style: animate(targets, parameters)
            return animate(targets, parameters)
          } else {
            // v3 style: anime({ targets: ..., ... }) - convert to v4
            const options = targets
            if (options.targets) {
              const { targets: target, ...params } = options
              return animate(target, params)
            } else {
              console.warn('Invalid anime.js options:', options)
              return null
            }
          }
        },
        
        // For backward compatibility with old syntax
        __call: (options: any) => {
          if (options.targets) {
            const { targets, ...params } = options
            return animate(targets, params)
          } else {
            console.warn('Invalid anime.js options (missing targets):', options)
            return null
          }
        },
        
        // Helper methods
        stagger: stagger || ((delay: number, start?: number) => {
          return (target: any, index: number) => (start || 0) + (index * delay)
        }),
        
        random: utils.random || ((min: number, max: number) => {
          return Math.random() * (max - min) + min
        }),
        
        remove: utils.remove || (() => {}),
        
        timeline: timeline ? () => {
          const tl = timeline()
          return {
            add: (targets: any, params?: any, position?: any) => {
              if (tl && tl.add) {
                if (params) {
                  // v4 style
                  return tl.add(targets, params, position)
                } else {
                  // v3 style conversion
                  const options = targets
                  if (options.targets) {
                    const { targets: target, ...parameters } = options
                    return tl.add(target, parameters, params) // params becomes position
                  }
                }
              }
              return tl
            },
            on: (event: string, callback: Function) => {
              if (tl && tl.on) {
                return tl.on(event, callback)
              }
              if (event === 'complete') {
                setTimeout(callback, 1000)
              }
              return tl
            }
          }
        } : null
      }
      
      // Make the API callable for backward compatibility
      const callableAPI = ((options: any) => {
        return animeAPI.__call(options)
      }) as any
      
      // Copy all methods to the callable function
      Object.assign(callableAPI, animeAPI)
      
      return {
        provide: {
          anime: callableAPI as any
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