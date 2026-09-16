<template>
  <div 
    class="secret-trigger-zone" 
    :class="position" 
    @dblclick.stop="handleDoubleClick"
  >
    <Transition name="secret-fade">
      <button 
        v-if="visible" 
        class="back-to-home-btn"
        @click.stop="handleClick"
        title="На головну"
      >
        <svg viewBox="0 0 24 24" class="home-icon">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </button>
    </Transition>
  </div>
</template>

<script>
export default {
  name: 'SecretHomeButton',
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
  width: 120px;
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

.back-to-home-btn {
  width: 3.2vw;
  height: 3.2vw;
  min-width: 44px;
  min-height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: auto;
  z-index: 31;
}

.back-to-home-btn:active {
  transform: scale(0.95);
}

.home-icon {
  width: 1.4vw;
  height: 1.4vw;
  min-width: 20px;
  min-height: 20px;
  fill: black;
}

.secret-fade-enter-active, 
.secret-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.secret-fade-enter-from, 
.secret-fade-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
</style>