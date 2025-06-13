<template>
  <div class="chinese-zodiac-container">
    <h2 class="mb-4 text-xl font-bold text-center text-gray-700 sm:mb-6 sm:text-2xl lg:text-3xl">{{ $t('chineseZodiacTitle') }}</h2>
    <p class="mb-4 text-center text-sm text-gray-600 sm:mb-6 sm:text-base">{{ $t('chineseZodiacIntro') }}</p>

    <div class="form-group" :class="{ 'has-error': yearError }">
      <label for="birthYear">{{ $t('birthYearLabel') }}</label>
      <input 
        id="birthYear"
        v-model="birthYear"
        type="number" 
        :placeholder="$t('birthYearPlaceholder')"
        min="1900"
        max="2099"
        :class="{ error: yearError }"
        @input="handleBirthYearInput"
      />
      <div class="input-help">{{ $t('lunarYearHelp') }}</div>
      <div v-if="yearError" class="error-message">
        <span class="error-icon">⚠️</span>
        <span>{{ $t('birthYearError') }}</span>
      </div>
    </div>

    <button @click="findZodiac" class="btn">{{ $t('findZodiacBtn') }}</button>

    <div v-if="zodiacResult && showResult" class="result show" aria-live="polite">
      <h4 class="mb-4 text-lg font-semibold text-center text-gray-800 sm:text-xl">{{ $t('yourZodiac') }}</h4>
      <div class="zodiac-animal">
        <div class="animal-emoji text-4xl mb-3 text-center sm:text-5xl">{{ animalEmoji }}</div>
        <h3 class="mb-4 text-lg font-bold text-center text-red-700 sm:text-xl lg:text-2xl">{{ $t('yearOf', { animal: animalName }) }}</h3>
        <div class="traits-section">
          <h5 class="mb-2 text-base font-medium text-gray-700 sm:text-lg">{{ $t('traits') }}</h5>
          <p class="text-sm text-gray-600 leading-relaxed sm:text-base">{{ animalTraits }}</p>
        </div>
      </div>
      <div class="reflection-prompt">
        {{ $t('chineseZodiacReflection') }}
      </div>
      <div class="action-buttons">
        <button @click="shareZodiac" class="share-button">{{ $t('shareZodiacBtn') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t: $t, locale } = useI18n()
const { runMysticalAnimation } = useAnimations()
const { logger, LogCategory } = useLogger()
const { setChineseZodiacData, getChineseZodiacData, clearChineseZodiacData } = useFormState()

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

const findZodiac = () => {
  clearErrors()
  
  if (!validateYear()) {
    return
  }
  
  const year = parseInt(birthYear.value)
  const textToShow = `${year} 🐉✨`
  
  runMysticalAnimation(textToShow, () => {
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
.intro-text {
  text-align: center;
  margin-bottom: 20px;
  color: #6B7280;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 15px;
  position: relative;
}

.form-group.has-error .error-message {
  display: flex;
}

.form-group.has-error input {
  border-color: #EF4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #4a5568;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-help {
  font-size: 0.8rem;
  color: #6B7280;
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

.zodiac-animal h3 {
  color: #667eea;
  margin-bottom: 15px;
  font-size: 1.4rem;
}

.traits-section {
  background: #F8FAFC;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  margin-top: 15px;
}

.traits-section h5 {
  color: #667eea;
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.reflection-prompt {
  background: rgba(34, 197, 94, 0.1);
  padding: 12px;
  border-radius: 8px;
  margin-top: 12px;
  font-style: italic;
  color: #166534;
}

.share-button {
  background: #2563EB;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 15px;
}
</style> 