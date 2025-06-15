<template>
  <div class="astrology-container">
    <h2 class="mb-4 text-2xl font-bold text-center mystical-text-gradient sm:mb-6 sm:text-3xl lg:text-4xl">⭐ Daily Horoscope</h2>
    <p class="mb-4 text-center text-base mystical-text-primary sm:mb-6 sm:text-lg">Select your zodiac sign to see your horoscope for today.</p>
    
    <div class="zodiac-signs">
      <button 
        v-for="sign in zodiacSigns" 
        :key="sign.name"
        @click="selectSign(sign)"
        :disabled="isAnimating"
        class="mystical-button"
        :class="{ 'opacity-50 cursor-not-allowed': isAnimating }"
      >
        {{ sign.emoji }} {{ sign.name }}
      </button>
    </div>

    <div v-if="isAnimating" class="mystical-progress mystical-text-primary text-center my-4">
      ✨ Consulting the stars... ✨
    </div>

    <div v-if="selectedSign" class="result show">
      <h3 class="mb-4 text-xl font-bold text-center mystical-text-gradient sm:text-2xl lg:text-3xl">{{ selectedSign.name }} - Today's Horoscope</h3>
      <div class="mystical-card mb-4">
        <p class="text-base mystical-text-card leading-relaxed text-center sm:text-lg lg:text-xl">{{ selectedSign.horoscope }}</p>
      </div>
      <div class="mystical-card mystical-text-card reflection-prompt">
        Consider how this guidance might apply to your day ahead.
      </div>
      <div class="action-buttons">
        <button @click="shareHoroscope" class="mystical-button">Share Today's Horoscope</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLogger } from '@/composables/useLogger'
import { useSeoMeta, useHead } from '#imports'

interface ZodiacSign {
  name: string
  emoji: string
  horoscope: string
}

const { t: $t, locale } = useI18n()
const { showAnimation } = useSimpleAnimation()
const { logger } = useLogger()

// Add SEO implementation
useSeoMeta({
  title: $t('seo.astrology.title'),
  description: $t('seo.astrology.description'),
  keywords: $t('seo.astrology.keywords'),
  ogTitle: $t('seo.astrology.ogTitle'),
  ogDescription: $t('seo.astrology.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image' as const,
  twitterTitle: $t('seo.astrology.twitterTitle'),
  twitterDescription: $t('seo.astrology.twitterDescription')
})

// Add structured data
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify($t('seo.astrology.structuredData'))
    }
  ]
})

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
            await showAnimation(`${sign.emoji} ${sign.name} ${sign.emoji}`)
    
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
.zodiac-signs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin: 18px 0;
}

@media (min-width: 640px) {
  .zodiac-signs {
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 14px;
    margin: 22px 0;
  }
}

@media (min-width: 768px) {
  .zodiac-signs {
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  }
}

.reflection-prompt {
  padding: 18px;
  border-radius: 12px;
  margin: 18px 0;
  font-style: italic;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
}

@media (min-width: 640px) {
  .reflection-prompt {
    padding: 20px;
    margin: 20px 0;
    font-size: 17px;
  }
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 18px;
}

@media (min-width: 640px) {
  .action-buttons {
    flex-direction: row;
    justify-content: center;
    gap: 14px;
    margin-top: 22px;
  }
}
</style> 