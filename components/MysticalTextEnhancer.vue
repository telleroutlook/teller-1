<template>
  <div class="mystical-text-enhancer">
    <!-- 全局文字增强效果 -->
    <ClientOnly>
      <div class="text-aura-overlay" ref="textAuraRef"></div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const textAuraRef = ref<HTMLElement>()

let observer: MutationObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let animatedElements = new Set<HTMLElement>()

// 神秘色彩系统
const mysticalColors = [
  '#8B5CF6', '#A855F7', '#C084FC', '#E879F9', '#F3E8FF',
  '#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA',
  '#FF3399', '#9933FF', '#33FF99', '#FF9933', '#3399FF'
]

onMounted(() => {
  if (process.client) {
    initializeTextEnhancement()
  }
})

onUnmounted(() => {
  if (process.client) {
    cleanupObservers()
  }
})

const initializeTextEnhancement = () => {
  // 添加全局CSS动画
  addGlobalTextAnimations()
  
  // 设置文字监听器
  setupTextObserver()
  
  // 设置交集观察器
  setupIntersectionObserver()
  
  // 初始处理页面上的文字
  processExistingText()
}

const addGlobalTextAnimations = () => {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes mysticalTextBreath {
      0%, 100% {
        opacity: 0.4;
        transform: scale(1) rotate(0deg);
        filter: blur(0px);
      }
      20% {
        opacity: 0.9;
        transform: scale(1.03) rotate(0.8deg);
        filter: blur(0.3px);
      }
      40% {
        opacity: 0.2;
        transform: scale(0.96) rotate(-0.5deg);
        filter: blur(0.2px);
      }
      60% {
        opacity: 0.8;
        transform: scale(1.02) rotate(0.3deg);
        filter: blur(0.1px);
      }
      80% {
        opacity: 0.3;
        transform: scale(0.98) rotate(-0.2deg);
        filter: blur(0.25px);
      }
    }
    
    @keyframes mysticalTextTwist {
      0%, 100% {
        transform: rotate(0deg) scale(1);
        text-shadow: 0 0 5px rgba(139, 92, 246, 0.3);
      }
      20% {
        transform: rotate(0.8deg) scale(1.005);
        text-shadow: 0 0 8px rgba(168, 85, 247, 0.4);
      }
      40% {
        transform: rotate(-0.5deg) scale(0.995);
        text-shadow: 0 0 6px rgba(192, 132, 252, 0.35);
      }
      60% {
        transform: rotate(0.3deg) scale(1.003);
        text-shadow: 0 0 7px rgba(232, 121, 249, 0.38);
      }
      80% {
        transform: rotate(-0.2deg) scale(1.001);
        text-shadow: 0 0 5px rgba(139, 92, 246, 0.32);
      }
    }
    
    @keyframes mysticalTextGlow {
      0%, 100% {
        text-shadow: 
          0 0 5px rgba(139, 92, 246, 0.4),
          0 0 10px rgba(139, 92, 246, 0.2);
        color: rgba(255, 255, 255, 0.8);
      }
      16% {
        text-shadow: 
          0 0 15px rgba(255, 0, 102, 0.6),
          0 0 25px rgba(255, 0, 102, 0.3);
        color: rgba(255, 51, 153, 0.9);
      }
      33% {
        text-shadow: 
          0 0 12px rgba(102, 0, 255, 0.5),
          0 0 20px rgba(102, 0, 255, 0.3);
        color: rgba(153, 51, 255, 0.8);
      }
      50% {
        text-shadow: 
          0 0 18px rgba(0, 255, 102, 0.7),
          0 0 30px rgba(0, 255, 102, 0.4);
        color: rgba(51, 255, 153, 0.9);
      }
      66% {
        text-shadow: 
          0 0 10px rgba(255, 102, 0, 0.5),
          0 0 20px rgba(255, 102, 0, 0.3);
        color: rgba(255, 153, 51, 0.8);
      }
      83% {
        text-shadow: 
          0 0 14px rgba(0, 102, 255, 0.6),
          0 0 28px rgba(0, 102, 255, 0.3);
        color: rgba(51, 153, 255, 0.9);
      }
    }
    
    @keyframes mysticalColorFlow {
      0%, 100% {
        background: linear-gradient(45deg, 
          rgba(139, 92, 246, 0.8), 
          rgba(168, 85, 247, 0.6)
        );
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      }
      20% {
        background: linear-gradient(45deg, 
          rgba(255, 0, 102, 0.9), 
          rgba(255, 51, 153, 0.7)
        );
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      }
      40% {
        background: linear-gradient(45deg, 
          rgba(0, 255, 102, 0.8), 
          rgba(51, 255, 153, 0.6)
        );
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      }
      60% {
        background: linear-gradient(45deg, 
          rgba(255, 102, 0, 0.9), 
          rgba(255, 153, 51, 0.7)
        );
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      }
      80% {
        background: linear-gradient(45deg, 
          rgba(0, 102, 255, 0.8), 
          rgba(51, 153, 255, 0.6)
        );
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      }
    }
    
    .mystical-text-enhanced {
      animation: 
        mysticalTextBreath 5s ease-in-out infinite,
        mysticalTextTwist 7s ease-in-out infinite,
        mysticalTextGlow 3s ease-in-out infinite,
        mysticalColorFlow 8s linear infinite;
      animation-delay: var(--mystical-delay, 0s);
      transition: all 0.3s ease;
      position: relative;
    }
    
    .mystical-text-enhanced:hover {
      animation-duration: 2s, 3s, 1.5s, 4s;
      transform: scale(1.08) !important;
      text-shadow: 
        0 0 20px rgba(168, 85, 247, 0.9),
        0 0 35px rgba(168, 85, 247, 0.6),
        0 0 50px rgba(192, 132, 252, 0.4) !important;
    }
    
    @media (prefers-reduced-motion: reduce) {
      .mystical-text-enhanced {
        animation: none !important;
      }
    }
    
    /* 强制应用动画效果 */
    body .mystical-text-enhanced {
      animation: 
        mysticalTextBreath 5s ease-in-out infinite,
        mysticalTextTwist 7s ease-in-out infinite,
        mysticalTextGlow 3s ease-in-out infinite,
        mysticalColorFlow 8s linear infinite !important;
    }
    
    /* 确保文字可见 */
    .mystical-text-enhanced {
      opacity: 1 !important;
      visibility: visible !important;
    }
  `
  
  document.head.appendChild(style)
}

const setupTextObserver = () => {
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement
            processTextElement(element)
            
            // 处理子元素
            const textElements = element.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a, button, label')
            textElements.forEach(textEl => processTextElement(textEl as HTMLElement))
          }
        })
      }
    })
  })
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

const setupIntersectionObserver = () => {
  intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const element = entry.target as HTMLElement
      
      if (entry.isIntersecting) {
        // 元素进入可视区域时增强动画
        if (animatedElements.has(element)) {
          element.style.animationPlayState = 'running'
        }
      } else {
        // 元素离开可视区域时暂停动画（性能优化）
        if (animatedElements.has(element)) {
          element.style.animationPlayState = 'paused'
        }
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  })
}

const processExistingText = () => {
  const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a, button, label')
  textElements.forEach(element => processTextElement(element as HTMLElement))
}

const processTextElement = (element: HTMLElement) => {
  // 跳过已经处理过的元素
  if (animatedElements.has(element)) return
  
  // 跳过特定类型的元素
  if (
    element.classList.contains('mystical-text-enhanced') ||
    element.classList.contains('no-mystical-enhancement') ||
    element.tagName === 'SCRIPT' ||
    element.tagName === 'STYLE' ||
    element.tagName === 'NOSCRIPT' ||
    element.hasAttribute('contenteditable') ||
    element.closest('.mystical-text-enhancer')
  ) {
    return
  }
  
  // 检查是否包含文本内容
  const hasTextContent = element.textContent && element.textContent.trim().length > 0
  if (!hasTextContent) return
  
  // 更宽泛的元素选择，包括更多文本元素
  const isTextElement = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'A', 'BUTTON', 'LABEL', 'DIV'].includes(element.tagName)
  
  // 检查是否是叶子节点或主要包含文本的节点
  const hasSignificantChildren = Array.from(element.children).some(child => 
    child.tagName !== 'BR' && 
    child.tagName !== 'SPAN' && 
    (child as HTMLElement).textContent?.trim()
  )
  
  if (isTextElement && (!hasSignificantChildren || element.tagName === 'SPAN' || element.children.length === 0)) {
    enhanceTextElement(element)
  }
}

const enhanceTextElement = (element: HTMLElement) => {
  // 添加增强类
  element.classList.add('mystical-text-enhanced')
  
  // 设置随机延迟
  const delay = Math.random() * 3
  element.style.setProperty('--mystical-delay', `${delay}s`)
  
  // 为特定元素添加更强的效果
  if (['H1', 'H2', 'H3'].includes(element.tagName)) {
    element.style.setProperty('--mystical-intensity', '1.2')
  } else if (['H4', 'H5', 'H6'].includes(element.tagName)) {
    element.style.setProperty('--mystical-intensity', '1.1')
  } else {
    element.style.setProperty('--mystical-intensity', '1.0')
  }
  
  // 添加到动画元素集合
  animatedElements.add(element)
  
  // 添加到交集观察器
  if (intersectionObserver) {
    intersectionObserver.observe(element)
  }
  
  // 添加鼠标悬停效果
  let hoverTimeout: NodeJS.Timeout
  
  element.addEventListener('mouseenter', () => {
    clearTimeout(hoverTimeout)
    const color = mysticalColors[Math.floor(Math.random() * mysticalColors.length)]
    element.style.setProperty('--hover-color', color)
  })
  
  element.addEventListener('mouseleave', () => {
    hoverTimeout = setTimeout(() => {
      element.style.removeProperty('--hover-color')
    }, 300)
  })
}

const cleanupObservers = () => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  
  if (intersectionObserver) {
    intersectionObserver.disconnect()
    intersectionObserver = null
  }
  
  // 清理增强效果
  animatedElements.forEach(element => {
    element.classList.remove('mystical-text-enhanced')
    element.style.removeProperty('--mystical-delay')
    element.style.removeProperty('--mystical-intensity')
    element.style.removeProperty('--hover-color')
  })
  
  animatedElements.clear()
}
</script>

<style scoped>
.mystical-text-enhancer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1;
}

.text-aura-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
}

/* 为特定页面元素优化动画强度 */
:deep(.mystical-text-enhanced) {
  will-change: transform, opacity, filter;
}

:deep(.mystical-text-enhanced.title) {
  animation-duration: 6s, 4s, 3s !important;
}

:deep(.mystical-text-enhanced.subtitle) {
  animation-duration: 7s, 5s, 3.5s !important;
}

:deep(.mystical-text-enhanced.body-text) {
  animation-duration: 9s, 7s, 5s !important;
}
</style> 