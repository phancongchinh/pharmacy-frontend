import { apiClient } from './apiClient'
import type { ApiResponse, PaginatedResponse } from './apiClient'

// Updated Types to match backend model
export interface Supplier {
  id: number
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  active: boolean
  // Auditable fields from backend
  createdBy?: string
  createdDate?: string
  lastModifiedBy?: string
  lastModifiedDate?: string
  isDeleted?: boolean
  // Additional computed fields for frontend display
  medicineBatches?: any[]
}

export interface SupplierFilters {
  search?: string // Maps to 'q' parameter in backend
  active?: boolean // Maps to 'active' parameter in backend
}

export interface SupplierPagination {
  page: number // Backend uses 1-based pagination
  size: number
  sort?: string // Maps to 'sortBy' parameter
  direction?: 'asc' | 'desc' // Maps to 'sortDir' parameter
}

// Constants
export const supplierStatuses = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Suspended', value: 'suspended' },
]

// Service functions
class SuppliersService {
  async getSuppliers(filters: SupplierFilters = {}, pagination: SupplierPagination) {
    const params = new URLSearchParams()

    // Add pagination parameters
    params.set('page', pagination.page.toString())
    params.set('size', pagination.size.toString())

    // Add sorting parameters
    if (pagination.sort) {
      params.set('sortBy', pagination.sort)
    }
    if (pagination.direction) {
      params.set('sortDir', pagination.direction)
    }

    // Add filter parameters
    if (filters.search) {
      params.set('q', filters.search)
    }
    if (filters.active !== undefined) {
      params.set('active', filters.active.toString())
    }

    const response = await apiClient.get<PaginatedResponse<Supplier>>(
      `/api/suppliers?${params.toString()}`,
    )

    // Transform backend response to match frontend expectations
    return {
      data: response.data || response,
      success: response.success ?? true,
      message: response.message || 'Suppliers retrieved successfully',
    }
  }

  async getSupplierById(id: number): Promise<ApiResponse<Supplier>> {
    const response = await apiClient.get<Supplier>(`/api/suppliers/${id}`)

    return {
      data: response.data || response,
      success: response.success ?? true,
      message: response.message || 'Supplier retrieved successfully',
    }
  }

  async createSupplier(
    supplier: Omit<
      Supplier,
      'id' | 'createdBy' | 'createdDate' | 'lastModifiedBy' | 'lastModifiedDate' | 'isDeleted'
    >,
  ): Promise<ApiResponse<Supplier>> {
    // Ensure active defaults to true if not specified
    const supplierData = {
      ...supplier,
      active: supplier.active ?? true,
    }

    const response = await apiClient.post<Supplier>('/api/suppliers', supplierData)

    return {
      data: response.data || response,
      success: response.success ?? true,
      message: response.message || 'Supplier created successfully',
    }
  }

  async updateSupplier(
    id: number,
    updates: Partial<Omit<Supplier, 'id' | 'createdBy' | 'createdDate'>>,
  ): Promise<ApiResponse<Supplier>> {
    const response = await apiClient.put<Supplier>(`/api/suppliers/${id}`, updates)

    return {
      data: response.data || response,
      success: response.success ?? true,
      message: response.message || 'Supplier updated successfully',
    }
  }

  async deleteSupplier(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<void>(`/api/suppliers/${id}`)

    return {
      data: undefined as any,
      success: response.success ?? true,
      message: response.message || 'Supplier deactivated successfully',
    }
  }

  // Note: Backend doesn't have bulk delete endpoint, so we'll call delete for each ID
  async bulkDeleteSuppliers(ids: number[]): Promise<ApiResponse<void>> {
    const deletePromises = ids.map((id) => this.deleteSupplier(id))
    await Promise.all(deletePromises)

    return {
      data: undefined as any,
      success: true,
      message: `${ids.length} suppliers deactivated successfully`,
    }
  }
}

export const suppliersService = new SuppliersService()
