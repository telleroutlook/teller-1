export const useAnimations = () => {
  const { logger, LogCategory } = useLogger()
  const { $anime } = useNuxtApp()

  // Use the anime instance from plugin or null as fallback
  const animeInstance = $anime || null
  
  // Check if animation is available
  const isAnimationAvailable = () => {
    return process.client && animeInstance && typeof animeInstance === 'function'
  }
  
  // Fallback animation function for when anime.js is not available
  const fallbackAnimation = (callback?: () => void) => {
    if (!process.client) return Promise.resolve()
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (callback) callback()
        resolve()
      }, 1000)
    })
  }

  // Animation overlay management
  const showAnimationOverlay = () => {
    if (!process.client) return null
    
    try {
      const overlay = document.getElementById('animation-overlay')
      if (overlay) {
        logger.logAnimationStart('overlay-show', { elementId: 'animation-overlay' })
        overlay.classList.add('visible')
        return overlay
      } else {
        logger.logError('useAnimations.showAnimationOverlay', 'Animation overlay element not found')
        return null
      }
    } catch (error) {
      logger.logError('useAnimations.showAnimationOverlay', error as Error)
      return null
    }
  }

  const hideAnimationOverlay = () => {
    if (!process.client) return
    
    try {
      const overlay = document.getElementById('animation-overlay')
      if (overlay) {
        logger.logAnimationStart('overlay-hide', { elementId: 'animation-overlay' })
        
        if (animeInstance) {
          animeInstance({
            targets: overlay,
            opacity: 0,
            duration: 500,
            easing: 'easeInOutQuad',
            complete: () => {
              overlay.classList.remove('visible')
              overlay.style.opacity = ''
              logger.logAnimationEnd('overlay-hide', 500)
            }
          })
        } else {
          // Fallback without animation
          overlay.classList.remove('visible')
          overlay.style.opacity = ''
        }
      }
    } catch (error) {
      logger.logError('useAnimations.hideAnimationOverlay', error as Error)
    }
  }

  // Particle system
  const createParticles = (container: HTMLElement, count: number = 70) => {
    if (!process.client || !isAnimationAvailable()) return []
    
    try {
      logger.logAnimationStart('particles-create', { count, container: container.id })
      
      const colors = ['#FFD700', '#FF69B4', '#00FFFF', '#9370DB', '#FFFFFF']
      const particles: HTMLElement[] = []
      
      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div')
        particle.className = 'particle'
        
        const size = animeInstance.random(1, 4) + 'px'
        Object.assign(particle.style, {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: '50%',
          left: `${animeInstance.random(0, 100)}%`,
          top: `${animeInstance.random(0, 100)}%`,
          backgroundColor: colors[animeInstance.random(0, colors.length - 1)],
          opacity: '0',
          pointerEvents: 'none',
          zIndex: '10000'
        })
        
        container.appendChild(particle)
        particles.push(particle)
      }
      
      // Animate particles
      animeInstance({
        targets: particles,
        opacity: [
          { value: () => animeInstance.random(0.2, 1), duration: () => animeInstance.random(200, 800) },
          { value: 0, duration: () => animeInstance.random(200, 600) }
        ],
        scale: [
          { value: () => animeInstance.random(0.5, 1.5), duration: () => animeInstance.random(300, 1000) },
          { value: 1, duration: () => animeInstance.random(200, 500) }
        ],
        duration: () => animeInstance.random(1500, 3000),
        easing: 'linear',
        loop: true,
        delay: animeInstance.stagger(20)
      })
      
      logger.logAnimationEnd('particles-create', count)
      return particles
      
    } catch (error) {
      logger.logError('useAnimations.createParticles', error as Error, { count })
      return []
    }
  }

  // Text animation
  const animateText = (text: string, container: HTMLElement) => {
    if (!process.client || !isAnimationAvailable()) return Promise.resolve()
    
    return new Promise<void>((resolve) => {
      try {
        logger.logAnimationStart('text-animation', { text: text.substring(0, 20) + '...', container: container.id })
        
        // Clear previous content
        container.innerHTML = ''
        
        // Calculate responsive font size
        const fontSize = Math.max(24, Math.min((window.innerWidth / text.length) * 1.5, 80))
        
        // Create text spans
        text.split('').forEach(char => {
          const span = document.createElement('span')
          span.innerHTML = char === ' ' ? '&nbsp;' : char
          span.style.fontSize = `${fontSize}px`
          span.style.position = 'relative'
          span.style.display = 'inline-block'
          span.style.color = 'white'
          span.style.fontWeight = 'bold'
          span.style.textShadow = '0 0 8px #fff, 0 0 15px #fff, 0 0 25px #ff00ff, 0 0 40px #ff00ff'
          span.style.margin = '0 0.1em'
          container.appendChild(span)
        })
        
        // Animation timeline
        const timeline = animeInstance.timeline({
          complete: () => {
            logger.logAnimationEnd('text-animation', Date.now())
            resolve()
          }
        })
        
        timeline.add({
          targets: container.children,
          opacity: [0, 1],
          scale: [0, 1],
          translateY: ['100%', 0],
          rotateZ: [180, 0],
          duration: 1500,
          easing: 'easeOutExpo',
          delay: animeInstance.stagger(Math.max(50, 1000 / text.length))
        }).add({
          targets: container.children,
          opacity: 0,
          scale: 0.5,
          duration: 1000,
          easing: 'easeInExpo',
          delay: animeInstance.stagger(50, { start: 500 })
        }, '+=500')
        
      } catch (error) {
        logger.logError('useAnimations.animateText', error as Error, { text })
        resolve()
      }
    })
  }

  // Flare animation
  const animateFlare = (flareElement: HTMLElement) => {
    if (!process.client || !isAnimationAvailable()) return
    
    try {
      logger.logAnimationStart('flare-animation', { element: flareElement.id })
      
      animeInstance({
        targets: flareElement,
        translateX: ['-50%', '50%'],
        translateY: ['-50%', '50%'],
        opacity: [0, 1, 0],
        duration: 4000,
        easing: 'easeInOutQuad',
        direction: 'alternate',
        loop: true
      })
      
    } catch (error) {
      logger.logError('useAnimations.animateFlare', error as Error)
    }
  }

  // Main mystical animation function
  const runMysticalAnimation = (text: string, callback?: () => void): Promise<void> => {
    return new Promise<void>((resolve) => {
      if (!process.client) {
        logger.warn(LogCategory.ANIMATION, 'runMysticalAnimation called on server side')
        if (callback) callback()
        resolve()
        return
      }
      
      // Check if animation is available, fallback if not
      if (!isAnimationAvailable()) {
        logger.warn(LogCategory.ANIMATION, 'anime.js not available, using fallback animation')
        fallbackAnimation(callback).then(() => resolve())
        return
      }

      try {
        logger.logAnimationStart('mystical-animation', { text: text.substring(0, 30) + '...' })
        
        const overlay = showAnimationOverlay()
        if (!overlay) {
          logger.warn(LogCategory.ANIMATION, 'No overlay found, animation aborted')
          if (callback) callback()
          resolve()
          return
        }

        // Clear existing content
        overlay.innerHTML = ''

        // Create container for text animation
        const textContainer = document.createElement('div')
        textContainer.id = 'animation-text-container'
        Object.assign(textContainer.style, {
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          zIndex: '10001'
        })
        overlay.appendChild(textContainer)

        // Create flare effect
        const flare = document.createElement('div')
        flare.id = 'animation-flare'
        Object.assign(flare.style, {
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,215,0,0.6) 30%, rgba(255,105,180,0.4) 60%, transparent 100%)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(10px)',
          zIndex: '10000'
        })
        overlay.appendChild(flare)

        // Create particle container
        const particleContainer = document.createElement('div')
        particleContainer.id = 'particle-container'
        Object.assign(particleContainer.style, {
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: '9999'
        })
        overlay.appendChild(particleContainer)

        // Start animations
        animateFlare(flare)
        const particles = createParticles(particleContainer, 50) || []

        // Run text animation
        animateText(text, textContainer).then(() => {
          setTimeout(() => {
            // Cleanup particles
            particles.forEach(particle => {
              if (particle.parentNode) {
                particle.parentNode.removeChild(particle)
              }
            })
            
            // Hide overlay
            hideAnimationOverlay()
            
            // Execute callback
            if (callback) callback()
            
            logger.logAnimationEnd('mystical-animation', Date.now())
            resolve()
          }, 1000)
        }).catch(error => {
          logger.logError('useAnimations.runMysticalAnimation.textAnimation', error as Error)
          hideAnimationOverlay()
          if (callback) callback()
          resolve()
        })

      } catch (error) {
        logger.logError('useAnimations.runMysticalAnimation', error as Error, { text })
        hideAnimationOverlay()
        if (callback) callback()
        resolve()
      }
    })
  }

  // Card flip animation
  const flipCard = (cardElement: HTMLElement, cardData?: any) => {
    if (!process.client || !isAnimationAvailable()) return Promise.resolve()
    
    return new Promise<void>((resolve) => {
      try {
        logger.logAnimationStart('card-flip', { element: cardElement.id, cardData })
        
        animeInstance({
          targets: cardElement,
          rotateY: '180deg',
          duration: 600,
          easing: 'easeInOutSine',
          complete: () => {
            logger.logAnimationEnd('card-flip', 600)
            resolve()
          }
        })
        
      } catch (error) {
        logger.logError('useAnimations.flipCard', error as Error, { cardData })
        resolve()
      }
    })
  }

  // Cleanup function
  const cleanupAnimations = () => {
    if (!process.client) return
    
    try {
      logger.info(LogCategory.ANIMATION, 'Cleaning up animations')
      
      // Remove particles
      const particles = document.querySelectorAll('.particle')
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      })
      
      // Reset animation overlay
      const overlay = document.getElementById('animation-overlay')
      if (overlay) {
        overlay.innerHTML = ''
        overlay.classList.remove('visible')
        overlay.style.opacity = ''
      }
      
      // Remove text containers
      const textContainer = document.getElementById('animation-text-container')
      if (textContainer && textContainer.parentNode) {
        textContainer.parentNode.removeChild(textContainer)
      }
      
      // Remove flare effects
      const flare = document.getElementById('animation-flare')
      if (flare && flare.parentNode) {
        flare.parentNode.removeChild(flare)
      }
      
      // Remove particle containers
      const particleContainer = document.getElementById('particle-container')
      if (particleContainer && particleContainer.parentNode) {
        particleContainer.parentNode.removeChild(particleContainer)
      }
      
      logger.info(LogCategory.ANIMATION, 'Animation cleanup completed')
      
    } catch (error) {
      logger.logError('useAnimations.cleanupAnimations', error as Error)
    }
  }

  return {
    runMysticalAnimation,
    flipCard,
    showAnimationOverlay,
    hideAnimationOverlay,
    createParticles,
    animateText,
    animateFlare,
    cleanupAnimations
  }
} 