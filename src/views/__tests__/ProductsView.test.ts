import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createStore } from 'vuex'
import ProductsView from '../ProductsView.vue'
import Card from '../../components/ui/Card.vue'
import Button from '../../components/ui/Button.vue'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

const mockProducts = [
  {
    id: '1',
    name: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 100000,
    stock: 10,
    images: [{ url: '/images/product1.jpg' }],
  },
  {
    id: '2',
    name: 'Producto 2',
    description: 'Descripción del producto 2',
    price: 200000,
    stock: 5,
    images: [{ url: '/images/product2.jpg' }],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/payment/card/:productId',
      name: 'payment-card',
      component: {},
    },
  ],
})

router.push = vi.fn()

interface State {
  products: typeof mockProducts
  loading: boolean
  error: string | null
}

const mockFetchProducts = vi.fn()
const store = createStore({
  state: {
    products: mockProducts,
    loading: false,
    error: null,
  } as State,
  getters: {
    getProducts: (state: State) => state.products,
    isLoading: (state: State) => state.loading,
    getError: (state: State) => state.error,
  },
  actions: {
    fetchProducts: mockFetchProducts,
  },
})

describe('ProductsView', () => {
  let wrapper: any

  beforeEach(async () => {
    vi.clearAllMocks()

    wrapper = mount(ProductsView, {
      global: {
        plugins: [router, store],
        stubs: {
          Card,
          Button,
        },
      },
    })

    await wrapper.vm.$nextTick()
  })

  it('renderiza correctamente el título', () => {
    const title = wrapper.find('h1')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Productos')
  })

  it('renderiza la lista de productos', () => {
    const cards = wrapper.findAllComponents(Card)
    expect(cards).toHaveLength(2)
  })

  it('pasa las propiedades correctas a los componentes Card', () => {
    const firstCard = wrapper.findAllComponents(Card)[0]
    expect(firstCard.props('title')).toBe('Producto 1')
    expect(firstCard.props('description')).toBe('Descripción del producto 1')
    expect(firstCard.props('price')).toBe(100000)
    expect(firstCard.props('imageUrl')).toBe('/images/product1.jpg')
  })

  it('guarda el producto en localStorage y redirige al hacer clic en Add to cart', async () => {
    const firstButton = wrapper.findAllComponents(Button)[0]
    expect(firstButton.exists()).toBe(true)
    await firstButton.trigger('click')
    await wrapper.vm.$nextTick()

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'selectedProduct',
      JSON.stringify({
        id: '1',
        name: 'Producto 1',
        description: 'Descripción del producto 1',
        price: 100000,
        stock: 10,
        image: '/images/product1.jpg',
      }),
    )

    expect(router.push).toHaveBeenCalledWith('/payment/card/1')
  })

  it('carga los productos al montar el componente', () => {
    expect(mockFetchProducts).toHaveBeenCalled()
  })
})
