<template>
  <div class="item-detail-view">
    <div class="item-detail-container">
      <!-- Ліва частина: 3D Модель Sketchfab (або Фото) -->
      <div 
        class="media-column" 
        :class="{ 'full-width': isSidebarCollapsed }"
      >
        <div class="media-wrapper">
          <SketchfabViewer 
            v-if="item.sketchfabId || item.sketchfabUrl"
            :modelId="item.sketchfabId"
            :url="item.sketchfabUrl"
            :title="item.title"
            :autoplay="true"
          />
          <img 
            v-else-if="item.image" 
            :src="item.image" 
            :alt="item.title" 
            class="detail-image" 
          />
        </div>
      </div>

      <!-- Кнопка-стрілка (по центру висоти) -->
      <button 
        class="toggle-sidebar-btn" 
        :class="{ 'collapsed': isSidebarCollapsed }"
        @click="toggleSidebar"
        :title="isSidebarCollapsed ? 'Показати опис' : 'Згорнути опис'"
        aria-label="Перемикач панелі опису"
      >
        <svg 
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          stroke="currentColor" 
          stroke-width="2.5" 
          fill="none" 
          stroke-linecap="round" 
          stroke-linejoin="round"
          class="arrow-icon"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      <!-- Права частина: Карусель з драгом (Опис <-> Галерея) -->
      <div 
        class="content-column" 
        :class="{ 'collapsed': isSidebarCollapsed }"
      >
        <!-- Шапка: Незмінний заголовок та кругла кнопка -->
        <div class="header-row">
          <h1 class="detail-title" v-html="item.title"></h1>
          
          <button 
            class="mode-toggle-circle-btn"
            :class="{ 'is-gallery': currentSlide === 1 }"
            @click="toggleMode"
            :title="currentSlide === 0 ? 'Перейти до галереї' : 'Повернутися до опису'"
          >
            <AppIcon 
              v-if="currentSlide === 0" 
              name="photos" 
              class="toggle-icon" 
            />
            <AppIcon 
              v-if="currentSlide === 1" 
              name="description" 
              class="toggle-icon" 
            />
          </button>
        </div>

        <div class="accent-line"></div>

        <div 
          class="carousel-wrapper"
          ref="carouselWrapper"
          @mousedown="handleMouseDown"
          @touchstart="handleTouchStart"
          :class="{ 'is-dragging': isDragging }"
        >
          <div 
            class="carousel-track" 
            :style="{ transform: `translateX(${currentTranslateX}px)` }"
          >
            <!-- Слайд 1: Текстовий контент -->
            <div class="carousel-slide slide-description">
              <div class="description-wrapper" @mousedown.stop @touchstart.stop>
                <div class="detail-description" v-html="item.description"></div>
              </div>
            </div>

            <!-- Слайд 2: Галерея з 6 фото 16:9 -->
            <div class="carousel-slide slide-gallery">
              <div class="gallery-scroll-container" @mousedown.stop @touchstart.stop>
                <div class="gallery-grid">
                  <div 
                    v-for="n in 6" 
                    :key="n" 
                    class="gallery-item-card"
                  >
                    <div class="placeholder-content">
                      <span>Zdjęcie {{ n }} (16:9)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SketchfabViewer from './SketchfabViewer.vue'
import AppIcon from './AppIcon.vue'

