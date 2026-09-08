<template>
  <div 
    class="carousel-container"
    ref="carouselRef"
    @mousedown="startDrag"
    @mouseenter="pauseAutoScroll"
    @mouseleave="handleMouseLeave"
    @touchstart="startTouch"
    @touchmove="onTouch"
    @touchend="stopDrag"
  >
    <div 
      class="carousel-track" 
      ref="trackRef"
      :style="{ transform: `translateX(${offset}px)` }"
    >
      <div 
        v-for="(item, index) in longStaticList" 
        :key="index" 
        class="carousel-card"
      >
        <img :src="item.image || item" alt="Gallery Image" class="card-image" draggable="false" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SolutionsCarousel',
  props: {
    speed: {
      type: Number,
      default: 1
    },
    repeatCount: {
      type: Number,
      default: 12
    }
  },
  data() {
    return {
      offset: 0,
      isDragging: false,
      isHovered: false,
      
      startX: 0,
      lastX: 0,
      lastTime: 0,
      velocity: 0,
      friction: 0.95,
      
      animFrameId: null,
      singleSetWidth: 0,
      localImages: []
    }
  },
  computed: {
    longStaticList() {
      if (!this.localImages.length) return []
      let list = []
      for (let i = 0; i < this.repeatCount; i++) {
        list = list.concat(this.localImages)
      }
      return list
    }
  },
  created() {
    this.loadLocalImages()
  },
  mounted() {
    // Чекаємо повного рендерингу елементів у DOM
    this.$nextTick(() => {
      // Додатково чекаємо завантаження хоча б одного зображення для точного розрахунку ширини
      setTimeout(() => {
        this.calculateBounds()
        if (this.singleSetWidth > 0) {
          this.offset = -this.singleSetWidth * Math.floor(this.repeatCount / 2)
        }
        this.startAnimation()
      }, 100)
    })

    // Глобальні слухачі для миші та сенсорних екранів
    window.addEventListener('mousemove', this.onDrag)
    window.addEventListener('mouseup', this.stopDrag)
    window.addEventListener('touchmove', this.onTouch)
    window.addEventListener('touchend', this.stopDrag)
  },
  beforeUnmount() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId)
    window.removeEventListener('mousemove', this.onDrag)
    window.removeEventListener('mouseup', this.stopDrag)
    window.removeEventListener('touchmove', this.onTouch)
    window.removeEventListener('touchend', this.stopDrag)
  },
  methods: {
    loadLocalImages() {
      const glob = import.meta.glob('@/assets/main-carousel/*.{png,jpg,jpeg,webp,svg}', { 
        eager: true, 
        query: '?url',
        import: 'default'
      })
      this.localImages = Object.values(glob)
    },

    calculateBounds() {
      const track = this.$refs.trackRef
      if (track && this.repeatCount > 0) {
        this.singleSetWidth = track.scrollWidth / this.repeatCount
      }
    },

    startAnimation() {
      const step = () => {
        // Якщо ширина не розрахувалася на старті, пробуємо перерахувати
        if (!this.singleSetWidth) {
          this.calculateBounds()
        }

        if (!this.isDragging) {
          // 1. Рух за інерцією (після свайпу)
          if (Math.abs(this.velocity) > 0.1) {
            this.offset += this.velocity
            this.velocity *= this.friction
          } 
          // 2. Автоскрол (працює завжди, коли не зажата ЛКМ / палець)
          else if (!this.isHovered) {
            this.offset -= this.speed
          }
        }

        // Безкінечний закольцований скрол
        if (this.singleSetWidth > 0) {
          if (this.offset <= -this.singleSetWidth * (this.repeatCount - 2)) {
            this.offset += this.singleSetWidth * Math.floor(this.repeatCount / 2)
          } else if (this.offset >= -this.singleSetWidth) {
            this.offset -= this.singleSetWidth * Math.floor(this.repeatCount / 2)
          }
        }

        this.animFrameId = requestAnimationFrame(step)
      }

      this.animFrameId = requestAnimationFrame(step)
    },

    pauseAutoScroll() {
      this.isHovered = true
    },

    handleMouseLeave() {
      this.isHovered = false
    },

    startDrag(e) {
      this.initDrag(e.pageX)
    },

    startTouch(e) {
      if (e.touches && e.touches[0]) {
        this.initDrag(e.touches[0].pageX)
      }
    },

    initDrag(pageX) {
      this.isDragging = true
      this.velocity = 0
      this.startX = pageX
      this.lastX = pageX
      this.lastTime = performance.now()
    },

    onDrag(e) {
      if (!this.isDragging) return
      this.updateDrag(e.pageX)
    },

    onTouch(e) {
      if (!this.isDragging || !e.touches || !e.touches[0]) return
      this.updateDrag(e.touches[0].pageX)
    },

    updateDrag(pageX) {
      const now = performance.now()
      const deltaX = pageX - this.lastX
      const deltaTime = now - this.lastTime

      if (deltaTime > 0) {
        this.velocity = deltaX / Math.max(deltaTime / 16, 1)
      }

      this.offset += deltaX
      this.lastX = pageX
      this.lastTime = now
    },

    stopDrag() {
      if (!this.isDragging) return
      this.isDragging = false
      this.velocity *= 1.2 // Сила імпульсу при відпусканні
    }
  }
}
</script>

<style scoped>
.carousel-container {
  width: 100%;
  height: 25vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  cursor: grab;
  user-select: none;
  position: relative;
}

.carousel-container:active {
  cursor: grabbing;
}

.carousel-track {
  display: flex;
  gap: 1.5vw;
  padding-left: 2vw;
  will-change: transform;
}

/* Картка тільки під зображення */
.carousel-card {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 18vw;
  height: 20vh;
  background: #f7fafc;
  border-radius: 1vw;
  border: 0.1vw solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 0.5vw 1.5vw rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.carousel-card:hover {
  transform: translateY(-0.3vw);
  box-shadow: 0 1vw 2vw rgba(0, 0, 0, 0.1);
}

.card-image {
  width: 80%;
  height: 80%;
  object-fit: cover;
  pointer-events: none;
}
</style>