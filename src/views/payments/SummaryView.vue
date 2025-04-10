<template>
  <div class="summary-payment">
    <div class="container">
      <h1 class="title">Summary Payment</h1>

      <div class="product-summary" v-if="product">
        <div class="product">
          <img :src="product.image" :alt="product.name" />
        </div>
        <div class="product-info">
          <h2>{{ product.name }}</h2>
          <p class="price">{{ formatPrice(product.price) }}</p>
          <p class="quantity">Quantity: {{ paymentData.quantity || 1 }}</p>
        </div>
      </div>

      <div class="summary-sections">
        <!-- Payment Details -->
        <div class="detail-payment">
          <h3>Payment Details</h3>
          <div class="card-info" v-if="paymentData.cardData">
            <p>
              <strong>Card Number:</strong> {{ maskCardNumber(paymentData.cardData.cardNumber) }}
            </p>
            <p><strong>Card Holder:</strong> {{ paymentData.cardData.cardName }}</p>
            <p><strong>Expiry Date:</strong> {{ paymentData.cardData.expiryDate }}</p>
          </div>
          <div class="detail-item">
            <span>Subtotal:</span>
            <span>{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="detail-item">
            <span>Base Fee:</span>
            <span>{{ formatPrice(taxAmount) }}</span>
          </div>
          <div class="detail-item">
            <span>Shipping Fee:</span>
            <span>{{ formatPrice(SHIPPING_FEE) }}</span>
          </div>
          <div class="detail-item total">
            <span>Total:</span>
            <span>{{ formatPrice(total) }}</span>
          </div>
        </div>

        <!-- Delivery Details Section -->
        <div class="detail-delivery">
          <h3>Delivery Information</h3>
          <div class="delivery-info" v-if="paymentData.deliveryData">
            <p><strong>Name:</strong> {{ paymentData.deliveryData.fullName }}</p>
            <p><strong>Email:</strong> {{ paymentData.deliveryData.email }}</p>
            <p><strong>Phone:</strong> {{ paymentData.deliveryData.phone }}</p>
            <p><strong>Address:</strong> {{ paymentData.deliveryData.address }}</p>
            <p><strong>City:</strong> {{ paymentData.deliveryData.city }}</p>
            <p><strong>Postal Code:</strong> {{ paymentData.deliveryData.postalCode }}</p>
            <p v-if="paymentData.deliveryData.deliveryInstructions">
              <strong>Instructions:</strong> {{ paymentData.deliveryData.deliveryInstructions }}
            </p>
          </div>
        </div>
      </div>

      <div class="actions">
        <Button variant="secondary" @click="backToCard">Back</Button>
        <Button variant="primary" @click="processPayment" :loading="loading"> Pay </Button>
      </div>
    </div>
    <Notification v-model="showNotification" type="error" :message="notificationMessage" />
    <Loading :show="loading" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from '../../components/ui/Button.vue'
import Notification from '../../components/ui/Notification.vue'
import Loading from '../../components/ui/Loading.vue'
import { TransactionService } from '../../api/services/transactions'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
}

interface CardData {
  cardNumber: string
  expiryDate: string
  cvc: string
  cardName: string
  installments: string
  termsAccepted: boolean
  dataProcessingAccepted: boolean
}

interface DeliveryData {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  deliveryInstructions?: string
}

interface PaymentData {
  quantity: number
  cardData: CardData | null
  deliveryData: DeliveryData | null
}

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const product = ref<Product | null>(null)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref<'error' | 'success' | 'info'>('error')
const paymentData = ref<PaymentData>({
  quantity: 1,
  cardData: null,
  deliveryData: null,
})

const TAX_RATE = 0.19 // Iva 19%
const SHIPPING_FEE = 10000

const subtotal = computed(() => {
  return (product.value?.price || 0) * paymentData.value.quantity
})

const taxAmount = computed(() => {
  return subtotal.value * TAX_RATE
})

const total = computed(() => {
  return subtotal.value + taxAmount.value + SHIPPING_FEE
})

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
      id: Array.isArray(productId) ? productId[0] : productId,
      name: 'No product found',
      description: 'Product description',
      price: 9999999,
      image: `https://picsum.photos/500/300?random=${Array.isArray(productId) ? productId[0] : productId}`,
    }
  }

  const storedData = localStorage.getItem('paymentData')
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData)
      paymentData.value = {
        cardData: parsedData.cardData || null,
        deliveryData: parsedData.deliveryData || null,
        quantity: parsedData.quantity || 1,
      }
    } catch (error) {
      console.error('Error parsing payment data:', error)
    }
  }
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price)
}

const maskCardNumber = (cardNumber: string) => {
  if (!cardNumber) return '**** **** **** ****'
  const cleaned = cardNumber.replace(/\s/g, '')
  return `**** **** **** ${cleaned.slice(-4)}`
}

const backToCard = () => {
  router.push(`/payment/card/${route.params.productId}`)
}

const processPayment = async () => {
  loading.value = true
  try {
    if (!paymentData.value.cardData || !paymentData.value.deliveryData) {
      notificationMessage.value = 'Por favor complete todos los datos de pago y entrega'
      showNotification.value = true
      loading.value = false
      return
    }

    const transactionData = {
      productId: route.params.productId as string,
      quantity: paymentData.value.quantity,
      cardData: paymentData.value.cardData,
      deliveryData: paymentData.value.deliveryData,
      amount: {
        subtotal: subtotal.value,
        tax: taxAmount.value,
        shipping: SHIPPING_FEE,
        total: total.value,
      },
    }

    const response = await TransactionService.createTransaction(transactionData)

    router.push(`/payment/status/${response.data.id}`)
  } catch (error: any) {
    console.error('Error processing payment:', error)
    notificationMessage.value =
      error?.response?.data?.message || 'Ha ocurrido un error al procesar el pago'
    showNotification.value = true
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
  max-width: 1200px;
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

.product {
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

.quantity {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  margin: 0.25rem 0 0 0;
}

.summary-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.detail-payment,
.detail-delivery {
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.detail-payment h3,
.detail-delivery h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--color-dark);
}

.card-info,
.delivery-info {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.card-info p,
.delivery-info p {
  margin: 0.5rem 0;
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

  .product-summary {
    flex-direction: column;
    text-align: center;
  }

  .product {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .summary-sections {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .actions {
    flex-direction: column;
  }

  .actions button {
    width: 100%;
  }
}
</style>
