<template>
  <div class="numerology-container">
    <h2 class="mb-4 text-2xl font-bold text-center mystical-text-gradient sm:mb-6 sm:text-3xl lg:text-4xl">🔢 {{ $t('numerologyTitle') }}</h2>
    <p class="mb-4 text-center text-base mystical-text-primary sm:mb-6 sm:text-lg">{{ $t('numerologyIntro') }}</p>

    <div class="form-group" :class="{ 'has-error': birthDateError }">
      <label for="birthDate" class="mystical-text-primary">{{ $t('birthDateLabel') }}</label>
      <input 
        id="birthDate"
        v-model="birthDate"
        type="date" 
        class="mystical-input"
        :class="{ error: birthDateError }"
        @input="handleBirthDateInput"
      />
      <div v-if="birthDateError" class="error-message">
        <span class="error-icon">⚠️</span>
        <span>{{ $t('birthDateError') }}</span>
      </div>
    </div>

    <div class="form-group" :class="{ 'has-error': fullNameError }">
      <label for="fullName" class="mystical-text-primary">{{ $t('fullNameLabel') }}</label>
      <input 
        id="fullName"
        v-model="fullName"
        type="text" 
        class="mystical-input"
        :placeholder="$t('fullNamePlaceholder')"
        :class="{ error: fullNameError }"
        @input="handleFullNameInput"
      />
      <div v-if="fullNameError" class="error-message">
        <span class="error-icon">⚠️</span>
        <span>{{ $t('fullNameError') }}</span>
      </div>
    </div>

    <button @click="calculateNumerology" class="mystical-button">{{ $t('calculateBtn') }}</button>

    <div v-if="numerologyResult && showResult" class="result show" aria-live="polite">
      <h4 class="mb-4 text-lg font-semibold text-center mystical-text-gradient sm:text-xl">{{ $t('yourNumerologyProfile') }}</h4>
      <div class="numerology-results">
        <div class="number-result mystical-card">
          <h5 class="mb-2 text-base font-medium mystical-text-card sm:text-lg">{{ $t('lifePathNumber') }} {{ lifePathNumber }}</h5>
          <p class="text-sm mystical-text-card sm:text-base">{{ lifePathMeaning }}</p>
        </div>
        <div class="number-result mystical-card">
          <h5 class="mb-2 text-base font-medium mystical-text-card sm:text-lg">{{ $t('destinyNumber') }} {{ destinyNumber }}</h5>
          <p class="text-sm mystical-text-card sm:text-base">{{ destinyMeaning }}</p>
        </div>
      </div>
      <div class="mystical-card mystical-text-card reflection-prompt">
        {{ $t('numerologyReflection') }}
      </div>
      <div class="action-buttons">
        <button @click="resetCalculation" class="mystical-button mystical-button-danger">{{ $t('recalculateBtn') }}</button>
        <button @click="shareNumbers" class="mystical-button">{{ $t('shareNumbersBtn') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLogger } from '@/composables/useLogger'
import { useSeoMeta, useHead } from '#imports'

const { t: $t, locale } = useI18n()
const { showAnimation } = useSimpleAnimation()
const { logger, LogCategory } = useLogger()
const { setNumerologyData, getNumerologyData, clearNumerologyData } = useFormState()

const birthDate = ref('')
const fullName = ref('')
const birthDateError = ref(false)
const fullNameError = ref(false)
const numerologyResult = ref('')
const showResult = ref(false)
const lifePathNumber = ref(0)
const destinyNumber = ref(0)
const lifePathMeaning = ref('')
const destinyMeaning = ref('')

// Add SEO implementation
useSeoMeta({
  title: $t('seo.numerology.title'),
  description: $t('seo.numerology.description'),
  keywords: $t('seo.numerology.keywords'),
  ogTitle: $t('seo.numerology.ogTitle'),
  ogDescription: $t('seo.numerology.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image' as const,
  twitterTitle: $t('seo.numerology.twitterTitle'),
  twitterDescription: $t('seo.numerology.twitterDescription')
})

// Add structured data
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify($t('seo.numerology.structuredData'))
    }
  ]
})

// Initialize component logging
onMounted(() => {
  logger.logComponentInit('NumerologyReading', { locale: locale.value })
  
  // Restore saved form data
  const savedData = getNumerologyData()
  birthDate.value = savedData.birthDate
  fullName.value = savedData.fullName
})

