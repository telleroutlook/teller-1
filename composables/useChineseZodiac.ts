export const useChineseZodiac = () => {
  const getChineseZodiacAnimal = (year: number, locale: string = 'en') => {
    const { getChineseZodiac, getChineseTraits } = useDivinationData()
    
    const animalIndex = (year - 4) % 12
    const animals = getChineseZodiac(locale)
    const englishAnimals = getChineseZodiac('en')
    const traits = getChineseTraits(locale)
    
    const animal = animals[animalIndex]
    const englishAnimal = englishAnimals[animalIndex]
    const animalTraits = traits[englishAnimal as keyof typeof traits]
    
    return {
      animal,
      englishAnimal,
      traits: animalTraits,
      year
    }
  }

  return {
    getChineseZodiacAnimal
  }
} 