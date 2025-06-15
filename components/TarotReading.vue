<template>
  <div class="tarot-container">
    <h2 class="mb-4 text-2xl font-bold text-center mystical-text-gradient sm:mb-6 sm:text-3xl lg:text-4xl">{{ $t('tarotTitle') }}</h2>
    <p class="mb-4 text-center text-base mystical-text-primary sm:mb-6 sm:text-lg">{{ $t('tarotIntro') }}</p>
    
    <div class="tarot-progress mystical-progress mystical-text-primary" aria-live="polite">
      {{ progressText }}
    </div>

    <div v-if="selectedCards.length > 0" class="selected-cards" aria-live="polite">
      <div v-for="(card, index) in selectedCards" :key="index" class="selected-card mystical-card mystical-text-primary">
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
      <h4 class="mb-4 text-xl font-bold text-center mystical-text-gradient sm:text-2xl">{{ $t('yourReading') }}</h4>
      <div class="tarot-reading">
                  <div v-for="(card, index) in selectedCards" :key="index" class="reading-card mystical-card">
            <h4 class="mb-2 text-lg font-bold mystical-text-card sm:text-xl">{{ getPositionLabel(index) }} - {{ card.name }}</h4>
            <p class="text-base mystical-text-card sm:text-lg">{{ card.meaning }}</p>
          </div>
      </div>
      <div class="reflection-prompt mystical-card mystical-text-card">
        {{ $t('tarotReflection') }}
      </div>
      <div class="action-buttons">
        <button @click="resetReading" class="mystical-button mystical-button-danger">{{ $t('resetReadingBtn') }}</button>
        <button @click="shareReading" class="mystical-button">{{ $t('shareReadingBtn') }}</button>
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
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
}

@media (min-width: 640px) {
  .tarot-progress {
    margin: 16px 0;
    padding: 14px 24px;
    font-size: 18px;
  }
}

.selected-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin: 16px 0;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
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
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.4;
}

@media (min-width: 640px) {
  .selected-card {
    padding: 14px 18px;
    font-size: 16px;
  }
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 10px;
  margin: 16px 0;
  max-height: 450px;
  overflow-y: auto;
  padding: 12px;
  perspective: 1000px;
}

@media (min-width: 640px) {
  .card-grid {
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    gap: 14px;
    margin: 20px 0;
    max-height: 550px;
    padding: 16px;
  }
}

@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  }
}

.tarot-card {
  aspect-ratio: 2/3;
  position: relative;
  cursor: pointer;
  transition: all 0.5s ease;
  transform-style: preserve-3d;
  min-height: 135px;
  touch-action: manipulation;
}

@media (min-width: 640px) {
  .tarot-card {
    min-height: 165px;
  }
}

.tarot-card:hover {
  transform: translateY(-6px) scale(1.05);
}

.tarot-card.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  filter: grayscale(70%);
}

.tarot-card.flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@media (min-width: 640px) {
  .card-face {
    font-size: 28px;
    border-radius: 16px;
  }
}

.card-front {
  background: linear-gradient(135deg, #8B5CF6, #A855F7, #C084FC);
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.card-back {
  background: linear-gradient(135deg, #FBBF24, #F59E0B, #EAB308);
  color: #1F2937;
  transform: rotateY(180deg);
  font-size: 14px;
  text-align: center;
  padding: 10px;
  line-height: 1.3;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

@media (min-width: 640px) {
  .card-back {
    font-size: 16px;
    padding: 14px;
    line-height: 1.4;
  }
}

.tarot-reading {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  margin: 16px 0;
}

@media (min-width: 640px) {
  .tarot-reading {
    gap: 18px;
    margin: 20px 0;
  }
}

@media (min-width: 768px) {
  .tarot-reading {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

.reading-card {
  padding: 18px;
  border-radius: 12px;
  border-left: 4px solid #10B981;
}

@media (min-width: 640px) {
  .reading-card {
    padding: 20px;
  }
}

.reflection-prompt {
  padding: 18px;
  border-radius: 12px;
  margin: 16px 0;
  font-style: italic;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  border: 2px solid rgba(34, 197, 94, 0.6);
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

.reset-btn, .share-button {
  padding: 12px 18px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  min-height: 48px;
  touch-action: manipulation;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

@media (min-width: 640px) {
  .reset-btn, .share-button {
    padding: 14px 22px;
    font-size: 17px;
    min-height: auto;
  }
}

.reset-btn {
  background: linear-gradient(135deg, #EF4444, #DC2626);
  color: white;
}

.share-button {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
}

.reset-btn:hover, .share-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.reset-btn:active, .share-button:active {
  transform: translateY(0) scale(1);
}

</style> 