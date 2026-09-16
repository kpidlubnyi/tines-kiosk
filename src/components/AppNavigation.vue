<template>
  <nav class="bottom-navigation">
    <div 
      v-for="button in buttons" 
      :key="button.id" 
      class="button-wrapper"
    >
      <span class="button-label">{{ button.label }}</span>

      <button class="kiosk-btn" @click="$emit('select', button.id, $event)">
        <AppIcon :name="button.icon" />
      </button>
    </div>
  </nav>
</template>

<script>
import AppIcon from './AppIcon.vue'

export default {
  name: 'AppNavigation',
  components: {
    AppIcon
  },
  props: {
    buttons: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  emits: ['select']
}
</script>

<style scoped>
.bottom-navigation {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  width: 33%;
  margin-top: 3%;
  margin-bottom: 2%;
}

.button-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 14%;
  flex-shrink: 0;
}

.button-label {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 140%;
  font-family: inherit;
  font-size: 0.7vw;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 8%;
  text-align: center;
  white-space: normal;
  word-wrap: break-word;
}

.kiosk-btn {
  font-family: inherit;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
  border-radius: 20%;
  background-color: #ffffff;
  border: 0.15vw solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 1vw 2vw rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.kiosk-btn :deep(.app-icon) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  height: 60%;
}

.kiosk-btn:active {
  transform: scale(0.95);
  box-shadow: 0 0.5vw 1vw rgba(0, 0, 0, 0.1);
}
</style>