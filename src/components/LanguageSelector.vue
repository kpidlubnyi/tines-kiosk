<template>
  <div class="lang-selector-container" ref="containerRef">
    <!-- Горизонтальний список мов (висувається вліво) -->
    <Transition name="slide-left">
      <div v-if="isOpen" class="lang-dropdown-horizontal">
        <button
          v-for="lang in langStore.availableLanguages"
          :key="lang.code"
          class="lang-option-btn"
          :class="{ active: langStore.currentLang === lang.code }"
          @click="selectLanguage(lang.code)"
        >
          {{ lang.label }}
        </button>
      </div>
    </Transition>

    <!-- Головна кнопка вибору мови -->
    <button 
      class="lang-toggle-btn" 
      :class="{ active: isOpen }"
      @click="toggleDropdown"
      title="Змінити мову"
    >
      <span class="current-lang-code">{{ currentLangLabel }}</span>
      <svg class="globe-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLanguageStore } from '@/stores/language'

const langStore = useLanguageStore()
const isOpen = ref(false)
const containerRef = ref(null)

const currentLangLabel = computed(() => {
  const found = langStore.availableLanguages.find(l => l.code === langStore.currentLang)
  return found ? found.label : 'PL'
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectLanguage(code) {
  langStore.setLanguage(code)
  isOpen.value = false
}

// Закриття меню при кліку поза ним
function handleClickOutside(event) {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.lang-selector-container {
  position: relative;
  display: inline-flex;
  align-items: center;
}

/* Кнопка тригер */
.lang-toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-weight: 600;
  font-size: 14px;
}

.lang-toggle-btn:hover,
.lang-toggle-btn.active {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
}

.globe-icon {
  width: 18px;
  height: 18px;
}

/* Горизонтальний список мов, що висувається ВЛІВО */
.lang-dropdown-horizontal {
  position: absolute;
  right: 100%; /* Розгортається ліворуч від кнопки */
  margin-right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: row;
  gap: 6px;
  background: #1e1e1e;
  padding: 4px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
  z-index: 100;
}

/* Окремі кнопки мов у випадаючому списку */
.lang-option-btn {
  background: transparent;
  border: none;
  color: #aaa;
  padding: 6px 12px;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.2s ease;
}

.lang-option-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.lang-option-btn.active {
  background: #007bff; /* Ваш акцентний колір */
  color: #fff;
}

/* Анімація появи зсувом вліво */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-left-enter-from,
.slide-left-leave-to {
  opacity: 0;
  transform: translate(15px, -50%); /* Починає висуватись зправа наліво */
}
</style>