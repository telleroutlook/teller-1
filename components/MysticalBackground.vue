<template>
  <div class="mystical-background">
    <!-- 持续的星空背景 -->
    <ClientOnly>
      <div class="mystical-stars-bg">
        <div 
          class="mystical-star-bg" 
          v-for="i in 80" 
          :key="i" 
          :style="getStarStyle(i)"
          :class="`star-type-${(i % 4) + 1}`"
        >
          {{ getStarIcon(i) }}
        </div>
      </div>
      
      <!-- 漂浮光点效果 -->
      <div class="floating-orbs">
        <div 
          class="orb" 
          v-for="j in 20" 
          :key="`orb-${j}`"
          :style="getOrbStyle(j)"
        ></div>
      </div>
      
      <!-- 神秘光晕效果 -->
      <div class="mystical-aura">
        <div 
          class="aura-circle" 
          v-for="k in 6" 
          :key="`aura-${k}`"
          :style="getAuraStyle(k)"
        ></div>
      </div>
      
      <!-- 大型透明水晶球 -->
      <div class="crystal-orb-container">
        <div class="crystal-orb">🔮</div>
        <div class="crystal-orb-glow"></div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
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
  '#8B5CF6', '#A855F7', '#C084FC', '#E879F9', '#F3E8FF',
  '#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA'
]

// 获取星星图标
const getStarIcon = (index: number) => {
  const icons = ['✨', '⭐', '🌟', '💫', '⚡', '🔮', '🌙', '☄️', '✧', '○', '◇', '◈']
  return icons[index % icons.length]
}

// 生成星星样式
const getStarStyle = (index: number) => {
  const seed = index * 98765
  const top = seededRandom(seed + 1) * 100
  const left = seededRandom(seed + 2) * 100
  const delay = seededRandom(seed + 3) * 8
  const duration = 4 + seededRandom(seed + 4) * 8
  const color = mysticalColors[Math.floor(seededRandom(seed + 5) * mysticalColors.length)]
  
  return {
    position: 'absolute' as const,
    top: `${top}%`,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    color,
    textShadow: `0 0 15px ${color}, 0 0 30px ${color}40`
  }
}

