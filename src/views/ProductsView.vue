<template>
  <div class="productos">
    <h1>Productos</h1>

    <div class="products-grid">
      <div class="card-wrapper" v-for="product in products" :key="product.id">
        <Card
          :title="product.name"
          :description="product.description"
          :price="product.price"
          :imageUrl="product.image"
        >
          <template #footer>
            <Button variant="primary" size="sm" @click="irAPago(product.id)">Agregar</Button>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'

const router = useRouter()

const products = ref([
  {
    id: 1,
    name: 'Producto 1',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    price: 150000,
    image: 'https://picsum.photos/500/300?random=1',
  },
  {
    id: 2,
    name: 'Producto 2',
    description: 'Dolorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    price: 250000,
    image: 'https://picsum.photos/500/300?random=2',
  },
  {
    id: 3,
    name: 'Producto 3',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    price: 350000,
    image: 'https://picsum.photos/500/300?random=3',
  },
  {
    id: 4,
    name: 'Producto 4',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    price: 450000,
    image: 'https://picsum.photos/500/300?random=4',
  },
])

const irAPago = (productId: number) => {
  router.push(`/payment/card/${productId}`)
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