// Save form data when inputs change
const handleBirthDateInput = () => {
  clearErrors()
  setNumerologyData(birthDate.value, fullName.value)
}

const handleFullNameInput = () => {
  clearErrors()
  setNumerologyData(birthDate.value, fullName.value)
}

// Watch for locale changes and update meanings if result is already shown
watch(locale, () => {
  if (showResult.value && lifePathNumber.value && destinyNumber.value) {
    lifePathMeaning.value = getMeaning(lifePathNumber.value)
    destinyMeaning.value = getMeaning(destinyNumber.value)
  }
})

const lifePathMeanings = {
  en: { 
    1: "Leadership, independence, pioneering spirit", 
    2: "Cooperation, diplomacy, sensitivity", 
    3: "Creativity, communication, optimism", 
    4: "Hard work, stability, practicality", 
    5: "Freedom, adventure, versatility", 
    6: "Nurturing, responsibility, compassion", 
    7: "Spirituality, analysis, introspection", 
    8: "Material success, ambition, power", 
    9: "Humanitarianism, generosity, idealism", 
    11: "Master Number: Spiritual insight, intuition, enlightenment, visionary", 
    22: "Master Number: Master Builder, practical idealism, large-scale achievements", 
    33: "Master Number: Master Teacher, compassion, healing, spiritual guidance" 
  },
  zh: { 
    1: "领导力，独立，开拓精神", 
    2: "合作，外交，敏感", 
    3: "创造力，沟通，乐观", 
    4: "努力工作，稳定，务实", 
    5: "自由，冒险，多才多艺", 
    6: "养育，责任，同情", 
    7: "灵性，分析，内省", 
    8: "物质成功，野心，权力", 
    9: "人道主义，慷慨，理想主义", 
    11: "卓越数字：精神洞察力，直觉，启蒙，远见", 
    22: "卓越数字：大师级建造者，务实的理想主义，大规模成就", 
    33: "卓越数字：大师级教师，同情心，疗愈，精神指导" 
  },
  hi: { 
    1: "नेतृत्व, स्वतंत्रता, अग्रणी भावना", 
    2: "सहयोग, कूटनीति, संवेदनशीलता", 
    3: "रचनात्मकता, संचार, आशावाद", 
    4: "कड़ी मेहनत, स्थिरता, व्यावहारिकता", 
    5: "स्वतंत्रता, रोमांच, बहुमुखी प्रतिभा", 
    6: "पोषण, जिम्मेदारी, करुणा", 
    7: "आध्यात्मिकता, विश्लेषण, आत्मनिरीक्षण", 
    8: "भौतिक सफलता, महत्वाकांक्षा, शक्ति", 
    9: "मानवतावाद, उदारता, आदर्शवाद", 
    11: "मास्टर नंबर: आध्यात्मिक अंतर्दृष्टि, अंतर्ज्ञान, आत्मज्ञान, दूरदर्शी", 
    22: "मास्टर नंबर: मास्टर बिल्डर, व्यावहारिक आदर्शवाद, बड़े पैमाने पर उपलब्धियां", 
    33: "मास्टर नंबर: मास्टर शिक्षक, करुणा, उपचार, आध्यात्मिक मार्गदर्शन" 
  },
  fr: { 
    1: "Leadership, indépendance, esprit pionnier", 
    2: "Coopération, diplomatie, sensibilité", 
    3: "Créativité, communication, optimisme", 
    4: "Travail acharné, stabilité, sens pratique", 
    5: "Liberté, aventure, polyvalence", 
    6: "Nourricier, responsabilité, compassion", 
    7: "Spiritualité, analyse, introspection", 
    8: "Succès matériel, ambition, pouvoir", 
    9: "Humanitarisme, générosité, idéalisme", 
    11: "Maître Nombre : perspicacité spirituelle, intuition, illumination, visionnaire", 
    22: "Maître Nombre : Maître Bâtisseur, idéalisme pratique, réalisations à grande échelle", 
    33: "Maître Nombre : Maître Enseignant, compassion, guérison, guide spirituel" 
  },
  ar: { 
    1: "قيادة، استقلالية، روح رائدة", 
    2: "تعاون، دبلوماسية، حساسية", 
    3: "إبداع، تواصل، تفاؤل", 
    4: "عمل جاد، استقرار، عملية", 
    5: "حرية، مغامرة, تنوع", 
    6: "رعاية، مسؤولية، تعاطف", 
    7: "روحانية، تحليل، تأمل", 
    8: "نجاح مادي، طموح، قوة", 
    9: "إنسانية، كرم، مثالية", 
    11: "رقم رئيسي: بصيرة روحية، حدس، تنوير، رؤية", 
    22: "رقم رئيسي: باني رئيسي, مثالية عملية, إنجازات واسعة النطاق", 
    33: "رقم رئيسي: معلم رئيسي, تعاطف, شفاء, توجيه روحي" 
  }
}

