<template>
  <div class="main-screen">
    <AppBackground :currentState="currentBgState" />

    <Transition name="fade">
      <div v-if="isOfferActive && !isAnimating" class="offer-top-gradient"></div>
    </Transition>

    <!-- Заголовок оферти з плавним переходом -->
    <Transition name="offer-change" mode="out-in">
      <div 
        v-if="isOfferActive && !isAnimating" 
        :key="`header-${activeOfferId}`"
        class="offer-header-brand"
      >
        <img src="./assets/logo.png" class="header-logo" alt="Логотип компанії" />
        <span class="active-offer-title" v-html="currentOfferData.title"></span>
      </div>
    </Transition>
    <!-- Бічна панель -->
    <AppSidebar 
      :isOpen="isOfferActive && !isAnimating" 
      :offers="buttons"
      :activeOfferId="activeOfferId"
      :totalItems="currentOfferItemsCount"
      :activeIndex="activeOfferItemIndex"
      @toggle-language="handleLanguageToggle"
      @go-home="closeOffer"
      @navigate="scrollToOfferItem"
      @select-offer="switchOffer"
    />

    <div class="content-container">
      <Transition name="main-content-fade" appear>
        <div v-if="!isOfferActive" class="top-content-group" key="main-group">
          <div class="main-logo-container">
            <img src="./assets/logo.png" class="main-logo" alt="Логотип компанії" />
          </div>
          <div class="interactive-group">
            <InfoTicker :phrases="phrases" :interval="5000" />
            <AppNavigation :buttons="buttons" @select="handleButtonClick" />
          </div>
        </div>
      </Transition>

      <!-- Контент оферти з плавним переходом та ефектом розмиття -->
      <Transition name="offer-change" mode="out-in">
        <main 
          v-if="isOfferActive && !isAnimating" 
          :key="`content-${activeOfferId}`"
          class="offer-content-container"
        >
          <OfferDetails 
            ref="offerDetailsRef"
            :offer="currentOfferData" 
            @active-item-change="handleActiveItemChange"
          />
        </main>
      </Transition>

      <Transition name="main-content-fade" appear>
        <SolutionsCarousel v-if="!isOfferActive" :solutions="solutions" :speed="1" key="carousel" />
      </Transition>
    </div>

    <!-- Ripple Overlay -->
    <Transition name="ripple-fade">
      <div 
        v-if="ripple.active" 
        class="ripple-overlay" 
        :style="{ left: `${ripple.x}px`, top: `${ripple.y}px` }"
      >
        <div class="ripple-circle circle-1"></div>
      </div>
    </Transition>
  </div>
</template>

<script>
import offersDataJson from '@/assets/data/offers.json';

import AppBackground from './components/AppBackground.vue'
import InfoTicker from './components/InfoTicker.vue'
import AppNavigation from './components/AppNavigation.vue'
import SolutionsCarousel from './components/SolutionsCarousel.vue'
import AppSidebar from './components/AppSidebar.vue'
import OfferDetails from './components/OfferDetails.vue'

