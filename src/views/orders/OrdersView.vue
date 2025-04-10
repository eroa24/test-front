<template>
  <div class="orders-container">
    <div class="search-card">
      <h1 class="title">Órdenes</h1>

      <div class="search-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Ingresa tu correo electrónico"
            class="email-input"
            :class="{ error: showError }"
          />
          <span v-if="showError" class="error-message"> Por favor ingresa un email válido </span>
        </div>
        <Button variant="primary" @click="searchOrders" :disabled="isLoading || !email">
          <template v-if="!isLoading">Buscar Órdenes</template>
          <Loading v-else :show="true" />
        </Button>
      </div>
    </div>

    <Notification
      v-if="error"
      v-model="showNotification"
      type="error"
      :message="error"
      @close="error = ''"
    />

    <OrderList v-if="orders.length > 0" :orders="orders" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '../../components/ui/Button.vue'
import Loading from '../../components/ui/Loading.vue'
import Notification from '../../components/ui/Notification.vue'
import OrderList from '../../components/orders/OrderList.vue'
import { OrderService } from '../../api/services/orders'
import type { Order } from '../../api/services/orders'

const email = ref('')
const orders = ref<Order[]>([])
const isLoading = ref(false)
const error = ref('')
const showError = ref(false)
const showNotification = ref(false)

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const searchOrders = async () => {
  if (!validateEmail(email.value)) {
    showError.value = true
    return
  }

  showError.value = false
  isLoading.value = true
  error.value = ''

  try {
    const response = await OrderService.getOrdersByEmail(email.value)
    orders.value = response.data
  } catch (e) {
    error.value = 'Error al buscar las órdenes. Por favor intenta de nuevo.'
    orders.value = []
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.orders-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
}

.search-card {
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  width: 100%;
  max-width: 500px;
  margin-bottom: 2rem;
}

.title {
  color: var(--color-dark);
  margin-bottom: 2rem;
  text-align: center;
  font-size: clamp(1.5rem, 4vw, 2rem);
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: var(--font-size-base);
  color: var(--color-text);
  font-weight: 500;
}

.email-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: border-color 0.2s ease;
}

.email-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.email-input.error {
  border-color: var(--color-error);
}

.error-message {
  color: var(--color-error);
  font-size: var(--font-size-sm);
}

@media (max-width: 768px) {
  .orders-container {
    padding: 1rem;
  }

  .search-card {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .search-card {
    padding: 1rem;
  }

  .email-input {
    padding: 0.5rem;
    font-size: var(--font-size-sm);
  }
}
</style>
