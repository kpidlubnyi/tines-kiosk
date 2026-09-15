<template>
  <div class="offer-details">
    <div class="offer-items-stack">
      <article 
        v-for="(item, index) in offer.items" 
        :key="item.id || index" 
        :id="`offer-item-${index}`"
        ref="itemRefs"
        class="offer-item-card"
        :class="{ 'even-item': index % 2 !== 0 }"
        @click="handleCardClick(item, $event)"
      >
        <div class="item-media">
          <img :src="item.images?.main_image" :alt="langStore.getText(item.title)" class="item-image" />
        </div>

        <div class="item-content">
          <h2 class="item-title" v-html="langStore.getText(item.title)"></h2>
          <p class="item-description" v-html="langStore.getText(item.description)"></p>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import { useLanguageStore } from '@/stores/language';

export default {
  name: 'OfferDetails',
  props: {
    offer: {
      type: Object,
      required: true,
      default: () => ({ items: [] })
    }
  },
  emits: ['active-item-change', 'select-item'],
  data() {
    return {
      langStore: useLanguageStore(),
      observer: null
    }
  },
  mounted() {
    this.initObserver()
  },
  beforeUnmount() {
    if (this.observer) this.observer.disconnect()
  },
  methods: {
    handleCardClick(item, event) {
      this.$emit('select-item', {
        item,
        event
      })
    },

    initObserver() {
      const options = {
        root: null,
        rootMargin: '-30% 0px -30% 0px',
        threshold: 0.2
      }

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(this.$refs.itemRefs || []).indexOf(entry.target)
            if (index !== -1) {
              this.$emit('active-item-change', index)
            }
          }
        })
      }, options)

      this.$nextTick(() => {
        if (this.$refs.itemRefs) {
          this.$refs.itemRefs.forEach((el) => this.observer.observe(el))
        }
      })
    },

    scrollToIndex(index) {
      if (this.$refs.itemRefs && this.$refs.itemRefs[index]) {
        this.$refs.itemRefs[index].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }
  }
}
</script>

<style scoped>
.offer-details {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  padding-bottom: 4vh;
}

.offer-items-stack {
  display: flex;
  flex-direction: column;
  gap: 2.5vw;
}

.offer-item-card {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.33);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 0.1vw solid rgba(226, 232, 240, 0.8);
  border-radius: 1.2vw;
  overflow: hidden;
  box-shadow: 0 0.8vw 2.5vw rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  scroll-margin-top: 15vh;
  cursor: pointer;
}

.offer-item-card:hover {
  transform: translateY(-0.3vw) scale(1.005);
  box-shadow: 0 1.2vw 3vw rgba(0, 0, 0, 0.12);
}

.offer-item-card.even-item {
  flex-direction: row-reverse;
}

.item-media {
  width: 50%;
  height: 100%;
  min-height: 220px;
  max-height: 350px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.offer-item-card:hover .item-image {
  transform: scale(1.04);
}

.item-content {
  width: 50%;
  padding: 2.5vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-title {
  margin: 0 0 1vw 0;
  font-size: 1.4vw;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}

.item-title :deep(sup),
.item-description :deep(sup) {
  font-size: 0.6em;
  vertical-align: super;
  line-height: 0;
}

.item-description {
  margin: 0;
  font-size: 1vw;
  line-height: 1.65;
  color: #334155;
}
</style>