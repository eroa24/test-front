<template>
  <div class="orders-list">
    <div v-if="orders.length === 0" class="no-orders">
      No se encontraron órdenes para este email
    </div>
    <div v-else class="orders-grid">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-status" :class="order.status.toLowerCase()">
            {{ order.delivery?.status }}
          </div>
          <div class="order-date">
            {{
              new Date(order.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            }}
          </div>
        </div>

        <div class="order-details">
          <div class="order-info">
            <p><strong>ID:</strong> {{ order.paymentId }}</p>
            <p><strong>Total:</strong> {{ formatPrice(order.total) }}</p>
            <p v-if="order.tax"><strong>Impuesto:</strong> {{ formatPrice(order.tax) }}</p>
          </div>

          <div v-if="order.transactionProducts.length > 0" class="products-list">
            <h4>Productos</h4>
            <div v-for="item in order.transactionProducts" :key="item.id" class="product-item">
              <div class="product-info">
                <p class="product-name">{{ item.product.name }}</p>
                <p class="product-quantity">Cantidad: {{ item.quantity }}</p>
                <p class="product-price">{{ formatPrice(item.unitPrice) }} c/u</p>
              </div>
            </div>
          </div>

          <div v-if="order.delivery" class="delivery-info">
            <h4>Información de Entrega</h4>
            <p><strong>Dirección:</strong> {{ order.delivery.deliveryAddress }}</p>
            <p><strong>Ciudad:</strong> {{ order.delivery.city }}</p>
            <p><strong>Código Postal:</strong> {{ order.delivery.postalCode }}</p>
            <p v-if="order.delivery.trackingNumber">
              <strong>Número de Seguimiento:</strong> {{ order.delivery.trackingNumber }}
            </p>
            <p v-if="order.delivery.estimatedDeliveryDate">
              <strong>Fecha Estimada de Entrega:</strong>
              {{
                new Date(order.delivery.estimatedDeliveryDate).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Order } from '../../api/services/orders'

defineProps<{
  orders: Order[]
}>()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price)
}
</script>

<style scoped>
.orders-list {
  margin-top: 2rem;
  width: 100%;
  max-height: 600px;
  overflow-y: auto;
}

.orders-grid {
  display: grid;
  gap: 1rem;
}

.order-card {
  background-color: white;
  border-radius: var(--border-radius-md);
  padding: 1rem;
  box-shadow: var(--shadow-sm);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: var(--font-size-sm);
}

.order-status.pending {
  background-color: #fff3cd;
  color: #856404;
}

.order-status.completed {
  background-color: #d4edda;
  color: #155724;
}

.order-status.failed {
  background-color: #f8d7da;
  color: #721c24;
}

.order-date {
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.order-info p {
  margin: 0.5rem 0;
  font-size: var(--font-size-base);
}

.products-list,
.delivery-info {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.products-list h4,
.delivery-info h4 {
  margin: 0 0 1rem 0;
  color: var(--color-dark);
}

.product-item {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  background-color: var(--color-light);
  border-radius: var(--border-radius-sm);
  margin-bottom: 0.5rem;
}

.product-info {
  flex: 1;
}

.product-name {
  font-weight: 500;
  margin: 0 0 0.25rem 0;
}

.product-quantity,
.product-price {
  font-size: var(--font-size-sm);
  margin: 0;
  color: var(--color-text);
}

.delivery-info p {
  margin: 0.5rem 0;
  font-size: var(--font-size-base);
}

.no-orders {
  text-align: center;
  padding: 2rem;
  color: var(--color-text);
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 768px) {
  .orders-list {
    max-height: 500px;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .product-item {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .orders-list {
    max-height: 400px;
  }

  .order-card {
    padding: 0.75rem;
  }
}
</style>
