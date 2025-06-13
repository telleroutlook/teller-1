<template>
  <div>
    <h2 class="section-title">⭐ Daily Horoscope</h2>
    <p class="intro-text">Select your zodiac sign to see your horoscope for today.</p>
    
    <div class="zodiac-signs">
      <button 
        v-for="sign in zodiacSigns" 
        :key="sign.name"
        @click="selectSign(sign)"
        :disabled="isAnimating"
        class="zodiac-btn"
        :class="{ 'opacity-50 cursor-not-allowed': isAnimating }"
      >
        {{ sign.emoji }} {{ sign.name }}
      </button>
    </div>

    <div v-if="isAnimating" class="text-center my-4">
      <p class="text-purple-600 font-medium">✨ Consulting the stars... ✨</p>
    </div>

    <div v-if="selectedSign" class="result show">
      <h3>{{ selectedSign.name }} - Today's Horoscope</h3>
      <p>{{ selectedSign.horoscope }}</p>
      <div class="reflection-prompt">
        Consider how this guidance might apply to your day ahead.
      </div>
      <button @click="shareHoroscope" class="share-button">Share Today's Horoscope</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ZodiacSign {
  name: string
  emoji: string
  horoscope: string
}

const { runMysticalAnimation } = useAnimations()
const { logger } = useLogger()

const zodiacSigns = ref<ZodiacSign[]>([
  { name: "Aries", emoji: "♈", horoscope: "Today brings new opportunities for leadership and initiative." },
  { name: "Taurus", emoji: "♉", horoscope: "Focus on stability and practical matters today." },
  { name: "Gemini", emoji: "♊", horoscope: "Communication and learning are highlighted today." },
  { name: "Cancer", emoji: "♋", horoscope: "Emotional connections and home matters take priority." },
  { name: "Leo", emoji: "♌", horoscope: "Your creativity and confidence shine brightly today." },
  { name: "Virgo", emoji: "♍", horoscope: "Attention to detail and organization serve you well." },
  { name: "Libra", emoji: "♎", horoscope: "Balance and harmony in relationships are emphasized." },
  { name: "Scorpio", emoji: "♏", horoscope: "Deep transformation and intuition guide your path." },
  { name: "Sagittarius", emoji: "♐", horoscope: "Adventure and expansion beckon you forward." },
  { name: "Capricorn", emoji: "♑", horoscope: "Discipline and ambition lead to success." },
  { name: "Aquarius", emoji: "♒", horoscope: "Innovation and humanitarian efforts are favored." },
  { name: "Pisces", emoji: "♓", horoscope: "Intuition and compassion open new doors." }
])

const selectedSign = ref<ZodiacSign | null>(null)
const isAnimating = ref(false)

const selectSign = async (sign: ZodiacSign): Promise<void> => {
  if (isAnimating.value) return
  
  try {
    isAnimating.value = true
    
    logger.logUserAction('Zodiac sign selected', { 
      sign: sign.name,
      emoji: sign.emoji 
    })

    // Show mystical animation with the sign's name and emoji
    await runMysticalAnimation(`${sign.emoji} ${sign.name} ${sign.emoji}`)
    
    // Set the selected sign after animation
    selectedSign.value = sign
    
  } catch (error) {
    logger.logError('AstrologyReading.selectSign', error as Error)
    // Still show the result even if animation fails
    selectedSign.value = sign
  } finally {
    isAnimating.value = false
  }
}

const shareHoroscope = (): void => {
  if (!selectedSign.value) return
  
  const shareText = `My Horoscope\n\n${selectedSign.value.name} - Today's Horoscope\n${selectedSign.value.horoscope}\n\nvia Teller.eu.org`
  
  logger.logUserAction('Horoscope shared', { 
    sign: selectedSign.value.name 
  })
  
  if (navigator.share) {
    navigator.share({
      title: 'My Horoscope',
      text: shareText
    }).catch(() => {
      navigator.clipboard.writeText(shareText)
      alert('Sharing failed or was cancelled. Your horoscope has been copied to the clipboard!')
    })
  } else {
    navigator.clipboard.writeText(shareText)
    alert('Your horoscope has been copied to the clipboard!')
  }
}
</script>

<style scoped>
.intro-text {
  text-align: center;
  margin-bottom: 20px;
  color: #6B7280;
}

.zodiac-signs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin: 20px 0;
}

.zodiac-btn {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.zodiac-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}
</style> 