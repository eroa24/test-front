import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import CreditCardView from '../CreditCardView.vue'
import Button from '../../../components/ui/Button.vue'
import Notification from '../../../components/ui/Notification.vue'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

const mockProduct = {
  id: '1',
  name: 'Producto Test',
  description: 'Descripción Test',
  price: 100,
  stock: 10,
  image: 'test-image.jpg',
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/products',
      name: 'products',
      component: {},
    },
    {
      path: '/payment/summary/:productId',
      name: 'summary',
      component: {},
    },
  ],
})

router.push = vi.fn()

const mockCardForm = {
  validateTerms: vi.fn().mockReturnValue(true),
  formData: {
    cardNumber: '4111111111111111',
    expiryDate: '12/25',
    cvc: '123',
    termsAccepted: true,
  },
}

const mockDeliveryForm = {
  formData: {
    fullName: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    address: 'Test Address',
    city: 'Test City',
    postalCode: '12345',
  },
}

describe('CreditCardView (Mock)', () => {
  let wrapper: any

  beforeEach(async () => {
    vi.clearAllMocks()

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'selectedProduct') {
        return JSON.stringify(mockProduct)
      }
      return null
    })

    wrapper = mount(CreditCardView, {
      global: {
        plugins: [router],
        stubs: {
          Button,
          CardPaymentForm: {
            template: '<div class="card-form"></div>',
            setup() {
              return {
                validateTerms: mockCardForm.validateTerms,
                formData: mockCardForm.formData,
              }
            },
          },
          DeliveryForm: {
            template: '<div class="delivery-form"></div>',
            setup() {
              return {
                formData: mockDeliveryForm.formData,
              }
            },
          },
          Notification,
        },
      },
      props: {
        productId: '1',
      },
    })
  }, 30000)

  it('renderiza correctamente el título', () => {
    const title = wrapper.find('.title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Payment Information')
  })

  it('carga el producto desde localStorage', () => {
    expect(localStorageMock.getItem).toHaveBeenCalledWith('selectedProduct')
  })

  it('redirige a /products si no hay producto seleccionado', async () => {
    localStorageMock.getItem.mockReturnValue(null)

    wrapper = mount(CreditCardView, {
      global: {
        plugins: [router],
        stubs: {
          Button,
          CardPaymentForm: {
            template: '<div class="card-form"></div>',
            setup() {
              return {
                validateTerms: mockCardForm.validateTerms,
                formData: mockCardForm.formData,
              }
            },
          },
          DeliveryForm: {
            template: '<div class="delivery-form"></div>',
            setup() {
              return {
                formData: mockDeliveryForm.formData,
              }
            },
          },
          Notification,
        },
      },
      props: {
        productId: '1',
      },
    })

    expect(router.push).toHaveBeenCalledWith('/products')
  })

  it('redirige a /products cuando se hace clic en Cancel', async () => {
    const cancelButton = wrapper.findAllComponents(Button)[0]
    expect(cancelButton.exists()).toBe(true)
    await cancelButton.trigger('click')
    expect(router.push).toHaveBeenCalledWith('/products')
  })

  it('guarda los datos de pago en localStorage antes de continuar', async () => {
    const continueButton = wrapper.findAllComponents(Button)[1]
    expect(continueButton.exists()).toBe(true)
    await continueButton.trigger('click')

    expect(localStorageMock.setItem).toHaveBeenCalledWith('paymentData', expect.any(String))
  })
})
