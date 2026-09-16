<template>
  <div class="lang-selector-wrapper" ref="containerRef">
    <div class="lang-pill" :class="{ expanded: isOpen }">
      <Transition name="fade-options">
        <div v-if="isOpen" class="lang-options">
          <button
            v-for="lang in availableLanguages"
            :key="lang.code"
            class="lang-option-btn"
            :class="{ active: currentLang === lang.code }"
            @click="selectLanguage(lang.code)"
          >
            {{ lang.label }}
          </button>
        </div>
      </Transition>

      <button 
        class="lang-toggle-btn" 
        @click="toggleDropdown"
        :title="isOpen ? 'Close' : 'Change language'"
      >
        <AppIcon name="globe" class="globe-icon" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLanguageStore } from '@/stores/language'
import AppIcon from '@/components/AppIcon.vue'

const langStore = useLanguageStore()

const currentLang = computed(() => langStore.currentLang)
const availableLanguages = langStore.availableLanguages

const isOpen = ref(false)
const containerRef = ref(null)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectLanguage(code) {
  langStore.setLanguage(code)
  isOpen.value = false
}

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
.lang-selector-wrapper {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 48px;
  height: 48px;
}

.lang-pill {
  position: absolute;
  right: 0;
  top: 0;
  height: 48px;
  width: 48px;
  background-color: #ffffff;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
  z-index: 100;
}

.lang-pill.expanded {
  width: 290px; 
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  padding-left: 6px;
}

.lang-toggle-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.2s ease;
}

.lang-toggle-btn:active {
  background-color: rgba(0, 0, 0, 0.05);
}

.globe-icon {
  width: 22px;
  height: 22px;
}

.lang-options {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-grow: 1;
  height: 100%;
  padding-right: 4px;
}

.lang-option-btn {
  flex: 1;
  height: 34px;
  border: none;
  background: transparent;
  color: #555555;
  font-weight: 600;
  font-size: 13px;
  border-radius: 17px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.lang-option-btn:active {
  color: #1e1e1e;
  background: rgba(0, 0, 0, 0.05);
}

.lang-option-btn.active {
  background: #929292;
  color: #ffffff;
}

.fade-options-enter-active {
  transition: opacity 0.2s ease 0.1s;
}
.fade-options-leave-active {
  transition: opacity 0.1s ease;
}

.fade-options-enter-from,
.fade-options-leave-to {
  opacity: 0;
}
</style>