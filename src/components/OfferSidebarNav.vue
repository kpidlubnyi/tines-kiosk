<template>
  <div class="offer-sidebar-nav" :class="{ 'is-expanded': isExpanded }">
    <!-- Кнопка розгортання/згортання -->
    <button 
      class="toggle-btn" 
      :title="isExpanded ? 'Згорнути оферти' : 'Розгорнути оферти'"
      @click="toggleExpand"
    >
      <AppIcon 
        :name="isExpanded ? 'arrow-up' : activeOfferIcon" 
        class="toggle-icon" 
      />
    </button>

    <!-- Висувний перелік категорій -->
    <Transition name="expand-fade">
      <div v-if="isExpanded" class="expanded-list">
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
    </Transition>
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
  data() {
    return {
      isExpanded: false
    }
  },
  computed: {
    activeOfferIcon() {
      const current = this.offers.find(o => o.id === this.activeOfferId)
      return current ? current.icon : 'kolej'
    }
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded
    },
    selectOffer(id) {
      this.$emit('select-offer', id)
      this.isExpanded = false
    }
  }
}
</script>

<style scoped>
.offer-sidebar-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
}

.toggle-btn {
  width: 3vw;
  height: 3vw;
  border-radius: 50%;
  background-color: #ffffff;
  border: 0.1vw solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  padding: 0;
  color: #007bc2;
  box-shadow: 0 0.2vw 0.8vw rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 5;
}

.toggle-btn:hover {
  background-color: #f8fafc;
  border-color: #007bc2;
  transform: scale(1.05);
}

.toggle-icon {
  width: 1.4vw;
  height: 1.4vw;
}

/* Висувний список: позиціонується абсолютно, не зміщує потік і не перекриває елементи зверху */
.expanded-list {
  position: absolute;
  top: calc(100% + 0.8vh);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8vh;
  padding: 0.8vh 0.3vw;
  background-color: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(8px);
  border-radius: 1.5vw;
  border: 0.1vw solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 0.6vw 1.8vw rgba(0, 0, 0, 0.08);
  width: 3.2vw;
  min-width: 38px;
  box-sizing: border-box;
  z-index: 4; /* Знижений z-index */
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
  transition: all 0.2s ease;
  padding: 0;
  color: #475569;
  flex-shrink: 0;
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
  box-shadow: 0 0 0.5vw rgba(0, 123, 194, 0.4);
}

.offer-nav-btn.is-active :deep(.app-icon) {
  color: #ffffff !important;
}

.offer-icon {
  width: 1.1vw;
  height: 1.1vw;
}

.expand-fade-enter-active,
.expand-fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.25s ease,
              transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.expand-fade-enter-from,
.expand-fade-leave-to {
  opacity: 0;
  filter: blur(6px);
  transform: translate(-50%, -0.8vh) scale(0.95);
}
</style>