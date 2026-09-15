<template>
  <div class="item-detail-view">
    <div class="item-detail-container">
      <!-- Ліва частина: 3D Модель Sketchfab (або Фото) + Галерея моделей -->
      <div 
        class="media-column" 
        :class="{ 'full-width': isSidebarCollapsed }"
      >
<!-- ЗМІНИ В СЕКЦІЇ <template> -->
<div class="media-wrapper">
  <SketchfabAPIViewer 
    v-if="activeSketchfabId"
    :key="activeSketchfabId"
    :modelId="activeSketchfabId"
    :autoplay="true"
    :annotations="item.annotations"
  />
  <img 
    v-else-if="item.images?.main_image" 
    :src="item.images?.main_image" 
    :alt="langStore.getText(item.title)" 
    class="detail-image" 
  />
</div>
        <!-- Галерея 3D-моделей під в'ювером -->
        <div v-if="hasMultipleModels" class="models-gallery">
          <button 
            class="nav-arrow left-arrow" 
            title="Попередня модель" 
            @click="prevModel"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div class="thumbnails-container">
            <button
              v-for="(id, index) in modelIds"
              :key="id"
              class="thumb-box"
              :class="{ 'is-active': id === activeSketchfabId }"
              :title="`Модель ${index + 1}`"
              @click="selectModel(id)"
            >
              <img 
                :src="`/3d-thumbnails/${id}.png`" 
                :alt="`Model ${index + 1}`"
                class="thumb-img"
                @error="handleImageError"
              />
              <span class="thumb-badge">3D</span>
            </button>
          </div>

          <button 
            class="nav-arrow right-arrow" 
            title="Наступна модель" 
            @click="nextModel"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
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
          <h1 class="detail-title" v-html="langStore.getText(item.title)"></h1>
          
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
                <div class="detail-description" v-html="langStore.getText(item.description)"></div>
              </div>
            </div>

            <!-- Слайд 2: Галерея фото 16:9 -->
            <div class="carousel-slide slide-gallery">
              <div class="gallery-scroll-container" @mousedown.stop @touchstart.stop>
                <div class="gallery-grid">
                  <template v-if="galleryImages.length > 0">
                    <div 
                      v-for="(imgSrc, index) in galleryImages" 
                      :key="index" 
                      class="gallery-item-card"
                    >
                      <img 
                        :src="imgSrc" 
                        :alt="`Zdjęcie ${index + 1}`"
                        class="gallery-img"
                        @error="handleImageError"
                      />
                    </div>
                  </template>
                  <div v-else class="placeholder-content">
                    Brak dostępnych zdjęć
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
import { useLanguageStore } from '@/stores/language.js';
import SketchfabAPIViewer from './SketchfabAPIViewer.vue';

