export const useDivinationData = () => {
  const tarotCards = {
    en: ["The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"],
    zh: ["愚人", "魔术师", "女祭司", "皇后", "皇帝", "教皇", "恋人", "战车", "力量", "隐士", "命运之轮", "正义", "倒吊人", "死亡", "节制", "恶魔", "塔", "星星", "月亮", "太阳", "审判", "世界"],
    hi: ["मूर्ख", "जादूगर", "महायाजिका", "महारानी", "सम्राट", "धर्मगुरु", "प्रेमी", "रथ", "शक्ति", "एकांतवासी", "भाग्य का पहिया", "न्याय", "उल्टा लटका हुआ आदमी", "मृत्यु", "संयम", "शैतान", "टॉवर", "तारा", "चाँद", "सूरज", "निर्णय", "दुनिया"],
    fr: ["Le Mat", "Le Bateleur", "La Papesse", "L'Impératrice", "L'Empereur", "Le Pape", "L'Amoureux", "Le Chariot", "La Force", "L'Hermite", "La Roue de Fortune", "La Justice", "Le Pendu", "La Mort", "Tempérance", "Le Diable", "La Maison Dieu", "L'Étoile", "La Lune", "Le Soleil", "Le Jugement", "Le Monde"],
    ar: ["الأحمق", "الساحر", "الكاهنة العليا", "الإمبراطورة", "الإمبراطور", "الكاهن", "العشاق", "العربة", "القوة", "الناسك", "عجلة الحظ", "العدالة", "الرجل المشنوق", "الموت", "الاعتدال", "الشيطان", "البرج", "النجمة", "القمر", "الشمس", "الحكم", "العالم"]
  }

  const tarotMeanings = {
    en: ["New beginnings, spontaneity, innocence", "Manifestation, resourcefulness, power", "Intuition, sacred knowledge, divine feminine", "Femininity, beauty, nature, abundance", "Authority, establishment, structure, a father figure", "Spiritual wisdom, religious beliefs, conformity", "Love, harmony, relationships, values alignment", "Control, willpower, success, determination", "Strength, courage, persuasion, influence", "Soul-searching, introspection, inner guidance", "Good luck, karma, life cycles, destiny", "Justice, fairness, truth, cause and effect", "Suspension, restriction, letting go", "Endings, beginnings, change, transformation", "Balance, moderation, patience, purpose", "Shadow self, attachment, addiction, restriction", "Sudden change, upheaval, chaos, revelation", "Hope, faith, purpose, renewal, spirituality", "Illusion, fear, anxiety, subconscious, intuition", "Positivity, fun, warmth, success, vitality", "Judgement, rebirth, inner calling, absolution", "Completion, accomplishment, travel, success"],
    zh: ["新的开始，自发性，纯真", "显化，足智多谋，力量", "直觉，神圣知识，神圣女性", "女性气质，美丽，自然，富足", "权威，建制，结构，父亲形象", "精神智慧，宗教信仰，整合", "爱，和谐，关系，价值观对齐", "控制，意志力，成功，决心", "力量，勇气，说服力，影响力", "灵魂探索，内省，内在指引", "好运，业力，生命周期，命运", "正义，公平，真理，因果", "悬挂，限制，放手", "结束，开始，改变，转变", "平衡，节制，耐心，目的", "阴暗面，执着，成瘾，限制", "突然的变化，剧变，混乱，启示", "希望，信念，目的，更新，灵性", "幻觉，恐惧，焦虑，潜意识，直觉", "积极，乐趣，温暖，成功，活力", "审判，重生，内在召唤，赦免", "完成，成就，旅行，成功"],
    hi: ["नई शुरुआत, सहजता, मासूमियत", "प्रकटीकरण, साधन संपन्नता, शक्ति", "अंतर्ज्ञान, पवित्र ज्ञान, दिव्य स्त्री", "स्त्रीत्व, सौंदर्य, प्रकृति, प्रचुरता", "अधिकार, स्थापना, संरचना, एक पिता का आंकड़ा", "आध्यात्मिक ज्ञान, धार्मिक विश्वास, अनुरूपता", "प्रेम, सद्भाव, रिश्ते, मूल्यों का संरेखण", "नियंत्रण, इच्छाशक्ति, सफलता, दृढ़ संकल्प", "शक्ति, साहस, अनुनय, प्रभाव", "आत्मा-खोज, आत्मनिरीक्षण, आंतरिक मार्गदर्शन", "सौभाग्य, कर्म, जीवन चक्र, भाग्य", "न्याय, निष्पक्षता, सत्य, कारण और प्रभाव", "निलंबन, प्रतिबंध, जाने देना", "अंत, शुरुआत, परिवर्तन, परिवर्तन", "संतुलन, संयम, धैर्य, उद्देश्य", "छाया स्वयं, लगाव, व्यसन, प्रतिबंध", "अचानक परिवर्तन, उथल-पुथल, अराजकता, रहस्योद्घाटन", "आशा, विश्वास, उद्देश्य, नवीनीकरण, आध्यात्मिकता", "भ्रम, भय, चिंता, अवचेतन, अंतर्ज्ञान", "सकारात्मकता, मज़ा, गर्मी, सफलता, जीवन शक्ति", "निर्णय, पुनर्जन्म, आंतरिक बुलावा, दोषमुक्ति", "पूर्णता, उपलब्धि, यात्रा, सफलता"],
    fr: ["Nouveaux départs, spontanéité, innocence", "Manifestation, ingéniosité, pouvoir", "Intuition, connaissance sacrée, féminin divin", "Féminité, beauté, nature, abondance", "Autorité, établissement, structure, une figure paternelle", "Sagesse spirituelle, croyances religieuses, conformité", "Amour, harmonie, relations, alignement des valeurs", "Contrôle, volonté, succès, détermination", "Force, courage, persuasion, influence", "Recherche de l'âme, introspection, guide intérieur", "Bonne fortune, karma, cycles de vie, destin", "Justice, équité, vérité, cause à effet", "Suspension, restriction, lâcher prise", "Fins, commencements, changement, transformation", "Équilibre, modération, patience, but", "Le côté sombre, l'attachement, la dépendance, la restriction", "Changement soudain, bouleversement, chaos, révélation", "Espoir, foi, but, renouveau, spiritualité", "Illusion, peur, anxiété, subconscient, intuition", "Positivité, plaisir, chaleur, succès, vitalité", "Jugement, renaissance, appel intérieur, absolution", "Achèvement, accomplissement, voyage, succès"],
    ar: ["بدايات جديدة، عفوية، براءة", "تجلي، براعة، قوة", "حدس، معرفة مقدسة، أنوثة إلهية", "أنوثة، جمال، طبيعة، وفرة", "سلطة، مؤسسة، هيكل، شخصية أب", "حكمة روحية، معتقدات دينية, مطابقة", "حب، انسجام، علاقات، توافق القيم", "تحكم، قوة إرادة، نجاح، إصرار", "قوة، شجاعة، إقناع، تأثير", "بحث عن الذات، تأمل، توجيه داخلي", "حظ سعيد، كارما، دورات الحياة، مصير", "عدالة، إنصاف، حقيقة، سبب ونتيجة", "تعليق، تقييد، ترك", "نهايات، بدايات، تغيير، تحول", "توازن، اعتدال، صبر، هدف", "الجانب المظلم، تعلق، إدمان، تقييد", "تغيير مفاجئ، اضطراب، فوضى، كشف", "أمل، إيمان، هدف، تجديد، روحانية", "وهم، خوف، قلق، اللاوعي، حدس", "إيجابية، مرح، دفء، نجاح، حيوية", "حكم، ولادة جديدة، دعوة داخلية، غفران", "اكتمال، إنجاز، سفر، نجاح"]
  }

  const getTarotCards = (locale: string) => tarotCards[locale as keyof typeof tarotCards] || tarotCards.en
  const getTarotMeanings = (locale: string) => tarotMeanings[locale as keyof typeof tarotMeanings] || tarotMeanings.en

  return {
    getTarotCards,
    getTarotMeanings
  }
}