export default {
  name: 'MainScreen',
  components: {
    AppBackground,
    InfoTicker,
    AppNavigation,
    SolutionsCarousel,
    AppSidebar,
    OfferDetails
  },
  data() {
    return {
      isOfferActive: false,
      isAnimating: false,
      activeOfferId: null,
      activeOfferItemIndex: 0,
      
      ripple: {
        active: false,
        x: 0,
        y: 0
      },
      buttons: [
        { id: 'kolej', label: 'KOLEJ', icon: 'kolej' },
        { id: 'przemysl', label: 'KOLEJ PRZEMYSŁOWA', icon: 'przemysl' },
        { id: 'metro', label: 'METRO', icon: 'metro' },
        { id: 'tramwaj', label: 'TRAMWAJ', icon: 'tramwaj' },
        { id: 'budynki', label: 'WIBROIZOLACJA BUDYNKÓW', icon: 'wibro' }
      ],
      
      offersData: offersDataJson,
      phrases: [
        '22 lat doświadczenia',
        '600+ zrealizowanych projektów',
        '380000+ metrów toru pojedyńczego',
        '480000+ metrów kwadratowych mat wibroizolacyjnych'
      ],
      solutions: [
        {
          title: 'Система Getzner EBS',
          description: 'Ефективний захист від вібрацій для залізничних колій.',
          image: 'https://picsum.photos/400/250?random=1'
        },
        {
          title: 'Підшпальні мати Sylomer',
          description: 'Зменшення зносу баласту та рівня шуму.',
          image: 'https://picsum.photos/400/250?random=2'
        }
      ]
    }
  },
  computed: {
    currentBgState() {
      return this.isOfferActive ? this.activeOfferId : 'main'
    },
    currentOfferData() {
      return this.offersData[this.activeOfferId] || {
        category: 'Інформація',
        title: 'Заголовок оферти',
        subtitle: 'Підзаголовок',
        description: 'Опис відсутній',
        items: []
      }
    },
    currentOfferItemsCount() {
      return this.currentOfferData.items ? this.currentOfferData.items.length : 0
    }
  },
  methods: {
    handleButtonClick(id, event) {
      if (this.isAnimating) return
      this.isAnimating = true
      this.activeOfferItemIndex = 0

      if (event && event.clientX) {
        this.ripple.x = event.clientX
        this.ripple.y = event.clientY
      } else {
        this.ripple.x = window.innerWidth / 2
        this.ripple.y = window.innerHeight / 2
      }

      this.ripple.active = true

      setTimeout(() => {
        this.activeOfferId = id
        this.isOfferActive = true
      }, 100)

      setTimeout(() => {
        this.ripple.active = false
      }, 500)

      setTimeout(() => {
        this.isAnimating = false
      }, 950)
    },

    closeOffer() {
      this.isOfferActive = false
      this.activeOfferId = null
      this.activeOfferItemIndex = 0
    },

    handleLanguageToggle() {
      console.log('Перемикання мови')
    },

    handleActiveItemChange(index) {
      this.activeOfferItemIndex = index
    },

    scrollToOfferItem(index) {
      if (index < 0 || index >= this.currentOfferItemsCount) return
      this.activeOfferItemIndex = index
      if (this.$refs.offerDetailsRef) {
        this.$refs.offerDetailsRef.scrollToIndex(index)
      }
    },
    
switchOffer(id) {
    if (this.activeOfferId === id || this.isAnimating) return

    // Перемикаємо ID оферти
    this.activeOfferId = id
    this.activeOfferItemIndex = 0

    // Прокручуємо контейнер до самого верху
    this.$nextTick(() => {
      const container = document.querySelector('.offer-content-container')
      if (container) {
        container.scrollTop = 0
      }
    })
  }
  }
}
</script>

<style scoped>
.main-content-fade-enter-active {
  transition: all 0.7s ease-in-out;
  transition-delay: 0.2s;
}

.main-content-fade-leave-active {
  transition: all 0.4s ease-in-out;
}

.main-content-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.96);
}

.main-content-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.main-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.offer-header-brand {
  position: fixed;
  top: 3vh;
  left: 3vw;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 1.2vw;
}

.header-logo {
  width: 10vw;
  height: auto;
  object-fit: contain;
}

.active-offer-title {
  font-size: 1.3vw;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  padding-left: 1.2vw;
  border-left: 0.15vw solid #007bc2;
  line-height: 1.1;
}

.main-logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25vw;
  margin-bottom: 1vh;
}

.main-logo {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.offer-top-gradient {
  position: fixed;
  top: 0;
  left: 0;
  right: 8vw;
  height: 14vh;
  z-index: 10;
  pointer-events: none;
  background: linear-gradient(
    180deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(255, 255, 255, 0.7) 50%, 
    rgba(255, 255, 255, 0) 100%
  );
}

.offer-content-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 8vw;
  bottom: 0;
  z-index: 5;
  overflow-y: auto;
  padding: 16vh 4vw 6vh 18vw;
  box-sizing: border-box;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.offer-content-container::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.content-container {
  position: relative;
  z-index: 3;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 2% 0;
  box-sizing: border-box;
  overflow: hidden;
}

.top-content-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 18vh;
}

.interactive-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ripple-overlay {
  position: fixed;
  z-index: 999;
  pointer-events: none;
  transform: translate(-50%, -50%);
}

.ripple-circle {
  position: absolute;
  border-radius: 50%;
  background: #ffffff;
  transform: scale(0);
  will-change: transform;
  animation: rippleExpand 1.2s ease-in-out forwards;
}

.circle-1 {
  width: 320vw;
  height: 320vw;
  margin-left: -160vw;
  margin-top: -160vw;
  opacity: 1;
}

@keyframes rippleExpand {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

.ripple-fade-enter-active { transition: opacity 0.4s ease-out; }
.ripple-fade-leave-active { transition: opacity 2s ease-out; }
.ripple-fade-enter-from, .ripple-fade-leave-to { opacity: 0; }

/* Анімація плавної зміни оферти (Blur + Fade + Scale) */
.offer-change-enter-active {
  transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.45s ease;
  transition-delay: 0.1s;
}

.offer-change-leave-active {
  transition: opacity 0.3s cubic-bezier(0.7, 0, 0.84, 0),
              transform 0.3s cubic-bezier(0.7, 0, 0.84, 0),
              filter 0.3s ease;
}

.offer-change-enter-from {
  opacity: 0;
  transform: translateY(18px) scale(0.98);
  filter: blur(8px);
}

.offer-change-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.98);
  filter: blur(8px);
}
</style>