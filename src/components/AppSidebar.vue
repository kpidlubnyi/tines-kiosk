<template>
  <Transition name="slide-sidebar">
    <aside v-if="isOpen" class="sidebar">
      <!-- 1. Верхній блок (Кнопка Додому + Перемикач Оферт) -->
      <div class="sidebar-top-section">
        <button 
          class="back-btn" 
          title="На головну" 
          @click="$emit('go-home')"
        >
          <AppIcon name="home" class="back-to-offer-icon" />
        </button>

        <OfferSidebarNav 
          :offers="offers"
          :activeOfferId="activeOfferId"
          @select-offer="$emit('select-offer', $event)"
        />
      </div>

      <!-- 2. Центральний блок (Крос-категорії), розміщений трохи нижче центру -->
      <div class="sidebar-center-section">
        <CrossCategoryNav
          :crossCategories="crossCategories"
          :activeCategory="activeOfferId"
          @select-cross-category="$emit('select-cross-category', $event)"
        />
      </div>

      <!-- 3. Нижній блок (Індикатори + Мова) -->
      <div class="sidebar-bottom-section">
        <SidebarNav 
          v-if="!isItemDetailActive && totalItems > 0"
          :items="items"
          :totalItems="totalItems" 
          :activeIndex="activeIndex"
          :category="activeOfferId"
          @navigate="$emit('navigate', $event)"
        />

        <div class="sidebar-footer">
          <button 
            v-if="isItemDetailActive"
            class="back-to-offer-btn" 
            title="Повернутися до оферти"
            @click="$emit('back-to-offer')"
          >
            <AppIcon name="arrow-left" class="back-to-offer-icon" />
          </button>

          <LanguageSelector />
        </div>
      </div>
    </aside>
  </Transition>
</template>

<script>
import SidebarNav from './SidebarNav.vue'
import OfferSidebarNav from './OfferSidebarNav.vue'
import CrossCategoryNav from './CrossCategoryNav.vue'
import AppIcon from './AppIcon.vue'
import LanguageSelector from './LanguageSelector.vue'

export default {
  name: 'AppSidebar',
  components: {
    SidebarNav,
    OfferSidebarNav,
    CrossCategoryNav,
    AppIcon,
    LanguageSelector
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    isItemDetailActive: {
      type: Boolean,
      default: false
    },
    offers: {
      type: Array,
      default: () => []
    },
    activeOfferId: {
      type: String,
      default: null
    },
    items: {
      type: Array,
      default: () => []
    },
    totalItems: {
      type: Number,
      default: 0
    },
    activeIndex: {
      type: Number,
      default: 0
    },
    crossCategories: {
      type: Array,
      default: () => []
    }
  },
  emits: ['toggle-language', 'go-home', 'navigate', 'select-offer', 'back-to-offer', 'select-cross-category']
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 4vw;
  height: 100vh;
  background-color: #ffffff;
  z-index: 100;
  box-shadow: -0.3vw 0 1.5vw rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Використовуємо flex-start замість space-between */
  align-items: center;
  padding: 3vh 0.8vw;
  box-sizing: border-box;
}

/* Верхній блок фіксовано зверху */
.sidebar-top-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1.5vh;
  z-index: 10;
}

/* 
  Альтернатива space-between: 
  margin-top: auto виштовхує блок донизу від верхньої секції,
  а transform: translateY(4vh) додатково зміщує його трохи нижче від центральної осі.
*/
.sidebar-center-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: auto; 
  transform: translateY(8vh); /* Опускаємо елемент трохи нижче */
  z-index: 10;
}

/* Нижній блок притиснутий до самого низу завдяки margin-top: auto */
.sidebar-bottom-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 2vh;
  margin-top: auto; 
  z-index: 10;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 1.5vh;
}

.back-btn {
  width: 3vw;
  height: 3vw;
  border-radius: 50%;
  background-color: #ffffff;
  border: 0.1vw solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  padding: 0;
  color: #1a202c;
  box-shadow: 0 0.2vw 0.8vw rgba(0, 0, 0, 0.05);
}

.back-btn:hover {
  background-color: #f8fafc;
  transform: translateY(-0.1vw);
  box-shadow: 0 0.4vw 1vw rgba(0, 0, 0, 0.1);
}

.back-btn:active {
  transform: scale(0.92);
}

.back-to-offer-btn {
  width: 3vw;
  height: 3vw;
  border-radius: 50%;
  background-color: #f1f5f9;
  border: 0.1vw solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  padding: 0;
}

.back-to-offer-btn:hover {
  background-color: #e2e8f0;
  transform: translateY(-0.1vw);
  box-shadow: 0 0.4vw 1vw rgba(0, 0, 0, 0.08);
}

.back-to-offer-btn:active {
  transform: scale(0.92);
}

.back-to-offer-icon {
  width: 1.5vw;
  height: 1.5vw;
}

.lang-btn {
  width: 3vw;
  height: 3vw;
  border-radius: 50%;
  background-color: #f1f5f9;
  border: 0.1vw solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  padding: 0;
}

.lang-btn:hover {
  background-color: #e2e8f0;
  transform: translateY(-0.1vw);
  box-shadow: 0 0.4vw 1vw rgba(0, 0, 0, 0.08);
}

.lang-btn:active {
  transform: scale(0.92);
}

.globe-icon {
  width: 1.5vw;
  height: 1.5vw;
  color: #0000008b;
}

.slide-sidebar-enter-active,
.slide-sidebar-leave-active {
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-sidebar-enter-from,
.slide-sidebar-leave-to {
  transform: translateX(100%);
}
</style>