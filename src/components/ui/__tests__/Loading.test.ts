import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Loading from '../Loading.vue'

describe('Loading', () => {
  it('no se muestra cuando show es false', () => {
    const wrapper = mount(Loading, {
      props: {
        show: false,
      },
    })

    expect(wrapper.find('.loading-overlay').exists()).toBe(false)
  })

  it('se muestra cuando show es true', () => {
    const wrapper = mount(Loading, {
      props: {
        show: true,
      },
    })

    expect(wrapper.find('.loading-overlay').exists()).toBe(true)
    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
  })

  it('tiene la estructura correcta del DOM', () => {
    const wrapper = mount(Loading, {
      props: {
        show: true,
      },
    })

    const overlay = wrapper.find('.loading-overlay')
    const spinner = wrapper.find('.loading-spinner')

    expect(overlay.exists()).toBe(true)
    expect(spinner.exists()).toBe(true)
    expect(spinner.element.parentElement).toBe(overlay.element)
  })

  it('renderiza correctamente con el tamaño por defecto', () => {
    const wrapper = mount(Loading, {
      props: {
        show: true,
      },
    })
    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
  })

  it('renderiza correctamente con diferentes tamaños', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    sizes.forEach((size) => {
      const wrapper = mount(Loading, {
        props: {
          show: true,
          size,
        },
      })
      expect(wrapper.find('.loading-spinner').exists()).toBe(true)
    })
  })

  it('renderiza correctamente con el texto por defecto', () => {
    const wrapper = mount(Loading, {
      props: {
        show: true,
      },
    })
    expect(wrapper.find('.loading-overlay').exists()).toBe(true)
  })

  it('renderiza correctamente con texto personalizado', () => {
    const wrapper = mount(Loading, {
      props: {
        show: true,
        text: 'Cargando datos...',
      },
    })
    expect(wrapper.find('.loading-overlay').exists()).toBe(true)
  })
})
