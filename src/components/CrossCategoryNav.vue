<template>
  <div v-if="hasCrossCategories" class="cross-category-nav-wrapper">
    <div class="cross-category-nav">
      <div class="cross-category-items">
        <button
          v-for="catKey in crossCategories"
          :key="catKey"
          class="cross-nav-btn"
          :class="{ 'is-active': catKey === activeCategoryKey }"
          :title="getCategoryLabel(catKey)"
          @click="selectCrossCategory(catKey)"
        >
          <AppIcon :name="getCategoryIcon(catKey)" class="cross-icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AppIcon from './AppIcon.vue'

export default {
  name: 'CrossCategoryNav',
  components: {
    AppIcon
  },
  props: {
    crossCategories: {
      type: Array,
      default: () => []
    },
    activeCategory: {
      type: String,
      default: ''
    }
  },
  emits: ['select-cross-category'],
  computed: {
    hasCrossCategories() {
      return Array.isArray(this.crossCategories) && this.crossCategories.length > 0
    },
    activeCategoryKey() {
      if (!this.activeCategory) return ''
      return this.activeCategory.split('-')[0]
    }
  },
  methods: {
    getCategoryIcon(key) {
      const icons = {
        kolej: 'kolej',
        przemysl: 'przemysl',
        metro: 'metro',
        tramwaj: 'tramwaj',
        wibro: 'wibro',
        budynki: 'wibro'
      }
      return icons[key] || 'kolej'
    },
    getCategoryLabel(key) {
      const labels = {
        kolej: 'KOLEJ',
        przemysl: 'KOLEJ PRZEMYSŁOWA',
        metro: 'METRO',
        tramwaj: 'TRAMWAJ',
        wibro: 'WIBROIZOLACJA BUDYNKÓW',
        budynki: 'WIBROIZOLACJA BUDYNKÓW'
      }
      return labels[key] || key.toUpperCase()
    },
    selectCrossCategory(catKey) {
      if (catKey !== this.activeCategoryKey) {
        this.$emit('select-cross-category', catKey)
      }
    }
  }
}
</script>

<style scoped>
.cross-category-nav-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1vh;
}

.cross-category-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vh;
  padding: 0.8vh 0.2vw 1.2vh 0.2vw;
  background-color: #f8fafc;
  border-radius: 1.5vw;
  border: 0.1vw solid rgba(226, 232, 240, 0.8);
  width: 100%;
  box-sizing: border-box;
  animation: blurFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.cross-category-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vh;
  width: 100%;
}

.cross-nav-btn {
  width: 2.2vw;
  height: 2.2vw;
  min-width: 28px;
  min-height: 28px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 0.12vw solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  padding: 0;
  color: #475569;
}

.cross-nav-btn:hover {
  border-color: #929292;
  color: #929292;
  transform: scale(1.1);
}

.cross-nav-btn.is-active {
  background-color: #929292;
  border-color: #929292;
  color: #ffffff;
  box-shadow: 0 0 0.6vw rgba(0, 0, 0, 0.45);
}

.cross-nav-btn.is-active :deep(.app-icon) {
  color: #ffffff !important;
}

.cross-icon {
  width: 1.1vw;
  height: 1.1vw;
}

@keyframes blurFadeIn {
  0% {
    opacity: 0;
    filter: blur(8px);
  }
  100% {
    opacity: 1;
    filter: blur(0);
  }
}
</style>