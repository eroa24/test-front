<template>
  <Modal v-model="isOpen" :closeOnOverlay="false">
    <template #header>
      <h2 class="modal-title">Pago con tarjeta</h2>
    </template>

    <CardPaymentForm ref="cardForm" />

    <template #footer>
      <Button variant="secondary" @click="closeModal">Cancelar</Button>
      <Button variant="primary" @click="handleSubmit" :loading="loading"> Pagar </Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Modal from '../ui/Modal.vue'
import Button from '../ui/Button.vue'
import CardPaymentForm from './CardPaymentForm.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', formData: any): void
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const cardForm = ref<InstanceType<typeof CardPaymentForm> | null>(null)
const loading = ref(false)

const closeModal = () => {
  isOpen.value = false
}

const handleSubmit = async () => {
  if (!cardForm.value) return

  loading.value = true
  try {
    const formData = cardForm.value.formData
    emit('submit', formData)
  } catch (error) {
    console.error('Error al procesar el pago:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-title {
  margin: 0;
  font-size: var(--font-size-xl);
  color: var(--color-dark);
  text-align: center;
  padding: 0.5rem 0;
}

/* Tablets */
@media (max-width: 768px) {
  .modal-title {
    font-size: var(--font-size-lg);
  }
}

/* Móviles */
@media (max-width: 480px) {
  .modal-title {
    font-size: var(--font-size-base);
    padding: 0.25rem 0;
  }
}
</style>
