<template>
  <Teleport to="body">
    <Transition name="notification">
      <div v-if="modelValue" class="notification" :class="type">
        <div class="notification-content">
          <div class="notification-icon">
            <svg
              v-if="type === 'error'"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
            <svg
              v-else-if="type === 'success'"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div class="notification-message">
            <slot>{{ message }}</slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

interface Props {
  modelValue: boolean
  message?: string
  type?: 'error' | 'success' | 'info'
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000,
  message: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

let timeout: number | undefined

const closeNotification = () => {
  emit('update:modelValue', false)
}

const startTimer = () => {
  if (timeout) {
    clearTimeout(timeout)
  }
  if (props.duration > 0) {
    timeout = window.setTimeout(closeNotification, props.duration)
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      startTimer()
    }
  },
)

onMounted(() => {
  if (props.modelValue) {
    startTimer()
  }
})

onUnmounted(() => {
  if (timeout) {
    clearTimeout(timeout)
  }
})
</script>

<style scoped>
.notification {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  min-width: 300px;
  max-width: 450px;
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  padding: 1rem;
  display: flex;
  align-items: center;
  border-left: 4px solid var(--color-primary);
}

.notification.error {
  border-left-color: var(--color-danger);
}

.notification.success {
  border-left-color: var(--color-success);
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.error .notification-icon {
  color: var(--color-danger);
}

.success .notification-icon {
  color: var(--color-success);
}

.info .notification-icon {
  color: var(--color-primary);
}

.notification-message {
  flex: 1;
  font-size: var(--font-size-base);
  color: var(--color-dark);
}

/* Animaciones */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Responsive */
@media (max-width: 768px) {
  .notification {
    top: auto;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    min-width: auto;
    max-width: none;
  }
}
</style>
