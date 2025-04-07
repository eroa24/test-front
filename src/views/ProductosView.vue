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
            :imageUrl="product.image"
          >
            <template #footer>
              <Button variant="primary" size="sm">Agregar</Button>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'

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
</script>

<style scoped>
.productos {
  width: 100%;
  padding: clamp(1rem, 5vw, 2rem);
  background-color: #f8f9fa;
  box-sizing: border-box;
}

h1 {
  color: var(--color-dark);
  margin-bottom: 2rem;
  text-align: center;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
}

.products-container {
  width: 100%;
  max-width: 100%; /* Asegura que se use todo el ancho */
  margin: 0 auto;
}

.products-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  width: 100%;
}

.card-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

/* Tablet: 2 columnas */
@media (min-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1440px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
    padding: 0 2rem;
  }

  .card-wrapper {
    max-width: 100%;
  }
}
</style>
