<template>
  <div class="offer-sidebar-nav-wrapper">
    <div class="offer-sidebar-nav" :class="{ 'is-expanded': isExpanded }">
      <!-- Згорнутий стан: одна кругла кнопка зі стрілкою вниз -->
      <button 
        v-if="!isExpanded"
        class="offer-toggle-btn"
        title="Оберіть оферту"
        @click="isExpanded = true"
      >
        <AppIcon name="arrow-down" class="toggle-icon" />
      </button>

      <!-- Розгорнутий стан -->
      <div v-else class="offers-list">
        <!-- Кнопка згортання розміщена ТАМ ЖЕ (наверху списку) -->
        <button 
          class="close-offers-btn" 
          title="Згорнути" 
          @click="isExpanded = false"
        >
          <AppIcon name="arrow-up" class="close-icon" />
        </button>

        <div class="offers-items-group">
          <button
            v-for="offer in offers"
            :key="offer.id"
            class="offer-nav-btn"
            :class="{ 'is-active': offer.id === activeOfferId }"
            :title="offer.label"
            @click="selectOffer(offer.id)"
          >
            <AppIcon :name="offer.icon" class="offer-icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppIcon from './AppIcon.vue'

export default {
  name: 'OfferSidebarNav',
  components: {
    AppIcon
  },
  props: {
    offers: {
      type: Array,
      default: () => []
    },
    activeOfferId: {
      type: String,
      default: null
    }
  },
  emits: ['select-offer'],
  data() {
    return {
      isExpanded: false
    }
  },
  methods: {
    selectOffer(id) {
      if (id !== this.activeOfferId) {
        this.$emit('select-offer', id)
      }
      this.isExpanded = false
    }
  }
}
</script>

<style scoped>
.offer-sidebar-nav-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1.5vh;
}

.offer-sidebar-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/* Кнопка відкриття (у згорнутому стані) */
.offer-toggle-btn {
  width: 3vw;
  height: 3vw;
  border-radius: 50%;
  background-color: #f8fafc;
  border: 0.1vw solid rgba(226, 232, 240, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #007bc2;
  box-shadow: 0 0.2vw 0.8vw rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
  padding: 0;
}

.offer-toggle-btn:hover {
  background-color: #f1f5f9;
  transform: translateY(0.1vw);
  box-shadow: 0 0.4vw 1vw rgba(0, 0, 0, 0.08);
}

.offer-toggle-btn:active {
  transform: scale(0.92);
}

.toggle-icon {
  width: 1.2vw;
  height: 1.2vw;
}

/* Розгорнута сіра плашка */
.offers-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vh;
  padding: 0.4vw 0.2vw 1.2vh 0.2vw;
  background-color: #f8fafc;
  border-radius: 1.5vw;
  border: 0.1vw solid rgba(226, 232, 240, 0.8);
  width: 100%;
  box-sizing: border-box;
  animation: expandDown 0.35s cubic-bezier(0.34, 1.25, 0.64, 1) forwards;
  transform-origin: top center;
}

@keyframes expandDown {
  from {
    opacity: 0;
    transform: scaleY(0.6);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

/* Кнопка згортання — стоїть першою, рівно на місці кнопки розгортання */
.close-offers-btn {
  width: 2.6vw;
  height: 2.6vw;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #007bc2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: color 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
}

.close-offers-btn:hover {
  background-color: #e2e8f0;
  transform: scale(1.1);
}

.close-icon {
  width: 1.1vw;
  height: 1.1vw;
}

/* Група кнопок оферт під кнопкою закриття */
.offers-items-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vh;
  width: 100%;
}

.offer-nav-btn {
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

.offer-nav-btn:hover {
  border-color: #007bc2;
  color: #007bc2;
  transform: scale(1.1);
}

.offer-nav-btn.is-active {
  background-color: #007bc2;
  border-color: #007bc2;
  color: #ffffff;
  box-shadow: 0 0 0.6vw rgba(0, 123, 194, 0.45);
}

.offer-nav-btn.is-active :deep(.app-icon) {
  color: #ffffff !important;
}

.offer-icon {
  width: 1.1vw;
  height: 1.1vw;
}
</style>