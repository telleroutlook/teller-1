<template>
  <div 
    id="simple-animation-overlay" 
    v-show="isVisible"
    class="mystical-bg"
    :class="{ 'animate-fade-in': isVisible, 'animate-fade-out': !isVisible }"
  >
    <!-- 增强的背景星星 -->
    <ClientOnly>
      <div class="mystical-stars">
        <div 
          class="mystical-star" 
          v-for="i in 50" 
          :key="i" 
          :style="getStarStyle(i)"
          :class="`star-size-${(i % 3) + 1}`"
        >
          {{ getStarIcon(i) }}
        </div>
      </div>
      
      <!-- 漂浮粒子效果 -->
      <div class="floating-particles">
        <div 
          class="particle" 
          v-for="j in 30" 
          :key="`particle-${j}`"
          :style="getParticleStyle(j)"
        ></div>
      </div>
      
      <!-- 大型透明水晶球 -->
      <div class="crystal-orb-container">
        <div class="crystal-orb">🔮</div>
        <div class="crystal-orb-glow"></div>
      </div>
    </ClientOnly>
    
    <div 
      id="simple-animation-text" 
      ref="animatedTextRef"
      class="mystical-animated-text"
    ></div>
  </div>
</template>

<script setup lang="ts">
const isVisible = ref(false)
const animatedTextRef = ref<HTMLElement>()

let animationTimeouts: (number | NodeJS.Timeout)[] = []
let isAnimationRunning = false

// 清理所有超时
const clearAnimationTimeouts = () => {
  animationTimeouts.forEach(timeout => clearTimeout(timeout))
  animationTimeouts = []
}

// 简单的伪随机数生成器，基于种子
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// 神秘色彩系统
const mysticalColors = [
  '#FF0066', '#6600FF', '#00FF66', '#FF6600', '#0066FF',
  '#FF3399', '#9933FF', '#33FF99', '#FF9933', '#3399FF',
  '#FFD700', '#FF1493', '#00CED1', '#32CD32', '#FF6347',
  '#8B5CF6', '#A855F7', '#C084FC', '#E879F9', '#F3E8FF'
]

// 获取星星图标
const getStarIcon = (index: number) => {
  const icons = ['✨', '⭐', '🌟', '💫', '⚡', '🔮', '🌙', '☄️']
  return icons[index % icons.length]
}

// 生成增强的星星样式
const getStarStyle = (index: number) => {
  const seed = index * 12345
  const top = seededRandom(seed + 1) * 100
  const left = seededRandom(seed + 2) * 100
  const delay = seededRandom(seed + 3) * 5
  const duration = 3 + seededRandom(seed + 4) * 4
  const color = mysticalColors[Math.floor(seededRandom(seed + 5) * mysticalColors.length)]
  
  return {
    position: 'absolute' as const,
    top: `${top}%`,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    color,
    textShadow: `0 0 10px ${color}, 0 0 20px ${color}50`
  }
}

