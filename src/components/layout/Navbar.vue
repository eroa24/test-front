<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/products" class="brand"> Mi Tienda </router-link>
      <div class="nav-links">
        <router-link to="/orders" class="nav-link"> Órdenes </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts"></script>

<style scoped>
.navbar {
  background-color: white;
  box-shadow: var(--shadow-sm);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  font-size: var(--font-size-lg);
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-md);
  transition: background-color 0.2s ease;
}

.nav-link:hover {
  background-color: var(--color-light);
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 0.75rem 0;
  }

  .brand {
    font-size: var(--font-size-base);
  }

  .nav-link {
    padding: 0.375rem 0.75rem;
    font-size: var(--font-size-sm);
  }
}
</style>
