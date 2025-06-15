<template>
  <div class="tarot-container">
    <h2 class="mb-4 text-xl font-bold text-center text-gray-700 sm:mb-6 sm:text-2xl lg:text-3xl">{{ $t('tarotTitle') }}</h2>
    <p class="mb-4 text-center text-sm text-gray-600 sm:mb-6 sm:text-base">{{ $t('tarotIntro') }}</p>
    
    <div class="tarot-progress" aria-live="polite">
      {{ progressText }}
    </div>

    <div v-if="selectedCards.length > 0" class="selected-cards" aria-live="polite">
      <div v-for="(card, index) in selectedCards" :key="index" class="selected-card">
        <strong>{{ getPositionLabel(index) }}:</strong><br>{{ card.name }}
      </div>
    </div>

    <div v-if="showCardGrid" class="card-grid" role="group" aria-label="Tarot card deck">
      <div
        v-for="(card, index) in shuffledDeck"
        :key="index"
        class="tarot-card"
        :class="{ flipped: card.flipped, disabled: selectedCards.length >= 3 || card.disabled }"
        @click="selectCard(index)"
        :aria-label="`${$t('tarotCard')} ${index + 1}`"
        tabindex="0"
      >
        <div class="card-face card-front">🎴</div>
        <div class="card-face card-back">
          <div>{{ card.name }}</div>
        </div>
      </div>
    </div>

    <div v-if="selectedCards.length === 3 && showResult" class="result show">
      <h4 class="mb-4 text-lg font-semibold text-center text-gray-800 sm:text-xl">{{ $t('yourReading') }}</h4>
      <div class="tarot-reading">
        <div v-for="(card, index) in selectedCards" :key="index" class="reading-card">
          <h4 class="mb-2 text-base font-medium sm:text-lg">{{ getPositionLabel(index) }} - {{ card.name }}</h4>
          <p class="text-sm text-gray-600 sm:text-base">{{ card.meaning }}</p>
        </div>
      </div>
      <div class="reflection-prompt">
        {{ $t('tarotReflection') }}
      </div>
      <div class="action-buttons">
        <button @click="resetReading" class="reset-btn">{{ $t('resetReadingBtn') }}</button>
        <button @click="shareReading" class="share-button">{{ $t('shareReadingBtn') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLogger } from '@/composables/useLogger'
import { useSeoMeta, useHead } from '#imports'

interface TarotCard {
  name: string
  meaning: string
  flipped: boolean
  disabled: boolean
}

const { t: $t, locale } = useI18n()
const { logger, LogCategory } = useLogger()

// Use the simplified animation composable
const { showAnimation } = useSimpleAnimation()

// Add SEO implementation
useSeoMeta({
  title: $t('seo.tarot.title'),
  description: $t('seo.tarot.description'),
  keywords: $t('seo.tarot.keywords'),
  ogTitle: $t('seo.tarot.ogTitle'),
  ogDescription: $t('seo.tarot.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image' as const,
  twitterTitle: $t('seo.tarot.twitterTitle'),
  twitterDescription: $t('seo.tarot.twitterDescription')
})

// Add structured data
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify($t('seo.tarot.structuredData'))
    }
  ]
})

// 使用分离的塔罗牌数据composable
const { getTarotCards, getTarotMeanings } = useDivinationData()

const selectedCards = ref<TarotCard[]>([])
const shuffledDeck = ref<TarotCard[]>([])
const showResult = ref(false)
const showCardGrid = ref(true)

const progressText = computed(() => {
  const remaining = 3 - selectedCards.value.length
  if (remaining === 3) {
    return $t('tarotProgressStart')
  } else if (remaining > 0) {
    return $t('tarotProgressRemain', { remaining })
  } else {
    return $t('tarotProgressDone')
  }
})

const initializeDeck = () => {
  const cards = getTarotCards(locale.value)
  const meanings = getTarotMeanings(locale.value)
  
  const deck = cards.map((name: string, index: number) => ({
    name,
    meaning: meanings[index],
    flipped: false,
    disabled: false
  }))
  
  // Shuffle deck
  shuffledDeck.value = deck.sort(() => Math.random() - 0.5)
}

