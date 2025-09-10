import type { App } from 'vue'
import { apiClient } from './apiClient'

// Create a service object
export const services = {
  api: apiClient,
}

export const priorities = {
  highest: 'highest',
  high: 'high',
  medium: 'medium',
  low: 'low',
  lowest: 'lowest',
}

// Type for services injection
export type Services = typeof services

// Vue plugin to provide services
export const servicesPlugin = {
  install(app: App) {
    // Provide services to all components
    app.provide('services', services)

    // Also make available as global property (optional)
    app.config.globalProperties.$services = services
  },
}

// Injection key for better TypeScript support
export const servicesKey = Symbol('services') as InjectionKey<Services>

// Import InjectionKey type
import type { InjectionKey } from 'vue'
