<template>
  <div class="sketchfab-blockers-wrapper">
    <div 
      class="sketchfab-ui-blocker"
      :style="boxStyle"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'SketchfabUiBlocker',
  props: {
    // Стан розгортки/згортки колонки
    isCollapsed: {
      type: Boolean,
      default: false
    },
    
    // Стандартні позиції та розміри (коли колонка розгорнута)
    top: {
      type: String,
      default: null
    },
    bottom: {
      type: String,
      default: null
    },
    left: {
      type: String,
      default: null
    },
    right: {
      type: String,
      default: null
    },
    width: {
      type: String,
      default: 'auto'
    },
    height: {
      type: String,
      default: 'auto'
    },

    // Позиції та розміри для стану, коли колонка згорнута
    collapsedTop: {
      type: String,
      default: null
    },
    collapsedBottom: {
      type: String,
      default: null
    },
    collapsedLeft: {
      type: String,
      default: null
    },
    collapsedRight: {
      type: String,
      default: null
    },
    collapsedWidth: {
      type: String,
      default: null
    },
    collapsedHeight: {
      type: String,
      default: null
    }
  },
  computed: {
    boxStyle() {
      const isColl = this.isCollapsed;

      return {
        top: (isColl ? (this.collapsedTop || this.top) : this.top) || 'auto',
        bottom: (isColl ? (this.collapsedBottom || this.bottom) : this.bottom) || 'auto',
        left: (isColl ? (this.collapsedLeft || this.left) : this.left) || 'auto',
        right: (isColl ? (this.collapsedRight || this.right) : this.right) || 'auto',
        width: (isColl ? (this.collapsedWidth || this.width) : this.width) || 'auto',
        height: (isColl ? (this.collapsedHeight || this.height) : this.height) || 'auto'
      };
    }
  }
}
</script>

<style scoped>
.sketchfab-blockers-wrapper {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}

.sketchfab-ui-blocker {
  position: absolute;
  pointer-events: auto;
  box-sizing: border-box;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border: red dashed;
}
</style>