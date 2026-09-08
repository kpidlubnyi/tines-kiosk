<template>
  <Transition name="slide-sidebar">
    <aside v-if="isOpen" class="sidebar">
      <!-- Верхній блок: Кнопка повернення на головну -->
      <div class="sidebar-header">
        <button 
          class="back-btn" 
          title="На головну" 
          @click="$emit('go-home')"
        >
          <span class="arrow">←</span>
        </button>
      </div>

      <!-- Світло-сірий вертикальний блок для іконок/кружечків -->
      <div class="sidebar-content">
        <slot>
          <!-- Дефолтні кружечки-індикатори/іконки -->
          <div class="sidebar-items">
            <div class="sidebar-circle active"></div>
            <div class="sidebar-circle"></div>
            <div class="sidebar-circle"></div>
            <div class="sidebar-circle"></div>
          </div>
        </slot>
      </div>

      <!-- Футер: Кругла кнопка перемикання мов -->
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
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"></path>
          </svg>
        </button>
      </div>
    </aside>
  </Transition>
</template>

<script>
export default {
  name: 'AppSidebar',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-language', 'go-home']
}
</script>

<style scoped>
/* Вузька бічна панель (~4vw ширини) */
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

/* Верхній блок з кнопкою "На головну" */
.sidebar-header {
  display: flex;
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

/* Світло-сірий блок у центрі */
.sidebar-content {
  width: 100%;
  flex: 1;
  background-color: #f8fafc;
  border-radius: 1vw;
  border: 0.1vw solid rgba(226, 232, 240, 0.8);
  margin-top: 2vh;
  margin-bottom: 2vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1vw 0;
}

.sidebar-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5vw;
}

/* Кружечки/іконки */
.sidebar-circle {
  width: 1.8vw;
  height: 1.8vw;
  border-radius: 50%;
  background-color: #e2e8f0;
  border: 0.15vw solid #cbd5e1;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

.sidebar-circle.active,
.sidebar-circle:hover {
  background-color: #007bc2;
  border-color: #005a8f;
  transform: scale(1.1);
}

/* Нижній блок з кнопкою мови */
.sidebar-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
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

/* Анімація виїзду з правого краю */
.slide-sidebar-enter-active,
.slide-sidebar-leave-active {
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-sidebar-enter-from,
.slide-sidebar-leave-to {
  transform: translateX(100%);
}
</style>