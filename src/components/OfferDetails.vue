<template>
  <div class="offer-details">
    <!-- Вертикальний стос айтемів (без шапки) -->
    <div class="offer-items-stack">
      <article 
        v-for="(item, index) in offer.items" 
        :key="index" 
        class="offer-item-card"
        :class="{ 'even-item': index % 2 !== 0 }"
      >
        <!-- Блок з фотографією -->
        <div class="item-media">
          <img :src="item.image" :alt="item.title" class="item-image" />
        </div>

        <!-- Блок з текстом (назва та опис) -->
        <div class="item-content">
          <h2 class="item-title">{{ item.title }}</h2>
          <p class="item-description">{{ item.description }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OfferDetails',
  props: {
    offer: {
      type: Object,
      required: true,
      default: () => ({
        items: []
      })
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

/* Вертикальний стос айтемів */
.offer-items-stack {
  display: flex;
  flex-direction: column;
  gap: 2.5vw;
}

/* Картка айтему з матовим склом */
.offer-item-card {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 0.1vw solid rgba(226, 232, 240, 0.8);
  border-radius: 1.2vw;
  overflow: hidden;
  box-shadow: 0 0.8vw 2.5vw rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.offer-item-card:hover {
  transform: translateY(-0.2vw);
  box-shadow: 0 1.2vw 3vw rgba(0, 0, 0, 0.08);
}

/* Реверсивне розташування для парних айтемів */
.offer-item-card.even-item {
  flex-direction: row-reverse;
}

/* Блок фотографії */
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
  transform: scale(1.03);
}

/* Блок тексту */
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

.item-description {
  margin: 0;
  font-size: 1vw;
  line-height: 1.65;
  color: #334155;
}
</style>