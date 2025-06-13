/**
 * Composable for managing form state that persists across language changes
 */
interface FormState {
  numerology: {
    birthDate: string
    fullName: string
  }
  chineseZodiac: {
    birthYear: string
  }
  astrology: {
    birthDate: string
    birthTime: string
    birthPlace: string
  }
}

export const useFormState = () => {
  // Use Nuxt's useState to persist data across component re-renders
  const formState = useState<FormState>('formState', () => ({
    numerology: {
      birthDate: '',
      fullName: ''
    },
    chineseZodiac: {
      birthYear: ''
    },
    astrology: {
      birthDate: '',
      birthTime: '',
      birthPlace: ''
    }
  }))

  // Numerology form state
  const setNumerologyData = (birthDate: string, fullName: string) => {
    formState.value.numerology.birthDate = birthDate
    formState.value.numerology.fullName = fullName
  }

  const getNumerologyData = () => formState.value.numerology

  const clearNumerologyData = () => {
    formState.value.numerology.birthDate = ''
    formState.value.numerology.fullName = ''
  }

  // Chinese Zodiac form state
  const setChineseZodiacData = (birthYear: string) => {
    formState.value.chineseZodiac.birthYear = birthYear
  }

  const getChineseZodiacData = () => formState.value.chineseZodiac

  const clearChineseZodiacData = () => {
    formState.value.chineseZodiac.birthYear = ''
  }

  // Astrology form state  
  const setAstrologyData = (birthDate: string, birthTime: string, birthPlace: string) => {
    formState.value.astrology.birthDate = birthDate
    formState.value.astrology.birthTime = birthTime
    formState.value.astrology.birthPlace = birthPlace
  }

  const getAstrologyData = () => formState.value.astrology

  const clearAstrologyData = () => {
    formState.value.astrology.birthDate = ''
    formState.value.astrology.birthTime = ''
    formState.value.astrology.birthPlace = ''
  }

  return {
    // Numerology
    setNumerologyData,
    getNumerologyData,
    clearNumerologyData,
    
    // Chinese Zodiac
    setChineseZodiacData,
    getChineseZodiacData,
    clearChineseZodiacData,
    
    // Astrology
    setAstrologyData,
    getAstrologyData,
    clearAstrologyData
  }
} 