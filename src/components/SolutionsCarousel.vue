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
        :key="`${item.id}-${index}`" 
        class="carousel-card"
        @click="handleCardClick($event, item)"
      >
        <div class="image-wrapper">
          <img 
            v-if="getImageUrl(item.image)"
            :src="getImageUrl(item.image)" 
            :alt="langStore.getText(item.title)" 
            class="card-image" 
            draggable="false" 
          />
          <div v-else class="no-image-placeholder">
            <span>{{ langStore.getText(item.title) }}</span>
          </div>
        </div>
        
        <div class="card-overlay">
          <span class="card-title" v-html="langStore.getText(item.title)"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import carouselData from '@/assets/data/carousel-offers.json'
import { useLanguageStore } from '@/stores/language';

export default {
  name: 'SolutionsCarousel',
  props: {
    speed: {
      type: Number,
      default: 1
    },
    repeatCount: {
      type: Number,
      default: 10
    }
  },
  emits: ['select-item'],
  data() {
    return {
      langStore: useLanguageStore(),
      offset: 0,
      isDragging: false,
      isHovered: false,
      
      startX: 0,
      lastX: 0,
      lastTime: 0,
      velocity: 0,
      friction: 0.95,
      dragDistance: 0,
      
      animFrameId: null,
      singleSetWidth: 0,
      productsList: carouselData || []
    }
  },
  computed: {
    longStaticList() {
      if (!this.productsList.length) return []
      let list = []
      for (let i = 0; i < this.repeatCount; i++) {
        list = list.concat(this.productsList)
      }
      return list
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.calculateBounds()
        if (this.singleSetWidth > 0) {
          this.offset = -this.singleSetWidth * Math.floor(this.repeatCount / 2)
        }
        this.startAnimation()
      }, 100)
    })

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
    getImageUrl(imagePath) {
      if (!imagePath || imagePath.includes('na-razie-nie-ma')) return null
      return imagePath
    },

    calculateBounds() {
      const track = this.$refs.trackRef
      if (track && this.repeatCount > 0) {
        this.singleSetWidth = track.scrollWidth / this.repeatCount
      }
    },

    startAnimation() {
      const step = () => {
        if (!this.singleSetWidth) {
          this.calculateBounds()
        }

        if (!this.isDragging) {
          if (Math.abs(this.velocity) > 0.1) {
            this.offset += this.velocity
            this.velocity *= this.friction
          } else if (!this.isHovered) {
            this.offset -= this.speed
          }
        }

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
      this.dragDistance = 0
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

      this.dragDistance += Math.abs(deltaX)

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
      this.velocity *= 1.2
    },

    handleCardClick(event, item) {
      if (this.dragDistance < 5) {
        this.$emit('select-item', { item, event })
      }
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

.carousel-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 0 0 18vw;
  height: 18vh;
  background: #ffffff;
  border-radius: 1vw;
  border: 0.1vw solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 0.5vw 1.5vw rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
}

.carousel-card:hover {
  transform: translateY(-0.4vw);
  box-shadow: 0 1vw 2vw rgba(0, 123, 194, 0.15);
  border-color: rgba(0, 123, 194, 0.4);
}

.image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.card-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.no-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
  color: #64748b;
  font-size: 0.8vw;
  font-weight: 600;
  text-align: center;
  padding: 1vw;
  box-sizing: border-box;
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0.6vw 0.8vw;
  background: linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.85) 100%);
  opacity: 0;
  transition: opacity 0.25s ease;
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
}

.carousel-card:hover .card-overlay {
  opacity: 1;
}

.card-title {
  color: #ffffff;
  font-size: 0.75vw;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>