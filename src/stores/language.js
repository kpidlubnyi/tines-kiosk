import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLanguageStore = defineStore('language', () => {
  // За замовчуванням польська
  const currentLang = ref(localStorage.getItem('lang') || 'pl')

  const availableLanguages = [
    { code: 'pl', label: 'PL', name: 'Polski' },
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'uk', label: 'UA', name: 'Українська' }
  ]

  function setLanguage(code) {
    currentLang.value = code
    localStorage.setItem('lang', code)
  }

  // Хелпер для отримання перекладу з об'єктів { pl: "...", en: "...", uk: "..." }
  function getText(field) {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field[currentLang.value] || field['pl'] || ''
  }

  return {
    currentLang,
    availableLanguages,
    setLanguage,
    getText
  }
})