export default {
  name: 'ItemDetailView',
  components: {
    SketchfabAPIViewer,
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
        images: null,
        sketchfabId: '',
        sketchfabUrl: '',
        sketchfab: null
      })
    }
  },
  data() {
    return {
      langStore: useLanguageStore(),
      isSidebarCollapsed: false,
      currentSlide: 0,
      hasAppIcon: true,
      
      activeSketchfabId: null,

      isDragging: false,
      startX: 0,
      dragOffset: 0,
      slideWidth: 0
    }
  },
  computed: {
    // Підтягуємо головне та додаткові зображення для галереї
    galleryImages() {
      if (!this.item) return []

      const imgs = []

      if (this.item.images) {
        if (Array.isArray(this.item.images.related_images)) {
          imgs.push(...this.item.images.related_images)
        }
      } else if (this.item.image) {
        imgs.push(this.item.image)
      }

      return imgs
    },
    modelIds() {
      if (this.item.sketchfab?.sketchfabIds?.length) {
        return this.item.sketchfab.sketchfabIds
      }
      const fallbackId = this.item.sketchfab?.defaultId || this.item.sketchfabId
      return fallbackId ? [fallbackId] : []
    },
    hasMultipleModels() {
      return this.modelIds.length > 1
    },
    currentIndex() {
      return this.modelIds.indexOf(this.activeSketchfabId)
    },
    currentTranslateX() {
      const baseTranslate = -this.currentSlide * this.slideWidth
      return baseTranslate + this.dragOffset
    }
  },
  watch: {
    item: {
      immediate: true,
      handler(newItem) {
        if (newItem.sketchfab?.defaultId) {
          this.activeSketchfabId = newItem.sketchfab.defaultId
        } else if (newItem.sketchfab?.sketchfabIds?.length) {
          this.activeSketchfabId = newItem.sketchfab.sketchfabIds[0]
        } else if (newItem.sketchfabId) {
          this.activeSketchfabId = newItem.sketchfabId
        } else {
          this.activeSketchfabId = null
        }
      }
    }
  },
  mounted() {
    this.$emit('sidebar-toggle', this.isSidebarCollapsed)
    
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
    selectModel(id) {
      this.activeSketchfabId = id
    },
    prevModel() {
      const total = this.modelIds.length
      if (total <= 1) return
      const prevIdx = (this.currentIndex - 1 + total) % total
      this.activeSketchfabId = this.modelIds[prevIdx]
    },
    nextModel() {
      const total = this.modelIds.length
      if (total <= 1) return
      const nextIdx = (this.currentIndex + 1) % total
      this.activeSketchfabId = this.modelIds[nextIdx]
    },
    // Фоллбек на png або приховання якщо зображення відсутнє
    handleImageError(e) {
      if (!e.target.dataset.fallbackTried) {
        e.target.dataset.fallbackTried = 'true'
        e.target.src = e.target.src.replace('.jpg', '.png')
      } else {
        e.target.style.opacity = '0'
      }
    },

    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
      
      // Надсилаємо стан нагору в App.vue
      this.$emit('sidebar-toggle', this.isSidebarCollapsed)
      
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
  flex-direction: column;
  gap: 1.5vh;
  flex-shrink: 0;
  box-sizing: border-box;
  transition: width 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.media-column.full-width {
  width: calc(100% - 2.5vw);
}

.media-wrapper {
  width: 100%;
  flex: 1;
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

/* Галерея 3D Моделей під в'ювером */
.models-gallery {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8vw;
  height: 8vh;
  min-height: 60px;
  flex-shrink: 0;
}

.thumbnails-container {
  display: flex;
  align-items: center;
  gap: 0.6vw;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 0.2vw;
}

.thumbnails-container::-webkit-scrollbar {
  display: none;
}

.thumb-box {
  position: relative;
  width: 6vw;
  height: 4vw;
  border-radius: 0.8vw;
  border: 0.12vw solid #e2e8f0;
  background-color: #0f172a;
  cursor: pointer;
  overflow: hidden;
  padding: 0;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0.2vw 0.6vw rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumb-box:hover {
  border-color: #0000008b;
  transform: translateY(-0.15vw);
  box-shadow: 0 0.4vw 1vw rgba(0, 0, 0, 0.2);
}

.thumb-box.is-active {
  border-color: #0000008b;
  border-width: 0.18vw;
  box-shadow: 0 0 0 0.2vw rgba(0, 0, 0, 0.3);
  transform: scale(1.05);
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-badge {
  position: absolute;
  bottom: 0.2vw;
  right: 0.2vw;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  color: #ffffff;
  font-size: 0.55vw;
  font-weight: 700;
  padding: 0.1vw 0.3vw;
  border-radius: 0.3vw;
  pointer-events: none;
}

.nav-arrow {
  width: 2.2vw;
  height: 2.2vw;
  min-width: 32px;
  min-height: 32px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 0.1vw solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 0.2vw 0.6vw rgba(0, 0, 0, 0.05);
  padding: 0;
  flex-shrink: 0;
}

.nav-arrow:hover {
  transform: scale(1.08);
}

.nav-arrow svg {
  width: 1.1vw;
  height: 1.1vw;
  min-width: 16px;
  min-height: 16px;
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

.toggle-sidebar-btn:active {
  color: #0000008b;
  transform: scale(0.9);
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
  border: 0.1vw solid rgba(0, 0, 0, 0.3);
  background-color: rgba(0, 0, 0, 0.08);
  color: #0000008b;
  flex-shrink: 0;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0.2vw 0.6vw rgba(0, 0, 0, 0.04);
}

.mode-toggle-circle-btn:active {
  background-color: #0000008b;
  color: #ffffff;
  border-color: #0000008b;
  transform: scale(0.94);
  box-shadow: 0 0.2vw 0.6vw rgba(0, 0, 0, 0.25);
}

.toggle-icon {
  width: 1.3vw;
  height: 1.3vw;
  object-fit: contain;
  transition: transform 0.2s ease;
}

.mode-toggle-circle-btn:active .toggle-icon {
  transform: scale(0.95);
}

.mode-toggle-circle-btn.is-gallery {
  border-color: rgba(0, 0, 0, 0.2);
  background-color: rgba(0, 0, 0, 0.06);
  color: #0f172a;
}

.mode-toggle-circle-btn.is-gallery:active {
  background-color: #0f172a;
  color: #ffffff;
  border-color: #0f172a;
  box-shadow: 0 0.2vw 0.6vw rgba(0, 0, 0, 0.25);
}

.accent-line {
  width: 5vw;
  height: 0.3vw;
  background-color: #0000008b;
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
  color: #0000008b;
  word-break: break-word;
}

.gallery-scroll-container {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  padding-right: 0.5vw;
  scrollbar-width: none;
  -ms-overflow-style: none;

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
  padding: 1.5vh 0;
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

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.placeholder-content {
  font-size: 1vw;
  font-weight: 600;
  color: #64748b;
}
</style>