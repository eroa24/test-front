<script setup lang="ts"></script>

<template>
  <div class="app">
    <nav class="navigation">
      <div class="nav-container">
        <div class="nav-brand">
          <router-link to="/" class="brand-link">Mi Tienda</router-link>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
body {
  background-color: var(--color-white);
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

* {
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
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
  padding: 0 1rem;
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
}

@media (max-width: 768px) {
  .nav-container {
    height: 56px;
  }
}
</style>
