<template>
  <div class="sidebar-nav">
    <!-- Стрілка Вгору -->
    <button 
      class="nav-arrow" 
      :disabled="activeIndex === 0" 
      @click="$emit('navigate', activeIndex - 1)"
      title="Попередній"
    >
      <AppIcon name="arrow-up" class="arrow-icon" />
    </button>

    <!-- Вертикальний список рисочок із заокругленими краями -->
    <div class="bars-container">
      <div
        v-for="index in totalItems"
        :key="index"
        class="nav-bar"
        :class="{ active: activeIndex === index - 1 }"
        @click="$emit('navigate', index - 1)"
      ></div>
    </div>

    <!-- Стрілка Вниз -->
    <button 
      class="nav-arrow" 
      :disabled="activeIndex === totalItems - 1" 
      @click="$emit('navigate', activeIndex + 1)"
      title="Наступний"
    >
      <AppIcon name="arrow-down" class="arrow-icon" />
    </button>
  </div>
</template>

<script>
import AppIcon from './AppIcon.vue'

export default {
  name: 'SidebarNav',
  components: {
    AppIcon
  },
  props: {
    totalItems: {
      type: Number,
      required: true,
      default: 0
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  emits: ['navigate']
}
</script>

<style scoped>
.sidebar-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3vh;
  width: 100%;
  padding: 0.5vh 0;
  box-sizing: border-box;
}

.nav-arrow {
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.2vw;
  transition: color 0.2s ease, transform 0.15s ease, opacity 0.2s ease;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-icon {
  width: 2vw;
  height: 2vw;
  min-width: 14px;
  min-height: 14px;
  display: block;
}

.nav-arrow:hover:not(:disabled) {
  color: #007bc2;
  transform: scale(1.25);
}

.nav-arrow:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

.bars-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6vh;
  width: 100%;
  padding: 0.2vh 0;
}

.nav-bar {
  width: 1.1vw;
  height: 0.3vh;
  min-height: 3px;
  background-color: #cbd5e1;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-bar:hover {
  background-color: #94a3b8;
  transform: scaleX(1.25);
}

.nav-bar.active {
  width: 1.7vw;
  height: 0.45vh;
  min-height: 4px;
  background-color: #007bc2;
  border-radius: 999px;
  box-shadow: 0 0 0.4vw rgba(0, 123, 194, 0.45);
}
</style>