// 专门的占星术数据 composable（按需导入）
export const useAstrologyData = () => {
  const horoscopes = {
    en: { 
      aries: "New opportunities for leadership arise today. Your natural charisma will attract success, both personally and professionally.", 
      taurus: "Stability and patience will be your greatest assets today. Focus on building lasting foundations for future goals.", 
      gemini: "Communication is key today. Your wit and charm will open doors to new connections and exciting possibilities.", 
      cancer: "Trust your intuition today. Your emotional intelligence will guide you toward making the right decisions.", 
      leo: "Your creativity is at its peak. It's an excellent time to showcase your talents and pursue artistic endeavors.", 
      virgo: "Attention to detail will serve you well today. Focus on organization and practical solutions to current challenges.", 
      libra: "Balance and harmony are within reach. Seek compromise in conflicts and find beauty in your surroundings.", 
      scorpio: "Transformation is in the air. Embrace change and let go of what no longer serves your higher purpose.", 
      sagittarius: "Adventure calls to you today. Broaden your horizons through learning, travel, or philosophical discussions.", 
      capricorn: "Hard work and discipline will pay off today. Stay focused on your long-term goals and remain persistent.", 
      aquarius: "Innovation and originality will set you apart today. Embrace your unique perspective and share your vision.", 
      pisces: "Your compassion and creativity are highlighted today. Trust in your dreams and let your imagination guide you." 
    },
    zh: { 
      aries: "今天为领导力带来了新的机会。你天生的魅力将在个人和职业上吸引成功。", 
      taurus: "稳定和耐心将是你今天最大的财富。专注于为未来目标建立持久的基础。", 
      gemini: "沟通是今天的关键。你的机智和魅力将为新的联系和令人兴奋的可能性打开大门。", 
      cancer: "今天相信你的直觉。你的情商将引导你做出正确的决定。", 
      leo: "你的创造力正处于顶峰。这是展示你的才华和追求艺术事业的绝佳时机。", 
      virgo: "对细节的关注今天将对你大有裨益。专注于组织和对当前挑战的实际解决方案。", 
      libra: "平衡与和谐触手可及。在冲突中寻求妥协，在周围环境中寻找美好。", 
      scorpio: "变革在空气中。拥抱变化，放开不再服务于你更高目标的东西。", 
      sagittarius: "冒险今天在呼唤你。通过学习、旅行或哲学讨论来拓宽你的视野。", 
      capricorn: "辛勤工作和纪律今天将得到回报。专注于你的长期目标并保持毅力。", 
      aquarius: "创新和独创性今天将使你脱颖而出。拥抱你独特的视角并分享你的Vision。", 
      pisces: "你的同情心和创造力今天得到彰显。相信你的梦想，让你的想象力引导你。" 
    }
    // 其他语言省略...
  }

  const zodiacSigns = {
    en: { aries: "Aries", taurus: "Taurus", gemini: "Gemini", cancer: "Cancer", leo: "Leo", virgo: "Virgo", libra: "Libra", scorpio: "Scorpio", sagittarius: "Sagittarius", capricorn: "Capricorn", aquarius: "Aquarius", pisces: "Pisces" },
    zh: { aries: "白羊座", taurus: "金牛座", gemini: "双子座", cancer: "巨蟹座", leo: "狮子座", virgo: "处女座", libra: "天秤座", scorpio: "天蝎座", sagittarius: "射手座", capricorn: "摩羯座", aquarius: "水瓶座", pisces: "双鱼座" }
    // 其他语言省略...
  }

  const getHoroscopes = (locale: string) => horoscopes[locale as keyof typeof horoscopes] || horoscopes.en
  const getZodiacSigns = (locale: string) => zodiacSigns[locale as keyof typeof zodiacSigns] || zodiacSigns.en

  return {
    getHoroscopes,
    getZodiacSigns
  }
}

