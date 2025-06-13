<template>
  <div>
    <h2 class="section-title">{{ $t('chineseZodiacTitle') }}</h2>
    <p class="intro-text">{{ $t('chineseZodiacIntro') }}</p>

    <div class="form-group" :class="{ 'has-error': yearError }">
      <label for="birthYear">{{ $t('birthYearLabel') }}</label>
      <input 
        id="birthYear"
        v-model="birthYear"
        type="number" 
        :placeholder="$t('birthYearPlaceholder')"
        min="1900"
        max="2099"
        :class="{ error: yearError }"
        @input="clearErrors"
      />
      <div class="input-help">{{ $t('lunarYearHelp') }}</div>
      <div v-if="yearError" class="error-message">
        <span class="error-icon">⚠️</span>
        <span>{{ $t('birthYearError') }}</span>
      </div>
    </div>

    <button @click="findZodiac" class="btn">{{ $t('findZodiacBtn') }}</button>

    <div v-if="zodiacResult && showResult" class="result show" aria-live="polite">
      <h4>{{ $t('yourZodiac') }}</h4>
      <div class="zodiac-animal">
        <div class="animal-emoji">{{ animalEmoji }}</div>
        <h3>{{ $t('yearOf', { animal: animalName }) }}</h3>
        <div class="traits-section">
          <h5>{{ $t('traits') }}</h5>
          <p>{{ animalTraits }}</p>
        </div>
      </div>
      <div class="reflection-prompt">
        {{ $t('chineseZodiacReflection') }}
      </div>
      <button @click="shareZodiac" class="share-button">{{ $t('shareZodiacBtn') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t: $t, locale } = useI18n()
const { runMysticalAnimation } = useAnimations()
const { logger, LogCategory } = useLogger()

const birthYear = ref('')
const yearError = ref(false)
const zodiacResult = ref('')
const showResult = ref(false)
const animalName = ref('')
const animalTraits = ref('')
const animalEmoji = ref('')

// Initialize component logging
onMounted(() => {
  logger.logComponentInit('ChineseZodiacReading', { locale: locale.value })
})

const chineseZodiacData = {
  animals: {
    en: ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"],
    zh: ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"],
    hi: ["चूहा", "बैल", "बाघ", "खरगोश", "ड्रैगन", "साँप", "घोड़ा", "बकरी", "बंदर", "मुर्गा", "कुत्ता", "सुअर"],
    fr: ["Rat", "Bœuf", "Tigre", "Lapin", "Dragon", "Serpent", "Cheval", "Chèvre", "Singe", "Coq", "Chien", "Cochon"],
    ar: ["الفأر", "الثور", "النمر", "الأرنب", "التنين", "الثعبان", "الحصان", "الماعز", "القرد", "الديك", "الكلب", "الخنزير"]
  },
  traits: {
    en: {
      Rat: "Clever, adaptable, quick-witted, charming, artistic", 
      Ox: "Loyal, reliable, thorough, strong, reasonable", 
      Tiger: "Enthusiastic, courageous, ambitious, leadership", 
      Rabbit: "Trustworthy, empathetic, modest, diplomatic, sincere", 
      Dragon: "Lucky, flexible, eccentric, imaginative, artistic", 
      Snake: "Philosophical, organized, intelligent, intuitive", 
      Horse: "Adaptable, loyal, courageous, ambitious, intelligent", 
      Goat: "Tasteful, crafty, warm, elegant, charming", 
      Monkey: "Quick-witted, charming, lucky, adaptable, bright", 
      Rooster: "Honest, energetic, intelligent, flamboyant, flexible", 
      Dog: "Loyal, responsible, trustworthy, honest, reliable", 
      Pig: "Honorable, philanthropic, determined, optimistic"
    },
    zh: {
      鼠: "聪明、适应能力强、机智、有魅力、有艺术感", 
      牛: "忠诚、可靠、彻底、坚强、理性", 
      虎: "热情、勇敢、有抱负、有领导才能", 
      兔: "值得信赖、有同情心、谦虚、圆滑、真诚", 
      龙: "幸运、灵活、古怪、富有想象力、有艺术感", 
      蛇: "富有哲理、有条理、聪明、有直觉", 
      马: "适应能力强、忠诚、勇敢、有抱负、聪明", 
      羊: "有品味、灵巧、温暖、优雅、有魅力", 
      猴: "机智、迷人、幸运、适应能力强、聪明", 
      鸡: "诚实、精力充沛、聪明、华丽、灵活", 
      狗: "忠诚、负责、值得信赖、诚实、可靠", 
      猪: "可敬、乐善好施、坚定、乐观"
    },
    hi: {
      चूहा: "चालाक, अनुकूलनीय, तेज-तर्रार, आकर्षक, कलात्मक", 
      बैल: "वफादार, भरोसेमंद, संपूर्ण, मजबूत, उचित", 
      बाघ: "उत्साही, साहसी, महत्वाकांक्षी, नेतृत्व", 
      खरगोश: "विश्वसनीय, सहानुभूतिपूर्ण, विनम्र, राजनयिक, ईमानदार", 
      ड्रैगन: "भाग्यशाली, लचीला, सनकी, कल्पनाशील, कलात्मक", 
      साँप: "दार्शनिक, संगठित, बुद्धिमान, सहज", 
      घोड़ा: "अनुकूलनीय, वफादार, साहसी, महत्वाकांक्षी, बुद्धिमान", 
      बकरी: "सुंदर, चालाक, गर्म, सुरुचिपूर्ण, आकर्षक", 
      बंदर: "तेज-तर्रार, आकर्षक, भाग्यशाली, अनुकूलनीय, उज्ज्वल", 
      मुर्गा: "ईमानदार, ऊर्जावान, बुद्धिमान, तेजतर्रार, लचीला", 
      कुत्ता: "वफादार, जिम्मेदार, भरोसेमंद, ईमानदार, विश्वसनीय", 
      सुअर: "सम्माननीय, परोपकारी, दृढ़निश्चयी, आशावादी"
    },
    fr: {
      Rat: "Intelligent, adaptable, vif d'esprit, charmant, artistique", 
      Bœuf: "Loyal, fiable, minutieux, fort, raisonnable", 
      Tigre: "Enthousiaste, courageus, ambitieux, leadership", 
      Lapin: "Digne de confiance, empathique, modeste, diplomate, sincère", 
      Dragon: "Chanceux, flexible, excentrique, imaginatif, artistique", 
      Serpent: "Philosophe, organisé, intelligent, intuitif", 
      Cheval: "Adaptable, loyal, courageus, ambitieux, intelligent", 
      Chèvre: "Raffiné, astucieux, chaleureux, élégant, charmant", 
      Singe: "Vif d'esprit, charmant, chanceux, adaptable, brillant", 
      Coq: "Honnête, énergique, intelligent, flamboyant, flexible", 
      Chien: "Loyal, responsable, digne de confiance, honnête, fiable", 
      Cochon: "Honorable, philanthrope, déterminé, optimiste"
    },
    ar: {
      الفأر: "ذكي، قابل للتكيف، سريع البديهة، ساحر، فني", 
      الثور: "مخلص، موثوق، شامل، قوي، معقول", 
      النمر: "متحمس، شجاع، طموح، قيادي", 
      الأرنب: "جدير بالثقة، متعاطف، متواضع، دبلوماسي، مخلص", 
      التنين: "محظوظ، مرن، غريب الأطوار، خيالي، فني", 
      الثعبان: "فلسفي، منظم، ذكي، حدسي", 
      الحصان: "قابل للتكيف، مخلص، شجاع، طموح، ذكي", 
      الماعز: "ذواق، ماكر، دافئ، أنيق، ساحر", 
      القرد: "سريع البديهة، ساحر، محظوظ، قابل للتكيف، مشرق", 
      الديك: "صادق، نشيط، ذكي، براق، مرن", 
      الكلب: "مخلص، مسؤول، جدير بالثقة، صادق، موثوق", 
      الخنزير: "شريف، خيري، حازم، متفائل"
    }
  },
  emojis: ["🐭", "🐂", "🐅", "🐰", "🐲", "🐍", "🐴", "🐐", "🐵", "🐓", "🐕", "🐖"]
}

const getChineseZodiacAnimal = (year: number) => {
  const animals = chineseZodiacData.animals[locale.value as keyof typeof chineseZodiacData.animals] || chineseZodiacData.animals.en
  const englishAnimals = chineseZodiacData.animals.en
  const traits = chineseZodiacData.traits[locale.value as keyof typeof chineseZodiacData.traits] || chineseZodiacData.traits.en
  
  const animalIndex = (year - 4) % 12
  const animal = animals[animalIndex]
  const englishAnimal = englishAnimals[animalIndex]
  const animalTrait = traits[englishAnimal as keyof typeof traits]
  const emoji = chineseZodiacData.emojis[animalIndex]
  
  return {
    animal,
    englishAnimal,
    traits: animalTrait,
    emoji,
    year
  }
}

const validateInput = (): boolean => {
  const year = parseInt(birthYear.value)
  if (!birthYear.value || isNaN(year) || year < 1900 || year > 2099) {
    yearError.value = true
    return false
  }
  return true
}

const clearErrors = () => {
  yearError.value = false
}

const findZodiac = () => {
  clearErrors()
  
  if (!validateInput()) {
    return
  }
  
  const year = parseInt(birthYear.value)
  const zodiacData = getChineseZodiacAnimal(year)
  
  runMysticalAnimation(zodiacData.emoji + ' ' + zodiacData.animal, () => {
    animalName.value = zodiacData.animal
    animalTraits.value = zodiacData.traits
    animalEmoji.value = zodiacData.emoji
    zodiacResult.value = `${zodiacData.animal} - ${zodiacData.traits}`
    showResult.value = true
  })
}

const shareZodiac = () => {
  const shareText = `${$t('myZodiac')}\n\n${$t('yearOf', { animal: animalName.value })}\n${$t('traits')} ${animalTraits.value}\n\nvia Teller.eu.org`
  
  if (navigator.share) {
    navigator.share({
      title: $t('myZodiac'),
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
</script>

<style scoped>
.intro-text {
  text-align: center;
  margin-bottom: 20px;
  color: #6B7280;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 15px;
  position: relative;
}

.form-group.has-error .error-message {
  display: flex;
}

.form-group.has-error input {
  border-color: #EF4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
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

.input-help {
  font-size: 0.8rem;
  color: #6B7280;
  margin-top: 4px;
}

.error-message {
  color: #EF4444;
  font-size: 0.8rem;
  margin-top: 4px;
  display: none;
  padding-left: 5px;
  align-items: center;
  gap: 5px;
}

.zodiac-animal {
  text-align: center;
  margin: 20px 0;
}

.animal-emoji {
  font-size: 4rem;
  margin-bottom: 15px;
}

.zodiac-animal h3 {
  color: #667eea;
  margin-bottom: 15px;
  font-size: 1.4rem;
}

.traits-section {
  background: #F8FAFC;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  margin-top: 15px;
}

.traits-section h5 {
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