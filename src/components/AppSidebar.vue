<template>
  <Transition name="slide-sidebar">
    <aside v-if="isOpen" class="sidebar">
      <!-- Верхній блок: Кнопка на головну + Навігатор оферт -->
      <div class="sidebar-header-group">
        <button 
          class="back-btn" 
          title="На головну" 
          @click="$emit('go-home')"
        >
          <span class="arrow">←</span>
        </button>

        <OfferSidebarNav 
          :offers="offers"
          :activeOfferId="activeOfferId"
          @select-offer="$emit('select-offer', $event)"
        />
      </div>

      <!-- Центральний/Нижній блок навігації -->
      <!-- РЕЖИМ 1: Якщо ми Всередині Айтема — показуємо Кнопку Повернення до Оферти -->
      <div v-if="isItemDetailActive" class="back-to-offer-container">
        <button 
          class="back-to-offer-btn" 
          title="Повернутися до оферти"
          @click="$emit('back-to-offer')"
        >
          <AppIcon name="arrow-left" class="back-icon" />
        </button>
      </div>

      <!-- РЕЖИМ 2: Якщо ми в списку оферти — показуємо смужки/кружечки -->
      <SidebarNav 
        v-else-if="totalItems > 0"
        :items="items"
        :totalItems="totalItems" 
        :activeIndex="activeIndex"
        @navigate="$emit('navigate', $event)"
      />

      <!-- Футер: Перемикання мов -->
      <div class="sidebar-footer">
        <button class="lang-btn" title="Переключити мову" @click="$emit('toggle-language')">
          <svg 
            class="globe-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4 10z"></path>
          </svg>
        </button>
      </div>
    </aside>
  </Transition>
</template>

<script>
import SidebarNav from './SidebarNav.vue'
import OfferSidebarNav from './OfferSidebarNav.vue'
import AppIcon from './AppIcon.vue'

export default {
  name: 'AppSidebar',
  components: {
    SidebarNav,
    OfferSidebarNav,
    AppIcon
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
    }
  },
  emits: ['toggle-language', 'go-home', 'navigate', 'select-offer', 'back-to-offer']
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
  justify-content: space-between;
  align-items: center;
  padding: 3vh 0.8vw;
  box-sizing: border-box;
}

.sidebar-header-group,
.sidebar-footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
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

.back-btn .arrow {
  font-size: 1.4vw;
  line-height: 1;
}

/* Блок для кнопки повернення до списку оферти */
.back-to-offer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: 1;
  padding-bottom: 6vh;
}

.back-to-offer-btn {
  width: 3vw;
  height: 3vw;
  border-radius: 50%;
  background-color: #007bc2;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ffffff;
  box-shadow: 0 0.4vw 1.2vw rgba(0, 123, 194, 0.35);
  transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
  padding: 0;
}

.back-to-offer-btn:hover {
  background-color: #0069a5;
  transform: scale(1.1);
  box-shadow: 0 0.6vw 1.6vw rgba(0, 123, 194, 0.45);
}

.back-to-offer-btn:active {
  transform: scale(0.95);
}

.back-icon {
  width: 1.4vw;
  height: 1.4vw;
  color: #ffffff !important;
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
  color: #007bc2;
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