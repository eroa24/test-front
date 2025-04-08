<template>
  <div class="delivery-form">
    <div class="form-group">
      <label for="fullName" class="form-label">Nombre completo</label>
      <input
        id="fullName"
        v-model="formData.fullName"
        type="text"
        placeholder="Enter your full name"
      />
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <input id="email" v-model="formData.email" type="email" placeholder="Enter your email" />
    </div>

    <div class="form-group">
      <label for="phone">Phone Number</label>
      <input id="phone" v-model="formData.phone" type="tel" placeholder="Enter your phone number" />
    </div>

    <div class="form-group">
      <label for="address">Delivery Address</label>
      <input
        id="address"
        v-model="formData.address"
        type="text"
        placeholder="Enter your delivery address"
      />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="city">City</label>
        <input id="city" v-model="formData.city" type="text" placeholder="City" />
      </div>

      <div class="form-group">
        <label for="postalCode">Postal Code</label>
        <input
          id="postalCode"
          v-model="formData.postalCode"
          type="text"
          placeholder="Postal code"
        />
      </div>
    </div>

    <div class="form-group">
      <label for="deliveryInstructions">Delivery Instructions (Optional)</label>
      <textarea
        id="deliveryInstructions"
        v-model="formData.deliveryInstructions"
        placeholder="Any special instructions for delivery"
        rows="3"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface DeliveryFormData {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  deliveryInstructions: string
}

const formData = ref<DeliveryFormData>({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  deliveryInstructions: '',
})

defineExpose({
  formData,
})
</script>

<style scoped>
.delivery-form {
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
input,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: border-color 0.2s ease;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* Tablets */
@media (max-width: 768px) {
  .delivery-form {
    padding: 0.25rem;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  label {
    font-size: var(--font-size-sm);
  }

  input,
  textarea {
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

  input,
  textarea {
    padding: 0.5rem;
  }
}

/* Dispositivos muy pequeños */
@media (max-width: 320px) {
  .delivery-form {
    padding: 0;
  }

  input,
  textarea {
    font-size: var(--font-size-xs);
  }
}
</style>
