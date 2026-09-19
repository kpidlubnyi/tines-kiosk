<template>
  <button 
    class="viewer-source-toggle"
    :title="isOffline ? 'Przejdź w tryb Online' : 'Przejdź w tryb Offline'"
    @click="$emit('toggle')"
  >
    <svg 
      v-if="!isOffline" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      class="icon"
    >
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
    </svg>

    <svg 
      v-else 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      class="icon offline"
    >
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
      <line x1="2" y1="2" x2="22" y2="22"></line>
    </svg>
  </button>
</template>

<script>
export default {
  name: 'ViewerSourceToggle',
  props: {
    isOffline: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle']
}
</script>

<style scoped>
.viewer-source-toggle {
  background: #ffffff;
  border: 0.1vw solid #e2e8f0;
  border-radius: 50%;
  width: 2.2vw;
  height: 2.2vw;
  min-width: 32px;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #333333;
  box-shadow: 0 0.2vw 0.6vw rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  padding: 0;
  flex-shrink: 0;
}

.viewer-source-toggle:active {
  transform: scale(0.92);
}

.viewer-source-toggle .icon {
  width: 1.2vw;
  height: 1.2vw;
  min-width: 18px;
  min-height: 18px;
  transition: color 0.2s ease;
}

.viewer-source-toggle .icon.offline {
  color: #333333;
}
</style>