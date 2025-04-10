import { createStore } from 'vuex'
import type { Product } from '@/api/services/products'
import { ProductService } from '@/api/services/products'

export interface State {
  products: Product[]
  loading: boolean
  error: string | null
}

export default createStore<State>({
  state: {
    products: [],
    loading: false,
    error: null,
  },

  getters: {
    getProducts: (state: State) => state.products,
    isLoading: (state: State) => state.loading,
    getError: (state: State) => state.error,
  },

  mutations: {
    setProducts(state: State, products: Product[]) {
      state.products = products
    },
    setLoading(state: State, loading: boolean) {
      state.loading = loading
    },
    setError(state: State, error: string | null) {
      state.error = error
    },
  },
  actions: {
    async fetchProducts({ commit }: { commit: Function }) {
      commit('setLoading', true)
      commit('setError', null)

      try {
        const products = await ProductService.getProducts()
        commit('setProducts', products)
      } catch (error) {
        commit('setError', 'Error al cargar los productos')
        console.error('Error fetching products:', error)
      } finally {
        commit('setLoading', false)
      }
    },
  },
})
