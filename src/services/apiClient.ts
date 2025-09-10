import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

import { ElMessage } from 'element-plus'

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: {
    content: T[]
    links: number
    page: {
      number: number
      size: number
      totalElements: number
      totalPages: number
    }
  }
}

// API Error type
export interface ApiError {
  message: string
  code?: string | number
  status?: number
}

class ApiClient {
  private readonly instance: AxiosInstance

  constructor(baseURL: string = 'http://localhost:8080') {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add an auth token if available
        const atk = localStorage.getItem('atk')
        const oid = localStorage.getItem('oid')
        config.headers.Authorization = `Bearer ${atk}`
        config.headers['oid'] = oid
        // Add loading indicator
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        console.error('❌ Request Error:', error)
        return Promise.reject(error)
      },
    )

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`)
        return response
      },
      (error) => {
        console.error('❌ Response Error:', error)
        this.handleError(error)
        return Promise.reject(error)
      },
    )
  }

  private handleError(error: any): void {
    let message = 'An unexpected error occurred'
    console.log('🚨 API Error:', error)
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      const data = error.response.data

      switch (status) {
        case 400:
          message = data.message || 'Bad request'
          break
        case 401:
          message = 'Unauthorized. Please log in again.'
          this.handleUnauthorized()
          break
        case 403:
          message = 'Access forbidden'
          break
        case 404:
          message = 'Resource not found'
          break
        case 422:
          message = data.message || 'Validation error'
          break
        case 500:
          message = 'Internal server error'
          break
        default:
          message = data.message || `Error: ${status}`
      }
    } else if (error.request) {
      // Network error
      message = 'Network error. Please check your connection.'
    }
    if (error?.config?.url !== '/api/auth/verify') ElMessage.error(message)
  }

  private handleUnauthorized(): void {
    localStorage.clear()
  }

  // Generic request method
  private async request<T>(config: AxiosRequestConfig) {
    try {
      const response = await this.instance.request<ApiResponse<T>>(config)
      return response.data
    } catch (error) {
      throw error
    }
  }

  // HTTP Methods
  async get<T>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: 'PATCH', url, data })
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }

  // Upload file method
  async upload<T>(url: string, file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData()
    formData.append('file', file)

    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })
  }
}

// Create a singleton instance
export const apiClient = new ApiClient()
