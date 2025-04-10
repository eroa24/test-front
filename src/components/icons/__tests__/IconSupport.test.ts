import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IconSupport from '../IconSupport.vue'

describe('IconSupport', () => {
  it('renderiza correctamente el icono', () => {
    const wrapper = mount(IconSupport)

    // Verificar que el elemento SVG existe
    expect(wrapper.find('svg').exists()).toBe(true)

    // Verificar atributos del SVG
    const svg = wrapper.find('svg')
    expect(svg.attributes('xmlns')).toBe('http://www.w3.org/2000/svg')
    expect(svg.attributes('width')).toBe('20')
    expect(svg.attributes('height')).toBe('20')
    expect(svg.attributes('fill')).toBe('currentColor')
  })

  it('tiene el path correcto', () => {
    const wrapper = mount(IconSupport)

    // Verificar que el elemento path existe
    expect(wrapper.find('path').exists()).toBe(true)

    // Verificar atributos del path
    const path = wrapper.find('path')
    expect(path.attributes('d')).toBe(
      'M10 3.22l-.61-.6a5.5 5.5 0 0 0-7.666.105 5.5 5.5 0 0 0-.114 7.665L10 18.78l8.39-8.4a5.5 5.5 0 0 0-.114-7.665 5.5 5.5 0 0 0-7.666-.105l-.61.61z',
    )
  })
})
