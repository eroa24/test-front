import { createRouter, createWebHistory } from 'vue-router'
import ProductsView from '../views/ProductsView.vue'
import CreditCardView from '../views/payments/CreditCardView.vue'
import SummaryView from '../views/payments/SummaryView.vue'
import FinalStatusView from '../views/payments/FinalStatusView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/products',
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView,
    },
    {
      path: '/payment/card/:productId',
      name: 'card',
      component: CreditCardView,
    },
    {
      path: '/payment/summary/:productId',
      name: 'summary',
      component: SummaryView,
    },
    {
      path: '/payment/status/:transactionId',
      name: 'status',
      component: FinalStatusView,
    },
  ],
})

export default router
