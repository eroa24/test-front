<template>
  <div class="card-payment-form">
    <div class="form-group">
      <label for="cardNumber">Card Number</label>
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
        <label for="expiryDate">Expiry Date</label>
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
        <label for="cvc">CVC</label>
        <input
          id="cvc"
          v-model="formData.cvc"
          type="text"
          placeholder="123"
          maxlength="4"
          @input="formatCVC"
        />
      </div>
    </div>

    <div class="form-group">
      <label for="cardName">Card Name</label>
      <input
        id="cardName"
        v-model="formData.cardName"
        type="text"
        placeholder="As it appears on the card"
        @input="formatCardName"
      />
    </div>

    <div class="form-group">
      <label for="installments">Cuotas</label>
      <div class="installments-selector">
        <select id="installments" v-model="formData.installments" class="installments-select">
          <option v-for="i in 12" :key="i" :value="String(i)">
            {{ i }} {{ i === 1 ? 'cuota' : 'cuotas' }}
          </option>
        </select>
      </div>
    </div>

    <div class="terms-container">
      <div class="checkbox-group">
        <input type="checkbox" id="termsAndConditions" v-model="formData.termsAccepted" />
        <label for="termsAndConditions" class="checkbox-label">
          Acepto haber leído los
          <a
            href="https://wompi.com/assets/downloadble/reglamento-Usuarios-Colombia.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            reglamentos
          </a>
          y la
          <a
            href="https://wompi.com/assets/downloadble/autorizacion-administracion-datos-personales.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            política de privacidad
          </a>
          para hacer este pago.
        </label>
      </div>

      <div class="checkbox-group">
        <input type="checkbox" id="dataProcessing" v-model="formData.dataProcessingAccepted" />
        <label for="dataProcessing" class="checkbox-label">
          Acepto la
          <a
            href="https://wompi.com/assets/downloadble/autorizacion-administracion-datos-personales.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            autorización para la administración de datos personales
          </a>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface FormData {
  cardNumber: string
  expiryDate: string
  cvc: string
  cardName: string
  installments: string
  termsAccepted: boolean
  dataProcessingAccepted: boolean
}

const emit = defineEmits<{
  (e: 'showNotification', message: string): void
}>()

const formData = ref<FormData>({
  cardNumber: '',
  expiryDate: '',
  cvc: '',
  cardName: '',
  installments: '1',
  termsAccepted: false,
  dataProcessingAccepted: false,
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

const formatCVC = (event: Event) => {
  const input = event.target as HTMLInputElement
  formData.value.cvc = input.value.replace(/\D/g, '')
}

const formatCardName = (event: Event) => {
  const input = event.target as HTMLInputElement
  formData.value.cardName = input.value.toUpperCase()
}

const validateTerms = () => {
  if (!formData.value.termsAccepted || !formData.value.dataProcessingAccepted) {
    emit(
      'showNotification',
      'Debes aceptar los términos y condiciones y la política de privacidad para continuar',
    )
    return false
  }
  return true
}

defineExpose({
  formData,
  validateTerms,
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

.installments-selector {
  position: relative;
  width: 100%;
}

.installments-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: border-color 0.2s ease;
  background-color: white;
  appearance: none;
  cursor: pointer;
}

.installments-select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.installments-selector::after {
  content: '';
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid var(--color-text);
  pointer-events: none;
}

.terms-container {
  margin-top: 1rem;
}

.checkbox-group {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.checkbox-group input[type='checkbox'] {
  width: auto;
  margin-right: 0.5rem;
  margin-top: 0.25rem;
  cursor: pointer;
}

.checkbox-label {
  font-size: var(--font-size-sm);
  line-height: 1.4;
  margin-bottom: 0;
  color: var(--color-text);
}

.checkbox-label a {
  color: var(--color-primary);
  text-decoration: none;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

/* Tablets */
@media (max-width: 68px) {
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

  .installments-select {
    padding: 0.625rem;
    font-size: var(--font-size-sm);
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

  .installments-select {
    padding: 0.5rem;
  }

  .terms-container {
    margin-top: 0.75rem;
  }

  .checkbox-group {
    margin-bottom: 0.5rem;
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

  .installments-select {
    font-size: var(--font-size-xs);
  }
}
</style>
