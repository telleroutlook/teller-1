/**
 * Simple animation composable to replace complex anime.js animations
 */
export const useSimpleAnimation = () => {
  const showAnimation = (text: string, callback?: () => void): Promise<void> => {
    return new Promise((resolve) => {
      if (!process.client) {
        if (callback) callback()
        resolve()
        return
      }

      // Generate unique callback ID
      const callbackId = `animation-callback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Listen for animation completion
      if (callback) {
        window.addEventListener(callbackId, () => {
          callback()
          resolve()
        }, { once: true })
      } else {
        // If no callback, resolve after animation time
        setTimeout(() => resolve(), 5000)
      }

      // Trigger the animation
      window.dispatchEvent(new CustomEvent('mystical-animation-start', {
        detail: { text, callbackId }
      }))
    })
  }

  return {
    showAnimation
  }
} 