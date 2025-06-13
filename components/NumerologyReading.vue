<template>
  <div>
    <h2 class="section-title">🔢 Numerology Reading</h2>
    <p class="intro-text">Discover your Life Path Number and its meaning.</p>
    
    <div class="form-group">
      <label>Enter your date of birth:</label>
      <input type="date" v-model="birthDate" />
    </div>

    <div class="form-group">
      <label>Enter your full name:</label>
      <input type="text" v-model="fullName" placeholder="e.g., John Doe" />
    </div>

    <button @click="calculateNumbers" class="btn">Calculate My Numbers</button>

    <div v-if="result" class="result show">
      <h3>Your Numerology Profile:</h3>
      <p><strong>Life Path Number:</strong> {{ result.lifePathNumber }}</p>
      <p><strong>Destiny Number:</strong> {{ result.destinyNumber }}</p>
      <p>{{ result.meaning }}</p>
      <div class="reflection-prompt">
        How do these numerical insights align with your personal experiences?
      </div>
      <button @click="shareNumbers" class="share-button">Share My Numbers</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const birthDate = ref('')
const fullName = ref('')
const result = ref<any>(null)

const calculateNumbers = () => {
  if (!birthDate.value || !fullName.value) return
  
  // Simple numerology calculation
  const lifePathNumber = calculateLifePath(birthDate.value)
  const destinyNumber = calculateDestiny(fullName.value)
  
  result.value = {
    lifePathNumber,
    destinyNumber,
    meaning: `Life Path ${lifePathNumber} individuals are ${getLifePathMeaning(lifePathNumber)}. Destiny Number ${destinyNumber} suggests ${getDestinyMeaning(destinyNumber)}.`
  }
}

const calculateLifePath = (date: string): number => {
  const sum = date.replace(/-/g, '').split('').reduce((acc, digit) => acc + parseInt(digit), 0)
  return reduceToSingleDigit(sum)
}

const calculateDestiny = (name: string): number => {
  const values: { [key: string]: number } = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
  }
  
  const sum = name.toUpperCase().replace(/[^A-Z]/g, '').split('').reduce((acc, char) => acc + (values[char] || 0), 0)
  return reduceToSingleDigit(sum)
}

const reduceToSingleDigit = (num: number): number => {
  while (num > 9) {
    num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0)
  }
  return num
}

const getLifePathMeaning = (num: number): string => {
  const meanings = {
    1: "natural leaders and pioneers",
    2: "cooperative and diplomatic",
    3: "creative and expressive",
    4: "practical and hardworking",
    5: "adventurous and free-spirited",
    6: "nurturing and responsible",
    7: "analytical and spiritual",
    8: "ambitious and business-minded",
    9: "humanitarian and compassionate"
  }
  return meanings[num as keyof typeof meanings] || "unique and special"
}

const getDestinyMeaning = (num: number): string => {
  const meanings = {
    1: "independence and leadership",
    2: "cooperation and partnership",
    3: "creativity and communication",
    4: "stability and organization",
    5: "freedom and adventure",
    6: "service and responsibility",
    7: "analysis and spirituality",
    8: "material success and authority",
    9: "humanitarian service"
  }
  return meanings[num as keyof typeof meanings] || "a special path"
}

const shareNumbers = () => {
  const shareText = `My Numerology Reading\n\nLife Path Number: ${result.value.lifePathNumber}\nDestiny Number: ${result.value.destinyNumber}\n\n${result.value.meaning}\n\nvia Teller.eu.org`
  
  if (navigator.share) {
    navigator.share({
      title: 'My Numerology Reading',
      text: shareText
    }).catch(() => {
      navigator.clipboard.writeText(shareText)
      alert('Sharing failed. Your numerology reading has been copied to the clipboard!')
    })
  } else {
    navigator.clipboard.writeText(shareText)
    alert('Your numerology reading has been copied to the clipboard!')
  }
}
</script>

<style scoped>
.intro-text {
  text-align: center;
  margin-bottom: 20px;
  color: #6B7280;
}

.form-group {
  margin-bottom: 15px;
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
</style> 