<template>
  <div class="main-screen">
    <!-- Фонове відео -->
    <video class="bg-video" autoplay loop muted playsinline>
      <source src="./assets/bg-video.mp4" type="video/mp4" />
    </video>

    <div class="bg-overlay"></div>

    <div class="content-container">
      <div class="top-content-group">
        <div class="logo-container">
          <img src="./assets/logo.png" class="logo" alt="Логотип компанії" />
        </div>
        
        <InfoTicker :phrases="phrases" :interval="5000" />

        <!-- Навігація одразу під InfoTicker -->
        <AppNavigation :buttons="buttons" @select="handleButtonClick" />
      </div>

      <!-- Нижня карусель систем та продуктів -->
      <SolutionsCarousel :solutions="solutions" :speed="1" />
    </div>
  </div>
</template>

<script>
import InfoTicker from './components/InfoTicker.vue'
import AppNavigation from './components/AppNavigation.vue'
import SolutionsCarousel from './components/SolutionsCarousel.vue'

export default {
  name: 'MainScreen',
  components: {
    InfoTicker,
    AppNavigation,
    SolutionsCarousel
  },
  data() {
    return {
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
      // Масив систем та продуктів для каруселі
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
      ]
    }
  },
  methods: {
    handleButtonClick(id) {
      console.log('Натиснуто кнопку:', id)
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
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  margin-bottom: 1vh;
}

.logo {
  width: 100%;
  height: auto;
  object-fit: contain;
}
</style>