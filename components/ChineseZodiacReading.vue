<template>
  <div class="chinese-zodiac-container">
    <h2 class="mb-4 text-xl font-bold text-center mystical-text-gradient sm:mb-6 sm:text-2xl lg:text-3xl">{{ $t('chineseZodiacTitle') }}</h2>
    <p class="mb-4 text-center text-sm mystical-text-primary sm:mb-6 sm:text-base">{{ $t('chineseZodiacIntro') }}</p>

    <div class="form-group" :class="{ 'has-error': yearError }">
      <label for="birthYear" class="mystical-text-primary">{{ $t('birthYearLabel') }}</label>
      <input 
        id="birthYear"
        v-model="birthYear"
        type="number" 
        class="mystical-input"
        :placeholder="$t('birthYearPlaceholder')"
        min="1900"
        max="2099"
        :class="{ error: yearError }"
        @input="handleBirthYearInput"
      />
      <div class="input-help mystical-text-primary">{{ $t('lunarYearHelp') }}</div>
      <div v-if="yearError" class="error-message">
        <span class="error-icon">⚠️</span>
        <span>{{ $t('birthYearError') }}</span>
      </div>
    </div>

    <button @click="findZodiac" class="mystical-button">{{ $t('findZodiacBtn') }}</button>

    <div v-if="zodiacResult && showResult" class="result show" aria-live="polite">
      <h4 class="mb-4 text-lg font-semibold text-center mystical-text-gradient sm:text-xl">{{ $t('yourZodiac') }}</h4>
      <div class="zodiac-animal mystical-card">
        <div class="animal-emoji text-4xl mb-3 text-center sm:text-5xl">{{ animalEmoji }}</div>
        <h3 class="mb-4 text-lg font-bold text-center mystical-text-gradient sm:text-xl lg:text-2xl">{{ $t('yearOf', { animal: animalName }) }}</h3>
        <div class="traits-section">
          <h5 class="mb-2 text-base font-medium mystical-text-card sm:text-lg">{{ $t('traits') }}</h5>
          <p class="text-sm mystical-text-card leading-relaxed sm:text-base">{{ animalTraits }}</p>
        </div>
      </div>
      <div class="mystical-card mystical-text-card reflection-prompt">
        {{ $t('chineseZodiacReflection') }}
      </div>
      <div class="action-buttons">
        <button @click="shareZodiac" class="mystical-button">{{ $t('shareZodiacBtn') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta, useHead } from '#imports'

const { t: $t, locale } = useI18n()
const { showAnimation } = useSimpleAnimation()
const { logger, LogCategory } = useLogger()
const { setChineseZodiacData, getChineseZodiacData, clearChineseZodiacData } = useFormState()

// Add SEO implementation
useSeoMeta({
  title: $t('seo.chinesezodiac.title'),
  description: $t('seo.chinesezodiac.description'),
  keywords: $t('seo.chinesezodiac.keywords'),
  ogTitle: $t('seo.chinesezodiac.ogTitle'),
  ogDescription: $t('seo.chinesezodiac.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image' as const,
  twitterTitle: $t('seo.chinesezodiac.twitterTitle'),
  twitterDescription: $t('seo.chinesezodiac.twitterDescription')
})

// Add structured data
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify($t('seo.chinesezodiac.structuredData'))
    }
  ]
})

const birthYear = ref('')
const yearError = ref(false)
const zodiacResult = ref('')
const showResult = ref(false)
const animalName = ref('')
const animalTraits = ref('')
const animalEmoji = ref('')

// Initialize component logging
onMounted(() => {
  logger.logComponentInit('ChineseZodiacReading', { locale: locale.value })
  
  // Restore saved form data
  const savedData = getChineseZodiacData()
  birthYear.value = savedData.birthYear
})

// Save form data when input changes
const handleBirthYearInput = () => {
  clearErrors()
  setChineseZodiacData(birthYear.value)
}

// Watch for locale changes and update animal name/traits if result is already shown
watch(locale, () => {
  if (showResult.value && birthYear.value) {
    updateZodiacResult()
  }
})

const clearErrors = () => {
  yearError.value = false
}

const validateYear = (): boolean => {
  const year = parseInt(birthYear.value)
  const isValid = !isNaN(year) && year >= 1900 && year <= 2099
  
  if (!isValid) {
    yearError.value = true
  }
  
  return isValid
}

const updateZodiacResult = () => {
  const year = parseInt(birthYear.value)
  const { getChineseZodiacAnimal } = useChineseZodiac()
  const result = getChineseZodiacAnimal(year, locale.value)
  
  animalName.value = result.animal
  animalTraits.value = result.traits
  animalEmoji.value = getAnimalEmoji(result.englishAnimal)
  zodiacResult.value = `${year} - ${$t('yearOf', { animal: result.animal })}`
}

const getAnimalEmoji = (animal: string): string => {
  const emojis: Record<string, string> = {
    'rat': '🐭',
    'ox': '🐂', 
    'tiger': '🐅',
    'rabbit': '🐰',
    'dragon': '🐉',
    'snake': '🐍',
    'horse': '🐴',
    'goat': '🐐',
    'monkey': '🐵',
    'rooster': '🐓',
    'dog': '🐕',
    'pig': '🐷'
  }
  return emojis[animal.toLowerCase()] || '🐉'
}

const findZodiac = async () => {
  clearErrors()
  
  if (!validateYear()) {
    return
  }
  
  const year = parseInt(birthYear.value)
  const textToShow = `${year} 🐉✨`
  
  await showAnimation(textToShow, () => {
    updateZodiacResult()
    showResult.value = true
    
    logger.logUserAction('Chinese zodiac calculated', {
      year,
      animal: animalName.value,
      locale: locale.value
    })
  })
}

const resetZodiac = () => {
  birthYear.value = ''
  showResult.value = false
  zodiacResult.value = ''
  clearErrors()
  clearChineseZodiacData()
  
  logger.logUserAction('Chinese zodiac reset')
}

const shareZodiac = () => {
  logger.logUserAction('Chinese zodiac share attempted')
  const shareText = `${$t('myZodiac')}\n\n${zodiacResult.value}\n\n${$t('traits')} ${animalTraits.value}\n\nvia Teller.eu.org`
  
  if (navigator.share) {
    navigator.share({
      title: $t('myZodiac'),
      text: shareText
    }).then(() => {
      logger.logUserAction('Chinese zodiac shared successfully')
    }).catch(() => {
      navigator.clipboard.writeText(shareText)
      alert($t('shareError'))
      logger.logUserAction('Chinese zodiac copied to clipboard (share failed)')
    })
  } else {
    navigator.clipboard.writeText(shareText)
    alert($t('shareSuccess'))
    logger.logUserAction('Chinese zodiac copied to clipboard')
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
  position: relative;
}

.form-group.has-error .error-message {
  display: flex;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

.input-help {
  font-size: 0.8rem;
  margin-top: 4px;
}

.error-message {
  color: #EF4444;
  font-size: 0.8rem;
  margin-top: 4px;
  display: none;
  padding-left: 5px;
  align-items: center;
  gap: 5px;
}

.zodiac-animal {
  text-align: center;
  margin: 20px 0;
}

.animal-emoji {
  font-size: 4rem;
  margin-bottom: 15px;
}

.traits-section {
  margin-top: 15px;
}

.reflection-prompt {
  padding: 16px;
  border-radius: 12px;
  margin: 16px 0;
  font-style: italic;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

@media (min-width: 640px) {
  .action-buttons {
    flex-direction: row;
    justify-content: center;
    gap: 12px;
    margin-top: 20px;
  }
}
</style> 