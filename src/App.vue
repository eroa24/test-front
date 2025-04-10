<script setup lang="ts">
import Navbar from './components/layout/Navbar.vue'
</script>

<template>
  <Navbar />
  <router-view />
</template>

<style>
body {
  background-color: var(--color-white);
  margin: 0;
  padding: 10px;
  box-sizing: border-box;
}

.app {
  display: flex;
  flex-direction: column;
}

.navigation {
  background-color: var(--color-white);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
}

.nav-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.main-content {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .app {
    display: flex;
    flex-direction: column;
  }
  .nav-container {
    height: 56px;
    padding: 0 1rem;
  }
}
</style>
