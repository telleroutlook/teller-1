<template>
  <div>
    <h2 class="section-title">🐉 Chinese Zodiac</h2>
    <p class="intro-text">Discover your zodiac animal and its characteristics.</p>
    
    <div class="form-group">
      <label>Enter your birth year:</label>
      <input type="number" v-model="birthYear" placeholder="e.g., 1990" min="1900" max="2099" />
      <div class="input-help">
        Note: For those born in Jan or Feb, results may vary due to the Lunar New Year.
      </div>
    </div>

    <button @click="findZodiac" class="btn">Find My Zodiac</button>

    <div v-if="result" class="result show">
      <h3>Your Zodiac Animal:</h3>
      <div class="zodiac-animal">
        <span class="animal-emoji">{{ result.emoji }}</span>
        <h4>Year of the {{ result.animal }}</h4>
      </div>
      <p><strong>Traits:</strong> {{ result.traits }}</p>
      <p>{{ result.description }}</p>
      <div class="reflection-prompt">
        Embrace the wisdom of your zodiac animal.
      </div>
      <button @click="shareZodiac" class="share-button">Share My Zodiac</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const birthYear = ref<number>()
const result = ref<any>(null)

const zodiacAnimals = [
  { animal: "Rat", emoji: "🐭", traits: "Quick-witted, resourceful, versatile, kind" },
  { animal: "Ox", emoji: "🐂", traits: "Diligent, dependable, strong, determined" },
  { animal: "Tiger", emoji: "🐅", traits: "Brave, competitive, unpredictable, confident" },
  { animal: "Rabbit", emoji: "🐰", traits: "Quiet, elegant, kind, responsible" },
  { animal: "Dragon", emoji: "🐲", traits: "Confident, intelligent, enthusiastic" },
  { animal: "Snake", emoji: "🐍", traits: "Enigmatic, intelligent, wise" },
  { animal: "Horse", emoji: "🐴", traits: "Animated, active, energetic" },
  { animal: "Goat", emoji: "🐐", traits: "Calm, gentle, sympathetic" },
  { animal: "Monkey", emoji: "🐵", traits: "Sharp, smart, curiosity" },
  { animal: "Rooster", emoji: "🐓", traits: "Observant, hardworking, courageous" },
  { animal: "Dog", emoji: "🐕", traits: "Lovely, honest, responsible" },
  { animal: "Pig", emoji: "🐷", traits: "Compassionate, generous, diligent" }
]

const findZodiac = () => {
  if (!birthYear.value) return
  
  // Calculate zodiac based on year (simplified)
  const animalIndex = (birthYear.value - 1900) % 12
  const zodiac = zodiacAnimals[animalIndex]
  
  result.value = {
    ...zodiac,
    description: `People born in the Year of the ${zodiac.animal} are known for being ${zodiac.traits.toLowerCase()}.`
  }
}

const shareZodiac = () => {
  const shareText = `My Chinese Zodiac\n\nYear of the ${result.value.animal} ${result.value.emoji}\n\nTraits: ${result.value.traits}\n\n${result.value.description}\n\nvia Teller.eu.org`
  
  if (navigator.share) {
    navigator.share({
      title: 'My Chinese Zodiac',
      text: shareText
    }).catch(() => {
      navigator.clipboard.writeText(shareText)
      alert('Sharing failed. Your zodiac has been copied to the clipboard!')
    })
  } else {
    navigator.clipboard.writeText(shareText)
    alert('Your zodiac has been copied to the clipboard!')
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

.input-help {
  font-size: 0.8rem;
  color: #6B7280;
  margin-top: 4px;
}

.zodiac-animal {
  text-align: center;
  margin: 20px 0;
}

.animal-emoji {
  font-size: 3rem;
  display: block;
  margin-bottom: 10px;
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