export default {
  name: 'ItemDetailView',
  components: {
    SketchfabViewer,
    AppIcon
  },
  props: {
    item: {
      type: Object,
      required: true,
      default: () => ({
        title: '',
        description: '',
        image: '',
        sketchfabId: '',
        sketchfabUrl: ''
      })
    }
  },
  data() {
    return {
      isSidebarCollapsed: false,
      currentSlide: 0,
      hasAppIcon: true,
      
      isDragging: false,
      startX: 0,
      dragOffset: 0,
      slideWidth: 0
    }
  },
  computed: {
    currentTranslateX() {
      const baseTranslate = -this.currentSlide * this.slideWidth
      return baseTranslate + this.dragOffset
    }
  },
  mounted() {
    this.updateSlideWidth()
    window.addEventListener('resize', this.updateSlideWidth)
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mouseup', this.handleMouseUp)
    window.addEventListener('touchmove', this.handleTouchMove)
    window.addEventListener('touchend', this.handleMouseUp)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateSlideWidth)
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.handleMouseUp)
    window.removeEventListener('touchmove', this.handleTouchMove)
    window.removeEventListener('touchend', this.handleMouseUp)
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
      
      setTimeout(() => {
        this.updateSlideWidth()
        window.dispatchEvent(new Event('resize'))
      }, 300)
    },

    updateSlideWidth() {
      if (this.$refs.carouselWrapper) {
        this.slideWidth = this.$refs.carouselWrapper.clientWidth
      }
    },

    toggleMode() {
      this.currentSlide = this.currentSlide === 0 ? 1 : 0
      this.dragOffset = 0
    },

    handleMouseDown(e) {
      this.startDrag(e.clientX)
    },

    handleTouchStart(e) {
      if (e.touches && e.touches[0]) {
        this.startDrag(e.touches[0].clientX)
      }
    },

    startDrag(clientX) {
      this.isDragging = true
      this.startX = clientX
      this.dragOffset = 0
      this.updateSlideWidth()
    },

    handleMouseMove(e) {
      if (!this.isDragging) return
      this.moveDrag(e.clientX)
    },

    handleTouchMove(e) {
      if (!this.isDragging || !e.touches || !e.touches[0]) return
      this.moveDrag(e.touches[0].clientX)
    },

    moveDrag(clientX) {
      const deltaX = clientX - this.startX
      
      if ((this.currentSlide === 0 && deltaX > 0) || (this.currentSlide === 1 && deltaX < 0)) {
        this.dragOffset = deltaX * 0.25
      } else {
        this.dragOffset = deltaX
      }
    },

    handleMouseUp() {
      if (!this.isDragging) return
      this.isDragging = false

      const threshold = this.slideWidth * 0.2
      if (this.dragOffset < -threshold && this.currentSlide === 0) {
        this.currentSlide = 1
      } else if (this.dragOffset > threshold && this.currentSlide === 1) {
        this.currentSlide = 0
      }

      this.dragOffset = 0
    }
  }
}
</script>

