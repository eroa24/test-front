<template>
  <div class="card" :class="{ 'card-hover': hover }">
    <div class="card-image" v-if="imageUrl">
      <img :src="imageUrl" :alt="imageAlt || title" />
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-description" v-if="description">{{ description }}</p>
      <div class="card-price" v-if="price">
        {{ formatPrice(price) }}
      </div>
      <div class="card-footer" v-if="$slots.footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description?: string
  imageUrl?: string
  imageAlt?: string
  price?: number
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hover: true,
  description: '',
  imageUrl: '',
  imageAlt: '',
  price: 0,
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price)
}
</script>

<style scoped>
.card {
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  padding-top: 60%;
  overflow: hidden;
  width: 100%;
}

.card-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  width: 100%;
}

.card-title {
  color: var(--color-dark);
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0;
}

.card-description {
  color: var(--color-dark);
  font-size: var(--font-size-base);
  line-height: 1.5;
  margin: 0;
  opacity: 0.8;
}

.card-price {
  color: var(--color-primary);
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-top: auto;
}

.card-footer {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  width: 100%;
}

@media (max-width: 768px) {
  .card-content {
    padding: 1rem;
  }

  .card-title {
    font-size: var(--font-size-md);
  }

  .card-price {
    font-size: var(--font-size-lg);
  }
}
</style>
