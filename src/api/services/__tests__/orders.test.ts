import { describe, it, expect, vi, beforeEach } from 'vitest'
import { OrderService } from '../orders'
import api from '../../config'

// Mock de la API
vi.mock('../../config', () => ({
  default: {
    get: vi.fn(),
  },
}))

describe('OrderService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getOrdersByEmail', () => {
    it('obtiene las órdenes por email correctamente', async () => {
      // Datos de prueba
      const email = 'test@example.com'

      // Respuesta de la API
      const mockApiResponse = {
        success: true,
        data: [
          {
            id: 'ORDER-123',
            total: 248000,
            paymentId: 'PAY-123',
            status: 'COMPLETED',
            createdAt: '2023-01-01T00:00:00.000Z',
            lastFour: '1111',
            tax: 38000,
            transactionProducts: [
              {
                id: 'PROD-123',
                quantity: 2,
                unitPrice: 100000,
                product: {
                  id: 'PROD-123',
                  name: 'Test Product',
                  description: 'Test Description',
                  price: 100000,
                  stock: 10,
                  images: [
                    {
                      url: 'https://example.com/image.jpg',
                      alt: 'Test Image',
                    },
                  ],
                },
              },
            ],
          },
        ],
        metadata: {
          timestamp: '2023-01-01T00:00:00.000Z',
          path: `/transactions/${email}`,
          method: 'GET',
        },
      }

      // Configurar el mock para devolver la respuesta
      ;(api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockApiResponse,
      })

      // Llamar al servicio
      const response = await OrderService.getOrdersByEmail(email)

      // Verificar que se llamó a la API con los parámetros correctos
      expect(api.get).toHaveBeenCalledWith(`/transactions/${email}`)

      // Verificar que se devolvió la respuesta correctamente
      expect(response).toEqual(mockApiResponse)
      expect(response.data).toHaveLength(1)
      expect(response.data[0].id).toBe('ORDER-123')
      expect(response.data[0].status).toBe('COMPLETED')
      expect(response.data[0].transactionProducts).toHaveLength(1)
      expect(response.data[0].transactionProducts[0].product.name).toBe('Test Product')
    })

    it('maneja el caso de no tener órdenes', async () => {
      // Datos de prueba
      const email = 'test@example.com'

      // Respuesta de la API con lista vacía
      const mockApiResponse = {
        success: true,
        data: [],
        metadata: {
          timestamp: '2023-01-01T00:00:00.000Z',
          path: `/transactions/${email}`,
          method: 'GET',
        },
      }

      // Configurar el mock para devolver la respuesta
      ;(api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockApiResponse,
      })

      // Llamar al servicio
      const response = await OrderService.getOrdersByEmail(email)

      // Verificar que se devolvió una lista vacía
      expect(response.data).toHaveLength(0)
    })

    it('maneja errores correctamente', async () => {
      // Datos de prueba
      const email = 'test@example.com'

      // Configurar el mock para simular un error
      const errorMessage = 'Error al obtener las órdenes'
      ;(api.get as unknown as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: {
          data: {
            message: errorMessage,
          },
        },
      })

      // Llamar al servicio y verificar que se lanza el error
      await expect(OrderService.getOrdersByEmail(email)).rejects.toThrow()
    })
  })
})
