<template>
  <div class="sketchfab-api-viewer">
    <!-- Блюр та спінер завантаження -->
    <Transition name="fade">
      <div v-if="isLoading" class="loader-overlay">
        <div class="spinner"></div>
      </div>
    </Transition>

    <iframe
      :id="iframeId"
      ref="sketchfabIframe"
      class="sketchfab-iframe"
      title="Sketchfab Viewer"
      frameborder="0"
      allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope"
      mozallowfullscreen="true"
      webkitallowfullscreen="true"
    ></iframe>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import { useLanguageStore } from '@/stores/language.js'
import annotationsData from '@/assets/data/3d-annotations.json'

export default {
  name: 'SketchfabAPIViewer',
  props: {
    modelId: {
      type: String,
      required: true
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    uiControls: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      iframeId: `sketchfab-iframe-${Math.random().toString(36).substring(2, 9)}`,
      apiClient: null,
      apiApi: null,
      isViewerReady: false,
      isLoading: true,
      readyPollInterval: null,
      langStore: useLanguageStore(),
      annotationsMap: annotationsData['3d-models'] || {}
    }
  },
  computed: {
    currentLang() {
      const rawLang = this.langStore.currentLang || this.langStore.lang || 'pl'
      return rawLang.toLowerCase() === 'uk' ? 'ua' : rawLang.toLowerCase()
    },
    currentModelAnnotations() {
      return this.annotationsMap[this.modelId] || []
    }
  },
  watch: {
    modelId(newId, oldId) {
      if (newId !== oldId) {
        this.reinitForNewModel()
      }
    },
    currentLang() {
      if (this.isViewerReady) {
        this.updateAllAnnotations()
      } else {
        this.checkAndApplyWhenReady()
      }
    }
  },
  async mounted() {
    try {
      await this.ensureScriptLoaded()
      await this.$nextTick()
      this.initViewer()
    } catch (err) {
      console.error('[SketchfabViewer] Error loading JS API:', err)
      this.isLoading = false
    }
  },
  beforeUnmount() {
    this.clearIntervals()
    if (this.apiApi && typeof this.apiApi.stop === 'function') {
      this.apiApi.stop()
    }
  },
  methods: {
    clearIntervals() {
      if (this.readyPollInterval) {
        clearInterval(this.readyPollInterval)
        this.readyPollInterval = null
      }
    },

    reinitForNewModel() {
      this.isLoading = true
      this.isViewerReady = false
      this.clearIntervals()

      if (this.apiApi && typeof this.apiApi.stop === 'function') {
        this.apiApi.stop()
      }
      this.apiApi = null
      this.apiClient = null

      this.$nextTick(() => {
        this.initViewer()
      })
    },

    ensureScriptLoaded() {
      return new Promise((resolve, reject) => {
        if (window.Sketchfab) {
          resolve()
          return
        }

        const scriptId = 'sketchfab-viewer-api-script'
        const existingScript = document.getElementById(scriptId)
        
        if (existingScript) {
          existingScript.addEventListener('load', resolve)
          existingScript.addEventListener('error', reject)
          return
        }

        const script = document.createElement('script')
        script.id = scriptId
        script.src = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js'
        script.async = true
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
    },

    initViewer() {
      const iframe = this.$refs.sketchfabIframe
      if (!this.modelId || !window.Sketchfab || !iframe) return

      this.apiClient = markRaw(new window.Sketchfab(iframe))

      this.apiClient.init(this.modelId, {
        autoplay: this.autoplay ? 1 : 0,
        ui_controls: this.uiControls ? 1 : 0,
        ui_infos: 0,
        ui_stop: 0,
        ui_watermark: 0,
        ui_color: '000000',
        autostart: 1,
        success: (api) => {
          this.apiApi = markRaw(api)
          this.apiApi.start()

          this.apiApi.addEventListener('viewerready', () => {
            this.markAsReadyAndApply()
          })

          this.startReadyPolling()
        },
        error: (err) => {
          console.error('[SketchfabViewer] Initialization error:', err)
          this.isLoading = false
          this.$emit('viewer-error', err)
        }
      })
    },

    startReadyPolling() {
      this.clearIntervals()
      
      let attempts = 0
      this.readyPollInterval = setInterval(() => {
        attempts++
        if (this.isViewerReady) {
          this.clearIntervals()
          return
        }

        if (this.apiApi && typeof this.apiApi.getAnnotationList === 'function') {
          this.apiApi.getAnnotationList((err, list) => {
            if (!err && list) {
              this.markAsReadyAndApply()
            }
          })
        }

        if (attempts > 30) {
          this.clearIntervals()
          this.isLoading = false
        }
      }, 300)
    },

    markAsReadyAndApply() {
      if (this.isViewerReady) return
      this.isViewerReady = true
      this.clearIntervals()
      this.updateAllAnnotations()
      
      // Вимикаємо спінер і блюр
      this.isLoading = false
      this.$emit('viewer-ready', this.apiApi)
    },

    checkAndApplyWhenReady() {
      if (!this.apiApi) return
      
      this.apiApi.getAnnotationList((err, list) => {
        if (!err && list) {
          this.isViewerReady = true
          this.applyAnnotationsData(list)
        }
      })
    },

    updateAllAnnotations() {
      if (!this.apiApi) return

      this.apiApi.getAnnotationList((err, sketchfabAnnotations) => {
        if (err || !sketchfabAnnotations) return
        this.applyAnnotationsData(sketchfabAnnotations)
      })
    },

    applyAnnotationsData(sketchfabAnnotations) {
      if (!this.currentModelAnnotations.length) return

      const lang = this.currentLang

      this.currentModelAnnotations.forEach((item, idx) => {
        const annotationIndex = item.index !== undefined ? item.index : idx

        if (sketchfabAnnotations[annotationIndex]) {
          const currentObj = sketchfabAnnotations[annotationIndex]

          const targetTitle = String(item[lang] || item.pl || item.en || currentObj.name || '')
          const contentKey = `${lang}_content`
          const rawContent = item[contentKey] || item.content

          let fallbackContent = ''
          if (typeof currentObj.content === 'string') {
            fallbackContent = currentObj.content
          } else if (currentObj.content && typeof currentObj.content.raw === 'string') {
            fallbackContent = currentObj.content.raw
          }

          const finalContent = String(rawContent || fallbackContent || '')

          const updatedData = {
            ...currentObj,
            name: targetTitle,
            title: targetTitle,
            content: {
              raw: finalContent
            }
          }

          this.apiApi.updateAnnotation(annotationIndex, updatedData, (updateErr) => {
            if (updateErr) {
              const fallbackData = {
                ...currentObj,
                name: targetTitle,
                title: targetTitle,
                content: finalContent
              }
              this.apiApi.updateAnnotation(annotationIndex, fallbackData)
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.sketchfab-api-viewer {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #0f172a;
  border-radius: inherit;
  overflow: hidden;
}

.sketchfab-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

/* Оверлей з блюром */
.loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

/* Спінер */
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: #38bdf8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Анімація появи/зникання оверлею */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>