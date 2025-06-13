export const useAnimations = () => {
  const { $anime } = useNuxtApp()

  const runMysticalAnimation = (text: string, callback?: () => void) => {
    if (!process.client) return

    const overlay = document.getElementById('animation-overlay')
    const animatedText = document.getElementById('animated-text')
    const animationFlare = document.getElementById('animation-flare')

    if (!overlay || !animatedText || !animationFlare) return

    // Cleanup previous animations
    ;($anime as any).remove([overlay, animatedText, animationFlare, '.particle'])
    animatedText.innerHTML = ''
    const existingParticles = overlay.querySelectorAll('.particle')
    existingParticles.forEach(p => p.remove())
    overlay.style.opacity = ''

    overlay.classList.add('visible')

    // Create particles
    const createAndAnimateParticles = () => {
      const colors = ['#FFD700', '#FF69B4', '#00FFFF', '#9370DB', '#FFFFFF']
      for (let i = 0; i < 70; i++) {
        const particle = document.createElement('div')
        particle.className = 'particle'
        const size = Math.floor(Math.random() * 4) + 1 + 'px'
        Object.assign(particle.style, {
          width: size, 
          height: size,
          left: `${Math.floor(Math.random() * 101)}%`, 
          top: `${Math.floor(Math.random() * 101)}%`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          opacity: '0'
        })
        overlay.appendChild(particle)
      }

      ;($anime as any)({
        targets: '.particle',
        opacity: [
          { value: () => Math.random() * 0.8 + 0.2, duration: () => Math.random() * 600 + 200 }, 
          { value: 0, duration: () => Math.random() * 400 + 200 }
        ],
        scale: [
          { value: () => Math.random() * 1 + 0.5, duration: () => Math.random() * 700 + 300 }, 
          { value: 1, duration: () => Math.random() * 300 + 200 }
        ],
        duration: () => Math.random() * 1500 + 1500, 
        easing: 'linear', 
        loop: true, 
        delay: ($anime as any).stagger(20),
      })
    }

    createAndAnimateParticles()

    // Animate flare
    ;($anime as any)({ 
      targets: animationFlare, 
      translateX: ['-50%', '50%'], 
      translateY: ['-50%', '50%'], 
      opacity: [0, 1, 0], 
      duration: 4000, 
      easing: 'easeInOutQuad', 
      direction: 'alternate', 
      loop: true 
    })

    // Display and animate text
    const displayText = text || '✨'
    const fontSize = Math.max(24, Math.min((window.innerWidth / displayText.length) * 1.5, 80))

    displayText.split('').forEach(char => {
      const span = document.createElement('span')
      span.innerHTML = char === ' ' ? '&nbsp;' : char
      span.style.fontSize = `${fontSize}px`
      animatedText.appendChild(span)
    })

    const animationTimeline = ($anime as any).timeline({
      complete: () => {
        ;($anime as any)({
          targets: overlay,
          opacity: 0,
          duration: 500,
          easing: 'easeInOutQuad',
          complete: () => {
            overlay.classList.remove('visible')
            overlay.style.opacity = ''
            ;($anime as any).remove([animationFlare, '.particle'])
            if (callback) setTimeout(callback, 50)
          }
        })
      }
    })

    animationTimeline.add({
      targets: '#animated-text span',
      opacity: [0, 1], 
      scale: [0, 1], 
      translateY: ['100%', 0], 
      rotateZ: [180, 0],
      duration: 1500, 
      easing: 'easeOutExpo', 
      delay: ($anime as any).stagger(Math.max(50, 1000 / displayText.length))
    }).add({
      targets: '#animated-text span',
      opacity: 0, 
      scale: 0.5,
      duration: 1000, 
      easing: 'easeInExpo', 
      delay: ($anime as any).stagger(50, { start: 500 })
    }, '+=500')
  }

  return {
    runMysticalAnimation
  }
} 