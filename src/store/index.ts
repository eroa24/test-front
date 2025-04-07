import { createStore } from 'vuex'

interface Product {
  id: number
  name: string
  price: number
  stock: number
  description: string
}

interface Transaction {
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  amount: number
  cardInfo: any
  deliveryInfo: any
}

export interface State {
  product: Product | null
  transaction: Transaction | null
}

export default createStore<State>({
  state: {
    product: null,
    transaction: null,
  },
  getters: {
    getProduct: (state: State) => state.product,
    getTransaction: (state: State) => state.transaction,
  },
  mutations: {
    setProduct(state: State, product: Product) {
      state.product = product
    },
    setTransaction(state: State, transaction: Transaction) {
      state.transaction = transaction
    },
  },
  actions: {},
  modules: {},
})
