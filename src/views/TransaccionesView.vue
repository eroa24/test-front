<template>
  <div class="transacciones">
    <h1>Transacciones</h1>
    <div class="content">
      <p>Vista de transacciones en desarrollo</p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.transacciones {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: var(--color-dark);
  margin-bottom: 2rem;
  text-align: center;
}

.content {
  background-color: var(--color-white);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 768px) {
  .transacciones {
    padding: 1rem;
  }
}
</style>
