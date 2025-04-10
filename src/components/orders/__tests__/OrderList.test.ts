import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderList from '../OrderList.vue'
import type { Order } from '../../../api/services/orders'

describe('OrderList', () => {
  const mockOrders: Order[] = [
    {
      id: '1',
      paymentId: 'PAY-123',
      total: 150000,
      tax: 28500,
      status: 'COMPLETED',
      createdAt: '2024-04-10T10:00:00Z',
      lastFour: '1234',
      transactionProducts: [
        {
          id: '1',
          quantity: 2,
          unitPrice: 75000,
          product: {
            id: '1',
            name: 'Producto 1',
            description: 'Descripción del producto 1',
            price: 75000,
            stock: 10,
            images: [{ url: 'image1.jpg', alt: 'Producto 1' }],
          },
        },
      ],
    },
    {
      id: '2',
      paymentId: 'PAY-456',
      total: 200000,
      tax: 38000,
      status: 'PENDING',
      createdAt: '2024-04-09T15:30:00Z',
      lastFour: '5678',
      transactionProducts: [
        {
          id: '2',
          quantity: 1,
          unitPrice: 200000,
          product: {
            id: '2',
            name: 'Producto 2',
            description: 'Descripción del producto 2',
            price: 200000,
            stock: 5,
            images: [{ url: 'image2.jpg', alt: 'Producto 2' }],
          },
        },
      ],
    },
  ]

  it('muestra mensaje cuando no hay órdenes', () => {
    const wrapper = mount(OrderList, {
      props: {
        orders: [],
      },
    })

    expect(wrapper.find('.no-orders').exists()).toBe(true)
    expect(wrapper.find('.no-orders').text()).toBe('No se encontraron órdenes para este email')
    expect(wrapper.find('.orders-grid').exists()).toBe(false)
  })

  it('renderiza correctamente las órdenes', () => {
    const wrapper = mount(OrderList, {
      props: {
        orders: mockOrders,
      },
    })

    expect(wrapper.find('.no-orders').exists()).toBe(false)
    expect(wrapper.find('.orders-grid').exists()).toBe(true)
    expect(wrapper.findAll('.order-card')).toHaveLength(2)
  })

  it('formatea correctamente los precios', () => {
    const wrapper = mount(OrderList, {
      props: {
        orders: mockOrders,
      },
    })

    const firstOrder = wrapper.findAll('.order-card')[0]

    const orderInfoText = firstOrder.find('.order-info').text()
    expect(orderInfoText).toMatch(/Total:\s*\$\s*150\.000/)
    expect(orderInfoText).toMatch(/Impuesto:\s*\$\s*28\.500/)

    const productPriceText = firstOrder.find('.product-price').text()
    expect(productPriceText).toMatch(/\$\s*75\.000\s*c\/u/)
  })

  it('muestra correctamente los estados de las órdenes', () => {
    const wrapper = mount(OrderList, {
      props: {
        orders: mockOrders,
      },
    })

    const orders = wrapper.findAll('.order-card')
    expect(orders[0].find('.order-status').classes()).toContain('completed')
    expect(orders[1].find('.order-status').classes()).toContain('pending')
  })

  it('muestra correctamente la información de productos', () => {
    const wrapper = mount(OrderList, {
      props: {
        orders: mockOrders,
      },
    })

    const firstOrder = wrapper.findAll('.order-card')[0]
    const productInfo = firstOrder.find('.product-info')

    expect(productInfo.find('.product-name').text()).toBe('Producto 1')
    expect(productInfo.find('.product-quantity').text()).toBe('Cantidad: 2')

    const productPriceText = productInfo.find('.product-price').text()
    expect(productPriceText).toMatch(/\$\s*75\.000\s*c\/u/)
  })

  it('formatea correctamente las fechas', () => {
    const wrapper = mount(OrderList, {
      props: {
        orders: mockOrders,
      },
    })

    const firstOrder = wrapper.findAll('.order-card')[0]
    const orderDate = firstOrder.find('.order-date').text()

    expect(orderDate).toMatch(/\d{1,2} de \w+ de \d{4}/)
    expect(orderDate).toMatch(/\d{2}:\d{2}/)
  })
})
