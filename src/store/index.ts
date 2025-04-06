import { createStore } from 'vuex'

export interface State {
  product: {
    id: number
    name: string
    price: number
    stock: number
    description: string
  } | null
  transaction: {
    status: 'PENDING' | 'COMPLETED' | 'FAILED'
    amount: number
    cardInfo: any
    deliveryInfo: any
  } | null
}

export default createStore<State>({
  state: {
    product: null,
    transaction: null,
  },
  getters: {
    getProduct: (state) => state.product,
    getTransaction: (state) => state.transaction,
  },
  mutations: {
    setProduct(state, product) {
      state.product = product
    },
    setTransaction(state, transaction) {
      state.transaction = transaction
    },
  },
  actions: {
    // Las acciones se implementarán según se necesiten
  },
})
