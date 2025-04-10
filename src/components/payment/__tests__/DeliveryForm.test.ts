import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DeliveryForm from '../DeliveryForm.vue'

describe('DeliveryForm', () => {
  it('renderiza correctamente el formulario', () => {
    const wrapper = mount(DeliveryForm)

    expect(wrapper.find('#fullName').exists()).toBe(true)
    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#phone').exists()).toBe(true)
    expect(wrapper.find('#address').exists()).toBe(true)
    expect(wrapper.find('#city').exists()).toBe(true)
    expect(wrapper.find('#postalCode').exists()).toBe(true)
    expect(wrapper.find('#deliveryInstructions').exists()).toBe(true)
  })

  it('inicializa con valores vacíos', () => {
    const wrapper = mount(DeliveryForm)

    expect(wrapper.vm.formData.fullName).toBe('')
    expect(wrapper.vm.formData.email).toBe('')
    expect(wrapper.vm.formData.phone).toBe('')
    expect(wrapper.vm.formData.address).toBe('')
    expect(wrapper.vm.formData.city).toBe('')
    expect(wrapper.vm.formData.postalCode).toBe('')
    expect(wrapper.vm.formData.deliveryInstructions).toBe('')
  })

  it('actualiza los valores del formulario correctamente', async () => {
    const wrapper = mount(DeliveryForm)

    await wrapper.find('#fullName').setValue('Juan Pérez')
    await wrapper.find('#email').setValue('juan@example.com')
    await wrapper.find('#phone').setValue('3001234567')
    await wrapper.find('#address').setValue('Calle 123 #45-67')
    await wrapper.find('#city').setValue('Bogotá')
    await wrapper.find('#postalCode').setValue('110111')
    await wrapper.find('#deliveryInstructions').setValue('Dejar en la portería')

    expect(wrapper.vm.formData.fullName).toBe('Juan Pérez')
    expect(wrapper.vm.formData.email).toBe('juan@example.com')
    expect(wrapper.vm.formData.phone).toBe('3001234567')
    expect(wrapper.vm.formData.address).toBe('Calle 123 #45-67')
    expect(wrapper.vm.formData.city).toBe('Bogotá')
    expect(wrapper.vm.formData.postalCode).toBe('110111')
    expect(wrapper.vm.formData.deliveryInstructions).toBe('Dejar en la portería')
  })

  it('tiene los placeholders correctos', () => {
    const wrapper = mount(DeliveryForm)

    expect(wrapper.find('#fullName').attributes('placeholder')).toBe('Enter your full name')
    expect(wrapper.find('#email').attributes('placeholder')).toBe('Enter your email')
    expect(wrapper.find('#phone').attributes('placeholder')).toBe('Enter your phone number')
    expect(wrapper.find('#address').attributes('placeholder')).toBe('Enter your delivery address')
    expect(wrapper.find('#city').attributes('placeholder')).toBe('City')
    expect(wrapper.find('#postalCode').attributes('placeholder')).toBe('Postal code')
    expect(wrapper.find('#deliveryInstructions').attributes('placeholder')).toBe(
      'Any special instructions for delivery',
    )
  })

  it('tiene los tipos de input correctos', () => {
    const wrapper = mount(DeliveryForm)

    expect(wrapper.find('#fullName').attributes('type')).toBe('text')
    expect(wrapper.find('#email').attributes('type')).toBe('email')
    expect(wrapper.find('#phone').attributes('type')).toBe('tel')
    expect(wrapper.find('#address').attributes('type')).toBe('text')
    expect(wrapper.find('#city').attributes('type')).toBe('text')
    expect(wrapper.find('#postalCode').attributes('type')).toBe('text')
  })

  it('tiene las etiquetas correctas', () => {
    const wrapper = mount(DeliveryForm)

    expect(wrapper.find('label[for="fullName"]').text()).toBe('Nombre completo')
    expect(wrapper.find('label[for="email"]').text()).toBe('Email')
    expect(wrapper.find('label[for="phone"]').text()).toBe('Phone Number')
    expect(wrapper.find('label[for="address"]').text()).toBe('Delivery Address')
    expect(wrapper.find('label[for="city"]').text()).toBe('City')
    expect(wrapper.find('label[for="postalCode"]').text()).toBe('Postal Code')
    expect(wrapper.find('label[for="deliveryInstructions"]').text()).toBe(
      'Delivery Instructions (Optional)',
    )
  })

  it('tiene la estructura de grid correcta para city y postalCode', () => {
    const wrapper = mount(DeliveryForm)

    const formRow = wrapper.find('.form-row')
    expect(formRow.exists()).toBe(true)

    expect(formRow.find('#city').exists()).toBe(true)
    expect(formRow.find('#postalCode').exists()).toBe(true)
  })
})
