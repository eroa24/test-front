import api from '../config'

interface ProductImage {
  id: string
  url: string
  alt: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  images: ProductImage[]
}

interface ApiResponse {
  success: boolean
  data: {
    items: Product[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
  metadata: {
    timestamp: string
    path: string
    method: string
  }
}

export const ProductService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get<ApiResponse>('/products')
    return response.data.data.items
  },
}
