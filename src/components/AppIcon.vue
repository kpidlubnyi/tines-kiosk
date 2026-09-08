<template>
  <div class="app-icon" v-html="svgContent"></div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

const svgContent = ref('')

// Динамічний імпорт локальних SVG файлів із src/assets/icons/
watchEffect(async () => {
  try {
    const icon = await import(`../assets/icons/${props.name}.svg?raw`)
    svgContent.value = icon.default
  } catch (e) {
    console.error(`Іконку "${props.name}.svg" не знайдено в src/assets/icons/`)
    svgContent.value = ''
  }
})
</script>

<style scoped>
.app-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #000000; /* Головний колір для всіх іконок */
}

.app-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.app-icon :deep(svg path:not([stroke])) {
  fill: currentColor !important; /* Робимо заливку чорною */
  stroke: none !important;       /* Прибираємо будь-які контури */
}

.app-icon :deep(svg path[stroke]) {
  fill: none !important;           /* Робимо середину прозорою */
  stroke: currentColor !important; /* Робимо лінії чорними */
}
</style>