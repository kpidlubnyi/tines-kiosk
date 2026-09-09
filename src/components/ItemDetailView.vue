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

      <!-- Права частина: Текстовий контент -->
      <div 
        class="content-column" 
        :class="{ 'collapsed': isSidebarCollapsed }"
      >
        <h1 class="detail-title" v-html="item.title"></h1>
        <div class="accent-line"></div>
        
        <div class="description-wrapper">
          <div class="detail-description" v-html="item.description"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SketchfabViewer from './SketchfabViewer.vue'

export default {
  name: 'ItemDetailView',
  components: {
    SketchfabViewer
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
      isSidebarCollapsed: false
    }
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
      
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 300)
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
  /* Центруємо елементи по вертикалі, щоб кнопка стала по середині */
  align-items: center; 
}

.media-column {
  width: 55%;
  height: 100%; /* Займає всю висоту контейнера */
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

/* Кнопка-стрілка (Центрована по вертикалі) */
.toggle-sidebar-btn {
  background: transparent;
  border: none;
  padding: 1vw 0.2vw;
  margin: 0;
  align-self: center; /* Чітке вертикальне центрування */
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
  height: 100%; /* Займає всю висоту, щоб заголовок був зверху */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding-left: 0.5vw;
  box-sizing: border-box;
  overflow: hidden;
  opacity: 1;
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

.detail-title {
  margin: 0 0 1.5vh 0;
  font-size: 2.2vw;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.15;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  width: 100%;
}

.detail-title :deep(sup),
.detail-description :deep(sup) {
  font-size: 0.6em;
  vertical-align: super;
  line-height: 0;
}

.accent-line {
  width: 5vw;
  height: 0.3vw;
  background-color: #007bc2;
  border-radius: 1vw;
  margin-bottom: 2.5vh;
  flex-shrink: 0;
}

.description-wrapper {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  padding-right: 1vw;
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
</style>