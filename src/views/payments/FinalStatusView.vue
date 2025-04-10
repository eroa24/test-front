<template>
  <div class="final-status">
    <div class="container">
      <div class="status-card">
        <div v-if="isLoading" class="loading">
          <p>Procesando pago...</p>
        </div>
        <template v-else>
          <div class="status-icon" :class="{ 'status-success': isSuccessful }">
            <svg
              v-if="isSuccessful"
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>

          <h1 class="title">{{ isSuccessful ? '¡Pago Exitoso!' : 'Pago Fallido' }}</h1>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div class="transaction-details">
            <p>
              ID de Transacción: <strong>{{ transactionId }}</strong>
            </p>
            <p>
              Fecha: <strong>{{ currentDate }}</strong>
            </p>
          </div>
        </template>

        <div class="actions">
          <Button variant="primary" @click="backToProducts">Volver a Productos</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from '../../components/ui/Button.vue'
import { TransactionService } from '../../api/services/transactions'

const router = useRouter()
const route = useRoute()
const transactionId = ref('')
const isSuccessful = ref(false)
const isLoading = ref(true)
const error = ref('')

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

onMounted(async () => {
  transactionId.value = route.params.transactionId as string

  try {
    const response = await TransactionService.getTransactionStatus(transactionId.value)
    isSuccessful.value = response.data.status === 'COMPLETED' || response.data.status === 'PENDING'

    if (isSuccessful.value) {
      localStorage.removeItem('paymentData')
      localStorage.removeItem('selectedProduct')
    }
  } catch (err) {
    console.error('Error fetching transaction status:', err)
    error.value = 'Error al obtener el estado de la transacción'
    isSuccessful.value = false
  } finally {
    isLoading.value = false
  }
})

const backToProducts = () => {
  router.push('/products')
}
</script>

<style scoped>
.final-status {
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.status-card {
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  text-align: center;
}

.status-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f8f9fa;
  color: #dc3545;
}

.status-success {
  color: #28a745;
}

.title {
  color: var(--color-dark);
  margin-bottom: 1.5rem;
  font-size: clamp(1.5rem, 4vw, 2rem);
}

.transaction-details {
  margin-bottom: 2rem;
  text-align: left;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: var(--border-radius-md);
}

.transaction-details p {
  margin: 0.5rem 0;
}

.actions {
  display: flex;
  justify-content: center;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: var(--font-size-lg);
  color: var(--color-text);
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: var(--border-radius-md);
  margin-bottom: 1rem;
  text-align: center;
}

@media (max-width: 768px) {
  .status-card {
    padding: 1.5rem;
  }

  .status-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
  }

  .transaction-details {
    padding: 0.75rem;
  }
}
</style>
