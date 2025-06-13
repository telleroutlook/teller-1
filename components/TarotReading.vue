<template>
  <div>
    <h2 class="section-title">{{ $t('tarotTitle') }}</h2>
    <p class="intro-text">{{ $t('tarotIntro') }}</p>
    
    <div class="tarot-progress" aria-live="polite">
      {{ progressText }}
    </div>

    <div v-if="selectedCards.length > 0" class="selected-cards" aria-live="polite">
      <div v-for="(card, index) in selectedCards" :key="index" class="selected-card">
        <strong>{{ getPositionLabel(index) }}:</strong><br>{{ card.name }}
      </div>
    </div>

    <div v-if="selectedCards.length < 3" class="card-grid" role="group" aria-label="Tarot card deck">
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
      <h4>{{ $t('yourReading') }}</h4>
      <div class="tarot-reading">
        <div v-for="(card, index) in selectedCards" :key="index" class="reading-card">
          <h4>{{ getPositionLabel(index) }} - {{ card.name }}</h4>
          <p>{{ card.meaning }}</p>
        </div>
      </div>
      <div class="reflection-prompt">
        {{ $t('tarotReflection') }}
      </div>
      <button @click="resetReading" class="reset-btn">{{ $t('resetReadingBtn') }}</button>
      <button @click="shareReading" class="share-button">{{ $t('shareReadingBtn') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TarotCard {
  name: string
  meaning: string
  flipped: boolean
  disabled: boolean
}

const { t: $t, locale } = useI18n()

// Simple animation function without anime.js for now
const runMysticalAnimation = (text: string, callback?: () => void) => {
  if (!process.client) return
  
  const overlay = document.getElementById('animation-overlay')
  if (overlay) {
    overlay.classList.add('visible')
    setTimeout(() => {
      overlay.classList.remove('visible')
      if (callback) callback()
    }, 2000)
  } else if (callback) {
    callback()
  }
}

// Get data directly for now
const getTarotCards = (locale: string) => {
  const cards = {
    en: ["The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"],
    zh: ["愚人", "魔术师", "女祭司", "皇后", "皇帝", "教皇", "恋人", "战车", "力量", "隐士", "命运之轮", "正义", "倒吊人", "死亡", "节制", "恶魔", "塔", "星星", "月亮", "太阳", "审判", "世界"],
    hi: ["मूर्ख", "जादूगर", "महायाजिका", "महारानी", "सम्राट", "धर्मगुरु", "प्रेमी", "रथ", "शक्ति", "एकांतवासी", "भाग्य का पहिया", "न्याय", "उल्टा लटका हुआ आदमी", "मृत्यु", "संयम", "शैतान", "टॉवर", "तारा", "चाँद", "सूरज", "निर्णय", "दुनिया"],
    fr: ["Le Mat", "Le Bateleur", "La Papesse", "L'Impératrice", "L'Empereur", "Le Pape", "L'Amoureux", "Le Chariot", "La Force", "L'Hermite", "La Roue de Fortune", "La Justice", "Le Pendu", "La Mort", "Tempérance", "Le Diable", "La Maison Dieu", "L'Étoile", "La Lune", "Le Soleil", "Le Jugement", "Le Monde"],
    ar: ["الأحمق", "الساحر", "الكاهنة العليا", "الإمبراطورة", "الإمبراطور", "الكاهن", "العشاق", "العربة", "القوة", "الناسك", "عجلة الحظ", "العدالة", "الرجل المشنوق", "الموت", "الاعتدال", "الشيطان", "البرج", "النجمة", "القمر", "الشمس", "الحكم", "العالم"]
  }
  return cards[locale as keyof typeof cards] || cards.en
}

const getTarotMeanings = (locale: string) => {
  const meanings = {
    en: ["New beginnings, spontaneity, innocence", "Manifestation, resourcefulness, power", "Intuition, sacred knowledge, divine feminine", "Femininity, beauty, nature, abundance", "Authority, establishment, structure, a father figure", "Spiritual wisdom, religious beliefs, conformity", "Love, harmony, relationships, values alignment", "Control, willpower, success, determination", "Strength, courage, persuasion, influence", "Soul-searching, introspection, inner guidance", "Good luck, karma, life cycles, destiny", "Justice, fairness, truth, cause and effect", "Suspension, restriction, letting go", "Endings, beginnings, change, transformation", "Balance, moderation, patience, purpose", "Shadow self, attachment, addiction, restriction", "Sudden change, upheaval, chaos, revelation", "Hope, faith, purpose, renewal, spirituality", "Illusion, fear, anxiety, subconscious, intuition", "Positivity, fun, warmth, success, vitality", "Judgement, rebirth, inner calling, absolution", "Completion, accomplishment, travel, success"],
    zh: ["新的开始，自发性，纯真", "显化，足智多谋，力量", "直觉，神圣知识，神圣女性", "女性气质，美丽，自然，富足", "权威，建制，结构，父亲形象", "精神智慧，宗教信仰，整合", "爱，和谐，关系，价值观对齐", "控制，意志力，成功，决心", "力量，勇气，说服力，影响力", "灵魂探索，内省，内在指引", "好运，业力，生命周期，命运", "正义，公平，真理，因果", "悬挂，限制，放手", "结束，开始，改变，转变", "平衡，节制，耐心，目的", "阴暗面，执着，成瘾，限制", "突然的变化，剧变，混乱，启示", "希望，信念，目的，更新，灵性", "幻觉，恐惧，焦虑，潜意识，直觉", "积极，乐趣，温暖，成功，活力", "审判，重生，内在召唤，赦免", "完成，成就，旅行，成功"],
    hi: ["नई शुरुआत, सहजता, मासूमियत", "प्रकटीकरण, साधन संपन्नता, शक्ति", "अंतर्ज्ञान, पवित्र ज्ञान, दिव्य स्त्री", "स्त्रीत्व, सौंदर्य, प्रकृति, प्रचुरता", "अधिकार, स्थापना, संरचना, एक पिता का आंकड़ा", "आध्यात्मिक ज्ञान, धार्मिक विश्वास, अनुरूपता", "प्रेम, सद्भाव, रिश्ते, मूल्यों का संरेखण", "नियंत्रण, इच्छाशक्ति, सफलता, दृढ़ संकल्प", "शक्ति, साहस, अनुनय, प्रभाव", "आत्मा-खोज, आत्मनिरीक्षण, आंतरिक मार्गदर्शन", "सौभाग्य, कर्म, जीवन चक्र, भाग्य", "न्याय, निष्पक्षता, सत्य, कारण और प्रभाव", "निलंबन, प्रतिबंध, जाने देना", "अंत, शुरुआत, परिवर्तन, परिवर्तन", "संतुलन, संयम, धैर्य, उद्देश्य", "छाया स्वयं, लगाव, व्यसन, प्रतिबंध", "अचानक परिवर्तन, उथल-पुथल, अराजकता, रहस्योद्घाटन", "आशा, विश्वास, उद्देश्य, नवीनीकरण, आध्यात्मिकता", "भ्रम, भय, चिंता, अवचेतन, अंतर्ज्ञान", "सकारात्मकता, मज़ा, गर्मी, सफलता, जीवन शक्ति", "निर्णय, पुनर्जन्म, आंतरिक बुलावा, दोषमुक्ति", "पूर्णता, उपलब्धि, यात्रा, सफलता"],
    fr: ["Nouveaux départs, spontanéité, innocence", "Manifestation, ingéniosité, pouvoir", "Intuition, connaissance sacrée, féminin divin", "Féminité, beauté, nature, abondance", "Autorité, établissement, structure, une figure paternelle", "Sagesse spirituelle, croyances religieuses, conformité", "Amour, harmonie, relations, alignement des valeurs", "Contrôle, volonté, succès, détermination", "Force, courage, persuasion, influence", "Recherche de l'âme, introspection, guide intérieur", "Bonne fortune, karma, cycles de vie, destin", "Justice, équité, vérité, cause à effet", "Suspension, restriction, lâcher prise", "Fins, commencements, changement, transformation", "Équilibre, modération, patience, but", "Le côté sombre, l'attachement, la dépendance, la restriction", "Changement soudain, bouleversement, chaos, révélation", "Espoir, foi, but, renouveau, spiritualité", "Illusion, peur, anxiété, subconscient, intuition", "Positivité, plaisir, chaleur, succès, vitalité", "Jugement, renaissance, appel intérieur, absolution", "Achèvement, accomplissement, voyage, succès"],
    ar: ["بدايات جديدة، عفوية، براءة", "تجلي، براعة، قوة", "حدس، معرفة مقدسة، أنوثة إلهية", "أنوثة، جمال، طبيعة، وفرة", "سلطة، مؤسسة، هيكل، شخصية أب", "حكمة روحية، معتقدات دينية, مطابقة", "حب، انسجام، علاقات، توافق القيم", "تحكم، قوة إرادة، نجاح، إصرار", "قوة، شجاعة، إقناع، تأثير", "بحث عن الذات، تأمل، توجيه داخلي", "حظ سعيد، كارما، دورات الحياة، مصير", "عدالة، إنصاف، حقيقة، سبب ونتيجة", "تعليق، تقييد، ترك", "نهايات، بدايات، تغيير، تحول", "توازن، اعتدال، صبر، هدف", "الجانب المظلم، تعلق، إدمان، تقييد", "تغيير مفاجئ، اضطراب، فوضى، كشف", "أمل، إيمان، هدف، تجديد، روحانية", "وهم، خوف، قلق، اللاوعي، حدس", "إيجابية، مرح، دفء، نجاح، حيوية", "حكم، ولادة جديدة، دعوة داخلية، غفران", "اكتمال، إنجاز، سفر، نجاح"]
  }
  return meanings[locale as keyof typeof meanings] || meanings.en
}

const selectedCards = ref<TarotCard[]>([])
const shuffledDeck = ref<TarotCard[]>([])
const showResult = ref(false)

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

const selectCard = (index: number) => {
  if (selectedCards.value.length >= 3 || shuffledDeck.value[index].flipped) return
  
  const card = shuffledDeck.value[index]
  card.flipped = true
  selectedCards.value.push(card)
  
  if (selectedCards.value.length === 3) {
    // Disable remaining cards
    shuffledDeck.value.forEach(c => {
      if (!c.flipped) c.disabled = true
    })
    
    // Trigger animation
    const cardNames = selectedCards.value.map(c => c.name).join('  ')
    runMysticalAnimation(cardNames, () => {
      showResult.value = true
    })
  }
}

const getPositionLabel = (index: number) => {
  const positions = [$t('tarotPast'), $t('tarotPresent'), $t('tarotFuture')]
  return positions[index]
}

const resetReading = () => {
  selectedCards.value = []
  showResult.value = false
  initializeDeck()
}

const shareReading = () => {
  const reading = selectedCards.value.map((card: TarotCard, index: number) => 
    `${getPositionLabel(index)}: ${card.name} - ${card.meaning}`
  ).join('\n')
  
  const shareText = `${$t('myTarotReading')}\n\n${reading}\n\nvia Teller.eu.org`
  
  if (navigator.share) {
    navigator.share({
      title: $t('myTarotReading'),
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

onMounted(() => {
  initializeDeck()
})

watch(locale, () => {
  if (selectedCards.value.length === 0) {
    initializeDeck()
  }
})
</script>

<style scoped>
.intro-text {
  text-align: center;
  margin-bottom: 20px;
  color: #6B7280;
  font-size: 0.9rem;
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