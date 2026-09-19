<template>
  <div class="main-screen" @dblclick="handleDoubleClick">
    <AppBackground :currentState="currentBgState" />

    <template v-if="isOfferActive && isItemDetailActive">
      <SketchfabUiBlocker 
        :isCollapsed="isContentCollapsed"
        top="10vh"
        left="2vw"
        width="51vw"
        height="7vh"
        collapsedWidth="90vw"
      />
      <SketchfabUiBlocker 
        :isCollapsed="isContentCollapsed"
        top="82vh"
        left="2vw"
        width="3vw"
        height="7vh"
      />
      <SketchfabUiBlocker 
        :isCollapsed="isContentCollapsed"
        top="82vh"
        left="40vw"
        width="13vw"
        height="7vh"
        collapsedLeft="80vw"
      />
    </template>

    <Transition name="fade">
      <div v-if="isOfferActive && !isAnimating" class="offer-top-gradient"></div>
    </Transition>

    <Transition name="offer-change" mode="out-in">
      <div 
        v-if="isOfferActive && !isAnimating" 
        :key="`header-${activeOfferId}`"
        class="offer-header-brand"
        @click="closeOffer"
      >
        <img src="./assets/logo.png" class="header-logo" alt="TINES" />
        <span class="active-offer-title" v-html="langStore.getText(currentOfferData.title)"></span>
      </div>
    </Transition>

    <!-- Менша версія логотипа у правому верхньому куті (перехід на localhost:4174) -->
    <Transition name="fade">
      <div 
        v-if="isOfferActive && !isAnimating" 
        class="secondary-logo-top-right"
      >
        <a href="http://localhost:4174" class="logo-link" title="Перейти на другий сайт">
          <img 
            src="./assets/tracktec-logo.png" 
            class="square-logo-btn" 
            alt="Secondary Logo" 
          />
        </a>
      </div>
    </Transition>

    <Transition name="fade">
      <a 
        v-if="!isOfferActive" 
        href="http://localhost:4174" 
        class="external-site-btn"
        title="Перейти на другий сайт"
      >
        <AppIcon name="tracktec" class="btn-app-icon" />
      </a>
    </Transition>

    <AppSidebar 
      :isOpen="isOfferActive && !isAnimating" 
      :isItemDetailActive="isItemDetailActive"
      :offers="buttons"
      :activeOfferId="activeOfferId"
      :totalItems="currentOfferItemsCount"
      :activeIndex="activeOfferItemIndex"
      :crossCategories="selectedItem?.crossCategories || currentOfferData?.crossCategories || []"
      @toggle-language="handleLanguageToggle"
      @go-home="closeOffer"
      @navigate="scrollToOfferItem"
      @select-offer="switchOffer"
      @back-to-offer="closeItemDetail"
      @select-cross-category="handleCrossCategorySwitch"
    />

    <div class="content-container">
      <Transition name="main-content-fade" appear>
        <div v-if="!isOfferActive" class="top-content-group" key="main-group">
          <div class="main-logo-container">
            <img src="./assets/logo.png" class="main-logo" alt="Logotyp TINES" />
            <!-- Головне квадратне лого з переходом на localhost:4174 -->
            <a href="http://localhost:4174" class="logo-link" title="Перейти на другий сайт">
              <img src="./assets/tracktec-logo.png" class="main-logo-square" alt="Logotyp TrackTec" />
            </a>
          </div>
          <div class="interactive-group">
            <!-- <InfoTicker :phrases="phrases" :interval="5000" /> -->
            <AppNavigation :buttons="buttons" @select="handleButtonClick" />
          </div>
        </div>
      </Transition>

      <Transition name="offer-change" mode="out-in">
        <main 
          v-if="isOfferActive && !isItemDetailActive && !isAnimating" 
          :key="`content-${activeOfferId}`"
          class="offer-content-container"
          ref="offerContentContainer"
        >
          <OfferDetails 
            ref="offerDetailsRef"
            :offer="currentOfferData" 
            @active-item-change="handleActiveItemChange"
            @select-item="openItemDetail"
          />
        </main>
      </Transition>

      <Transition name="offer-change" mode="out-in">
        <main 
          v-if="isOfferActive && isItemDetailActive && selectedItem && !isAnimating" 
          class="item-detail-full-container"
        >
          <ItemDetailView 
            :key="`${activeOfferId}-${selectedItem.id}`" 
            :item="selectedItem" 
            @sidebar-toggle="handleSidebarToggle"
          />
        </main>
      </Transition>
      
      <Transition name="main-content-fade" appear>
        <SolutionsCarousel 
          v-if="!isOfferActive" 
          :solutions="solutions" 
          :speed="1" 
          key="carousel"
          @select-item="handleCarouselSelect"
        />
      </Transition>

      <Transition name="fade">
        <LanguageSelector 
          v-if="!isOfferActive" 
          class="home-language-selector" 
        />
      </Transition>
    </div>

    <Transition name="ripple-fade">
      <div 
        v-if="ripple.active" 
        class="ripple-overlay" 
        :style="{ left: `${ripple.x}px`, top: `${ripple.y}px` }"
      >
        <div class="ripple-circle circle-1"></div>
      </div>
    </Transition>

    <template v-if="isOfferActive">
      <SecretHomeButton 
        ref="leftSecretBtn"
        position="left" 
        @go-home="closeOffer" 
      />
      <SecretHomeButton 
        ref="rightSecretBtn"
        position="right" 
        @go-home="closeOffer" 
      />
    </template>
  </div>
