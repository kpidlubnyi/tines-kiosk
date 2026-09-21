<template>
  <div class="local-3d-viewer">
    <!-- Зображення, якщо активовано фоллбек з 3D на photo -->
    <div v-if="fallbackToPhoto" class="photo-container">
      <img 
        :src="photoPath" 
        :alt="modelId" 
        class="fallback-photo" 
        @error="handlePhotoError" 
      />
      <div v-if="error" class="error-overlay">
        <span>{{ error }}</span>
      </div>
    </div>

    <!-- Режим 3D за замовчуванням -->
    <template v-else>
      <canvas ref="canvas"></canvas>

      <Transition name="fade">
        <div v-if="isLoading" class="loader-overlay">
          <div class="spinner"></div>
        </div>
      </Transition>

      <div v-if="error" class="error-overlay">
        <span>{{ error }}</span>
      </div>
    </template>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

export default {
  name: 'Local3DViewer',

  props: {
    modelId: {
      type: String,
      required: true
    },
    autoplay: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isLoading: false,
      error: null,
      fallbackToPhoto: false
    }
  },

  computed: {
    glbPath() {
      return `/tines-kiosk/models/${this.modelId}.glb`
    },
    photoPath() {
      return `/tines-kiosk/models/${this.modelId}.png`
    }
  },

  watch: {
    modelId(newId, oldId) {
      if (newId !== oldId) {
        this.fallbackToPhoto = false
        this.error = null
        this.$nextTick(() => {
          this.initOrReloadViewer()
        })
      }
    }
  },

  created() {
    this.scene = null
    this.camera = null
    this.renderer = null
    this.controls = null
    this.model = null
    this.animationFrame = null
    this.resizeObserver = null
    this.loader = null
  },

  mounted() {
    this.initViewer()
  },

  beforeUnmount() {
    this.destroyViewer()
  },

  methods: {
    initOrReloadViewer() {
      if (!this.renderer) {
        this.initViewer()
      } else {
        this.loadModel()
      }
    },

    initViewer() {
      const canvas = this.$refs.canvas
      if (!canvas) return

      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0xffffff)

      this.camera = new THREE.PerspectiveCamera(
        35,
        canvas.clientWidth / canvas.clientHeight,
        0.01,
        1000
      )

      this.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false
      })

      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
      this.renderer.outputColorSpace = THREE.SRGBColorSpace
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping
      this.renderer.toneMappingExposure = 0.3

      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type = THREE.VSMShadowMap

      const pmremGenerator = new THREE.PMREMGenerator(this.renderer)
      this.scene.environment = pmremGenerator.fromScene(
        new RoomEnvironment(),
        0.04
      ).texture
      pmremGenerator.dispose()

      this.controls = new OrbitControls(this.camera, canvas)
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.08
      this.controls.enablePan = true
      this.controls.minDistance = 0.1
      this.controls.maxDistance = 100
      this.controls.autoRotate = false

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.15)
      this.scene.add(ambientLight)

      const mainLight = new THREE.DirectionalLight(0xffffff, 0.45)
      mainLight.position.set(5, 8, 5)
      mainLight.castShadow = true
      mainLight.shadow.mapSize.set(2048, 2048)
      mainLight.shadow.radius = 4
      mainLight.shadow.bias = -0.0005
      this.scene.add(mainLight)

      const fillLight = new THREE.DirectionalLight(0xffffff, 0.1)
      fillLight.position.set(-5, 3, -4)
      this.scene.add(fillLight)

      this.loader = new GLTFLoader()

      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize()
      })
      if (canvas.parentElement) {
        this.resizeObserver.observe(canvas.parentElement)
      }

      this.animate()
      this.loadModel()
    },

    loadModel() {
      if (!this.loader) return

      this.isLoading = true
      this.error = null

      if (this.model) {
        this.disposeModel(this.model)
        this.scene.remove(this.model)
        this.model = null
      }

      this.loader.load(
        this.glbPath,
        (gltf) => {
          this.model = gltf.scene
          this.model.rotation.x = -Math.PI / 2
          this.model.updateMatrixWorld(true)

          this.prepareModel(this.model)
          this.scene.add(this.model)
          this.fitCamera(this.model)

          this.isLoading = false
          this.$emit('viewer-ready')
        },
        undefined,
        (error) => {
          console.warn(`[Local3DViewer] GLB file not found for "${this.modelId}", switching to PNG fallback.`, error)
          this.isLoading = false
          this.fallbackToPhoto = true
          this.$emit('viewer-error', error)
        }
      )
    },

    handlePhotoError() {
      this.error = 'Файл моделі (.glb або .png) не знайдено'
    },

    prepareModel(model) {
      model.traverse((object) => {
        if (!object.isMesh) return

        object.castShadow = true
        object.receiveShadow = true

        if (object.geometry) {
          object.geometry.computeVertexNormals()
        }

        const hasVertexColors = Boolean(
          object.geometry && object.geometry.attributes.color
        )

        if (object.material) {
          const isArray = Array.isArray(object.material)
          const materials = isArray ? object.material : [object.material]

          const updatedMaterials = materials.map((material) => {
            if (material.isGLTFSpecularGlossinessMaterial) {
              const pbrMaterial = new THREE.MeshStandardMaterial({
                color: material.color,
                map: material.map,
                normalMap: material.normalMap,
                emissiveMap: material.emissiveMap,
                emissive: material.emissive,
                roughness: 0.5,
                metalness: 0.1
              })
              material.dispose()
              material = pbrMaterial
            }

            if (hasVertexColors) {
              material.vertexColors = true
            }

            if (material.map) {
              material.map.colorSpace = THREE.SRGBColorSpace
              material.map.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
            }

            if (material.emissiveMap) {
              material.emissiveMap.colorSpace = THREE.SRGBColorSpace
            }

            material.needsUpdate = true
            return material
          })

          object.material = isArray ? updatedMaterials : updatedMaterials[0]
        }
      })
    },

    fitCamera(model) {
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())

      const maxSize = Math.max(size.x, size.y, size.z)
      if (!maxSize) return

      model.position.x -= center.x
      model.position.y -= center.y
      model.position.z -= center.z

      this.controls.target.set(0, 0, 0)

      const fov = THREE.MathUtils.degToRad(this.camera.fov)
      const distance = maxSize / (2 * Math.tan(fov / 2))
      const cameraDistance = distance * 0.9

      const isoFactor = cameraDistance / Math.sqrt(3)
      this.camera.position.set(isoFactor * 1.5, isoFactor * 0.4, isoFactor)

      this.camera.near = Math.max(maxSize / 1000, 0.01)
      this.camera.far = Math.max(maxSize * 100, 100)

      this.camera.updateProjectionMatrix()

      this.controls.minDistance = maxSize * 0.2
      this.controls.maxDistance = maxSize * 10

      this.controls.update()
    },

    handleResize() {
      if (!this.renderer || !this.camera) return
      const canvas = this.$refs.canvas
      if (!canvas) return

      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (!width || !height) return

      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(width, height, false)
    },

    animate() {
      if (!this.renderer || !this.scene || !this.camera) return
      this.animationFrame = requestAnimationFrame(this.animate)

      if (this.controls) {
        this.controls.update()
      }

      this.renderer.render(this.scene, this.camera)
    },

    disposeModel(model) {
      model.traverse((object) => {
        if (!object.isMesh) return
        if (object.geometry) object.geometry.dispose()
        if (!object.material) return

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material]

        materials.forEach((material) => {
          Object.keys(material).forEach((key) => {
            const value = material[key]
            if (value && typeof value === 'object' && typeof value.dispose === 'function') {
              value.dispose()
            }
          })
          material.dispose()
        })
      })
    },

    destroyViewer() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame)
        this.animationFrame = null
      }
      if (this.resizeObserver) {
        this.resizeObserver.disconnect()
        this.resizeObserver = null
      }
      if (this.controls) {
        this.controls.dispose()
        this.controls = null
      }
      if (this.model) {
        this.disposeModel(this.model)
        this.scene.remove(this.model)
        this.model = null
      }
      if (this.renderer) {
        this.renderer.dispose()
        this.renderer = null
      }
      this.scene = null
      this.camera = null
      this.loader = null
    }
  }
}
</script>

<style scoped>
.local-3d-viewer {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #ffffff;
  border-radius: inherit;
  overflow: hidden;
}

.local-3d-viewer canvas {
  width: 100%;
  height: 100%;
  display: block;
  touch-action: none;
}

.photo-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
}

.fallback-photo {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.loader-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #333333;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.error-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #333333;
  text-align: center;
  background: rgba(255, 255, 255, 0.8);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>