import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Notification from '../Notification.vue'

describe('Notification', () => {
  const defaultProps = {
    modelValue: true,
    message: 'Test message',
    type: 'info' as const,
    duration: 3000,
  }

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renderiza correctamente con todas las propiedades', async () => {
    const wrapper = mount(Notification, {
      props: defaultProps,
      attachTo: document.body,
    })

    await nextTick()

    const notification = document.querySelector('.notification')
    expect(notification).toBeTruthy()
    expect(notification?.querySelector('.notification-message')?.textContent?.trim()).toBe(
      'Test message',
    )
    expect(notification?.classList.contains('info')).toBe(true)
  })

  it('renderiza el slot cuando se proporciona', async () => {
    const wrapper = mount(Notification, {
      props: defaultProps,
      slots: {
        default: 'Custom message',
      },
      attachTo: document.body,
    })

    await nextTick()

    const message = document.querySelector('.notification-message')
    expect(message?.textContent?.trim()).toBe('Custom message')
  })

  it('aplica la clase correcta según el tipo', async () => {
    const types = ['error', 'success', 'info'] as const

    for (const type of types) {
      const wrapper = mount(Notification, {
        props: {
          ...defaultProps,
          type,
        },
        attachTo: document.body,
      })

      await nextTick()

      const notification = document.querySelector('.notification')
      expect(notification?.classList.contains(type)).toBe(true)

      wrapper.unmount()
      document.body.innerHTML = ''
    }
  })

  it('cierra automáticamente después de la duración especificada', async () => {
    vi.useFakeTimers()

    const wrapper = mount(Notification, {
      props: {
        ...defaultProps,
        duration: 3000,
      },
      attachTo: document.body,
    })

    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeFalsy()

    await vi.advanceTimersByTime(3000)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])

    vi.useRealTimers()
    wrapper.unmount()
  })

  it('no cierra automáticamente cuando duration es 0', async () => {
    vi.useFakeTimers()

    const wrapper = mount(Notification, {
      props: {
        ...defaultProps,
        duration: 0,
      },
      attachTo: document.body,
    })

    await nextTick()

    await vi.advanceTimersByTime(3000)

    expect(wrapper.emitted('update:modelValue')).toBeFalsy()

    vi.useRealTimers()
    wrapper.unmount()
  })

  it('reinicia el temporizador cuando modelValue cambia a true', async () => {
    vi.useFakeTimers()

    const wrapper = mount(Notification, {
      props: {
        ...defaultProps,
        duration: 3000,
      },
      attachTo: document.body,
    })

    await nextTick()

    await wrapper.setProps({ modelValue: false })
    await wrapper.setProps({ modelValue: true })

    await vi.advanceTimersByTime(3000)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])

    vi.useRealTimers()
    wrapper.unmount()
  })

  it('limpia el temporizador al desmontar', () => {
    vi.useFakeTimers()

    const wrapper = mount(Notification, {
      props: defaultProps,
      attachTo: document.body,
    })

    wrapper.unmount()

    vi.advanceTimersByTime(3000)

    vi.useRealTimers()
  })
})
