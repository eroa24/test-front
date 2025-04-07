<template>
  <div class="text-field" :class="{ 'text-field--error': error }">
    <label v-if="label" :for="id" class="text-field__label">
      {{ label }}
      <span v-if="required" class="text-field__required">*</span>
    </label>

    <div class="text-field__input-wrapper">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="text-field__input"
        :class="{
          'text-field__input--error': error,
          'text-field__input--success': success,
        }"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />

      <span v-if="error" class="text-field__error-message">{{ error }}</span>
      <span v-if="success" class="text-field__success-message">{{ success }}</span>
      <span v-if="hint && !error && !success" class="text-field__hint">{{ hint }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  error?: string
  success?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  id: () => `text-field-${Math.random().toString(36).substr(2, 9)}`,
})

defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
}>()
</script>

<style scoped>
.text-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.text-field__label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-dark);
}

.text-field__required {
  color: var(--color-danger);
  margin-left: 0.25rem;
}

.text-field__input-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.text-field__input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: var(--font-size-base);
  line-height: 1.5;
  color: var(--color-dark);
  background-color: var(--color-white);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--border-radius-md);
  transition: var(--transition-base);
}

.text-field__input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.text-field__input:disabled {
  background-color: var(--color-light);
  cursor: not-allowed;
  opacity: 0.65;
}

.text-field__input--error {
  border-color: var(--color-danger);
}

.text-field__input--error:focus {
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.text-field__input--success {
  border-color: var(--color-success);
}

.text-field__input--success:focus {
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.text-field__error-message,
.text-field__success-message,
.text-field__hint {
  font-size: var(--font-size-sm);
  margin-top: 0.25rem;
}

.text-field__error-message {
  color: var(--color-danger);
}

.text-field__success-message {
  color: var(--color-success);
}

.text-field__hint {
  color: var(--color-secondary);
}

/* Responsive styles */
@media (max-width: 768px) {
  .text-field__input {
    padding: 0.5rem 0.75rem;
    font-size: var(--font-size-sm);
  }
}
</style>
