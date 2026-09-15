import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLanguageStore = defineStore('language', () => {
  const currentLang = ref(localStorage.getItem('lang') || 'en')

  const availableLanguages = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'de', label: 'DE', name: 'Deutsch' },
    { code: 'pl', label: 'PL', name: 'Polski' },
    { code: 'uk', label: 'UA', name: 'Українська' },
    { code: 'ru', label: 'RU', name: 'Русский' }
  ]

  function setLanguage(code) {
    currentLang.value = code
    localStorage.setItem('lang', code)
  }

  function getText(field) {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field[currentLang.value] || field['en'] || field['pl'] || ''
  }

  return {
    currentLang,
    availableLanguages,
    setLanguage,
    getText
  }
})