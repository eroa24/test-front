import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import OrdersView from '../OrdersView.vue'
import Button from '../../../components/ui/Button.vue'
import Loading from '../../../components/ui/Loading.vue'
import Notification from '../../../components/ui/Notification.vue'
import OrderList from '../../../components/orders/OrderList.vue'
import { OrderService } from '../../../api/services/orders'
import type { Order } from '../../../api/services/orders'

vi.mock('../../../api/services/orders', () => ({
  OrderService: {
    getOrdersByEmail: vi.fn(),
  },
}))

const mockOrders: Order[] = [
  {
    id: '1',
    status: 'pending',
    total: 100,
    paymentId: 'pay_123',
    lastFour: '1234',
    tax: 10,
    createdAt: '2024-04-10',
    transactionProducts: [
      {
        id: '1',
        quantity: 1,
        unitPrice: 100,
        product: {
          id: '1',
          name: 'Producto 1',
          description: 'Descripción 1',
          price: 100,
          stock: 10,
          images: [{ url: 'image1.jpg', alt: 'Producto 1' }],
        },
      },
    ],
  },
  {
    id: '2',
    status: 'completed',
    total: 200,
    paymentId: 'pay_456',
    lastFour: '5678',
    tax: 20,
    createdAt: '2024-04-09',
    transactionProducts: [
      {
        id: '2',
        quantity: 2,
        unitPrice: 100,
        product: {
          id: '2',
          name: 'Producto 2',
          description: 'Descripción 2',
          price: 100,
          stock: 5,
          images: [{ url: 'image2.jpg', alt: 'Producto 2' }],
        },
      },
    ],
  },
]

describe('OrdersView', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(OrdersView, {
      global: {
        stubs: {
          Button,
          Loading,
          Notification,
          OrderList,
        },
      },
    })
  })

  it('renderiza correctamente el título', () => {
    expect(wrapper.find('.title').text()).toBe('Órdenes')
  })

  it('renderiza el campo de email', () => {
    const emailInput = wrapper.find('input[type="email"]')
    expect(emailInput.exists()).toBe(true)
    expect(emailInput.attributes('placeholder')).toBe('Ingresa tu correo electrónico')
  })

  it('muestra error cuando el email es inválido', async () => {
    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('invalid-email')

    const searchButton = wrapper.findComponent(Button)
    await searchButton.trigger('click')

    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.error-message').text()).toBe('Por favor ingresa un email válido')
  })

  it('busca órdenes cuando el email es válido', async () => {
    vi.mocked(OrderService.getOrdersByEmail).mockResolvedValue({
      data: mockOrders,
      success: true,
      metadata: {
        timestamp: '2024-04-10T12:00:00Z',
        path: '/transactions/test@example.com',
        method: 'GET',
      },
    })

    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('test@example.com')

    const searchButton = wrapper.findComponent(Button)
    await searchButton.trigger('click')

    expect(OrderService.getOrdersByEmail).toHaveBeenCalledWith('test@example.com')
    expect(wrapper.findComponent(OrderList).exists()).toBe(true)
  })

  it('muestra el componente de carga mientras busca órdenes', async () => {
    vi.mocked(OrderService.getOrdersByEmail).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    )

    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('test@example.com')

    const searchButton = wrapper.findComponent(Button)
    await searchButton.trigger('click')

    expect(wrapper.findComponent(Loading).exists()).toBe(true)
  })

  it('muestra un mensaje de error cuando falla la búsqueda', async () => {
    vi.mocked(OrderService.getOrdersByEmail).mockRejectedValue(new Error('Error de red'))

    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('test@example.com')

    const searchButton = wrapper.findComponent(Button)
    await searchButton.trigger('click')

    expect(wrapper.findComponent(Notification).exists()).toBe(true)
    expect(wrapper.findComponent(Notification).props('message')).toBe(
      'Error al buscar las órdenes. Por favor intenta de nuevo.',
    )
  })

  it('deshabilita el botón de búsqueda cuando el email está vacío', () => {
    const searchButton = wrapper.findComponent(Button)
    expect(searchButton.props('disabled')).toBe(true)
  })

  it('habilita el botón de búsqueda cuando el email es válido', async () => {
    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('test@example.com')

    const searchButton = wrapper.findComponent(Button)
    expect(searchButton.props('disabled')).toBe(false)
  })

  it('limpia el error cuando se cierra la notificación', async () => {
    vi.mocked(OrderService.getOrdersByEmail).mockRejectedValue(new Error('Error de red'))

    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('test@example.com')

    const searchButton = wrapper.findComponent(Button)
    await searchButton.trigger('click')

    await wrapper.findComponent(Notification).vm.$emit('close')

    expect(wrapper.findComponent(Notification).exists()).toBe(false)
  })
})
