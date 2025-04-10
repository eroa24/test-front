import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Navbar from '../Navbar.vue'

// Crear un router de prueba
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/products',
      name: 'products',
      component: { template: '<div>Products</div>' },
    },
    {
      path: '/orders',
      name: 'orders',
      component: { template: '<div>Orders</div>' },
    },
  ],
})

describe('Navbar', () => {
  it('renderiza correctamente', async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
      },
    })

    // Esperar a que el router se inicialice
    await router.isReady()

    expect(wrapper.find('.navbar').exists()).toBe(true)
    expect(wrapper.find('.navbar-container').exists()).toBe(true)
    expect(wrapper.find('.brand').exists()).toBe(true)
    expect(wrapper.find('.nav-links').exists()).toBe(true)
  })

  it('tiene el enlace de marca correcto', async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
      },
    })

    // Esperar a que el router se inicialice
    await router.isReady()

    const brandLink = wrapper.find('.brand')
    expect(brandLink.text()).toBe('Mi Tienda')

    // Verificar que el enlace apunta a /products
    const brandHref = brandLink.attributes('href')
    expect(brandHref).toContain('/products')
  })

  it('tiene el enlace de órdenes correcto', async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
      },
    })

    // Esperar a que el router se inicialice
    await router.isReady()

    const ordersLink = wrapper.find('.nav-link')
    expect(ordersLink.text()).toBe('Órdenes')

    // Verificar que el enlace apunta a /orders
    const ordersHref = ordersLink.attributes('href')
    expect(ordersHref).toContain('/orders')
  })

  it('tiene la estructura correcta del DOM', async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
      },
    })

    // Esperar a que el router se inicialice
    await router.isReady()

    const navbar = wrapper.find('.navbar')
    const container = wrapper.find('.navbar-container')
    const brand = wrapper.find('.brand')
    const navLinks = wrapper.find('.nav-links')
    const ordersLink = wrapper.find('.nav-link')

    expect(navbar.element.firstElementChild).toBe(container.element)
    expect(container.element.firstElementChild).toBe(brand.element)
    expect(container.element.lastElementChild).toBe(navLinks.element)
    expect(navLinks.element.firstElementChild).toBe(ordersLink.element)
  })
})
