import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TransactionService } from '../transactions'
import api from '../../config'

// Mock de la API
vi.mock('../../config', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

describe('TransactionService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createTransaction', () => {
    it('crea una transacción correctamente', async () => {
      // Datos de prueba
      const mockTransactionData = {
        productId: '123',
        quantity: 2,
        cardData: {
          cardNumber: '4111111111111111',
          expiryDate: '12/25',
          cvc: '123',
          cardName: 'John Doe',
          installments: '1',
          termsAccepted: true,
          dataProcessingAccepted: true,
        },
        deliveryData: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          address: 'Test Address',
          city: 'Test City',
          postalCode: '12345',
          deliveryInstructions: 'Test Instructions',
        },
        amount: {
          subtotal: 200000,
          tax: 38000,
          shipping: 10000,
          total: 248000,
        },
      }

      // Respuesta de la API
      const mockApiResponse = {
        success: true,
        data: {
          transactionId: 'TRANS-123',
          status: 'PENDING',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        metadata: {
          timestamp: '2023-01-01T00:00:00.000Z',
          path: '/transactions',
          method: 'POST',
        },
      }

      // Configurar el mock para devolver la respuesta
      ;(api.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockApiResponse,
      })

      // Llamar al servicio
      const response = await TransactionService.createTransaction(mockTransactionData)

      // Verificar que se llamó a la API con los parámetros correctos
      expect(api.post).toHaveBeenCalledWith('/transactions', mockTransactionData)

      // Verificar que se devolvió la respuesta correctamente
      expect(response).toEqual(mockApiResponse)
      expect(response.data.transactionId).toBe('TRANS-123')
      expect(response.data.status).toBe('PENDING')
    })

    it('maneja errores correctamente', async () => {
      // Datos de prueba
      const mockTransactionData = {
        productId: '123',
        quantity: 2,
        cardData: {
          cardNumber: '4111111111111111',
          expiryDate: '12/25',
          cvc: '123',
          cardName: 'John Doe',
          installments: '1',
          termsAccepted: true,
          dataProcessingAccepted: true,
        },
        deliveryData: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          address: 'Test Address',
          city: 'Test City',
          postalCode: '12345',
        },
        amount: {
          subtotal: 200000,
          tax: 38000,
          shipping: 10000,
          total: 248000,
        },
      }

      // Configurar el mock para simular un error
      const errorMessage = 'Error al crear la transacción'
      ;(api.post as unknown as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: {
          data: {
            message: errorMessage,
          },
        },
      })

      // Llamar al servicio y verificar que se lanza el error
      await expect(TransactionService.createTransaction(mockTransactionData)).rejects.toThrow()
    })
  })

  describe('getTransactionStatus', () => {
    it('obtiene el estado de una transacción correctamente', async () => {
      // Datos de prueba
      const transactionId = 'TRANS-123'

      // Respuesta de la API
      const mockApiResponse = {
        success: true,
        data: {
          transactionId: 'TRANS-123',
          status: 'COMPLETED',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        metadata: {
          timestamp: '2023-01-01T00:00:00.000Z',
          path: `/transactions/id/${transactionId}`,
          method: 'GET',
        },
      }

      // Configurar el mock para devolver la respuesta
      ;(api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockApiResponse,
      })

      // Llamar al servicio
      const response = await TransactionService.getTransactionStatus(transactionId)

      // Verificar que se llamó a la API con los parámetros correctos
      expect(api.get).toHaveBeenCalledWith(`/transactions/id/${transactionId}`)

      // Verificar que se devolvió la respuesta correctamente
      expect(response).toEqual(mockApiResponse)
      expect(response.data.transactionId).toBe('TRANS-123')
      expect(response.data.status).toBe('COMPLETED')
    })

    it('maneja errores correctamente', async () => {
      // Datos de prueba
      const transactionId = 'TRANS-123'

      // Configurar el mock para simular un error
      const errorMessage = 'Error al obtener el estado de la transacción'
      ;(api.get as unknown as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: {
          data: {
            message: errorMessage,
          },
        },
      })

      // Llamar al servicio y verificar que se lanza el error
      await expect(TransactionService.getTransactionStatus(transactionId)).rejects.toThrow()
    })

    it('maneja diferentes estados de transacción', async () => {
      // Datos de prueba
      const transactionId = 'TRANS-123'
      const statuses = ['PENDING', 'COMPLETED', 'FAILED']

      // Probar cada estado
      for (const status of statuses) {
        // Respuesta de la API
        const mockApiResponse = {
          success: true,
          data: {
            transactionId: 'TRANS-123',
            status: status,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
          metadata: {
            timestamp: '2023-01-01T00:00:00.000Z',
            path: `/transactions/id/${transactionId}`,
            method: 'GET',
          },
        }

        // Configurar el mock para devolver la respuesta
        ;(api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
          data: mockApiResponse,
        })

        // Llamar al servicio
        const response = await TransactionService.getTransactionStatus(transactionId)

        // Verificar que se devolvió la respuesta correctamente
        expect(response.data.status).toBe(status)
      }
    })
  })
})
