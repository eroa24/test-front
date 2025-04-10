import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProductService } from '../products'
import api from '../../config'

vi.mock('../../config', () => ({
  default: {
    get: vi.fn(),
  },
}))

describe('ProductService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('obtiene la lista de productos correctamente', async () => {
    const mockProducts = [
      {
        id: '1',
        name: 'Producto 1',
        description: 'Descripción del producto 1',
        price: 100000,
        stock: 10,
        isActive: true,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        images: [
          {
            id: 'img1',
            url: 'https://example.com/image1.jpg',
            alt: 'Imagen 1',
            order: 1,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
        ],
      },
      {
        id: '2',
        name: 'Producto 2',
        description: 'Descripción del producto 2',
        price: 200000,
        stock: 20,
        isActive: true,
        createdAt: '2023-01-02T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
        images: [
          {
            id: 'img2',
            url: 'https://example.com/image2.jpg',
            alt: 'Imagen 2',
            order: 1,
            createdAt: '2023-01-02T00:00:00.000Z',
            updatedAt: '2023-01-02T00:00:00.000Z',
          },
        ],
      },
    ]

    const mockApiResponse = {
      success: true,
      data: {
        items: mockProducts,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      metadata: {
        timestamp: '2023-01-01T00:00:00.000Z',
        path: '/products',
        method: 'GET',
      },
    }

    ;(api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockApiResponse,
    })

    const products = await ProductService.getProducts()

    expect(api.get).toHaveBeenCalledWith('/products')

    expect(products).toEqual(mockProducts)
    expect(products.length).toBe(2)
    expect(products[0].id).toBe('1')
    expect(products[1].id).toBe('2')
  })

  it('maneja errores correctamente', async () => {
    const errorMessage = 'Error al obtener productos'
    ;(api.get as unknown as ReturnType<typeof vi.fn>).mockRejectedValue({
      response: {
        data: {
          message: errorMessage,
        },
      },
    })

    await expect(ProductService.getProducts()).rejects.toThrow()
  })

  it('devuelve un array vacío cuando la API devuelve una lista vacía', async () => {
    const mockApiResponse = {
      success: true,
      data: {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
      metadata: {
        timestamp: '2023-01-01T00:00:00.000Z',
        path: '/products',
        method: 'GET',
      },
    }

    ;(api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockApiResponse,
    })

    const products = await ProductService.getProducts()

    expect(products).toEqual([])
    expect(products.length).toBe(0)
  })
})
