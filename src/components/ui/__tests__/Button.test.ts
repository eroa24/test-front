import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../Button.vue'

describe('Button', () => {
  it('renderiza correctamente con la variante por defecto', () => {
    const wrapper = mount(Button)
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button.button--primary').exists()).toBe(true)
  })

  it('renderiza correctamente con diferentes variantes', () => {
    const variants = ['primary', 'secondary'] as const
    variants.forEach((variant) => {
      const wrapper = mount(Button, {
        props: { variant },
      })
      expect(wrapper.find(`button.button--${variant}`).exists()).toBe(true)
    })
  })

  it('renderiza correctamente con diferentes tamaños', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    sizes.forEach((size) => {
      const wrapper = mount(Button, {
        props: { size },
      })
      expect(wrapper.find(`button.button--${size}`).exists()).toBe(true)
    })
  })

  it('renderiza correctamente con el texto', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Test Button' },
    })
    expect(wrapper.text()).toBe('Test Button')
  })

  it('renderiza correctamente como bloque', () => {
    const wrapper = mount(Button, {
      props: { block: true },
    })
    expect(wrapper.find('button.button--block').exists()).toBe(true)
  })

  it('renderiza correctamente deshabilitado', () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
    })
    expect(wrapper.find('button[disabled]').exists()).toBe(true)
  })

  it('emite el evento click cuando se hace clic', async () => {
    const wrapper = mount(Button)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
