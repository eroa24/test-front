import api from '../config'

export interface OrderProduct {
  id: string
  quantity: number
  unitPrice: number
  product: {
    id: string
    name: string
    description: string
    price: number
    stock: number
    images: Array<{
      url: string
      alt: string
    }>
  }
}

export interface Order {
  id: string
  total: number
  paymentId: string
  status: string
  createdAt: string
  lastFour: string | null
  tax: number | null
  transactionProducts: OrderProduct[]
}

export interface OrdersResponse {
  success: boolean
  data: Order[]
  metadata: {
    timestamp: string
    path: string
    method: string
  }
}

export const OrderService = {
  getOrdersByEmail: async (email: string): Promise<OrdersResponse> => {
    const response = await api.get<OrdersResponse>(`/transactions/${email}`)
    return response.data
  },
}