// 专门的中国生肖数据 composable（按需导入）
export const useChineseZodiacData = () => {
  const chineseZodiac = {
    animals: {
      en: ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"],
      zh: ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"]
      // 其他语言省略...
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
        Rat: "聪明、适应能力强、机智、有魅力、有艺术感", 
        Ox: "忠诚、可靠、彻底、坚强、理性", 
        Tiger: "热情、勇敢、有抱负、有领导才能", 
        Rabbit: "值得信赖、有同情心、谦虚、圆滑、真诚", 
        Dragon: "幸运、灵活、古怪、富有想象力、有艺术感", 
        Snake: "富有哲理、有条理、聪明、有直觉", 
        Horse: "适应能力强、忠诚、勇敢、有抱负、聪明", 
        Goat: "有品味、灵巧、温暖、优雅、有魅力", 
        Monkey: "机智、迷人、幸运、适应能力强、聪明", 
        Rooster: "诚实、精力充沛、聪明、华丽、灵活", 
        Dog: "忠诚、负责、值得信赖、诚实、可靠", 
        Pig: "可敬、乐善好施、坚定、乐观"
      }
      // 其他语言省略...
    }
  }

  const getChineseZodiac = (locale: string) => chineseZodiac.animals[locale as keyof typeof chineseZodiac.animals] || chineseZodiac.animals.en
  const getChineseTraits = (locale: string) => chineseZodiac.traits[locale as keyof typeof chineseZodiac.traits] || chineseZodiac.traits.en

  return {
    getChineseZodiac,
    getChineseTraits
  }
}

// 专门的数字命理数据 composable（按需导入）
export const useNumerologyData = () => {
  const lifePathMeanings = {
    en: { 
      1: "Leadership, independence, pioneering spirit", 
      2: "Cooperation, diplomacy, sensitivity", 
      3: "Creativity, communication, optimism", 
      4: "Hard work, stability, practicality", 
      5: "Freedom, adventure, versatility", 
      6: "Nurturing, responsibility, compassion", 
      7: "Spirituality, analysis, introspection", 
      8: "Material success, ambition, power", 
      9: "Humanitarianism, generosity, idealism", 
      11: "Master Number: Spiritual insight, intuition, enlightenment, visionary", 
      22: "Master Number: Master Builder, practical idealism, large-scale achievements", 
      33: "Master Number: Master Teacher, compassion, healing, spiritual guidance" 
    },
    zh: { 
      1: "领导力，独立，开拓精神", 
      2: "合作，外交，敏感", 
      3: "创造力，沟通，乐观", 
      4: "努力工作，稳定，务实", 
      5: "自由，冒险，多才多艺", 
      6: "培养，责任，同情", 
      7: "灵性，分析，内省", 
      8: "物质成功，野心，权力", 
      9: "人道主义，慷慨，理想主义", 
      11: "主数字：精神洞察力，直觉，启蒙，有远见", 
      22: "主数字：主建设者，实际理想主义，大规模成就", 
      33: "主数字：主老师，同情，治愈，精神指导" 
    }
    // 其他语言省略...
  }

  const getLifePathMeanings = (locale: string) => lifePathMeanings[locale as keyof typeof lifePathMeanings] || lifePathMeanings.en

  return {
    getLifePathMeanings
  }
} 