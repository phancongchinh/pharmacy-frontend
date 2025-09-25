import { apiClient } from './apiClient'
import type { ApiResponse } from './apiClient'
import { toQueryString } from '@/services/utilities.ts'

// Updated Types to match backend model
export interface Medicine {
  id: number
  name: string
  lowStockThreshold: number
  categories?: MedicineCategory[]
  barcode?: string
  description?: string
  dosageForm?: MedicineDosageForm
  strength?: string // 500mg, 250ml, etc.
  prescriptionRequired: boolean
  active: boolean
  medicineBatches?: MedicineBatch[]
  // Auditable fields from backend
  createdBy?: string
  createdDate?: string
  lastModifiedBy?: string
  lastModifiedDate?: string
  isDeleted?: boolean
}

export interface MedicineCategory {
  id: number
  name: string
  description?: string
  active: boolean
}

export interface MedicineBatch {
  id: number
  batchNumber: string
  expiryDate: string
  quantity: number
  unitPrice: number
  medicine: Medicine
  supplier: any
}

export enum MedicineDosageForm {
  TABLET = 'TABLET',
  CAPSULE = 'CAPSULE',
  SYRUP = 'SYRUP',
  INJECTION = 'INJECTION',
  OINTMENT = 'OINTMENT',
  DROPS = 'DROPS',
  INHALER = 'INHALER',
  PATCH = 'PATCH',
  POWDER = 'POWDER',
  OTHER = 'OTHER',
}

export interface MedicineFilters {
  q?: string // search query
  active?: boolean
  prescriptionRequired?: boolean
  dosageForm?: string
  categoryIds?: number[]
  page?: number
  size?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

// Service functions
class MedicinesService {
  async getMedicines(filters: MedicineFilters = {}) {
    const query = toQueryString(filters)
    return await apiClient.get('/api/medicines?' + query)
  }

  async getMedicineById(id: number): Promise<ApiResponse<Medicine>> {
    const response = await apiClient.get<Medicine>(`/api/medicines/${id}`)

    return {
      data: response.data || response,
      success: response.success ?? true,
      message: response.message || 'Medicine retrieved successfully',
    }
  }

  async getMedicineBatches(medicineId: number): Promise<ApiResponse<MedicineBatch[]>> {
    // Assuming there's an endpoint to get batches for a specific medicine
    const response = await apiClient.get<MedicineBatch[]>(`/api/medicines/${medicineId}/batches`)

    return {
      data: response.data || response,
      success: response.success ?? true,
      message: response.message || 'Medicine batches retrieved successfully',
    }
  }

  async createMedicine(
    medicine: Omit<
      Medicine,
      'id' | 'createdBy' | 'createdDate' | 'lastModifiedBy' | 'lastModifiedDate' | 'isDeleted'
    >,
  ): Promise<ApiResponse<Medicine>> {
    // Ensure active and prescriptionRequired default values
    const medicineData = {
      ...medicine,
      active: medicine.active ?? true,
      prescriptionRequired: medicine.prescriptionRequired ?? false,
      lowStockThreshold: medicine.lowStockThreshold ?? 10,
    }

    const response = await apiClient.post<Medicine>('/api/medicines', medicineData)

    return {
      data: response.data || response,
      success: response.success ?? true,
      message: response.message || 'Medicine created successfully',
    }
  }

  async updateMedicine(
    id: number,
    updates: Partial<Omit<Medicine, 'id' | 'createdBy' | 'createdDate'>>,
  ): Promise<ApiResponse<Medicine>> {
    const response = await apiClient.put<Medicine>(`/api/medicines/${id}`, updates)

    return {
      data: response.data || response,
      success: response.success ?? true,
      message: response.message || 'Medicine updated successfully',
    }
  }

  async deleteMedicine(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<void>(`/api/medicines/${id}`)

    return {
      data: undefined as any,
      success: response.success ?? true,
      message: response.message || 'Medicine deactivated successfully',
    }
  }

  // Utility methods
  getDosageFormOptions() {
    return Object.values(MedicineDosageForm).map((form) => ({
      label: form.charAt(0) + form.slice(1).toLowerCase().replace('_', ' '),
      value: form,
    }))
  }

  // Note: Backend doesn't have bulk operations, implement if needed
  async bulkDeleteMedicines(ids: number[]): Promise<ApiResponse<void>> {
    const deletePromises = ids.map((id) => this.deleteMedicine(id))
    await Promise.all(deletePromises)

    return {
      data: undefined as any,
      success: true,
      message: `${ids.length} medicines deactivated successfully`,
    }
  }
}

export const medicinesService = new MedicinesService()
