<template>
  <div class="productos">
    <h1>Productos</h1>

    <div class="products-container">
      <div class="products-grid">
        <div class="card-wrapper" v-for="product in products" :key="product.id">
          <Card
            :title="product.name"
            :description="product.description"
            :price="product.price"
            :imageUrl="getProductImage(product)"
          >
            <template #footer>
              <Button variant="primary" size="sm" @click="gotoPayment(product.id)"
                >Add to cart</Button
              >
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
// @ts-ignore
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  images?: Array<{
    url: string
    alt: string
  }>
}

const router = useRouter()
const store = useStore()

const products = computed<Product[]>(() => store.getters.getProducts)
const loading = computed(() => store.getters.isLoading)
const error = computed(() => store.getters.getError)

const getProductImage = (product: Product) => {
  return product.images?.[0]?.url || '/images/not_image.jpg'
}

onMounted(async () => {
  await store.dispatch('fetchProducts')
})

const gotoPayment = (productId: string) => {
  const product = products.value.find((p: Product) => p.id === productId)
  if (product) {
    localStorage.setItem(
      'selectedProduct',
      JSON.stringify({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: getProductImage(product),
      }),
    )
    router.push(`/payment/card/${productId}`)
  }
}
</script>

<style scoped>
.productos {
  background-color: var(--color-white);
}

h1 {
  color: var(--color-dark);
  margin: 1rem 0;
  text-align: center;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  width: 100%;
  border-radius: 10px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

@media (max-width: 768px) {
  .products-grid {
    gap: 2rem;
  }
}

@media (min-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  h1 {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .productos {
    background-color: var(--color-white);
  }
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1440px) {
  .productos {
    overflow-x: hidden;
    background-color: var(--color-white);
    padding: 0 50px;
  }
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
