<template>
  <button
    :class="[
      'button',
      `button--${variant}`,
      `button--${size}`,
      { 'button--block': block },
      { 'button--disabled': disabled },
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  disabled: false,
})

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: var(--font-size-base);
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border: var(--border-width) solid transparent;
  border-radius: var(--border-radius-md);
  transition: var(--transition-base);
}

/* Variantes */
.button--primary {
  color: var(--button-primary-text);
  background-color: var(--button-primary-bg);
  border: 2px solid var(--button-primary-border);
  box-shadow: 4px 4px 0px var(--button-primary-shadow);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
}

.button--secondary {
  color: var(--button-secondary-text);
  background-color: var(--button-secondary-bg);
  border: 2px solid var(--button-secondary-border);
  box-shadow: 4px 4px 0px var(--button-secondary-shadow);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
}

.button--outline {
  color: var(--color-primary);
  background-color: transparent;
  border-color: var(--color-primary);
}

/* Tamaños */
.button--sm {
  padding: 0.5rem 1rem;
  font-size: var(--font-size-sm);
  border-radius: var(--border-radius-sm);
}

.button--md {
  padding: 0.75rem 1.5rem;
  font-size: var(--font-size-base);
  border-radius: var(--border-radius-md);
}

.button--lg {
  padding: 1rem 2rem;
  font-size: var(--font-size-lg);
  border-radius: var(--border-radius-lg);
}

/* Estado block */
.button--block {
  display: flex;
  width: 100%;
}

/* Estado disabled */
.button--disabled {
  opacity: 0.65;
  pointer-events: none;
}

/* Hover states */
.button--primary:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--button-primary-shadow);
  background-color: var(--button-primary-bg);
  opacity: 0.95;
}

.button--secondary:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--button-secondary-shadow);
  background-color: var(--button-secondary-bg);
  opacity: 0.95;
}

.button--outline:hover {
  background-color: var(--color-primary);
  color: var(--color-white);
}

/* Focus states */
.button:focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0.15);
}

/* Active states */
.button:active {
  transform: translateY(1px);
}
</style>
