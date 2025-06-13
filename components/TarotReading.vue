<template>
  <div>
    <h2 class="section-title">{{ t('tarotTitle') }}</h2>
    <p class="intro-text">{{ t('tarotIntro') }}</p>
    
    <div v-if="!isReading" class="progress-indicator">
      <p>{{ t('tarotProgressStart') }}</p>
    </div>
    <div v-else-if="selectedCards.length < 3" class="progress-indicator">
      <p>{{ t('tarotProgressRemain', { remaining: 3 - selectedCards.length }) }}</p>
    </div>
    <div v-else class="progress-indicator">
      <p>{{ t('tarotProgressDone') }}</p>
    </div>

    <div v-if="selectedCards.length < 3" class="tarot-deck">
      <div
        v-for="(card, index) in shuffledDeck"
        :key="index"
        class="tarot-card"
        @click="selectCard(card, index)"
      >
        🎴
      </div>
    </div>

    <div v-if="selectedCards.length === 3" class="result show">
      <h3>{{ t('yourReading') }}</h3>
      <div class="tarot-reading">
        <div v-for="(card, index) in selectedCards" :key="index" class="reading-card">
          <h4>{{ getPositionLabel(index) }}</h4>
          <p><strong>{{ t('tarotCard') }}:</strong> {{ card.name }}</p>
          <p>{{ card.meaning }}</p>
        </div>
      </div>
      <div class="reflection-prompt">
        {{ t('tarotReflection') }}
      </div>
      <button @click="resetReading" class="reset-btn">{{ t('resetReadingBtn') }}</button>
      <button @click="shareReading" class="share-button">{{ t('shareReadingBtn') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TarotCard {
  name: string
  meaning: string
}

const { t } = useI18n()

// Tarot cards data
const tarotCards = ref<TarotCard[]>([
  { name: "The Fool", meaning: "New beginnings, spontaneity, innocence" },
  { name: "The Magician", meaning: "Manifestation, resourcefulness, power" },
  { name: "The High Priestess", meaning: "Intuition, sacred knowledge, divine feminine" },
  { name: "The Empress", meaning: "Femininity, beauty, nature, abundance" },
  { name: "The Emperor", meaning: "Authority, structure, control, fatherhood" },
  { name: "The Hierophant", meaning: "Spiritual wisdom, religious beliefs, conformity" },
  { name: "The Lovers", meaning: "Love, harmony, relationships, values alignment" },
  { name: "The Chariot", meaning: "Control, willpower, success, determination" },
  { name: "Strength", meaning: "Strength, courage, persuasion, influence" },
  { name: "The Hermit", meaning: "Soul searching, seeking inner guidance, inner wisdom" },
  { name: "Wheel of Fortune", meaning: "Good luck, karma, life cycles, destiny" },
  { name: "Justice", meaning: "Justice, fairness, truth, cause and effect" },
  { name: "The Hanged Man", meaning: "Suspension, restriction, letting go, sacrifice" },
  { name: "Death", meaning: "Endings, beginnings, change, transformation" },
  { name: "Temperance", meaning: "Balance, moderation, patience, purpose" },
  { name: "The Devil", meaning: "Shadow self, attachment, addiction, restriction" },
  { name: "The Tower", meaning: "Sudden change, upheaval, chaos, revelation" },
  { name: "The Star", meaning: "Hope, faith, purpose, renewal, spirituality" },
  { name: "The Moon", meaning: "Illusion, fear, anxiety, subconscious, intuition" },
  { name: "The Sun", meaning: "Happiness, optimism, vitality, joy, confidence" },
  { name: "Judgement", meaning: "Judgement, rebirth, inner calling, absolution" },
  { name: "The World", meaning: "Completion, integration, accomplishment, travel" }
])

const selectedCards = ref<TarotCard[]>([])
const shuffledDeck = ref<TarotCard[]>([])
const isReading = ref(false)

onMounted(() => {
  shuffledDeck.value = [...tarotCards.value].sort(() => Math.random() - 0.5)
})

const selectCard = (card: TarotCard, index: number) => {
  if (selectedCards.value.length < 3) {
    selectedCards.value.push(card)
    shuffledDeck.value.splice(index, 1)
    isReading.value = true
  }
}

const getPositionLabel = (index: number) => {
  const positions = [t('tarotPast'), t('tarotPresent'), t('tarotFuture')]
  return positions[index]
}

const resetReading = () => {
  selectedCards.value = []
  shuffledDeck.value = [...tarotCards.value].sort(() => Math.random() - 0.5)
  isReading.value = false
}

const shareReading = () => {
  const reading = selectedCards.value.map((card: TarotCard, index: number) => 
    `${getPositionLabel(index)}: ${card.name} - ${card.meaning}`
  ).join('\n')
  
  const shareText = `${t('myTarotReading')}\n\n${reading}\n\nvia Teller.eu.org`
  
  if (navigator.share) {
    navigator.share({
      title: t('myTarotReading'),
      text: shareText
    }).catch(() => {
      navigator.clipboard.writeText(shareText)
      alert(t('shareError'))
    })
  } else {
    navigator.clipboard.writeText(shareText)
    alert(t('shareSuccess'))
  }
}
</script>

<style scoped>
.intro-text {
  text-align: center;
  margin-bottom: 20px;
  color: #6B7280;
}

.progress-indicator {
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
  color: #4A5568;
}

.tarot-deck {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 10px;
  margin: 20px 0;
  max-height: 400px;
  overflow-y: auto;
}

.tarot-card {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 2rem;
  text-align: center;
  aspect-ratio: 2/3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tarot-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.tarot-reading {
  display: grid;
  gap: 15px;
  margin: 20px 0;
}

.reading-card {
  background: #F8FAFC;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.reading-card h4 {
  color: #667eea;
  margin-bottom: 8px;
  font-size: 1.1rem;
}
</style> 