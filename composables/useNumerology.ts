export const useNumerology = () => {
  const reduceToSingleDigit = (sum: number): number => {
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = String(sum).split('').reduce((acc, digit) => acc + Number(digit), 0)
    }
    return sum
  }

  const getLifePathNumber = (birthDate: string): number => {
    const sum = birthDate.replace(/-/g, '').split('').reduce((acc, digit) => acc + Number(digit), 0)
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

  return {
    getLifePathNumber,
    getDestinyNumber
  }
} 