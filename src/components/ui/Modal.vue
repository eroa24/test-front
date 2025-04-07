<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" :class="{ 'modal-content--centered': centered }">
        <div class="modal-header" v-if="$slots.header">
          <slot name="header"></slot>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  centered?: boolean
  closeOnOverlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  centered: true,
  closeOnOverlay: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const handleOverlayClick = (event: MouseEvent) => {
  if (props.closeOnOverlay && (event.target as HTMLElement).classList.contains('modal-overlay')) {
    emit('update:modelValue', false)
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  margin: auto;
}

.modal-content--centered {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  width: 100%;
}

.modal-body {
  padding: 1rem;
  width: 100%;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  width: 100%;
}

/* Tablets */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 85vh;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 0.75rem;
  }
}

/* Móviles pequeños */
@media (max-width: 480px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-content {
    width: 100%;
    max-height: 80vh;
    margin: 0;
    border-radius: var(--border-radius-md);
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 0.5rem;
  }

  .modal-footer {
    flex-direction: column;
    gap: 0.5rem;
  }

  .modal-footer button {
    width: 100%;
  }
}

/* Ajuste para dispositivos muy pequeños */
@media (max-height: 600px) {
  .modal-content {
    max-height: 95vh;
  }
}
</style>
