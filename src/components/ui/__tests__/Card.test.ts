import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from '../Card.vue'

describe('Card', () => {
  const defaultProps = {
    title: 'Test Card',
    description: 'Test Description',
    imageUrl: 'https://example.com/image.jpg',
    imageAlt: 'Test Image',
    price: 100000,
    hover: true,
  }

  it('renderiza correctamente con todas las propiedades', () => {
    const wrapper = mount(Card, {
      props: defaultProps,
    })

    expect(wrapper.find('.card').exists()).toBe(true)
    expect(wrapper.find('.card-title').text()).toBe('Test Card')
    expect(wrapper.find('.card-description').text()).toBe('Test Description')
    expect(wrapper.find('.card-image img').attributes('src')).toBe('https://example.com/image.jpg')
    expect(wrapper.find('.card-image img').attributes('alt')).toBe('Test Image')
    expect(wrapper.find('.card-price').text()).toMatch(/^\$\s*100\.000$/)
  })

  it('aplica la clase card-hover cuando hover es true', () => {
    const wrapper = mount(Card, {
      props: {
        ...defaultProps,
        hover: true,
      },
    })
    expect(wrapper.find('.card-hover').exists()).toBe(true)
  })

  it('no aplica la clase card-hover cuando hover es false', () => {
    const wrapper = mount(Card, {
      props: {
        ...defaultProps,
        hover: false,
      },
    })
    expect(wrapper.find('.card-hover').exists()).toBe(false)
  })

  it('no muestra la imagen cuando imageUrl no está definida', () => {
    const wrapper = mount(Card, {
      props: {
        ...defaultProps,
        imageUrl: '',
      },
    })
    expect(wrapper.find('.card-image').exists()).toBe(false)
  })

  it('no muestra la descripción cuando description no está definida', () => {
    const wrapper = mount(Card, {
      props: {
        ...defaultProps,
        description: '',
      },
    })
    expect(wrapper.find('.card-description').exists()).toBe(false)
  })

  it('no muestra el precio cuando price es 0', () => {
    const wrapper = mount(Card, {
      props: {
        ...defaultProps,
        price: 0,
      },
    })
    expect(wrapper.find('.card-price').exists()).toBe(false)
  })

  it('renderiza el slot footer cuando está presente', () => {
    const wrapper = mount(Card, {
      props: defaultProps,
      slots: {
        footer: '<button>Test Button</button>',
      },
    })
    expect(wrapper.find('.card-footer').exists()).toBe(true)
    expect(wrapper.find('.card-footer button').exists()).toBe(true)
  })

  it('formatea el precio correctamente', () => {
    const wrapper = mount(Card, {
      props: {
        ...defaultProps,
        price: 1500000,
      },
    })
    expect(wrapper.find('.card-price').text()).toMatch(/^\$\s*1\.500\.000$/)
  })
})
