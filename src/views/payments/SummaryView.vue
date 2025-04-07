<template>
  <div class="summary-payment">
    <div class="container">
      <h1 class="title">Resumen de pago</h1>

      <div class="product-summary" v-if="producto">
        <div class="product">
          <img :src="producto.image" :alt="producto.name" />
        </div>
        <div class="product-info">
          <h2>{{ producto.name }}</h2>
          <p class="price">{{ formatPrice(producto.price) }}</p>
        </div>
      </div>

      <div class="detail-payment">
        <h3>Detalles del pago</h3>
        <div class="detail-item">
          <span>Subtotal:</span>
          <span>{{ formatPrice(producto?.price || 0) }}</span>
        </div>
        <div class="detail-item">
          <span>Tarifa base:</span>
          <span>{{ formatPrice(5000) }}</span>
        </div>
        <div class="detail-item">
          <span>Tarifa de envío:</span>
          <span>{{ formatPrice(10000) }}</span>
        </div>
        <div class="detail-item total">
          <span>Total:</span>
          <span>{{ formatPrice((producto?.price || 0) + 5000 + 10000) }}</span>
        </div>
      </div>

      <div class="actions">
        <Button variant="secondary" @click="backToCard">Volver</Button>
        <Button variant="primary" @click="processPayment" :loading="loading"> Pagar </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from '../../components/ui/Button.vue'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const producto = ref(null)

onMounted(() => {
  const productId = route.params.productId
  producto.value = {
    id: productId,
    name: 'Producto ' + productId,
    description: 'Descripción del producto',
    price: 150000,
    image: `https://picsum.photos/500/300?random=${productId}`,
  }
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price)
}

const backToCard = () => {
  router.push(`/payment/card/${route.params.productId}`)
}

const processPayment = async () => {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const transactionId = Math.floor(Math.random() * 1000000)

    router.push(`/payment/status/${transactionId}`)
  } catch (error) {
    console.error('Error al procesar el pago:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.summary-payment {
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 1rem;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.title {
  color: var(--color-dark);
  margin-bottom: 2rem;
  text-align: center;
  font-size: clamp(1.5rem, 4vw, 2rem);
}

.product-summary {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  margin-right: 1rem;
}

.product img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-info h2 {
  margin: 0 0 0.5rem 0;
  font-size: var(--font-size-lg);
}

.price {
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}

.detail-payment {
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
}

.detail-payment h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--color-dark);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.detail-item.total {
  font-weight: 700;
  font-size: var(--font-size-lg);
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0.5rem;
  }

  .product {
    flex-direction: column;
    text-align: center;
  }

  .product {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .actions {
    flex-direction: column;
  }

  .actions button {
    width: 100%;
  }
}
</style>
