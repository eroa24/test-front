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
          <div class="quantity-selector">
            <label for="quantity">Quantity:</label>
            <div class="quantity-controls">
              <button class="quantity-btn" @click="decreaseQuantity" :disabled="quantity <= 1">
                -
              </button>
              <input
                id="quantity"
                type="number"
                v-model.number="quantity"
                min="1"
                :max="product.stock || 99"
                class="quantity-input"
              />
              <button
                class="quantity-btn"
                @click="increaseQuantity"
                :disabled="quantity >= (product.stock || 99)"
              >
                +
              </button>
            </div>
            <div class="stock-badge" v-if="product.stock">
              <span class="stock-icon">📦</span>
              <span class="stock-text">{{ product.stock }} available</span>
            </div>
          </div>
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
          <CardPaymentForm
            ref="cardForm"
            @showNotification="
              (message) => {
                notificationMessage = message
                showNotification = true
              }
            "
          />
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

    <Notification v-model="showNotification" type="error" :message="notificationMessage" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from '../../components/ui/Button.vue'
import CardPaymentForm from '../../components/payment/CardPaymentForm.vue'
import DeliveryForm from '../../components/payment/DeliveryForm.vue'
import Notification from '../../components/ui/Notification.vue'

const router = useRouter()
const route = useRoute()
const cardForm = ref<InstanceType<typeof CardPaymentForm> | null>(null)
const deliveryForm = ref<InstanceType<typeof DeliveryForm> | null>(null)
const loading = ref(false)
const product = ref(null)
const activeTab = ref('payment')
const showNotification = ref(false)
const notificationMessage = ref('')
const quantity = ref(1)

onMounted(() => {
  const productId = route.params.productId
  const storedProduct = localStorage.getItem('selectedProduct')

  if (storedProduct) {
    const parsedProduct = JSON.parse(storedProduct)
    if (parsedProduct.id === productId) {
      product.value = parsedProduct
    } else {
      router.push('/products')
    }
  } else {
    product.value = {
      id: productId,
      name: 'No product found',
      description: 'Product description',
      price: 9999999,
      image: `https://picsum.photos/500/300?random=${productId}`,
    }
  }

  const storedData = localStorage.getItem('paymentData')
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData)
      if (parsedData.cardData && cardForm.value) {
        cardForm.value.formData = parsedData.cardData
      }
      if (parsedData.deliveryData && deliveryForm.value) {
        deliveryForm.value.formData = parsedData.deliveryData
      }
      if (parsedData.quantity) {
        const maxStock = product.value?.stock || 99
        quantity.value = Math.min(parsedData.quantity, maxStock)
      }
    } catch (error) {
      console.error('Error parsing payment data:', error)
    }
  }
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price)
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const increaseQuantity = () => {
  const maxStock = product.value?.stock || 99
  if (quantity.value < maxStock) {
    quantity.value++
  }
}

const backToProducts = () => {
  router.push('/products')
}

const continueToSummary = async () => {
  if (!cardForm.value || !deliveryForm.value) return

  if (!cardForm.value.validateTerms()) {
    return
  }

  loading.value = true
  try {
    const cardData = cardForm.value.formData
    const deliveryData = deliveryForm.value.formData

    if (product.value?.stock && quantity.value > product.value.stock) {
      notificationMessage.value = `Solo hay ${product.value.stock} unidades disponibles`
      showNotification.value = true
      loading.value = false
      return
    }

    const isCardComplete = Object.entries(cardData).every(([key, value]) => {
      if (key === 'cardNumber') {
        return value.replace(/\s/g, '').length === 16
      }
      if (key === 'expiryDate') {
        return value.length === 5
      }
      if (key === 'cvc') {
        return value.length >= 3
      }
      if (key === 'termsAccepted' || key === 'dataProcessingAccepted' || key === 'installments') {
        return true
      }
      return typeof value === 'string' ? value.trim() !== '' : true
    })

    if (!isCardComplete) {
      notificationMessage.value = 'Por favor complete todos los campos obligatorios de la tarjeta'
      showNotification.value = true
      loading.value = false
      return
    }

    const requiredDeliveryFields = ['fullName', 'email', 'phone', 'address', 'city', 'postalCode']
    const isDeliveryComplete = requiredDeliveryFields.every(
      (field) => deliveryData[field] && deliveryData[field].trim() !== '',
    )

    if (!isDeliveryComplete) {
      notificationMessage.value = 'Por favor complete todos los campos obligatorios de entrega'
      showNotification.value = true
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
        quantity: quantity.value,
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
  margin: 0 0 0.5rem 0;
}

.quantity-selector {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  display: flex;
}

.quantity-selector label {
  margin-right: 0.5rem;
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.quantity-btn {
  background-color: var(--color-light);
  border: none;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  cursor: pointer;
  transition: background-color 0.2s;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-btn:hover:not(:disabled) {
  background-color: var(--color-border);
}

.quantity-input {
  width: 40px;
  height: 30px;
  border: none;
  border-left: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  text-align: center;
  font-size: var(--font-size-base);
  -moz-appearance: textfield;
}

.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.stock-badge {
  display: inline-flex;
  align-items: center;
  background-color: var(--color-light);
  border-radius: var(--border-radius-md);
  padding: 0.25rem 0.5rem;
  margin-top: 0.5rem;
  font-size: var(--font-size-sm);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  margin: 0.1rem;
  margin-left: 0.2rem;
  width: 45%;
}

.stock-icon {
  margin-right: 0.25rem;
  font-size: var(--font-size-base);
}

.stock-text {
  font-weight: 500;
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
  .stock-text {
    margin-left: 0.3rem;
  }
  .stock-badge {
    margin-left: 0.5rem;
  }
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
