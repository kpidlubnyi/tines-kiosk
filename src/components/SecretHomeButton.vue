<template>
  <div 
    class="secret-trigger-zone" 
    :class="position" 
    @dblclick.stop="handleDoubleClick"
  >
    <Transition name="secret-fade">
      <div v-if="visible" class="secret-pill-container">
        <!-- Ліва половина: зовнішній сайт (AppIcon / kolej) -->
        <a 
          href="http://localhost:4174" 
          class="pill-action-btn left-action"
          title="Перейти на другий сайт"
          @click.stop
        >
          <AppIcon name="tracktec" class="pill-icon" />
        </a>

        <div class="pill-divider"></div>

        <!-- Права половина: домік (На головну) -->
        <button 
          class="pill-action-btn right-action"
          title="На головну"
          @click.stop="handleClick"
        >
          <svg viewBox="0 0 24 24" class="pill-icon home-icon">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script>
import AppIcon from './AppIcon.vue'

export default {
  name: 'SecretHomeButton',
  components: {
    AppIcon
  },
  props: {
    position: {
      type: String,
      default: 'left'
    },
    duration: {
      type: Number,
      default: 3000
    }
  },
  emits: ['go-home'],
  data() {
    return {
      visible: false,
      timer: null
    }
  },
  beforeUnmount() {
    this.clearTimer()
  },
  methods: {
    handleDoubleClick() {
      this.visible = true
      this.clearTimer()
      
      this.timer = setTimeout(() => {
        this.visible = false
      }, this.duration)
    },
    handleClick() {
      this.hide()
      this.$emit('go-home')
    },
    hide() {
      this.visible = false
      this.clearTimer()
    },
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    }
  }
}
</script>

<style scoped>
.secret-trigger-zone {
  position: fixed;
  bottom: 2vh;
  width: 180px;
  height: 100px;
  z-index: 30;
  display: flex;
  align-items: center;
}

.secret-trigger-zone.left {
  left: 2vw;
  justify-content: flex-start;
}

.secret-trigger-zone.right {
  right: 6vw;
  justify-content: flex-end;
}

/* Капсула (Pill) */
.secret-pill-container {
  display: flex;
  align-items: center;
  height: 3.2vw;
  min-height: 44px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  pointer-events: auto;
  z-index: 31;
}

/* Спільні стилі для обох половин */
.pill-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 1.2vw;
  min-width: 44px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s ease, transform 0.15s ease;
}

.pill-action-btn:hover {
  background: rgba(0, 0, 0, 0.06);
}

.pill-action-btn:active {
  background: rgba(0, 0, 0, 0.12);
}

/* Вертикальний розділювач між половинами */
.pill-divider {
  width: 1px;
  height: 50%;
  background-color: rgba(0, 0, 0, 0.15);
}

/* Іконки всередині капсули */
.pill-icon {
  width: 2vw;
  height: 2vw;
  min-width: 20px;
  min-height: 20px;
  color: #333333;
  fill: currentColor;
  stroke: currentColor;
  display: block;
}

.home-icon {
  fill: #333333;
  stroke: none;
}

/* Анімація появи/зникання */
.secret-fade-enter-active, 
.secret-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.secret-fade-enter-from, 
.secret-fade-leave-to {
  opacity: 0;
  transform: scale(0.7);
}
</style>