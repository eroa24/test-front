import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import SummaryView from '../SummaryView.vue'
import Button from '../../../components/ui/Button.vue'
import Notification from '../../../components/ui/Notification.vue'
import Loading from '../../../components/ui/Loading.vue'
import { TransactionService } from '../../../api/services/transactions'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

vi.mock('../../../api/services/transactions', () => ({
  TransactionService: {
    createTransaction: vi.fn(),
  },
}))

const mockProduct = {
  id: '123',
  name: 'Test Product',
  description: 'Test Description',
  price: 100000,
  stock: 10,
  image: 'test-image.jpg',
}

const mockPaymentData = {
  cardData: {
    cardNumber: '4111111111111111',
    cardName: 'John Doe',
    expiryDate: '12/25',
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
  quantity: 2,
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/products',
      name: 'products',
      component: { template: '<div>Products</div>' },
    },
    {
      path: '/payment/card/:productId',
      name: 'card-payment',
      component: { template: '<div>Card Payment</div>' },
    },
    {
      path: '/payment/status/:transactionId',
      name: 'payment-status',
      component: { template: '<div>Payment Status</div>' },
    },
  ],
})

router.push = vi.fn()

describe('SummaryView', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'selectedProduct') return JSON.stringify(mockProduct)
      if (key === 'paymentData') return JSON.stringify(mockPaymentData)
      return null
    })
    ;(
      TransactionService.createTransaction as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      data: { id: 'TRANS-123' },
    })

    router.currentRoute.value = {
      params: { productId: '123' },
      path: '/payment/summary/123',
    } as any
  })

  it('renderiza el título correctamente', () => {
    wrapper = mount(SummaryView, {
      global: {
        plugins: [router],
        stubs: {
          Button,
          Notification,
          Loading,
        },
      },
    })
    expect(wrapper.find('.title').text()).toBe('Summary Payment')
  })

  it('carga el producto y los datos de pago desde localStorage', async () => {
    wrapper = mount(SummaryView, {
      global: {
        plugins: [router],
        stubs: {
          Button,
          Notification,
          Loading,
        },
      },
    })

    await wrapper.vm.$nextTick()

    expect(localStorageMock.getItem).toHaveBeenCalledWith('selectedProduct')
    expect(localStorageMock.getItem).toHaveBeenCalledWith('paymentData')

    expect(wrapper.vm.product).toEqual(mockProduct)

    expect(wrapper.vm.paymentData).toEqual(mockPaymentData)

    const productSummary = wrapper.find('.product-summary')
    expect(productSummary.exists()).toBe(true)

    const productName = productSummary.find('h2')
    expect(productName.exists()).toBe(true)
    expect(productName.text()).toBe('Test Product')

    const cardInfo = wrapper.find('.card-info')
    expect(cardInfo.exists()).toBe(true)

    const deliveryInfo = wrapper.find('.delivery-info')
    expect(deliveryInfo.exists()).toBe(true)
  })

  it('calcula correctamente los totales', async () => {
    wrapper = mount(SummaryView, {
      global: {
        plugins: [router],
        stubs: {
          Button,
          Notification,
          Loading,
        },
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.subtotal).toBe(200000)
    expect(wrapper.vm.taxAmount).toBe(38000)
    expect(wrapper.vm.total).toBe(248000)

    const detailItems = wrapper.findAll('.detail-item')
    expect(detailItems.length).toBeGreaterThan(0)

    const subtotalText = detailItems[0].text()
    expect(subtotalText).toMatch(/Subtotal:.*200,000/)

    const taxText = detailItems[1].text()
    expect(taxText).toMatch(/Base Fee:.*38,000/)

    const shippingText = detailItems[2].text()
    expect(shippingText).toMatch(/Shipping Fee:.*10,000/)

    const totalText = detailItems[3].text()
    expect(totalText).toMatch(/Total:.*248,000/)
  })

  it('procesa el pago correctamente', async () => {
    wrapper = mount(SummaryView, {
      global: {
        plugins: [router],
        stubs: {
          Button,
          Notification,
          Loading,
        },
      },
    })

    await wrapper.vm.$nextTick()

    const payButton = wrapper.findAllComponents(Button)[1]
    expect(payButton.exists()).toBe(true)

    await payButton.trigger('click')

    expect(TransactionService.createTransaction).toHaveBeenCalledWith({
      productId: '123',
      quantity: 2,
      cardData: mockPaymentData.cardData,
      deliveryData: mockPaymentData.deliveryData,
      amount: {
        subtotal: 200000,
        tax: 38000,
        shipping: 10000,
        total: 248000,
      },
    })

    expect(router.push).toHaveBeenCalledWith('/payment/status/TRANS-123')
  })

  it('muestra un error si falla el procesamiento del pago', async () => {
    const errorMessage = 'Error al procesar el pago'
    ;(
      TransactionService.createTransaction as unknown as ReturnType<typeof vi.fn>
    ).mockRejectedValue({
      response: { data: { message: errorMessage } },
    })

    wrapper = mount(SummaryView, {
      global: {
        plugins: [router],
        stubs: {
          Button,
          Notification,
          Loading,
        },
      },
    })

    await wrapper.vm.$nextTick()

    const payButton = wrapper.findAllComponents(Button)[1]
    expect(payButton.exists()).toBe(true)

    await payButton.trigger('click')

    expect(wrapper.vm.showNotification).toBe(true)
    expect(wrapper.vm.notificationMessage).toBe(errorMessage)
  })
})