// 生成光点样式
const getOrbStyle = (index: number) => {
  const seed = index * 13579
  const top = seededRandom(seed + 1) * 100
  const left = seededRandom(seed + 2) * 100
  const delay = seededRandom(seed + 3) * 6
  const duration = 8 + seededRandom(seed + 4) * 12
  const color = mysticalColors[Math.floor(seededRandom(seed + 5) * mysticalColors.length)]
  const size = 3 + seededRandom(seed + 6) * 8
  
  return {
    position: 'absolute' as const,
    top: `${top}%`,
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}30`
  }
}

// 生成光晕样式
const getAuraStyle = (index: number) => {
  const seed = index * 24681
  const top = seededRandom(seed + 1) * 100
  const left = seededRandom(seed + 2) * 100
  const delay = seededRandom(seed + 3) * 10
  const duration = 15 + seededRandom(seed + 4) * 20
  const color = mysticalColors[Math.floor(seededRandom(seed + 5) * mysticalColors.length)]
  const size = 80 + seededRandom(seed + 6) * 120
  
  return {
    position: 'absolute' as const,
    top: `${top}%`,
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    background: `radial-gradient(circle, ${color}20, transparent 70%)`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}
</script>

<style scoped>
.mystical-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

/* 星空背景 */
.mystical-stars-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.mystical-star-bg {
  position: absolute;
  animation: mysticalStarFloat 12s ease-in-out infinite;
  font-size: 0.8rem;
  opacity: 0.6;
  filter: blur(0.5px);
}

.star-type-1 {
  font-size: 0.6rem;
  animation-duration: 8s;
  opacity: 0.4;
}

.star-type-2 {
  font-size: 1rem;
  animation-duration: 15s;
  opacity: 0.7;
}

.star-type-3 {
  font-size: 1.2rem;
  animation-duration: 10s;
  opacity: 0.5;
}

.star-type-4 {
  font-size: 0.9rem;
  animation-duration: 20s;
  opacity: 0.8;
}

@keyframes mysticalStarFloat {
  0%, 100% {
    opacity: 0.2;
    transform: scale(0.7) translateX(0) translateY(0) rotate(0deg);
  }
  12.5% {
    opacity: 0.8;
    transform: scale(1.4) translateX(60px) translateY(-80px) rotate(45deg);
  }
  25% {
    opacity: 0.3;
    transform: scale(0.9) translateX(120px) translateY(-40px) rotate(90deg);
  }
  37.5% {
    opacity: 0.9;
    transform: scale(1.2) translateX(80px) translateY(100px) rotate(135deg);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.8) translateX(-20px) translateY(120px) rotate(180deg);
  }
  62.5% {
    opacity: 0.7;
    transform: scale(1.5) translateX(-100px) translateY(60px) rotate(225deg);
  }
  75% {
    opacity: 0.5;
    transform: scale(1) translateX(-120px) translateY(-20px) rotate(270deg);
  }
  87.5% {
    opacity: 0.6;
    transform: scale(1.1) translateX(-60px) translateY(-100px) rotate(315deg);
  }
}

/* 漂浮光点效果 */
.floating-orbs {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.orb {
  position: absolute;
  border-radius: 50%;
  animation: mysticalOrbDrift 16s linear infinite;
  opacity: 0;
  filter: blur(1px);
}

@keyframes mysticalOrbDrift {
  0% {
    opacity: 0;
    transform: translateY(110vh) translateX(0) scale(0) rotate(0deg);
  }
  5% {
    opacity: 0.8;
    transform: translateY(95vh) translateX(80px) scale(1) rotate(36deg);
  }
  15% {
    opacity: 0.4;
    transform: translateY(80vh) translateX(-120px) scale(1.4) rotate(108deg);
  }
  25% {
    opacity: 0.9;
    transform: translateY(65vh) translateX(150px) scale(0.7) rotate(180deg);
  }
  35% {
    opacity: 0.3;
    transform: translateY(50vh) translateX(-100px) scale(1.2) rotate(252deg);
  }
  45% {
    opacity: 0.7;
    transform: translateY(35vh) translateX(200px) scale(0.9) rotate(324deg);
  }
  55% {
    opacity: 0.5;
    transform: translateY(20vh) translateX(-180px) scale(1.5) rotate(396deg);
  }
  65% {
    opacity: 0.8;
    transform: translateY(15vh) translateX(120px) scale(0.6) rotate(468deg);
  }
  75% {
    opacity: 0.4;
    transform: translateY(10vh) translateX(-250px) scale(1.1) rotate(540deg);
  }
  85% {
    opacity: 0.6;
    transform: translateY(5vh) translateX(300px) scale(0.8) rotate(612deg);
  }
  95% {
    opacity: 0.2;
    transform: translateY(0vh) translateX(-50px) scale(1.3) rotate(684deg);
  }
  100% {
    opacity: 0;
    transform: translateY(-10vh) translateX(0) scale(0) rotate(720deg);
  }
}

/* 神秘光晕效果 */
.mystical-aura {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.aura-circle {
  position: absolute;
  border-radius: 50%;
  animation: mysticalAuraPulse 25s ease-in-out infinite;
  opacity: 0;
  filter: blur(2px);
}

@keyframes mysticalAuraPulse {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5) rotate(0deg);
  }
  20% {
    opacity: 0.3;
    transform: scale(1.2) rotate(72deg);
  }
  40% {
    opacity: 0.1;
    transform: scale(0.8) rotate(144deg);
  }
  60% {
    opacity: 0.4;
    transform: scale(1.5) rotate(216deg);
  }
  80% {
    opacity: 0.2;
    transform: scale(1) rotate(288deg);
  }
}

/* 响应式设计 */
@media (max-width: 640px) {
  .mystical-star-bg {
    font-size: 0.6rem;
  }
  
  .star-type-2 {
    font-size: 0.8rem;
  }
  
  .star-type-3 {
    font-size: 1rem;
  }
  
  .orb {
    filter: blur(0.5px);
  }
  
  .aura-circle {
    filter: blur(1px);
  }
}

/* 减少动画效果（用户偏好） */
@media (prefers-reduced-motion: reduce) {
  .mystical-star-bg,
  .orb,
  .aura-circle {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
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

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .mystical-star-bg {
    opacity: 0.9;
    filter: none;
  }
  
  .orb {
    opacity: 0.8 !important;
    filter: none;
  }
  
  .aura-circle {
    opacity: 0.6 !important;
    filter: none;
  }
  
  .crystal-orb {
    opacity: 0.9 !important;
    filter: none !important;
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