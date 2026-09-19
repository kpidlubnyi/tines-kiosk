<template>
  <div class="sidebar-nav-wrapper">
    <div class="sidebar-nav" :class="mode">
      <div class="nav-control top-control">
        <Transition name="fade-control">
          <button 
            v-if="mode === 'bars'"
            key="arrow-up"
            class="nav-arrow" 
            :disabled="activeIndex === 0" 
            @click="$emit('navigate', activeIndex - 1)"
            title="Попередній"
          >
            <AppIcon name="arrow-up" class="arrow-icon" />
          </button>
        </Transition>
      </div>

      <div 
        class="nav-scroll-container"
        ref="scrollContainer"
      >
        <div 
          class="nav-items-wrapper" 
          @click="handleWrapperClick"
        >
          <div
            v-for="(item, index) in itemsList"
            :key="typeof item === 'object' ? item.id || index : index"
            class="nav-item"
            :class="{ 
              'is-active': activeIndex === index,
              'is-circle': mode === 'circles'
            }"
            @click.stop="handleItemClick(index)"
          >
            <span 
              v-if="mode === 'circles'" 
              class="circle-label"
            >
              {{ getItemLabel(item, index) }}
            </span>
          </div>
        </div>
      </div>

      <div class="nav-control bottom-control">
        <Transition name="fade-control" mode="out-in">
          <button 
            v-if="mode === 'bars'"
            key="arrow-down"
            class="nav-arrow" 
            :disabled="activeIndex === totalItemsCount - 1" 
            @click="$emit('navigate', activeIndex + 1)"
            title="Наступний"
          >
            <AppIcon name="arrow-down" class="arrow-icon" />
          </button>

          <button 
            v-else
            key="reset-bars"
            class="nav-arrow reset-btn" 
            @click="switchToBars"
            title="Wróć do linii"
          >
            <AppIcon name="collapse" class="arrow-icon" />
          </button>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script>
import AppIcon from './AppIcon.vue'

// Власний масив назв для кожної категорії. Редагуйте стрінги тут:
const CATEGORY_NAV_ITEMS = {
  category1: ['Назва 1', 'Назва 2', 'Назва 3', 'Назва 4', 'Назва 5'],
  category2: ['Модель A', 'Модель B', 'Модель C', 'Модель D'],
  category3: ['Тип 100', 'Тип 200', 'Тип 300'],
  category4: ['Варіант 1', 'Варіант 2', 'Варіант 3', 'Варіант 4']
}

export default {
  name: 'SidebarNav',
  components: {
    AppIcon
  },
  props: {
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
    category: {
      type: String,
      default: ''
    }
  },
  emits: ['navigate'],
  data() {
    return {
      mode: 'bars'
    }
  },
  computed: {
    itemsList() {
      // 1. Якщо масив передано явно через props
      if (this.items && this.items.length > 0) {
        return this.items
      }
      
      // 2. Якщо задана категорія та для неї є стрінговий масив в CATEGORY_NAV_ITEMS
      if (this.category && CATEGORY_NAV_ITEMS[this.category]) {
        return CATEGORY_NAV_ITEMS[this.category]
      }
      
      // 3. За замовчуванням — генеруємо масив за тотальною кількістю
      return Array.from({ length: this.totalItems }, (_, i) => ({ id: i + 1 }))
    },
    totalItemsCount() {
      return this.itemsList.length
    }
  },
  watch: {
    activeIndex(newIndex) {
      this.scrollToActive(newIndex)
    }
  },
  methods: {
    handleWrapperClick() {
      if (this.mode === 'bars') {
        this.mode = 'circles'
      }
    },
    handleItemClick(index) {
      this.mode = 'circles'
      this.$emit('navigate', index)
    },
    switchToBars() {
      this.mode = 'bars'
    },
    getItemLabel(item, index) {
      if (typeof item === 'string' || typeof item === 'number') {
        return item
      }
      return item?.label || item?.title || item?.name || item?.code || item?.id || (index + 1)
    },
    scrollToActive(index) {
      this.$nextTick(() => {
        const container = this.$refs.scrollContainer
        if (!container) return
        const activeEl = container.querySelectorAll('.nav-item')[index]
        if (activeEl) {
          activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      })
    }
  }
}
</script>

<style scoped>
.sidebar-nav-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  flex: 1;
  padding-bottom: 6vh;
  box-sizing: border-box;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-height: 40vh;
  background-color: #f8fafc;
  border-radius: 1vw;
  border: 0.1vw solid rgba(226, 232, 240, 0.8);
  padding: 1vh 0.2vw;
  box-sizing: border-box;
  transition: all 0.4s cubic-bezier(0.34, 1.25, 0.64, 1);
}

.nav-control {
  height: 1.8vw;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-arrow {
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.2vw;
  transition: color 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-icon {
  width: 1vw;
  height: 1vw;
  min-width: 14px;
  min-height: 14px;
  display: block;
}

.nav-arrow:active:not(:disabled) {
  color: #929292;
  transform: scale(1.25);
}

.nav-arrow:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

.reset-btn {
  color: #929292;
}

.reset-btn:active {
  transform: rotate(90deg) scale(1.2);
}

.nav-scroll-container {
  overflow-y: auto;
  width: 100%;
  border-radius: 15%;
  max-height: calc(40vh - 3.6vw);
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.nav-scroll-container::-webkit-scrollbar {
  display: none;
}

.nav-items-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 0.6vh;
  padding: 0.4vh 0;
  cursor: pointer;
  border-radius: 0.6vw;
  transition: gap 0.4s cubic-bezier(0.34, 1.25, 0.64, 1), 
              padding 0.4s cubic-bezier(0.34, 1.25, 0.64, 1);
}

.sidebar-nav.circles .nav-items-wrapper {
  gap: 1.2vh;
  cursor: default;
}

.nav-item {
  width: 1.1vw;
  height: 0.35vh;
  min-height: 3px;
  background-color: #cbd5e1;
  border-radius: 50vw;
  border: 0.15vw solid transparent;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  transition: width 0.4s cubic-bezier(0.34, 1.3, 0.64, 1),
              height 0.4s cubic-bezier(0.34, 1.3, 0.64, 1),
              border-radius 0.4s ease,
              background-color 0.25s ease,
              border-color 0.25s ease,
              box-shadow 0.25s ease,
              transform 0.2s ease;
}

.sidebar-nav.bars .nav-item.is-active {
  width: 1.7vw;
  height: 0.45vh;
  min-height: 4px;
  background-color: #929292;
  box-shadow: 0 0 0.4vw rgba(0, 0, 0, 0.45);
}

.nav-item.is-circle {
  width: auto;
  min-width: 2.2vw;
  height: 2.2vw;
  min-height: 26px;
  padding: 0 0.4vw;
  border-radius: 50vw;
  background-color: #ffffff;
  border: 0.1vw solid #cbd5e1;
  cursor: pointer;
}

.nav-item.is-circle:active {
  border-color: #94a3b8;
  transform: scale(1.08);
}

.nav-item.is-circle.is-active {
  background-color: #f1f5f9;
  border-color: #929292;
  box-shadow: 0 0 0vw 0.15vw #929292, 0 0 0.6vw rgba(0, 0, 0, 0.2);
}

.circle-label {
  font-size: 0.65vw;
  font-weight: 600;
  color: #475569;
  user-select: none;
  white-space: nowrap;
  animation: fadeIn 0.25s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-control-enter-active,
.fade-control-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-control-enter-from,
.fade-control-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
</style>