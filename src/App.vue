<template>
  <div class="main-screen">
    <!-- Новий винесений компонент фону -->
    <AppBackground :currentState="currentBgState" />

    <!-- Кнопка повернення на головну -->
    <Transition name="fade">
      <button 
        v-if="isOfferActive && !isAnimating" 
        class="back-btn" 
        @click="closeOffer"
      >
        <span class="arrow">←</span>
        <span>На головну</span>
      </button>
    </Transition>

    <div class="content-container">
      <div class="top-content-group" :class="{ 'offer-layout': isOfferActive }">
        <div class="logo-container" :class="{ 'logo-top-left': isOfferActive }">
          <img src="./assets/logo.png" class="logo" alt="Логотип компанії" />
        </div>
        
        <Transition name="fade">
          <div v-if="!isOfferActive" class="interactive-group">
            <InfoTicker :phrases="phrases" :interval="5000" />
            <AppNavigation :buttons="buttons" @select="handleButtonClick" />
          </div>
        </Transition>
      </div>

      <Transition name="fade">
        <SolutionsCarousel v-if="!isOfferActive" :solutions="solutions" :speed="1" />
      </Transition>
    </div>

<div 
  v-if="ripple.active" 
  class="ripple-overlay" 
  :style="{ left: `${ripple.x}px`, top: `${ripple.y}px` }"
>
  <div class="ripple-circle circle-1"></div>
</div>
  </div>
</template>

<script>
import AppBackground from './components/AppBackground.vue'
import InfoTicker from './components/InfoTicker.vue'
import AppNavigation from './components/AppNavigation.vue'
import SolutionsCarousel from './components/SolutionsCarousel.vue'

export default {
  name: 'MainScreen',
  components: {
    AppBackground,
    InfoTicker,
    AppNavigation,
    SolutionsCarousel
  },
  data() {
    return {
      isOfferActive: false,
      isAnimating: false,
      activeOfferId: null,
      
      ripple: {
        active: false,
        x: 0,
        y: 0
      },
      buttons: [
        { id: 'kolej', label: 'Kolej', icon: 'kolej' },
        { id: 'metro', label: 'Metro', icon: 'metro' },
        { id: 'tramwaj', label: 'Tramwaj', icon: 'tramwaj' },
        { id: 'przemysl', label: 'Przemysł', icon: 'przemysl' },
        { id: 'budynki', label: 'Budynki', icon: 'wibro' }
      ],
      phrases: [
        'Сучасні рішення для інфраструктури',
        'Надійне віброізоляційне обладнання',
        'Інноваційні технології будівництва',
        'Безпека та якість на кожному етапі'
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
        },
        {
          title: 'Віброізоляція будівель',
          description: 'Захист споруд від динамічних навантажень.',
          image: 'https://picsum.photos/400/250?random=3'
        },
        {
          title: 'Промислові опори Sylodyn',
          description: 'Ізоляція важкого обладнання та верстатів.',
          image: 'https://picsum.photos/400/250?random=4'
        },
        {
          title: 'Метрополітен системи',
          description: 'Зниження рівня шуму в тунелях та на станціях.',
          image: 'https://picsum.photos/400/250?random=5'
        }
      ]    }
  },
  computed: {
    // Передаємо потрібний ключ фону
    currentBgState() {
      return this.isOfferActive ? this.activeOfferId : 'main'
    }
  },

methods: {
  handleButtonClick(id, event) {
    if (this.isAnimating) return
    this.isAnimating = true

    if (event && event.clientX) {
      this.ripple.x = event.clientX
      this.ripple.y = event.clientY
    } else {
      this.ripple.x = window.innerWidth / 2
      this.ripple.y = window.innerHeight / 2
    }

    this.ripple.active = true

    // Перемикаємо стан оферти рівно посередині розгортання кола (500ms)
    setTimeout(() => {
      this.activeOfferId = id
      this.isOfferActive = true
    }, 400)

    // Повне завершення повільної анімації (1100ms)
    setTimeout(() => {
      this.ripple.active = false
      this.isAnimating = false
    }, 800)
  },

  closeOffer() {
    this.isOfferActive = false
    this.activeOfferId = null
  }
}
  }
</script>

<style scoped>
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

.bg-video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 100vh;
  transform: translate(-50%, -50%);
  object-fit: cover;
  z-index: 1;
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 2;
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
  margin-top: 20vh;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.top-content-group.offer-layout {
  margin-top: 0;
}

.interactive-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Логотип */
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  margin-bottom: 1vh;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Переміщення логотипа в лівий верхній кут */
.logo-container.logo-top-left {
  position: absolute;
  top: 3vh;
  left: 3vw;
  width: 12vw;
  margin: 0;
}

.logo {
  width: 100%;
  height: auto;
  object-fit: contain;
}

/* Кнопка "На головну" */
.back-btn {
  position: absolute;
  top: 3.5vh;
  right: 4vw;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.6vw;
  padding: 0.8vw 1.5vw;
  background-color: #ffffff;
  border: 0.12vw solid rgba(226, 232, 240, 0.9);
  border-radius: 2vw;
  box-shadow: 0 0.5vw 1.5vw rgba(0, 0, 0, 0.08);
  font-family: inherit;
  font-size: 1vw;
  font-weight: 600;
  color: #1a202c;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.back-btn:hover {
  background-color: #f8fafc;
  transform: translateY(-0.1vw);
  box-shadow: 0 0.8vw 2vw rgba(0, 0, 0, 0.12);
}

.back-btn:active {
  transform: scale(0.96);
}

.back-btn .arrow {
  font-size: 1.2vw;
}

/* --- RIPPLE ANIMATION OVERLAY --- */
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
  animation: rippleExpand 0.8s ease-in forwards;
}

.circle-1 {
  width: 300vw;
  height: 300vw;
  margin-left: -150vw;
  margin-top: -150vw;
  opacity: 1;
  animation-delay: 0s;
}

@keyframes rippleExpand {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

/* FADE TRANSITIONS */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>