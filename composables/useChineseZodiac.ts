export const useChineseZodiac = () => {
  const getChineseZodiacAnimal = (year: number, locale: string = 'en') => {
    const { getChineseZodiac, getChineseTraits } = useChineseZodiacData()
    
    const animalIndex = (year - 4) % 12
    const animals = getChineseZodiac(locale)
    const englishAnimals = getChineseZodiac('en')
    const traits = getChineseTraits(locale)
    
    const animal = animals[animalIndex]
    const englishAnimal = englishAnimals[animalIndex]
    
    // 现在所有语言版本的traits都使用英文动物名作为键
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