import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextField from '../TextField.vue'

describe('TextField', () => {
  const defaultProps = {
    modelValue: 'test value',
    label: 'Test Label',
    placeholder: 'Test Placeholder',
    type: 'text' as const,
    error: '',
    success: '',
    hint: 'Test Hint',
    disabled: false,
    required: false,
    id: 'test-id',
  }

  it('renderiza correctamente con todas las propiedades', () => {
    const wrapper = mount(TextField, {
      props: defaultProps,
    })

    expect(wrapper.find('.text-field').exists()).toBe(true)
    expect(wrapper.find('.text-field__label').text()).toBe('Test Label')
    expect(wrapper.find('.text-field__input').attributes('placeholder')).toBe('Test Placeholder')
    expect(wrapper.find('.text-field__input').attributes('type')).toBe('text')
    expect(wrapper.find('.text-field__hint').text()).toBe('Test Hint')
  })

  it('muestra el asterisco cuando required es true', () => {
    const wrapper = mount(TextField, {
      props: {
        ...defaultProps,
        required: true,
      },
    })
    expect(wrapper.find('.text-field__required').exists()).toBe(true)
  })

  it('no muestra el asterisco cuando required es false', () => {
    const wrapper = mount(TextField, {
      props: {
        ...defaultProps,
        required: false,
      },
    })
    expect(wrapper.find('.text-field__required').exists()).toBe(false)
  })

  it('muestra el mensaje de error cuando error está presente', () => {
    const wrapper = mount(TextField, {
      props: {
        ...defaultProps,
        error: 'Error message',
      },
    })
    expect(wrapper.find('.text-field--error').exists()).toBe(true)
    expect(wrapper.find('.text-field__error-message').text()).toBe('Error message')
    expect(wrapper.find('.text-field__hint').exists()).toBe(false)
  })

  it('muestra el mensaje de éxito cuando success está presente', () => {
    const wrapper = mount(TextField, {
      props: {
        ...defaultProps,
        success: 'Success message',
      },
    })
    expect(wrapper.find('.text-field__success-message').text()).toBe('Success message')
    expect(wrapper.find('.text-field__hint').exists()).toBe(false)
  })

  it('aplica la clase disabled cuando disabled es true', () => {
    const wrapper = mount(TextField, {
      props: {
        ...defaultProps,
        disabled: true,
      },
    })
    expect(wrapper.find('.text-field__input').attributes('disabled')).toBeDefined()
  })

  it('emite update:modelValue cuando el input cambia', async () => {
    const wrapper = mount(TextField, {
      props: defaultProps,
    })
    const input = wrapper.find('.text-field__input')
    await input.setValue('new value')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
  })

  it('emite blur cuando el input pierde el foco', async () => {
    const wrapper = mount(TextField, {
      props: defaultProps,
    })
    const input = wrapper.find('.text-field__input')
    await input.trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('emite focus cuando el input recibe el foco', async () => {
    const wrapper = mount(TextField, {
      props: defaultProps,
    })
    const input = wrapper.find('.text-field__input')
    await input.trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()
  })

  it('genera un id único cuando no se proporciona uno', () => {
    const wrapper = mount(TextField, {
      props: {
        ...defaultProps,
        id: undefined,
      },
    })
    const input = wrapper.find('.text-field__input')
    expect(input.attributes('id')).toMatch(/^text-field-[a-z0-9]{9}$/)
  })

  it('renderiza correctamente con el tipo por defecto', () => {
    const wrapper = mount(TextField, {
      props: { modelValue: '' },
    })
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('renderiza correctamente con diferentes tipos', () => {
    const types = ['text', 'email', 'password', 'number', 'tel', 'url'] as const
    types.forEach((type) => {
      const wrapper = mount(TextField, {
        props: {
          type,
          modelValue: '',
        },
      })
      expect(wrapper.find(`input[type="${type}"]`).exists()).toBe(true)
    })
  })

  it('renderiza correctamente con el label', () => {
    const wrapper = mount(TextField, {
      props: {
        label: 'Test Label',
        modelValue: '',
      },
    })
    expect(wrapper.find('label').text()).toBe('Test Label')
  })

  it('renderiza correctamente con el placeholder', () => {
    const wrapper = mount(TextField, {
      props: {
        placeholder: 'Test Placeholder',
        modelValue: '',
      },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Test Placeholder')
  })

  it('emite el evento input cuando se modifica el valor', async () => {
    const wrapper = mount(TextField, {
      props: { modelValue: '' },
    })
    await wrapper.find('input').setValue('test value')
    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('emite el evento blur cuando el input pierde el foco', async () => {
    const wrapper = mount(TextField, {
      props: { modelValue: '' },
    })
    await wrapper.find('input').trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })
})