</template>

<script>
import offersDataJson from '@/assets/data/offers.json';
import mainPageTextJson from '@/assets/data/main-page-text.json';

import AppBackground from './components/AppBackground.vue'
import InfoTicker from './components/InfoTicker.vue'
import AppNavigation from './components/AppNavigation.vue'
import SolutionsCarousel from './components/SolutionsCarousel.vue'
import AppSidebar from './components/AppSidebar.vue'
import OfferDetails from './components/OfferDetails.vue'
import ItemDetailView from './components/ItemDetailView.vue'
import { useLanguageStore } from './stores/language.js';
import LanguageSelector from './components/LanguageSelector.vue';
import SketchfabUiBlocker from './components/SketchfabUiBlocker.vue'
import SecretHomeButton from './components/SecretHomeButton.vue'
import AppIcon from './components/AppIcon.vue'

export default {
  name: 'MainScreen',
  components: {
    AppBackground,
    InfoTicker,
    AppNavigation,
    SolutionsCarousel,
    AppSidebar,
    OfferDetails,
    ItemDetailView,
    LanguageSelector,
    SketchfabUiBlocker,
    SecretHomeButton,
    AppIcon
  },
  data() {
    return {
      langStore: useLanguageStore(),
      isOfferActive: false,
      isAnimating: false,
      isItemDetailActive: false,
      isContentCollapsed: false,
      selectedItem: null,
      activeOfferId: null,
      activeOfferItemIndex: 0,
      savedScrollTop: 0,
      
      ripple: {
        active: false,
        x: 0,
        y: 0
      },
      buttonConfigs: [
        { id: 'kolej', categoryKey: 'kolej', icon: 'kolej' },
        { id: 'przemysl', categoryKey: 'przemysl', icon: 'przemysl' },
        { id: 'metro', categoryKey: 'metro', icon: 'metro' },
        { id: 'tramwaj', categoryKey: 'tramwaj', icon: 'tramwaj' },
      ],
      
      offersData: offersDataJson,
      mainPageText: mainPageTextJson,
      solutions: []
    }
  },
  computed: {
    phrases() {
      if (!this.mainPageText?.phrases) return []
      return this.mainPageText.phrases.map(phrase => this.langStore.getText(phrase.text))
    },
    buttons() {
      return this.buttonConfigs.map(config => {
        const catObj = this.mainPageText?.categories?.[config.categoryKey]
        return {
          id: config.id,
          label: catObj ? this.langStore.getText(catObj) : config.id.toUpperCase(),
          icon: config.icon
        }
      })
    },
    currentBgState() {
      return this.isOfferActive ? this.activeOfferId : 'main'
    },
    currentOfferData() {
      return this.offersData[this.activeOfferId] || {
        category: 'Інформація',
        title: 'Заголовок оферти',
        description: 'Опис відсутній',
        items: []
      }
    },
    currentOfferItemsCount() {
      return this.currentOfferData.items ? this.currentOfferData.items.length : 0
    }
  },
  methods: {
    handleSidebarToggle(isCollapsed) {
      this.isContentCollapsed = isCollapsed
    },

    triggerRipple(event) {
      if (event && event.clientX !== undefined) {
        this.ripple.x = event.clientX
        this.ripple.y = event.clientY
      } else {
        this.ripple.x = window.innerWidth / 2
        this.ripple.y = window.innerHeight / 2
      }
      this.ripple.active = true
      setTimeout(() => {
        this.ripple.active = false
      }, 500)
    },

    handleButtonClick(id, event) {
      if (this.isAnimating) return
      this.isAnimating = true
      this.activeOfferItemIndex = 0

      this.triggerRipple(event)

      setTimeout(() => {
        this.activeOfferId = id
        this.isOfferActive = true
      }, 100)

      setTimeout(() => {
        this.isAnimating = false
      }, 950)
    },

    handleCarouselSelect({ item, event }) {
      if (this.isAnimating) return

      const targetCategory = item && item.categories && item.categories.length > 0 
        ? item.categories[0] 
        : 'kolej'

      this.isAnimating = true
      this.activeOfferItemIndex = 0

      this.triggerRipple(event)

      setTimeout(() => {
        this.activeOfferId = targetCategory
        this.isOfferActive = true

        const categoryData = this.offersData[targetCategory]
        let foundItem = null

        if (categoryData && categoryData.items) {
          foundItem = categoryData.items.find(i => i.id === item.id || i.id.endsWith(item.id))
        }

        this.selectedItem = foundItem || item
        this.isItemDetailActive = true
      }, 100)

      setTimeout(() => {
        this.isAnimating = false
      }, 950)
    },

    openItemDetail({ item, event }) {
      if (this.isAnimating) return
      this.isAnimating = true

      const container = this.$refs.offerContentContainer
      if (container) {
        this.savedScrollTop = container.scrollTop
      }

      this.triggerRipple(event)

      setTimeout(() => {
        this.selectedItem = item
        this.isItemDetailActive = true
        this.isContentCollapsed = false
      }, 100)

      setTimeout(() => {
        this.isAnimating = false
      }, 950)
    },

    closeItemDetail() {
      if (this.isAnimating) return
      this.isAnimating = true

      this.triggerRipple()

      setTimeout(() => {
        this.isItemDetailActive = false
        this.selectedItem = null
        this.isContentCollapsed = false
      }, 100)

      setTimeout(() => {
        this.isAnimating = false
        this.$nextTick(() => {
          const container = this.$refs.offerContentContainer
          if (container) {
            container.scrollTop = this.savedScrollTop
          }
        })
      }, 950)
    },

    closeOffer() {
      if (this.$refs.leftSecretBtn) this.$refs.leftSecretBtn.hide()
      if (this.$refs.rightSecretBtn) this.$refs.rightSecretBtn.hide()

      this.isOfferActive = false
      this.isItemDetailActive = false
      this.isContentCollapsed = false
      this.selectedItem = null
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
      this.isAnimating = true

      this.triggerRipple()

      setTimeout(() => {
        this.isItemDetailActive = false
        this.isContentCollapsed = false
        this.selectedItem = null
        this.activeOfferId = id
        this.activeOfferItemIndex = 0
      }, 100)

      setTimeout(() => {
        this.isAnimating = false
        this.$nextTick(() => {
          const container = this.$refs.offerContentContainer
          if (container) {
            container.scrollTop = 0
          }
        })
      }, 950)
    },

    handleCrossCategorySwitch(targetCategoryKey) {
      if (this.activeOfferId === targetCategoryKey || this.isAnimating) return;
      
      this.isAnimating = true;

      this.triggerRipple();

      setTimeout(() => {
        this.activeOfferId = targetCategoryKey;
        this.activeOfferItemIndex = 0;

        if (this.isItemDetailActive && this.selectedItem) {
          const newCategoryData = this.offersData[targetCategoryKey];
          
          if (newCategoryData && newCategoryData.items && newCategoryData.items.length > 0) {
            const matchedItem = newCategoryData.items.find(
              item => item.id === this.selectedItem.id || this.langStore.getText(item.title) === this.langStore.getText(this.selectedItem.title)
            );

            this.selectedItem = matchedItem || newCategoryData.items[0];
          } else {
            this.isItemDetailActive = false;
            this.isContentCollapsed = false;
            this.selectedItem = null;
          }
        }
      }, 150);

      setTimeout(() => {
        this.isAnimating = false;
        
        this.$nextTick(() => {
          const container = this.$refs.offerContentContainer;
          if (container) {
            container.scrollTop = 0;
          }
        });
      }, 600);
    },

    handleDoubleClick(event) {
      if (!this.isOfferActive) return

      const target = event.target
      if (target.closest('button, a, .sidebar, iframe')) return

      if (this.$refs.secretButtonsRef) {
        this.$refs.secretButtonsRef.trigger()
      }
    },
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

/* Огортка посилання для логотипів */
.logo-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
}

.external-site-btn {
  position: fixed;
  left: 2vw;
  top: 50%;
  transform: translateY(-50%);
  z-index: 50;

  width: 4.5vw;
  height: 4.5vw;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0.4vw 1.5vw rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.5);

  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.external-site-btn:hover {
  background: #ffffff;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 0.6vw 2vw rgba(0, 0, 0, 0.3);
}

.external-site-btn:active {
  transform: translateY(-50%) scale(0.95);
}

/* Гарантоване відображення та розміри для AppIcon */
.btn-app-icon {
  width: 3.5vw !important;
  height: 3.5vw !important;
  min-width: 2.2vw;
  min-height: 2.2vw;
  display: block !important;
  color: #666666;
  fill: currentColor;
  stroke: currentColor;
  pointer-events: none;
}

.offer-header-brand {
  position: fixed;
  top: 3vh;
  left: 3vw;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 1.2vw;
  cursor: pointer;
}

.header-logo {
  width: 10vw;
  height: auto;
  object-fit: contain;
}

.header-logo:active {
  transform: scale(0.98);
  transition: 0.2s ease-in-out;
}

.active-offer-title {
  font-size: 1.3vw;
  font-weight: 700;
  color: #333333;
  white-space: nowrap;
  padding-left: 1.2vw;
  border-left: 0.15vw solid #00000066;
  line-height: 1.1;
}

.active-offer-title :deep(sup) {
  font-size: 0.6em;
  vertical-align: super;
}

.offer-top-gradient {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
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
}

.item-detail-full-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 4vw;
  bottom: 0;
  z-index: 6;
  width: calc(100vw - 4vw);
  height: 100vh;
  box-sizing: border-box;
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

.main-logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3vh;
  width: 100vw;
  margin-bottom: 1vh;
}

.main-logo {
  width: 18vw;
  height: auto;
  object-fit: contain;
}

.main-logo-square {
  width: 16vw;
  height: 16vw;
  object-fit: contain;
  transition: transform 0.2s ease;
}

.main-logo-square:hover {
  transform: scale(1.03);
}

.main-logo-square:active {
  transform: scale(0.97);
}

.secondary-logo-top-right {
  position: fixed;
  top: 1vh;
  right: 5vw;
  z-index: 20;
  display: flex;
  align-items: center;
}

.square-logo-btn {
  width: 4.5vw;
  height: 4.5vw;
  object-fit: contain;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.square-logo-btn:hover {
  transform: scale(1.08);
}

.square-logo-btn:active {
  transform: scale(0.95);
}

.top-content-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 10vh;
}

.interactive-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.home-language-selector {
  position: absolute;
  bottom: 2vh;
  right: 2vw;
  z-index: 50;
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
</style>