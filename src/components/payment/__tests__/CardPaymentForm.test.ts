import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CardPaymentForm from '../CardPaymentForm.vue'

describe('CardPaymentForm', () => {
  it('renderiza correctamente el formulario', () => {
    const wrapper = mount(CardPaymentForm)

    expect(wrapper.find('#cardNumber').exists()).toBe(true)
    expect(wrapper.find('#expiryDate').exists()).toBe(true)
    expect(wrapper.find('#cvc').exists()).toBe(true)
    expect(wrapper.find('#cardName').exists()).toBe(true)
    expect(wrapper.find('#installments').exists()).toBe(true)
    expect(wrapper.find('#termsAndConditions').exists()).toBe(true)
    expect(wrapper.find('#dataProcessing').exists()).toBe(true)
  })

  it('inicializa con valores por defecto', () => {
    const wrapper = mount(CardPaymentForm)

    expect(wrapper.vm.formData.cardNumber).toBe('')
    expect(wrapper.vm.formData.expiryDate).toBe('')
    expect(wrapper.vm.formData.cvc).toBe('')
    expect(wrapper.vm.formData.cardName).toBe('')
    expect(wrapper.vm.formData.installments).toBe('1')
    expect(wrapper.vm.formData.termsAccepted).toBe(false)
    expect(wrapper.vm.formData.dataProcessingAccepted).toBe(false)
  })

  it('formatea correctamente el número de tarjeta', async () => {
    const wrapper = mount(CardPaymentForm)
    const cardNumberInput = wrapper.find('#cardNumber')

    await cardNumberInput.setValue('4111111111111111')

    expect(wrapper.vm.formData.cardNumber).toBe('4111 1111 1111 1111')
  })

  it('formatea correctamente la fecha de expiración', async () => {
    const wrapper = mount(CardPaymentForm)
    const expiryDateInput = wrapper.find('#expiryDate')

    await expiryDateInput.setValue('1225')

    expect(wrapper.vm.formData.expiryDate).toBe('12/25')
  })

  it('formatea correctamente el CVC', async () => {
    const wrapper = mount(CardPaymentForm)
    const cvcInput = wrapper.find('#cvc')

    await cvcInput.setValue('123')

    expect(wrapper.vm.formData.cvc).toBe('123')
  })

  it('formatea correctamente el nombre de la tarjeta', async () => {
    const wrapper = mount(CardPaymentForm)
    const cardNameInput = wrapper.find('#cardName')

    await cardNameInput.setValue('juan perez')

    expect(wrapper.vm.formData.cardName).toBe('JUAN PEREZ')
  })

  it('detecta correctamente el tipo de tarjeta Visa', async () => {
    const wrapper = mount(CardPaymentForm)
    const cardNumberInput = wrapper.find('#cardNumber')

    await cardNumberInput.setValue('4111111111111111')

    expect(wrapper.vm.formData.cardNumber).toBe('4111 1111 1111 1111')
    expect(wrapper.find('img[alt="Visa"]').exists()).toBe(true)
  })

  it('detecta correctamente el tipo de tarjeta Mastercard', async () => {
    const wrapper = mount(CardPaymentForm)
    const cardNumberInput = wrapper.find('#cardNumber')

    await cardNumberInput.setValue('5111111111111111')

    expect(wrapper.vm.formData.cardNumber).toBe('5111 1111 1111 1111')
    expect(wrapper.find('img[alt="Mastercard"]').exists()).toBe(true)
  })

  it('muestra el icono de Visa cuando se detecta una tarjeta Visa', async () => {
    const wrapper = mount(CardPaymentForm)
    const cardNumberInput = wrapper.find('#cardNumber')

    await cardNumberInput.setValue('4111111111111111')

    expect(wrapper.find('img[alt="Visa"]').exists()).toBe(true)
    expect(wrapper.find('img[alt="Mastercard"]').exists()).toBe(false)
  })

  it('muestra el icono de Mastercard cuando se detecta una tarjeta Mastercard', async () => {
    const wrapper = mount(CardPaymentForm)
    const cardNumberInput = wrapper.find('#cardNumber')

    await cardNumberInput.setValue('5111111111111111')

    expect(wrapper.find('img[alt="Mastercard"]').exists()).toBe(true)
    expect(wrapper.find('img[alt="Visa"]').exists()).toBe(false)
  })

  it('valida correctamente los términos y condiciones', async () => {
    const wrapper = mount(CardPaymentForm)

    expect(wrapper.vm.validateTerms()).toBe(false)

    const termsCheckbox = wrapper.find('#termsAndConditions')
    const dataProcessingCheckbox = wrapper.find('#dataProcessing')

    await termsCheckbox.setValue(true)
    await dataProcessingCheckbox.setValue(true)

    expect(wrapper.vm.validateTerms()).toBe(true)
  })

  it('emite una notificación cuando no se aceptan los términos', async () => {
    const wrapper = mount(CardPaymentForm)

    wrapper.vm.validateTerms()

    expect(wrapper.emitted('showNotification')).toBeTruthy()
    expect(wrapper.emitted('showNotification')?.[0]).toEqual([
      'Debes aceptar los términos y condiciones y la política de privacidad para continuar',
    ])
  })

  it('tiene 12 opciones de cuotas', () => {
    const wrapper = mount(CardPaymentForm)
    const installmentsSelect = wrapper.find('#installments')

    expect(installmentsSelect.findAll('option').length).toBe(12)

    expect(installmentsSelect.findAll('option')[0].text()).toBe('1 cuota')

    expect(installmentsSelect.findAll('option')[1].text()).toBe('2 cuotas')
  })
})
