<template>
  <div class="payment-container">
    <div class="payment-card">
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

      <div class="tabs-container mobile-only">
        <div class="tabs">
          <button
            class="tab-button"
            :class="{ active: activeTab === 'payment' }"
            @click="activeTab = 'payment'"
          >
            Payment
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'delivery' }"
            @click="activeTab = 'delivery'"
          >
            Delivery
          </button>
        </div>
      </div>

      <div class="forms-container">
        <div class="form-container" :class="{ 'desktop-only': activeTab !== 'payment' }">
          <h2 class="section-title">Card Information</h2>
          <CardPaymentForm ref="cardForm" />
        </div>

        <div class="form-container" :class="{ 'desktop-only': activeTab !== 'delivery' }">
          <h2 class="section-title">Delivery Information</h2>
          <DeliveryForm ref="deliveryForm" />
        </div>
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
import DeliveryForm from '../../components/payment/DeliveryForm.vue'

const router = useRouter()
const route = useRoute()
const cardForm = ref<InstanceType<typeof CardPaymentForm> | null>(null)
const deliveryForm = ref<InstanceType<typeof DeliveryForm> | null>(null)
const loading = ref(false)
const product = ref(null)
const activeTab = ref('payment')

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
  if (!cardForm.value || !deliveryForm.value) return

  loading.value = true
  try {
    const cardData = cardForm.value.formData
    const deliveryData = deliveryForm.value.formData

    const isDeliveryComplete = Object.values(deliveryData).every((value) => value.trim() !== '')

    if (!isDeliveryComplete) {
      activeTab.value = 'delivery'
      loading.value = false
      return
    }

    localStorage.setItem(
      'paymentData',
      JSON.stringify({
        productId: route.params.productId,
        cardData,
        deliveryData,
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
.container {
}

.title {
  color: var(--color-dark);
  margin-bottom: 2rem;
  text-align: center;
  font-size: clamp(1.5rem, 4vw, 2rem);
  width: 100%;
}

.product-summary {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm);
  max-width: 600px;
  width: 100%;
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

.tabs-container {
  margin-bottom: 1.5rem;
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border);
}

.tab-button {
  flex: 1;
  padding: 0.75rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.forms-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  width: 100%;
}

.form-container {
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
  width: 100%;
}

.section-title {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: var(--font-size-lg);
  color: var(--color-dark);
}

.actions {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .payment-card {
    padding: 1rem 0;
  }

  .container {
    padding: 1rem;
  }

  .forms-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-container {
    padding: 1rem;
  }

  .mobile-only {
    display: block;
  }

  .desktop-only {
    display: none;
  }

  .actions {
    padding: 5px;
    display: flex;
    gap: 20px;
  }

  .actions button {
    width: 100%;
  }
}

@media (min-width: 1024px) {
  .payment-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .payment-card {
    width: 60%;
  }
}

@media (min-width: 1440px) {
  .payment-card {
    width: 60%;
  }
}
</style>
