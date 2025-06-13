# 🔮 Teller.eu.org - Your Digital Fortune Teller

A modern, multilingual web application offering various divination tools including Tarot reading, Astrology, Numerology, and Chinese Zodiac readings.

## ✨ Features

- **🃏 Tarot Reading**: Interactive card selection with mystical animations
- **⭐ Astrology**: Daily horoscope based on zodiac signs  
- **🔢 Numerology**: Life path and destiny number calculations
- **🐉 Chinese Zodiac**: Animal sign traits and characteristics

## 🌍 Language Support

The application supports 5 languages:
- 🇺🇸 English
- 🇨🇳 中文 (Chinese)
- 🇮🇳 हिन्दी (Hindi)
- 🇫🇷 Français (French)
- 🇸🇦 العربية (Arabic)

### 🔄 Language Switching Behavior

**Important**: When users switch languages, their input data is **preserved**. This includes:
- Birth dates and names in Numerology
- Birth years in Chinese Zodiac
- Any partially filled forms

This ensures a seamless user experience where language exploration doesn't interrupt their divination journey.

## 🚀 Technologies Used

- **Framework**: Nuxt 3 with Vue 3 Composition API
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom animations
- **Internationalization**: Nuxt i18n module
- **State Management**: Nuxt `useState` for form persistence
- **Animations**: Anime.js for mystical effects
- **Icons**: Nuxt Icons module

## 🏗️ Architecture

### Form State Persistence

The app uses a custom `useFormState` composable that leverages Nuxt's `useState` to maintain form data across:
- Component re-renders
- Language switches
- Route navigation (within the same session)

```typescript
// Auto-saves user input
const { setNumerologyData, getNumerologyData } = useFormState()

// Persists across language changes
watch(locale, () => {
  // Form data is preserved automatically
})
```

### Component Structure

```
components/
├── LanguageSwitcher.vue     # Language selection dropdown
├── TarotReading.vue         # Interactive tarot cards
├── AstrologyReading.vue     # Zodiac sign selection
├── NumerologyReading.vue    # Birth date & name forms
└── ChineseZodiacReading.vue # Birth year form
```

## 🎯 User Experience Highlights

1. **Persistent Forms**: Input data survives language changes
2. **Responsive Design**: Mobile-first with touch-friendly interactions
3. **Accessibility**: Proper ARIA labels and keyboard navigation
4. **Performance**: Optimized animations and lazy loading
5. **SEO**: Dynamic meta tags per tool and language

## 🧪 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Progressive Web App

The application includes PWA capabilities with:
- Offline functionality for core features
- Installable on mobile devices
- App-like navigation experience

## 🔮 Future Enhancements

- [ ] Save reading history
- [ ] Export readings as PDFs
- [ ] Social sharing with custom images
- [ ] More divination tools (I Ching, Runes)
- [ ] Personalized recommendations

---

*Experience the mystical world of divination with modern web technology* ✨
