<template>
  <div class="sketchfab-viewer-wrapper">
    <iframe
      v-if="embedUrl"
      :title="title"
      class="sketchfab-iframe"
      :src="embedUrl"
      frameborder="0"
      allowfullscreen
      mozallowfullscreen="true"
      webkitallowfullscreen="true"
      allow="autoplay; fullscreen; xr-spatial-tracking"
      xr-spatial-tracking
      execution-while-out-of-viewport
      execution-while-not-rendered
      web-share
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'SketchfabViewer',
  props: {
    modelId: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '3D Model Viewer'
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    uiControls: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    extractedId() {
      if (this.modelId) return this.modelId

      if (this.url) {
        const match = this.url.match(/(?:models\/|3d-models\/[a-z0-9-]+-)([a-f0-9]{32})/i)
        if (match && match[1]) {
          return match[1]
        }
      }
      return ''
    },
    embedUrl() {
      if (!this.extractedId) return ''
      
      const params = new URLSearchParams({
        autostart: this.autoplay ? '1' : '0',
        ui_controls: this.uiControls ? '1' : '0',
        ui_infos: '0',
        ui_inspector: '0',
        ui_watermark_link: '0',
        ui_watermark: '0',
        transparent: '1'
      })

      return `https://sketchfab.com/models/${this.extractedId}/embed?${params.toString()}`
    }
  }
}
</script>

<style scoped>
.sketchfab-viewer-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: inherit;
  background-color: transparent;
}

.sketchfab-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
</style>