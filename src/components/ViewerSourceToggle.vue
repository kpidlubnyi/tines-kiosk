<template>
  <button 
    class="viewer-source-toggle"
    :title="isOffline ? 'Переключити на онлайн 3D (Sketchfab)' : 'Переключити на локальний 3D (Офлайн)'"
    @click="$emit('toggle')"
  >
    <!-- Іконка "Онлайн / Хмара" -->
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

    <!-- Іконка "Офлайн / Диск" -->
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
      <line x1="1" y1="1" x2="23" y2="23"></line>
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
      <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
      <line x1="12" y1="20" x2="12.01" y2="20"></line>
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
  color: #64748b;
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
  color: #e11d48;
}
</style>