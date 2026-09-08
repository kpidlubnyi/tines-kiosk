<template>
  <div class="info-ticker">
    <Transition name="slide-vertical" mode="out-in">
      <span :key="currentIndex" class="ticker-text">
        {{ phrases[currentIndex] }}
      </span>
    </Transition>
  </div>
</template>

<script>
export default {
  name: 'InfoTicker',
  props: {
    phrases: {
      type: Array,
      required: true,
      default: () => []
    },
    interval: {
      type: Number,
      default: 5000 // 5 секунд за замовчуванням
    }
  },
  data() {
    return {
      currentIndex: 0,
      timer: null
    }
  },
  mounted() {
    this.startRotation()
  },
  beforeUnmount() {
    this.stopRotation()
  },
  methods: {
    startRotation() {
      if (this.phrases.length > 1) {
        this.timer = setInterval(() => {
          this.currentIndex = (this.currentIndex + 1) % this.phrases.length
        }, this.interval)
      }
    },
    stopRotation() {
      if (this.timer) {
        clearInterval(this.timer)
      }
    }
  }
}
</script>

<style scoped>
/* Блакитна смужка */
.info-ticker {
  width: 45%;
  height: 3vw;
  border-radius: 0.5vw;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.ticker-text {
  font-family: inherit;
  font-size: 1.2vw;
  font-weight: 500;
  color: #007bc2;
  text-align: center;
  white-space: nowrap;
  padding: 0 4%;
  position: absolute;
}

/* Анімація зсуву вниз (Slide Down Vertical) */
.slide-vertical-enter-active,
.slide-vertical-leave-active {
  transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;
}

.slide-vertical-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-vertical-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>