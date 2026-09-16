<template>
  <div class="app-background">
    <Transition name="bg-fade">
      <div :key="currentBg.src" class="bg-media-wrapper">
        <video 
          v-if="currentBg.type === 'video'" 
          class="bg-media" 
          autoplay 
          loop 
          muted 
          playsinline
        >
          <source :src="currentBg.src" type="video/mp4" />
        </video>

        <img 
          v-else-if="currentBg.type === 'image'" 
          :src="currentBg.src" 
          class="bg-media" 
          alt="Background" 
        />
      </div>
    </Transition>

    <div 
      class="bg-overlay" 
      :style="{ backgroundColor: overlayColor }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'AppBackground',
  props: {
    currentState: {
      type: String,
      default: 'main'
    }
  },
  data() {
    return {
      backgrounds: {
        main: {
          type: 'video',
          src: new URL('../assets/backgrounds/bg-main.mp4', import.meta.url).href
        },
        kolej: {
          type: 'image',
          src: new URL('../assets/backgrounds/bg-kolej.avif', import.meta.url).href
        },
        metro: {
          type: 'image',
          src: new URL('../assets/backgrounds/bg-metro.avif', import.meta.url).href
        },
        tramwaj: {
          type: 'image',
          src: new URL('../assets/backgrounds/bg-tramwaj.avif', import.meta.url).href
        },
        przemysl: {
          type: 'image',
          src: new URL('../assets/backgrounds/bg-przemysl.jpg', import.meta.url).href
        },
        budynki: {
          type: 'image',
          src: new URL('../assets/backgrounds/bg-wibro.avif', import.meta.url).href
        }
      }
    }
  },
  computed: {
    currentBg() {
      return this.backgrounds[this.currentState] || this.backgrounds.main
    },
    overlayColor() {
      return this.currentState === 'main' 
        ? 'rgba(255, 255, 255, 0.8)' 
        : 'rgba(255, 255, 255, 0.8)'
    }
  }
}
</script>

<style scoped>
.app-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  overflow: hidden;
}

.bg-media-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.bg-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  transition: background-color 0.6s ease;
}

.bg-fade-enter-active,
.bg-fade-leave-active {
  transition: opacity 0.6s ease-in;
}

.bg-fade-enter-from,
.bg-fade-leave-to {
  opacity: 0;
}
</style>