// 生成粒子样式
const getParticleStyle = (index: number) => {
  const seed = index * 54321
  const top = seededRandom(seed + 1) * 100
  const left = seededRandom(seed + 2) * 100
  const delay = seededRandom(seed + 3) * 3
  const duration = 4 + seededRandom(seed + 4) * 6
  const color = mysticalColors[Math.floor(seededRandom(seed + 5) * mysticalColors.length)]
  const size = 2 + seededRandom(seed + 6) * 6
  
  return {
    position: 'absolute' as const,
    top: `${top}%`,
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}30`
  }
}

// 监听全局动画事件
onMounted(() => {
  if (process.client) {
    window.addEventListener('mystical-animation-start', handleAnimationStart as EventListener)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('mystical-animation-start', handleAnimationStart as EventListener)
    clearAnimationTimeouts()
    isAnimationRunning = false
  }
})

const handleAnimationStart = (event: Event) => {
  if (isAnimationRunning) {
    return
  }
  
  const customEvent = event as CustomEvent
  const { text, callbackId } = customEvent.detail
  
  showAnimation(text, () => {
    if (callbackId) {
      window.dispatchEvent(new CustomEvent(callbackId))
    }
  })
}

const showAnimation = (text: string, callback?: () => void) => {
  if (!process.client || isAnimationRunning) {
    if (callback) callback()
    return
  }
  
  isAnimationRunning = true
  isVisible.value = true
  clearAnimationTimeouts()
  
  if (animatedTextRef.value) {
    animatedTextRef.value.innerHTML = ''
  }

  nextTick(() => {
    runAnimation(text, callback)
  })
}

const runAnimation = (text: string, callback?: () => void) => {
  if (!animatedTextRef.value) return

  const displayText = text || '✨ 神秘时刻 ✨'
  
  // 创建增强的文字元素，添加若隐若现和流动色彩
  displayText.split('').forEach((char, index) => {
    const span = document.createElement('span')
    span.innerHTML = char === ' ' ? '&nbsp;' : char
    span.className = 'mystical-animated-char'
    
    // 动画延迟将在后面设置
    
    // 为每个字符添加随机的神秘色彩
    const color = mysticalColors[Math.floor(Math.random() * mysticalColors.length)]
    span.style.setProperty('--mystical-color', color)
    
    // 计算动画延迟
    const delay = index * 150
    
    // 强制设置可见性
    span.style.visibility = 'visible'
    span.style.display = 'inline-block'
    span.style.padding = '2px'
    span.style.transformOrigin = 'center center'
    
    // 添加初始阴影效果
    span.style.textShadow = `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`
    
    animatedTextRef.value?.appendChild(span)
    
    // 直接应用JavaScript动画
    setTimeout(() => {
      if (span.parentNode) {
        applyJavaScriptAnimation(span, index, color)
      }
    }, delay + 50)
  })

  // 显示动画后隐藏
  const hideTimeout = setTimeout(() => {
    hideAnimation()
    isAnimationRunning = false
    if (callback) {
      callback()
    }
  }, 8000) // 8秒动画展示
  
  animationTimeouts.push(hideTimeout)
}

const hideAnimation = () => {
  isVisible.value = false
  if (animatedTextRef.value) {
    animatedTextRef.value.innerHTML = ''
  }
}

// JavaScript强制动画函数（主要方案）
const applyJavaScriptAnimation = (element: HTMLElement, index: number, color: string) => {
  let animationFrame = 0
  let startTime = Date.now()
  
  const animate = () => {
    animationFrame++
    const elapsed = (Date.now() - startTime) / 1000 // 转为秒
    const fastTime = elapsed * 4 // 加速动画
    
    // 超强烈的闪烁效果 (0.05 到 1.0)
    const flickerBase = Math.sin(fastTime * 12) // 高频闪烁
    const flickerNoise = Math.sin(fastTime * 8.3) * 0.3 // 噪音效果
    const opacity = Math.max(0.05, 0.1 + Math.abs(flickerBase + flickerNoise) * 0.9)
    
    // 剧烈的扭动和缩放
    const scaleBase = 1 + Math.sin(fastTime * 6) * 0.8 // 0.2 到 1.8
    const scaleNoise = Math.cos(fastTime * 9.7) * 0.3
    const scale = Math.max(0.3, scaleBase + scaleNoise)
    
    // 疯狂旋转
    const rotation = Math.sin(fastTime * 4.2) * 45 + Math.cos(fastTime * 7.1) * 25
    
    // 大幅位移
    const translateY = Math.sin(fastTime * 5.5) * 25 + Math.cos(fastTime * 3.8) * 15
    const translateX = Math.cos(fastTime * 4.7) * 20 + Math.sin(fastTime * 6.2) * 12
    
    // 快速颜色循环 + 随机颜色
    const colors = [
      '#ff0066', '#6600ff', '#00ff66', '#ff6600', '#0066ff', '#ffff00', '#ffffff',
      '#ff3399', '#9933ff', '#33ff99', '#ff9933', '#3399ff', '#ffcc00', '#cc00ff'
    ]
    const primaryColorIndex = Math.floor(fastTime * 3) % colors.length
    const secondaryColorIndex = Math.floor(fastTime * 5.7) % colors.length
    const currentColor = Math.random() > 0.7 ? colors[secondaryColorIndex] : colors[primaryColorIndex]
    
    // 动态模糊效果
    const blur = Math.abs(Math.sin(fastTime * 8)) * 2
    
    // 应用所有效果
    element.style.opacity = opacity.toString()
    element.style.transform = `scale(${scale}) rotate(${rotation}deg) translateY(${translateY}px) translateX(${translateX}px)`
    element.style.color = currentColor
    element.style.filter = `blur(${blur}px) brightness(${1 + Math.sin(fastTime * 7) * 0.5})`
    element.style.textShadow = `
      0 0 ${10 + Math.sin(fastTime * 6) * 15}px ${currentColor},
      0 0 ${25 + Math.cos(fastTime * 4) * 20}px ${currentColor},
      0 0 ${40 + Math.sin(fastTime * 8) * 30}px ${currentColor}80
    `
    
         // 继续动画8秒
     if (elapsed < 8) {
       requestAnimationFrame(animate)
     }
  }
  
  // 立即开始动画
  requestAnimationFrame(animate)
}
</script>

<style scoped>
#simple-animation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(20px);
  transition: all 0.8s ease;
  overflow: hidden;
}

.animate-fade-in {
  animation: mysticalFadeIn 0.8s ease forwards;
}

.animate-fade-out {
  animation: mysticalFadeOut 0.8s ease forwards;
}

@keyframes mysticalFadeIn {
  from { 
    opacity: 0; 
    transform: scale(0.95);
    filter: blur(10px);
  }
  to { 
    opacity: 1; 
    transform: scale(1);
    filter: blur(0px);
  }
}

@keyframes mysticalFadeOut {
  from { 
    opacity: 1; 
    transform: scale(1);
    filter: blur(0px);
  }
  to { 
    opacity: 0; 
    transform: scale(1.05);
    filter: blur(10px);
  }
}

.mystical-animated-text {
  font-family: 'Arial', sans-serif;
  font-size: clamp(1.8rem, 5vw, 4rem);
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  letter-spacing: 0.2em;
  line-height: 1.3;
  position: relative;
  z-index: 10;
}

.mystical-animated-char {
  display: inline-block !important;
  margin: 0 0.1em;
  color: #ffffff;
  font-size: inherit;
  text-shadow: 
    0 0 20px var(--mystical-color, #ffffff),
    0 0 40px var(--mystical-color, #ffffff)50,
    0 0 60px var(--mystical-color, #ffffff)30;
  
  /* 应用动画 */
  animation-name: mysticalCharFlicker;
  animation-duration: 1.5s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}

@keyframes mysticalCharDance {
  0% {
    opacity: 0;
    transform: translateY(100px) scale(0.3) rotateZ(-45deg);
  }
  10% {
    opacity: 1;
    transform: translateY(0) scale(1.2) rotateZ(5deg);
  }
  20% {
    transform: translateY(-10px) scale(1) rotateZ(-2deg);
  }
  30% {
    transform: translateY(5px) scale(1.1) rotateZ(3deg);
    opacity: 0.8;
  }
  40% {
    transform: translateY(-5px) scale(0.95) rotateZ(-1deg);
    opacity: 1;
  }
  50% {
    transform: translateY(0) scale(1.05) rotateZ(2deg);
    opacity: 0.9;
  }
  60% {
    transform: translateY(3px) scale(1) rotateZ(-1deg);
    opacity: 0.7;
  }
  70% {
    transform: translateY(-8px) scale(1.1) rotateZ(4deg);
    opacity: 1;
  }
  80% {
    transform: translateY(2px) scale(0.98) rotateZ(-2deg);
    opacity: 0.8;
  }
  90% {
    transform: translateY(-3px) scale(1.02) rotateZ(1deg);
    opacity: 0.9;
  }
  100% {
    transform: translateY(0) scale(1) rotateZ(0deg);
    opacity: 0.6;
  }
}

/* 增强的星星动画 */
.mystical-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.mystical-star {
  position: absolute;
  animation: mysticalStarDance 6s ease-in-out infinite;
  font-size: 1rem;
  filter: blur(0.5px);
}

.star-size-1 {
  font-size: 0.8rem;
  animation-duration: 4s;
}

.star-size-2 {
  font-size: 1.2rem;
  animation-duration: 7s;
}

.star-size-3 {
  font-size: 1.5rem;
  animation-duration: 5s;
}

@keyframes mysticalStarDance {
  0%, 100% {
    opacity: 0.1;
    transform: scale(0.3) translateX(0) translateY(0) rotate(0deg);
    filter: blur(2px) brightness(0.5);
  }
  25% {
    opacity: 1;
    transform: scale(2.5) translateX(80px) translateY(-60px) rotate(90deg);
    filter: blur(0px) brightness(2);
  }
  50% {
    opacity: 0.2;
    transform: scale(0.6) translateX(-40px) translateY(100px) rotate(180deg);
    filter: blur(1px) brightness(0.7);
  }
  75% {
    opacity: 0.9;
    transform: scale(2) translateX(-100px) translateY(-40px) rotate(270deg);
    filter: blur(0px) brightness(1.8);
  }
}

/* 漂浮粒子动画 */
.floating-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.particle {
  position: absolute;
  border-radius: 50%;
  animation: mysticalParticleFloat 8s linear infinite;
  opacity: 0;
  filter: blur(1px);
}

@keyframes mysticalParticleFloat {
  0% {
    opacity: 0;
    transform: translateY(100vh) translateX(0) scale(0) rotate(0deg);
    filter: brightness(0.3) blur(3px);
  }
  10% {
    opacity: 1;
    transform: translateY(90vh) translateX(50px) scale(2) rotate(36deg);
    filter: brightness(2) blur(0px);
  }
  20% {
    opacity: 0.3;
    transform: translateY(80vh) translateX(-30px) scale(2.5) rotate(72deg);
    filter: brightness(1.5) blur(1px);
  }
  30% {
    opacity: 0.9;
    transform: translateY(70vh) translateX(80px) scale(1.5) rotate(108deg);
    filter: brightness(2.2) blur(0px);
  }
  40% {
    opacity: 0.4;
    transform: translateY(60vh) translateX(-60px) scale(2.8) rotate(144deg);
    filter: brightness(1.8) blur(1px);
  }
  50% {
    opacity: 1;
    transform: translateY(50vh) translateX(40px) scale(2) rotate(180deg);
    filter: brightness(2.5) blur(0px);
  }
  60% {
    opacity: 0.2;
    transform: translateY(40vh) translateX(-90px) scale(3) rotate(216deg);
    filter: brightness(1.2) blur(2px);
  }
  70% {
    opacity: 0.8;
    transform: translateY(30vh) translateX(70px) scale(1.8) rotate(252deg);
    filter: brightness(2) blur(0px);
  }
  80% {
    opacity: 0.3;
    transform: translateY(20vh) translateX(-50px) scale(2.2) rotate(288deg);
    filter: brightness(1.6) blur(1px);
  }
  90% {
    opacity: 0.9;
    transform: translateY(10vh) translateX(30px) scale(2.5) rotate(324deg);
    filter: brightness(2.3) blur(0px);
  }
  100% {
    opacity: 0;
    transform: translateY(-10vh) translateX(0) scale(0) rotate(360deg);
    filter: brightness(0.3) blur(3px);
  }
}

/* 响应式设计 */
@media (max-width: 640px) {
  .mystical-animated-text {
    font-size: clamp(1.4rem, 6vw, 2.5rem);
    padding: 0 1rem;
  }
  
  .mystical-star {
    font-size: 0.7rem;
  }
  
  .star-size-2 {
    font-size: 0.9rem;
  }
  
  .star-size-3 {
    font-size: 1.1rem;
  }
}

/* 超强烈的字符动画效果 */
@keyframes mysticalCharIntenseFlicker {
  0% {
    opacity: 0.05;
    transform: scale(0.5) rotate(-45deg) translateY(0px) translateX(0px);
    filter: blur(2px) brightness(0.3);
  }
  20% {
    opacity: 1;
    transform: scale(1.8) rotate(15deg) translateY(-25px) translateX(10px);
    filter: blur(0px) brightness(1.5);
  }
  40% {
    opacity: 0.1;
    transform: scale(0.7) rotate(-20deg) translateY(15px) translateX(-15px);
    filter: blur(1px) brightness(0.5);
  }
  60% {
    opacity: 0.95;
    transform: scale(1.6) rotate(25deg) translateY(-20px) translateX(8px);
    filter: blur(0px) brightness(1.8);
  }
  80% {
    opacity: 0.2;
    transform: scale(0.8) rotate(-15deg) translateY(10px) translateX(-5px);
    filter: blur(1.5px) brightness(0.4);
  }
  100% {
    opacity: 0.05;
    transform: scale(0.5) rotate(-45deg) translateY(0px) translateX(0px);
    filter: blur(2px) brightness(0.3);
  }
}

@keyframes mysticalCharColorCycle {
  0% {
    color: #ffffff;
    text-shadow: 0 0 15px #ffffff, 0 0 30px #ffffff, 0 0 45px #ffffff;
  }
  14% {
    color: #ff0066;
    text-shadow: 0 0 20px #ff0066, 0 0 40px #ff0066, 0 0 60px #ff0066;
  }
  28% {
    color: #6600ff;
    text-shadow: 0 0 25px #6600ff, 0 0 50px #6600ff, 0 0 75px #6600ff;
  }
  42% {
    color: #00ff66;
    text-shadow: 0 0 20px #00ff66, 0 0 40px #00ff66, 0 0 60px #00ff66;
  }
  57% {
    color: #ff6600;
    text-shadow: 0 0 25px #ff6600, 0 0 50px #ff6600, 0 0 75px #ff6600;
  }
  71% {
    color: #0066ff;
    text-shadow: 0 0 30px #0066ff, 0 0 60px #0066ff, 0 0 90px #0066ff;
  }
  85% {
    color: #ffff00;
    text-shadow: 0 0 25px #ffff00, 0 0 50px #ffff00, 0 0 75px #ffff00;
  }
  100% {
    color: #ffffff;
    text-shadow: 0 0 15px #ffffff, 0 0 30px #ffffff, 0 0 45px #ffffff;
  }
}

/* 保留原有的动画作为备用 */
@keyframes mysticalCharFlicker {
  0% {
    opacity: 0.1;
    transform: scale(0.8) rotate(-5deg) translateY(0px);
    color: #ffffff;
    text-shadow: 0 0 5px #ffffff;
  }
  25% {
    opacity: 1;
    transform: scale(1.3) rotate(3deg) translateY(-10px);
    color: #ff00ff;
    text-shadow: 0 0 20px #ff00ff, 0 0 40px #ff00ff;
  }
  50% {
    opacity: 0.2;
    transform: scale(0.9) rotate(-2deg) translateY(5px);
    color: #00ffff;
    text-shadow: 0 0 15px #00ffff, 0 0 30px #00ffff;
  }
  75% {
    opacity: 0.9;
    transform: scale(1.2) rotate(4deg) translateY(-5px);
    color: #ffff00;
    text-shadow: 0 0 25px #ffff00, 0 0 50px #ffff00;
  }
  100% {
    opacity: 0.1;
    transform: scale(0.8) rotate(-5deg) translateY(0px);
    color: #ffffff;
    text-shadow: 0 0 5px #ffffff;
  }
}

/* 流动色彩变化 */
@keyframes mysticalCharColorFlow {
  0%, 100% {
    color: rgba(139, 92, 246, 0.9);
    text-shadow: 
      0 0 15px rgba(139, 92, 246, 0.6),
      0 0 30px rgba(139, 92, 246, 0.4);
  }
  16% {
    color: rgba(255, 0, 102, 0.9);
    text-shadow: 
      0 0 15px rgba(255, 0, 102, 0.6),
      0 0 30px rgba(255, 0, 102, 0.4);
  }
  33% {
    color: rgba(0, 255, 102, 0.9);
    text-shadow: 
      0 0 15px rgba(0, 255, 102, 0.6),
      0 0 30px rgba(0, 255, 102, 0.4);
  }
  50% {
    color: rgba(255, 102, 0, 0.9);
    text-shadow: 
      0 0 15px rgba(255, 102, 0, 0.6),
      0 0 30px rgba(255, 102, 0, 0.4);
  }
  66% {
    color: rgba(0, 102, 255, 0.9);
    text-shadow: 
      0 0 15px rgba(0, 102, 255, 0.6),
      0 0 30px rgba(0, 102, 255, 0.4);
  }
  83% {
    color: rgba(255, 255, 0, 0.9);
    text-shadow: 
      0 0 15px rgba(255, 255, 0, 0.6),
      0 0 30px rgba(255, 255, 0, 0.4);
  }
}

/* 水晶球效果 */
.crystal-orb-container {
  position: absolute;
  top: 15%;
  right: 10%;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.crystal-orb {
  font-size: 120px;
  animation: crystalOrbPulse 6s ease-in-out infinite;
  filter: blur(1px);
  z-index: 2;
  position: relative;
}

.crystal-orb-glow {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(139, 92, 246, 0.3) 0%,
    rgba(168, 85, 247, 0.2) 30%,
    rgba(192, 132, 252, 0.1) 60%,
    transparent 100%
  );
  animation: crystalOrbGlow 8s ease-in-out infinite;
  filter: blur(3px);
  z-index: 1;
}

@keyframes crystalOrbPulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.9) rotate(0deg);
    filter: blur(2px) brightness(0.8);
  }
  25% {
    opacity: 0.8;
    transform: scale(1.1) rotate(90deg);
    filter: blur(0.5px) brightness(1.2);
  }
  50% {
    opacity: 0.2;
    transform: scale(0.85) rotate(180deg);
    filter: blur(3px) brightness(0.6);
  }
  75% {
    opacity: 0.9;
    transform: scale(1.05) rotate(270deg);
    filter: blur(1px) brightness(1.1);
  }
}

@keyframes crystalOrbGlow {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1) rotate(0deg);
  }
  33% {
    opacity: 0.6;
    transform: scale(1.3) rotate(120deg);
  }
  66% {
    opacity: 0.1;
    transform: scale(0.8) rotate(240deg);
  }
}

/* 减少动画效果（用户偏好） */
@media (prefers-reduced-motion: reduce) {
  .mystical-animated-char,
  .mystical-star,
  .particle,
  .crystal-orb {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
  
  #simple-animation-overlay {
    transition-duration: 0.01ms !important;
  }
}

/* 响应式水晶球 */
@media (max-width: 640px) {
  .crystal-orb-container {
    width: 100px;
    height: 100px;
    top: 20%;
    right: 5%;
  }
  
  .crystal-orb {
    font-size: 80px;
  }
  
  .crystal-orb-glow {
    width: 120px;
    height: 120px;
  }
}
</style> 