const reduceToSingleDigit = (sum: number): number => {
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').reduce((acc, digit) => acc + Number(digit), 0)
  }
  return sum
}

const getLifePathNumber = (birthDateStr: string): number => {
  const sum = birthDateStr.replace(/-/g, '').split('').reduce((acc, digit) => acc + Number(digit), 0)
  return reduceToSingleDigit(sum)
}

const getDestinyNumber = (name: string): number => {
  const values = { 
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9, 
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9, 
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8 
  }
  const sum = name.toUpperCase().split('').reduce((acc, char) => {
    return acc + (values[char as keyof typeof values] || 0)
  }, 0)
  return sum === 0 ? 1 : reduceToSingleDigit(sum)
}

const getMeaning = (number: number) => {
  const meanings = lifePathMeanings[locale.value as keyof typeof lifePathMeanings] || lifePathMeanings.en
  return meanings[number as keyof typeof meanings] || `Number ${number}`
}

const validateInputs = (): boolean => {
  let isValid = true
  
  if (!birthDate.value) {
    birthDateError.value = true
    isValid = false
  }
  
  if (!fullName.value.trim()) {
    fullNameError.value = true
    isValid = false
  }
  
  return isValid
}

const clearErrors = () => {
  birthDateError.value = false
  fullNameError.value = false
}

const calculateNumerology = async () => {
  clearErrors()
  
  if (!validateInputs()) {
    return
  }
  
  const textToShow = `${fullName.value.slice(0, 20)} ✨ ${birthDate.value}`
  
  await showAnimation(textToShow, () => {
    lifePathNumber.value = getLifePathNumber(birthDate.value)
    destinyNumber.value = getDestinyNumber(fullName.value)
    lifePathMeaning.value = getMeaning(lifePathNumber.value)
    destinyMeaning.value = getMeaning(destinyNumber.value)
    
    numerologyResult.value = `Life Path: ${lifePathNumber.value}, Destiny: ${destinyNumber.value}`
    showResult.value = true
  })
}

const resetCalculation = () => {
  birthDate.value = ''
  fullName.value = ''
  showResult.value = false
  numerologyResult.value = ''
  clearErrors()
  clearNumerologyData()
}

const shareNumbers = () => {
  const shareText = `${$t('myNumerology')}\n\n${$t('lifePathNumber')} ${lifePathNumber.value}: ${lifePathMeaning.value}\n\n${$t('destinyNumber')} ${destinyNumber.value}: ${destinyMeaning.value}\n\nvia Teller.eu.org`
  
  if (navigator.share) {
    navigator.share({
      title: $t('myNumerology'),
      text: shareText
    }).catch(() => {
      navigator.clipboard.writeText(shareText)
      alert($t('shareError'))
    })
  } else {
    navigator.clipboard.writeText(shareText)
    alert($t('shareSuccess'))
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 18px;
  position: relative;
}

.form-group.has-error .error-message {
  display: flex;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 16px;
}

@media (min-width: 640px) {
  label {
    font-size: 17px;
  }
}

.error-message {
  color: #EF4444;
  font-size: 14px;
  margin-top: 6px;
  display: none;
  padding-left: 6px;
  align-items: center;
  gap: 6px;
  line-height: 1.4;
}

@media (min-width: 640px) {
  .error-message {
    font-size: 15px;
  }
}

.numerology-results {
  display: grid;
  gap: 18px;
  margin: 22px 0;
}

@media (min-width: 640px) {
  .numerology-results {
    gap: 20px;
    margin: 24px 0;
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