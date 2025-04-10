import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import FinalStatusView from '../FinalStatusView.vue'
import Button from '../../../components/ui/Button.vue'
import { TransactionService } from '../../../api/services/transactions'

vi.mock('../../../api/services/transactions', () => ({
  TransactionService: {
    getTransactionStatus: vi.fn(),
  },
}))

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/products',
      name: 'products',
      component: {},
    },
  ],
})

router.push = vi.fn()

describe('FinalStatusView', () => {
  let wrapper: any

  beforeEach(async () => {
    vi.clearAllMocks()

    const mockGetTransactionStatus =
      TransactionService.getTransactionStatus as unknown as ReturnType<typeof vi.fn>
    mockGetTransactionStatus.mockResolvedValue({
      data: {
        status: 'COMPLETED',
        id: 'TRANS-123',
        date: '2024-04-10T12:00:00Z',
      },
    })

    wrapper = mount(FinalStatusView, {
      global: {
        plugins: [router],
        stubs: {
          Button,
        },
      },
      props: {
        transactionId: 'TRANS-123',
      },
    })
  })

  it('muestra el estado de carga inicialmente', async () => {
    const mockGetTransactionStatus =
      TransactionService.getTransactionStatus as unknown as ReturnType<typeof vi.fn>
    mockGetTransactionStatus.mockImplementation(() => new Promise(() => {}))

    wrapper = mount(FinalStatusView, {
      global: {
        plugins: [router],
        stubs: {
          Button,
        },
      },
      props: {
        transactionId: 'TRANS-123',
      },
    })

    const loading = wrapper.find('.loading')
    expect(loading.exists()).toBe(true)
    expect(loading.text()).toBe('Procesando pago...')
  })

  it('muestra el estado de éxito después de cargar', async () => {
    await vi.waitFor(() => {
      expect(wrapper.find('.loading').exists()).toBe(false)
    })

    const statusSuccess = wrapper.find('.status-success')
    expect(statusSuccess.exists()).toBe(true)

    const title = wrapper.find('.title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('¡Pago Exitoso!')
  })

  it('muestra el estado de error cuando falla la transacción', async () => {
    const mockGetTransactionStatus =
      TransactionService.getTransactionStatus as unknown as ReturnType<typeof vi.fn>
    mockGetTransactionStatus.mockRejectedValue(new Error('Error de transacción'))

    wrapper = mount(FinalStatusView, {
      global: {
        plugins: [router],
        stubs: {
          Button,
        },
      },
      props: {
        transactionId: 'TRANS-123',
      },
    })

    await vi.waitFor(() => {
      expect(wrapper.find('.loading').exists()).toBe(false)
    })

    const statusSuccess = wrapper.find('.status-success')
    expect(statusSuccess.exists()).toBe(false)

    const title = wrapper.find('.title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Pago Fallido')

    const errorMessage = wrapper.find('.error-message')
    expect(errorMessage.exists()).toBe(true)
    expect(errorMessage.text()).toBe('Error al obtener el estado de la transacción')
  })

  it('muestra el estado pendiente cuando la transacción está pendiente', async () => {
    const mockGetTransactionStatus =
      TransactionService.getTransactionStatus as unknown as ReturnType<typeof vi.fn>
    mockGetTransactionStatus.mockResolvedValue({
      data: {
        status: 'PENDING',
        id: 'TRANS-123',
        date: '2024-04-10T12:00:00Z',
      },
    })

    wrapper = mount(FinalStatusView, {
      global: {
        plugins: [router],
        stubs: {
          Button,
        },
      },
      props: {
        transactionId: 'TRANS-123',
      },
    })

    await vi.waitFor(() => {
      expect(wrapper.find('.loading').exists()).toBe(false)
    })

    const statusSuccess = wrapper.find('.status-success')
    expect(statusSuccess.exists()).toBe(true)

    const title = wrapper.find('.title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('¡Pago Exitoso!')
  })

  it('elimina los datos de pago del localStorage cuando la transacción es exitosa', async () => {
    await vi.waitFor(() => {
      expect(wrapper.find('.loading').exists()).toBe(false)
    })

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('paymentData')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('selectedProduct')
  })

  it('redirige a /products al hacer clic en Volver a Productos', async () => {
    await vi.waitFor(() => {
      expect(wrapper.find('.loading').exists()).toBe(false)
    })

    const button = wrapper.findComponent(Button)
    expect(button.exists()).toBe(true)
    await button.trigger('click')
    await wrapper.vm.$nextTick()

    expect(router.push).toHaveBeenCalledWith('/products')
  })

  it('muestra los detalles de la transacción', async () => {
    await vi.waitFor(() => {
      expect(wrapper.find('.loading').exists()).toBe(false)
    })

    const transactionDetails = wrapper.find('.transaction-details')
    expect(transactionDetails.exists()).toBe(true)

    const detailsText = transactionDetails.text()
    expect(detailsText).toMatch(/ID de Transacción:/)
    expect(detailsText).toMatch(/Fecha:/)
    expect(detailsText).toMatch(/April 10/)
  })
})
