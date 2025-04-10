import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createStore } from 'vuex'
import ProductsView from '../ProductsView.vue'
import Card from '../../components/ui/Card.vue'
import Button from '../../components/ui/Button.vue'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  images: Array<{ url: string }>
}

interface StoreState {
  products: Product[]
  loading: boolean
  error: string | null
}

// Mock de productos
const mockProducts = [
  {
    id: '1',
    name: 'Producto 1',
    description: 'Descripción 1',
    price: 100,
    stock: 10,
    images: [{ url: 'image1.jpg' }],
  },
  {
    id: '2',
    name: 'Producto 2',
    description: 'Descripción 2',
    price: 200,
    stock: 5,
    images: [],
  },
]

// Crear store mock
const createMockStore = (initialState = {}) => {
  const fetchProductsSpy = vi.fn()
  return {
    store: createStore({
      state: {
        products: mockProducts,
        loading: false,
        error: null,
        ...initialState,
      } as StoreState,
      getters: {
        getProducts: (state: StoreState) => state.products,
        isLoading: (state: StoreState) => state.loading,
        getError: (state: StoreState) => state.error,
      },
      actions: {
        fetchProducts: fetchProductsSpy,
      },
    }),
    fetchProductsSpy,
  }
}

// Crear router mock
const createMockRouter = () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'home',
        component: {},
      },
      {
        path: '/payment/card/:id',
        name: 'payment',
        component: {},
      },
    ],
  })

  // Mock de router.push para evitar la navegación real
  router.push = vi.fn()

  return router
}

describe('ProductsView', () => {
  let wrapper: any
  let store: any
  let router: any
  let fetchProductsSpy: any

  beforeEach(async () => {
    // Configurar el timeout para el beforeEach
    vi.setConfig({ testTimeout: 5000 })

    const storeResult = createMockStore()
    store = storeResult.store
    fetchProductsSpy = storeResult.fetchProductsSpy
    router = createMockRouter()

    // No esperamos a que el router esté listo, ya que estamos usando un mock
    wrapper = mount(ProductsView, {
      global: {
        plugins: [store, router],
        stubs: {
          Card,
          Button,
        },
      },
    })
  })

  it('renderiza correctamente el título', () => {
    expect(wrapper.find('h1').text()).toBe('Productos')
  })

  it('renderiza la lista de productos', () => {
    const cards = wrapper.findAllComponents(Card)
    expect(cards).toHaveLength(mockProducts.length)
  })

  it('muestra la imagen por defecto cuando no hay imágenes', () => {
    const cards = wrapper.findAllComponents(Card)
    const secondCard = cards[1]
    expect(secondCard.props('imageUrl')).toBe('/images/not_image.jpg')
  })

  it('muestra la primera imagen del producto cuando está disponible', () => {
    const cards = wrapper.findAllComponents(Card)
    const firstCard = cards[0]
    expect(firstCard.props('imageUrl')).toBe('image1.jpg')
  })

  it('navega a la página de pago al hacer clic en Add to cart', async () => {
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    })

    const buttons = wrapper.findAllComponents(Button)
    await buttons[0].trigger('click')

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'selectedProduct',
      JSON.stringify({
        id: mockProducts[0].id,
        name: mockProducts[0].name,
        description: mockProducts[0].description,
        price: mockProducts[0].price,
        stock: mockProducts[0].stock,
        image: mockProducts[0].images[0].url,
      }),
    )

    // Verificar que se llamó a router.push con la ruta correcta
    expect(router.push).toHaveBeenCalledWith(`/payment/card/${mockProducts[0].id}`)
  })

  it('carga los productos al montar el componente', () => {
    expect(fetchProductsSpy).toHaveBeenCalled()
  })

  it('muestra el estado de carga', async () => {
    const storeResult = createMockStore({ loading: true })
    store = storeResult.store
    wrapper = mount(ProductsView, {
      global: {
        plugins: [store, router],
        stubs: {
          Card,
          Button,
        },
      },
    })

    expect(wrapper.vm.loading).toBe(true)
  })

  it('muestra el error cuando ocurre', async () => {
    const errorMessage = 'Error al cargar productos'
    const storeResult = createMockStore({ error: errorMessage })
    store = storeResult.store
    wrapper = mount(ProductsView, {
      global: {
        plugins: [store, router],
        stubs: {
          Card,
          Button,
        },
      },
    })

    expect(wrapper.vm.error).toBe(errorMessage)
  })
})