const selectCard = async (index: number) => {
  if (selectedCards.value.length >= 3 || shuffledDeck.value[index].flipped) return
  
  logger.logUserAction('Tarot card selected', { 
    cardIndex: index,
    cardName: shuffledDeck.value[index].name,
    selectedCount: selectedCards.value.length + 1 
  })
  
  const card = shuffledDeck.value[index]
  card.flipped = true
  selectedCards.value.push(card)
  
  if (selectedCards.value.length === 3) {
    // Disable remaining cards
    shuffledDeck.value.forEach(c => {
      if (!c.flipped) c.disabled = true
    })
    
    // Wait for the third card's flip animation to complete before starting global animation
    setTimeout(async () => {
      // Trigger animation after the flip animation completes
      const cardNames = selectedCards.value.map(c => c.name).join('  ')
      logger.logAnimationStart('tarot-reading-complete', { 
        selectedCards: selectedCards.value.map(c => c.name) 
      })
      
      await showAnimation(cardNames)
      showCardGrid.value = false // Hide card grid after animation
      showResult.value = true
      logger.logUserAction('Tarot reading completed', { 
        cards: selectedCards.value.map(c => c.name) 
      })
    }, 1500) // Increased from 600ms to 1500ms for a longer pause after the third card flip
  }
}

const getPositionLabel = (index: number) => {
  const positions = [$t('tarotPast'), $t('tarotPresent'), $t('tarotFuture')]
  return positions[index]
}

const resetReading = () => {
  logger.logUserAction('Tarot reading reset')
  selectedCards.value = []
  showResult.value = false
  showCardGrid.value = true // Show card grid again when resetting
  initializeDeck()
}

const shareReading = () => {
  logger.logUserAction('Tarot reading share attempted')
  const reading = selectedCards.value.map((card: TarotCard, index: number) => 
    `${getPositionLabel(index)}: ${card.name} - ${card.meaning}`
  ).join('\n')
  
  const shareText = `${$t('myTarotReading')}\n\n${reading}\n\nvia Teller.eu.org`
  
  if (navigator.share) {
    navigator.share({
      title: $t('myTarotReading'),
      text: shareText
    }).then(() => {
      logger.logUserAction('Tarot reading shared successfully')
    }).catch(() => {
      navigator.clipboard.writeText(shareText)
      alert($t('shareError'))
      logger.logUserAction('Tarot reading copied to clipboard (share failed)')
    })
  } else {
    navigator.clipboard.writeText(shareText)
    alert($t('shareSuccess'))
    logger.logUserAction('Tarot reading copied to clipboard')
  }
}

onMounted(() => {
  logger.logComponentInit('TarotReading', { locale: locale.value })
  initializeDeck()
})

watch(locale, (newLocale, oldLocale) => {
  logger.logLanguageChange(oldLocale || 'unknown', newLocale)
  if (selectedCards.value.length === 0) {
    initializeDeck()
  }
})
</script>

<style scoped>
.tarot-container {
  max-width: 100%;
  padding: 0;
}

.tarot-progress {
  text-align: center;
  margin: 12px 0;
  padding: 8px 16px;
  background: linear-gradient(45deg, #EBF4FF, #DBEAFE);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #1D4ED8;
}

@media (min-width: 640px) {
  .tarot-progress {
    margin: 16px 0;
    padding: 12px 20px;
    font-size: 16px;
  }
}

.selected-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin: 16px 0;
  padding: 12px;
  background: #F3F4F6;
  border-radius: 8px;
}

@media (min-width: 640px) {
  .selected-cards {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    margin: 20px 0;
    padding: 16px;
  }
}

.selected-card {
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.4;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (min-width: 640px) {
  .selected-card {
    padding: 12px 16px;
    font-size: 14px;
  }
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 8px;
  margin: 16px 0;
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
}

@media (min-width: 640px) {
  .card-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 12px;
    margin: 20px 0;
    max-height: 500px;
    padding: 12px;
  }
}

@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}

