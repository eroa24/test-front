import { createRouter, createWebHistory } from 'vue-router'
import ProductosView from '../views/ProductosView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/productos',
    },
    {
      path: '/productos',
      name: 'productos',
      component: ProductosView,
    },
  ],
})

export default router
