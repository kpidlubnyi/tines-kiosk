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
            :key="item.id || index"
            class="nav-item"
            :class="{ 
              'is-active': activeIndex === index,
              'is-circle': mode === 'circles'
            }"
            :style="mode === 'circles' ? getCircleStyle(item) : {}"
            @click.stop="handleItemClick(index)"
          >
            <span 
              v-if="mode === 'circles' && !getItemImage(item)" 
              class="circle-fallback"
            >
              {{ index + 1 }}
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
      if (this.items && this.items.length > 0) {
        return this.items
      }
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
    getItemImage(item) {
      if (item?.image || item?.bgImage) {
        return item.image || item.bgImage
      }
      
      if (item && item.id !== undefined && item.id !== null) {
        const catPath = this.category ? `${this.category}/` : ''
        return `/nav-thumbnails/${catPath}${item.id}.png`
      }
      
      return null
    },
    getCircleStyle(item) {
      const imageUrl = this.getItemImage(item)
      if (imageUrl) {
        return {
          backgroundImage: `url("${imageUrl}")`
        }
      }
      return {}
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

.nav-arrow:hover:not(:disabled) {
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

.reset-btn:hover {
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
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
  width: 2vw;
  height: 2vw;
  min-width: 24px;
  min-height: 24px;
  border-radius: 50%;
  cursor: pointer;
}

.nav-item.is-circle:hover {
  border-color: #94a3b8;
  transform: scale(1.08);
}

.nav-item.is-circle.is-active {
  border-color: #929292;
  box-shadow: 0 0 0vw 0.15vw #929292, 0 0 0.6vw rgba(0, 0, 0, 0.4);
}

.circle-fallback {
  font-size: 0.65vw;
  font-weight: 600;
  color: #475569;
  user-select: none;
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