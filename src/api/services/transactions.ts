import api from '../config'

export interface TransactionData {
  productId: string
  quantity: number
  cardData: {
    cardNumber: string
    expiryDate: string
    cvc: string
    cardName: string
    installments: string
    termsAccepted: boolean
    dataProcessingAccepted: boolean
  }
  deliveryData: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    deliveryInstructions?: string
  }
  amount: {
    subtotal: number
    tax: number
    shipping: number
    total: number
  }
}

export interface TransactionResponse {
  success: boolean
  data: {
    id: string
    status: 'PENDING' | 'COMPLETED' | 'FAILED'
    createdAt: string
    updatedAt: string
  }
  metadata: {
    timestamp: string
    path: string
    method: string
  }
}

export const TransactionService = {
  createTransaction: async (transactionData: TransactionData): Promise<TransactionResponse> => {
    const response = await api.post<TransactionResponse>('/transactions', transactionData)
    return response.data
  },

  getTransactionStatus: async (transactionId: string): Promise<TransactionResponse> => {
    const response = await api.get<TransactionResponse>(`/transactions/id/${transactionId}`)
    return response.data
  },
}
