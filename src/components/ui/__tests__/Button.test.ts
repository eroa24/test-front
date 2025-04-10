import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../Button.vue'

describe('Button', () => {
  it('renders properly', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'primary',
        size: 'md',
      },
      slots: {
        default: 'Click me',
      },
    })

    expect(wrapper.text()).toContain('Click me')
    expect(wrapper.classes()).toContain('button--primary')
    expect(wrapper.classes()).toContain('button--md')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('applies disabled state correctly', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('button--disabled')
  })

  it('applies block class when block prop is true', () => {
    const wrapper = mount(Button, {
      props: {
        block: true,
      },
    })

    expect(wrapper.classes()).toContain('button--block')
  })

  it('renders with secondary variant', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'secondary',
      },
    })

    expect(wrapper.classes()).toContain('button--secondary')
  })

  it('renders with different sizes', () => {
    const sizes = ['sm', 'md', 'lg']

    sizes.forEach((size) => {
      const wrapper = mount(Button, {
        props: { size },
      })
      expect(wrapper.classes()).toContain(`button--${size}`)
    })
  })
})
