<template>
  <div class="payment-card">
    <div class="container">
      <h1 class="title">Payment Information</h1>

      <div class="product-summary" v-if="product">
        <div class="product-image">
          <img :src="product.image" :alt="product.name" />
        </div>
        <div class="product-info">
          <h2>{{ product.name }}</h2>
          <p class="price">{{ formatPrice(product.price) }}</p>
        </div>
      </div>

      <div class="form-container">
        <CardPaymentForm ref="cardForm" />
      </div>

      <div class="actions">
        <Button variant="secondary" @click="backToProducts">Cancel</Button>
        <Button variant="primary" @click="continueToSummary" :loading="loading"> Continue </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from '../../components/ui/Button.vue'
import CardPaymentForm from '../../components/payment/CardPaymentForm.vue'

const router = useRouter()
const route = useRoute()
const cardForm = ref<InstanceType<typeof CardPaymentForm> | null>(null)
const loading = ref(false)
const product = ref(null)

onMounted(() => {
  const productId = route.params.productId
  product.value = {
    id: productId,
    name: 'Product ' + productId,
    description: 'Product description',
    price: 150000,
    image: `https://picsum.photos/500/300?random=${productId}`,
  }
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price)
}

const backToProducts = () => {
  router.push('/products')
}

const continueToSummary = async () => {
  if (!cardForm.value) return

  loading.value = true
  try {
    const formData = cardForm.value.formData
    localStorage.setItem(
      'paymentData',
      JSON.stringify({
        productId: route.params.productId,
        cardData: formData,
        timestamp: new Date().toISOString(),
      }),
    )

    router.push(`/payment/summary/${route.params.productId}`)
  } catch (error) {
    console.error('Error processing payment:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.payment-card {
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

.product-image img {
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

.form-container {
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
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

  .product-summary {
    flex-direction: column;
    text-align: center;
  }

  .product-image {
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
