<template>
  <div class="card-payment-form">
    <div class="form-group">
      <label for="cardNumber">Número de tarjeta</label>
      <div class="input-with-icon">
        <input
          id="cardNumber"
          v-model="formData.cardNumber"
          type="text"
          placeholder="1234 5678 9012 3456"
          maxlength="19"
          @input="formatCardNumber"
        />
        <div class="card-icons">
          <img v-if="cardType === 'visa'" src="@/assets/visa.svg" alt="Visa" class="card-icon" />
          <img
            v-if="cardType === 'mastercard'"
            src="@/assets/mastercard.svg"
            alt="Mastercard"
            class="card-icon"
          />
        </div>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="expiryDate">Fecha de expiración</label>
        <input
          id="expiryDate"
          v-model="formData.expiryDate"
          type="text"
          placeholder="MM/AA"
          maxlength="5"
          @input="formatExpiryDate"
        />
      </div>

      <div class="form-group">
        <label for="cvv">CVV</label>
        <input
          id="cvv"
          v-model="formData.cvv"
          type="text"
          placeholder="123"
          maxlength="4"
          @input="formatCVV"
        />
      </div>
    </div>

    <div class="form-group">
      <label for="cardName">Nombre en la tarjeta</label>
      <input
        id="cardName"
        v-model="formData.cardName"
        type="text"
        placeholder="Como aparece en la tarjeta"
        @input="formatCardName"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface FormData {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardName: string
}

const formData = ref<FormData>({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardName: '',
})

const cardType = computed(() => {
  const number = formData.value.cardNumber.replace(/\s/g, '')
  if (number.startsWith('4')) return 'visa'
  if (/^5[1-5]/.test(number)) return 'mastercard'
  return null
})

const formatCardNumber = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  value = value.replace(/(\d{4})/g, '$1 ').trim()
  formData.value.cardNumber = value
}

const formatExpiryDate = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2)
  }
  formData.value.expiryDate = value
}

const formatCVV = (event: Event) => {
  const input = event.target as HTMLInputElement
  formData.value.cvv = input.value.replace(/\D/g, '')
}

const formatCardName = (event: Event) => {
  const input = event.target as HTMLInputElement
  formData.value.cardName = input.value.toUpperCase()
}

defineExpose({
  formData,
})
</script>

<style scoped>
.card-payment-form {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text);
  font-weight: 500;
  font-size: var(--font-size-base);
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: border-color 0.2s ease;
}

input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.input-with-icon {
  position: relative;
}

.card-icons {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 0.5rem;
}

.card-icon {
  height: 24px;
  width: auto;
}

/* Tablets */
@media (max-width: 768px) {
  .card-payment-form {
    padding: 0.25rem;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  label {
    font-size: var(--font-size-sm);
  }

  input {
    padding: 0.625rem;
    font-size: var(--font-size-sm);
  }

  .card-icon {
    height: 20px;
  }
}

/* Móviles */
@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    margin-bottom: 0.25rem;
  }

  input {
    padding: 0.5rem;
  }

  .card-icons {
    right: 0.5rem;
  }

  .card-icon {
    height: 18px;
  }
}

/* Dispositivos muy pequeños */
@media (max-width: 320px) {
  .card-payment-form {
    padding: 0;
  }

  input {
    font-size: var(--font-size-xs);
  }
}
</style>