.tarot-card {
  aspect-ratio: 2/3;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  transform-style: preserve-3d;
  min-height: 120px;
  touch-action: manipulation;
}

@media (min-width: 640px) {
  .tarot-card {
    min-height: 150px;
  }
}

.tarot-card:hover {
  transform: translateY(-4px) scale(1.02);
}

.tarot-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tarot-card.flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

@media (min-width: 640px) {
  .card-face {
    font-size: 24px;
    border-radius: 10px;
  }
}

.card-front {
  background: linear-gradient(45deg, #4F46E5, #7C3AED);
  color: white;
}

.card-back {
  background: linear-gradient(45deg, #FBBF24, #F59E0B);
  color: #1F2937;
  transform: rotateY(180deg);
  font-size: 11px;
  text-align: center;
  padding: 8px;
  line-height: 1.2;
}

@media (min-width: 640px) {
  .card-back {
    font-size: 13px;
    padding: 12px;
  }
}

.tarot-reading {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin: 16px 0;
}

@media (min-width: 640px) {
  .tarot-reading {
    gap: 16px;
    margin: 20px 0;
  }
}

@media (min-width: 768px) {
  .tarot-reading {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

.reading-card {
  padding: 12px;
  background: #F9FAFB;
  border-radius: 8px;
  border-left: 4px solid #10B981;
}

@media (min-width: 640px) {
  .reading-card {
    padding: 16px;
  }
}

.reflection-prompt {
  background: rgba(34, 197, 94, 0.1);
  padding: 12px;
  border-radius: 8px;
  margin: 16px 0;
  font-style: italic;
  color: #166534;
  text-align: center;
  font-size: 13px;
  line-height: 1.4;
}

@media (min-width: 640px) {
  .reflection-prompt {
    padding: 16px;
    margin: 20px 0;
    font-size: 14px;
  }
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

.reset-btn, .share-button {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  min-height: 44px;
  touch-action: manipulation;
}

@media (min-width: 640px) {
  .reset-btn, .share-button {
    padding: 12px 20px;
    font-size: 15px;
    min-height: auto;
  }
}

.reset-btn {
  background: linear-gradient(45deg, #6B7280, #4B5563);
  color: white;
}

.share-button {
  background: linear-gradient(45deg, #10B981, #059669);
  color: white;
}

.reset-btn:hover, .share-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.reset-btn:active, .share-button:active {
  transform: translateY(0);
}
.intro-text {
  text-align: center;
  margin-bottom: 30px;
  color: #6B7280;
  font-size: 0.9rem;
  line-height: 1.6;
  padding: 0 10px;
}

.tarot-progress {
  text-align: center;
  margin-bottom: 15px;
  font-size: 1rem;
  font-weight: 600;
  color: #667eea;
}

.selected-cards {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 15px 0;
  flex-wrap: wrap;
}

.selected-card {
  background: linear-gradient(45deg, #FCD34D, #F59E0B);
  color: #1F2937;
  padding: 8px;
  border-radius: 8px;
  min-width: 90px;
  text-align: center;
  font-weight: bold;
  border: 2px solid #F97316;
  font-size: 14px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 10px;
  margin: 15px auto;
  max-width: 600px;
  perspective: 1000px;
}

.tarot-card {
  aspect-ratio: 2/3;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  cursor: pointer;
}

.tarot-card .card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4px;
}

.card-face.card-front {
  background: linear-gradient(45deg, #8B5CF6, #A855F7);
  color: white;
  font-size: 2rem;
}

.card-face.card-back {
  background: linear-gradient(45deg, #FCD34D, #F59E0B);
  color: #1F2937;
  transform: rotateY(180deg);
  font-size: 12px;
  font-weight: bold;
}

.tarot-card.flipped {
  transform: rotateY(180deg);
}

.tarot-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(80%);
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

.reflection-prompt {
  background: rgba(34, 197, 94, 0.1);
  padding: 12px;
  border-radius: 8px;
  margin-top: 12px;
  font-style: italic;
  color: #166534;
}

.reset-btn {
  background: #EF4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  margin-right: 10px;
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