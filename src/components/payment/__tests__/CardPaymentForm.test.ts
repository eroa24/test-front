import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CardPaymentForm from '../CardPaymentForm.vue'

describe('CardPaymentForm', () => {
  it('renderiza correctamente el formulario', () => {
    const wrapper = mount(CardPaymentForm)

    // Verificar que los campos del formulario existen
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

    // Verificar valores iniciales
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

    // Simular entrada de número de tarjeta
    await cardNumberInput.setValue('4111111111111111')

    // Verificar que se formatea correctamente (con espacios cada 4 dígitos)
    expect(wrapper.vm.formData.cardNumber).toBe('4111 1111 1111 1111')
  })

  it('formatea correctamente la fecha de expiración', async () => {
    const wrapper = mount(CardPaymentForm)
    const expiryDateInput = wrapper.find('#expiryDate')

    // Simular entrada de fecha de expiración
    await expiryDateInput.setValue('1225')

    // Verificar que se formatea correctamente (MM/YY)
    expect(wrapper.vm.formData.expiryDate).toBe('12/25')
  })

  it('formatea correctamente el CVC', async () => {
    const wrapper = mount(CardPaymentForm)
    const cvcInput = wrapper.find('#cvc')

    // Simular entrada de CVC
    await cvcInput.setValue('123')

    // Verificar que se formatea correctamente (solo números)
    expect(wrapper.vm.formData.cvc).toBe('123')
  })

  it('formatea correctamente el nombre de la tarjeta', async () => {
    const wrapper = mount(CardPaymentForm)
    const cardNameInput = wrapper.find('#cardName')

    // Simular entrada de nombre de tarjeta
    await cardNameInput.setValue('juan perez')

    // Verificar que se formatea correctamente (mayúsculas)
    expect(wrapper.vm.formData.cardName).toBe('JUAN PEREZ')
  })

  it('detecta correctamente el tipo de tarjeta Visa', async () => {
    const wrapper = mount(CardPaymentForm)
    const cardNumberInput = wrapper.find('#cardNumber')

    // Simular entrada de número de tarjeta Visa
    await cardNumberInput.setValue('4111111111111111')

    // Verificar que se detecta como Visa
    expect(wrapper.vm.cardType).toBe('visa')
  })

  it('detecta correctamente el tipo de tarjeta Mastercard', async () => {
    const wrapper = mount(CardPaymentForm)
    const cardNumberInput = wrapper.find('#cardNumber')

    // Simular entrada de número de tarjeta Mastercard
    await cardNumberInput.setValue('5111111111111111')

    // Verificar que se detecta como Mastercard
    expect(wrapper.vm.cardType).toBe('mastercard')
  })

  it('muestra el icono de Visa cuando se detecta una tarjeta Visa', async () => {
    const wrapper = mount(CardPaymentForm)
    const cardNumberInput = wrapper.find('#cardNumber')

    // Simular entrada de número de tarjeta Visa
    await cardNumberInput.setValue('4111111111111111')

    // Verificar que se muestra el icono de Visa
    expect(wrapper.find('img[alt="Visa"]').exists()).toBe(true)
    expect(wrapper.find('img[alt="Mastercard"]').exists()).toBe(false)
  })

  it('muestra el icono de Mastercard cuando se detecta una tarjeta Mastercard', async () => {
    const wrapper = mount(CardPaymentForm)
    const cardNumberInput = wrapper.find('#cardNumber')

    // Simular entrada de número de tarjeta Mastercard
    await cardNumberInput.setValue('5111111111111111')

    // Verificar que se muestra el icono de Mastercard
    expect(wrapper.find('img[alt="Mastercard"]').exists()).toBe(true)
    expect(wrapper.find('img[alt="Visa"]').exists()).toBe(false)
  })

  it('valida correctamente los términos y condiciones', async () => {
    const wrapper = mount(CardPaymentForm)

    // Verificar que la validación falla cuando no se aceptan los términos
    expect(wrapper.vm.validateTerms()).toBe(false)

    // Aceptar los términos usando los checkboxes directamente
    const termsCheckbox = wrapper.find('#termsAndConditions')
    const dataProcessingCheckbox = wrapper.find('#dataProcessing')

    await termsCheckbox.setValue(true)
    await dataProcessingCheckbox.setValue(true)

    // Verificar que la validación pasa cuando se aceptan los términos
    expect(wrapper.vm.validateTerms()).toBe(true)
  })

  it('emite una notificación cuando no se aceptan los términos', async () => {
    const wrapper = mount(CardPaymentForm)

    // Llamar directamente al método validateTerms
    wrapper.vm.validateTerms()

    // Verificar que se emite la notificación correcta
    expect(wrapper.emitted('showNotification')).toBeTruthy()
    expect(wrapper.emitted('showNotification')?.[0]).toEqual([
      'Debes aceptar los términos y condiciones y la política de privacidad para continuar',
    ])
  })

  it('tiene 12 opciones de cuotas', () => {
    const wrapper = mount(CardPaymentForm)
    const installmentsSelect = wrapper.find('#installments')

    // Verificar que hay 12 opciones de cuotas
    expect(installmentsSelect.findAll('option').length).toBe(12)

    // Verificar que la primera opción es "1 cuota"
    expect(installmentsSelect.findAll('option')[0].text()).toBe('1 cuota')

    // Verificar que la segunda opción es "2 cuotas"
    expect(installmentsSelect.findAll('option')[1].text()).toBe('2 cuotas')
  })
})