<style scoped>
.item-detail-view {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.item-detail-container {
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10vh 2vw 2vh 2vw;
  gap: 0.8vw;
  align-items: center; 
}

.media-column {
  width: 55%;
  height: 100%;
  display: flex;
  flex-shrink: 0;
  box-sizing: border-box;
  transition: width 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.media-column.full-width {
  width: calc(100% - 2.5vw);
}

.media-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 1.5vw;
  overflow: hidden;
  box-shadow: 0 1vw 3vw rgba(0, 0, 0, 0.12);
  background-color: rgba(248, 250, 252, 0.85);
  border: 0.1vw solid rgba(226, 232, 240, 0.8);
  position: relative;
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.toggle-sidebar-btn {
  background: transparent;
  border: none;
  padding: 1vw 0.2vw;
  margin: 0;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  flex-shrink: 0;
  transition: color 0.2s ease, transform 0.2s ease;
}

.toggle-sidebar-btn:hover {
  color: #007bc2;
  transform: scale(1.2);
}

.toggle-sidebar-btn .arrow-icon {
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.toggle-sidebar-btn.collapsed .arrow-icon {
  transform: rotate(180deg);
}

.content-column {
  width: calc(45% - 2.5vw);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding-left: 0.5vw;
  box-sizing: border-box;
  overflow: hidden;
  opacity: 1;
  position: relative;
  transition: width 0.45s cubic-bezier(0.16, 1, 0.3, 1), 
              padding 0.45s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.25s ease;
}

.content-column.collapsed {
  width: 0%;
  padding-left: 0;
  opacity: 0;
  pointer-events: none;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1.5vh;
  gap: 1vw;
}

.detail-title {
  margin: 0;
  font-size: 2.2vw;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.15;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  flex: 1;
}

.detail-title :deep(sup),
.detail-description :deep(sup) {
  font-size: 0.6em;
  vertical-align: super;
  line-height: 0;
}

.mode-toggle-circle-btn {
  margin-left: auto;
  width: 2.8vw;
  height: 2.8vw;
  min-width: 2.8vw;
  min-height: 2.8vw;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 0.1vw solid rgba(0, 123, 194, 0.3);
  background-color: rgba(0, 123, 194, 0.08);
  color: #007bc2;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0.2vw 0.6vw rgba(0, 0, 0, 0.04);
}

.mode-toggle-circle-btn:hover {
  background-color: #007bc2;
  color: #ffffff;
  border-color: #007bc2;
  transform: scale(1.08);
  box-shadow: 0 0.4vw 1vw rgba(0, 123, 194, 0.25);
}

.toggle-icon {
  width: 1.3vw;
  height: 1.3vw;
  object-fit: contain;
  transition: transform 0.25s ease;
}

.mode-toggle-circle-btn:hover .toggle-icon {
  transform: scale(1.1);
}

.mode-toggle-circle-btn.is-gallery {
  border-color: rgba(15, 23, 42, 0.2);
  background-color: rgba(15, 23, 42, 0.06);
  color: #0f172a;
}

.mode-toggle-circle-btn.is-gallery:hover {
  background-color: #0f172a;
  color: #ffffff;
  border-color: #0f172a;
  box-shadow: 0 0.4vw 1vw rgba(15, 23, 42, 0.25);
}

.accent-line {
  width: 5vw;
  height: 0.3vw;
  background-color: #007bc2;
  border-radius: 1vw;
  margin-bottom: 2.5vh;
  flex-shrink: 0;
}

.carousel-wrapper {
  width: 100%;
  flex: 1;
  overflow: hidden;
  cursor: grab;
  user-select: none;
}

.carousel-wrapper.is-dragging {
  cursor: grabbing;
}

.carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
  will-change: transform;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.carousel-wrapper.is-dragging .carousel-track {
  transition: none;
}

.carousel-slide {
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.description-wrapper {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  padding-right: 0.5vw;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.description-wrapper::-webkit-scrollbar {
  display: none;
}

.detail-description {
  font-size: 1.1vw;
  line-height: 1.7;
  color: #334155;
  word-break: break-word;
}

/* Слайд 2: Галерея з градієнтною маскою прозорості зверху та знизу */
.gallery-scroll-container {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  padding-right: 0.5vw;
  scrollbar-width: none;
  -ms-overflow-style: none;

  /* Градієнтна маска прозорості для верхнього та нижнього країв */
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 4%,
    black 96%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 4%,
    black 96%,
    transparent 100%
  );
}

.gallery-scroll-container::-webkit-scrollbar {
  display: none;
}

.gallery-grid {
  display: flex;
  flex-direction: column;
  gap: 1.2vw;
  padding: 1.5vh 0; /* Невеликі відступи, щоб перша/остання картка гарно заходила під розмиття */
}

.gallery-item-card {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: rgba(241, 245, 249, 0.85);
  border: 0.1vw solid rgba(226, 232, 240, 0.9);
  border-radius: 1vw;
  overflow: hidden;
  box-shadow: 0 0.4vw 1.2vw rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.gallery-item-card:hover {
  transform: translateY(-0.2vw);
  box-shadow: 0 0.8vw 2vw rgba(0, 0, 0, 0.1);
}

.placeholder-content {
  font-size: 1vw;
  font-weight: 600;
  color: #64748b;
}
</style>