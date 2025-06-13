export const useAnimations = () => {
  const { logger, LogCategory } = useLogger()
  
  // Main mystical animation function using global event system
  const runMysticalAnimation = (text: string, callback?: () => void): Promise<void> => {
    return new Promise<void>((resolve) => {
      if (!process.client) {
        if (callback) callback()
        resolve()
        return
      }

      try {
        logger.logAnimationStart('mystical-animation', { text: text.substring(0, 20) + '...' })
        
        // Create a unique callback ID for this animation
        const callbackId = `animation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        // Set up one-time listener for animation completion
        const handleAnimationComplete = () => {
          window.removeEventListener(callbackId, handleAnimationComplete)
          if (callback) callback()
          logger.logAnimationEnd('mystical-animation', Date.now())
          resolve()
        }
        
        window.addEventListener(callbackId, handleAnimationComplete)
        
        // Trigger animation through global event
        window.dispatchEvent(new CustomEvent('mystical-animation-start', {
          detail: {
            text,
            callbackId
          }
        }))

      } catch (error) {
        logger.logError('useAnimations.runMysticalAnimation', error as Error)
        if (callback) callback()
        resolve()
      }
    })
  }

  // Card flip animation
  const flipCard = (cardElement: HTMLElement, cardData?: any) => {
    if (!process.client) return Promise.resolve()
    
    return new Promise<void>((resolve) => {
      try {
        logger.logAnimationStart('card-flip', { element: cardElement.id || 'unknown' })
        
        cardElement.style.transition = 'transform 0.6s'
        cardElement.style.transformStyle = 'preserve-3d'
        cardElement.classList.add('flipped')
        
        setTimeout(() => {
          logger.logAnimationEnd('card-flip', 600)
          resolve()
        }, 600)
        
      } catch (error) {
        logger.logError('useAnimations.flipCard', error as Error)
        resolve()
      }
    })
  }

  // Cleanup function
  const cleanupAnimations = () => {
    if (!process.client) return
    
    try {
      logger.info(LogCategory.ANIMATION, 'Cleaning up animations')
      
      // Remove all particle types
      const particles = document.querySelectorAll('.particle, .particle-trail, .stardust, .magic-particle, .meteor-trail, .css-particle, .stardust-particle')
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      })
      
      // Reset animation overlay
      const overlay = document.getElementById('animation-overlay')
      if (overlay) {
        overlay.classList.remove('visible')
        overlay.style.opacity = ''
      }
      
      logger.info(LogCategory.ANIMATION, 'Animation cleanup completed')
      
    } catch (error) {
      logger.logError('useAnimations.cleanupAnimations', error as Error)
    }
  }

  return {
    runMysticalAnimation,
    flipCard,
    cleanupAnimations
  }
} 