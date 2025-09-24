import { apiClient } from './apiClient'
import type { ApiResponse } from './apiClient'

// Types based on backend models
export interface DeliveryNote {
  id: number
  deliveryNumber: string
  deliveryTo?: string
  sale: any // Sale reference
  deliveryDate: string
  notes?: string
  deliveryNoteItems?: DeliveryNoteItem[]
  status: DeliveryStatus
  deliveryType: DeliveryType
  // Auditable fields from backend
  createdBy?: string
  createdDate?: string
  lastModifiedBy?: string
  lastModifiedDate?: string
  isDeleted?: boolean
}

export interface DeliveryNoteItem {
  id: number
  deliveryNote?: DeliveryNote
  medicineBatch: any // MedicineBatch reference
  quantity: number
  notes?: string
  // Auditable fields from backend
  createdBy?: string
  createdDate?: string
  lastModifiedBy?: string
  lastModifiedDate?: string
  isDeleted?: boolean
}

export enum DeliveryStatus {
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum DeliveryType {
  FOR_INTERNAL_USE = 'FOR_INTERNAL_USE',
  FOR_SALES = 'FOR_SALES',
  FOR_RETURNS = 'FOR_RETURNS',
  FOR_DAMAGED_GOODS = 'FOR_DAMAGED_GOODS',
  FOR_EXPIRY_MANAGEMENT = 'FOR_EXPIRY_MANAGEMENT'
}

export interface DeliveryNoteFilters {
  status?: DeliveryStatus
  deliveryType?: DeliveryType
  dateFrom?: string
  dateTo?: string
}

// Constants for UI
export const deliveryStatuses = [
  { label: 'Completed', value: DeliveryStatus.COMPLETED },
  { label: 'Cancelled', value: DeliveryStatus.CANCELLED },
]

export const deliveryTypes = [
  { label: 'For Internal Use', value: DeliveryType.FOR_INTERNAL_USE },
  { label: 'For Sales', value: DeliveryType.FOR_SALES },
  { label: 'For Returns', value: DeliveryType.FOR_RETURNS },
  { label: 'For Damaged Goods', value: DeliveryType.FOR_DAMAGED_GOODS },
  { label: 'For Expiry Management', value: DeliveryType.FOR_EXPIRY_MANAGEMENT },
]

// Service class
class DeliveryNotesService {
  async getDeliveryNotes(): Promise<ApiResponse<DeliveryNote[]>> {
    const response = await apiClient.get<DeliveryNote[]>('/api/delivery-notes')

    return {
      data: response.data || response,
      success: response.success ?? true,
      message: response.message || 'Delivery notes retrieved successfully',
    }
  }

  async getDeliveryNoteById(id: number): Promise<ApiResponse<DeliveryNote>> {
    const response = await apiClient.get<DeliveryNote>(`/api/delivery-notes/${id}`)

    return {
      data: response.data || response,
      success: response.success ?? true,
      message: response.message || 'Delivery note retrieved successfully',
    }
  }

  async createDeliveryNote(
    deliveryNote: Omit<DeliveryNote, 'id' | 'createdBy' | 'createdDate' | 'lastModifiedBy' | 'lastModifiedDate' | 'isDeleted'>,
  ): Promise<ApiResponse<DeliveryNote>> {
    // Ensure status defaults
    const deliveryNoteData = {
      ...deliveryNote,
      status: deliveryNote.status ?? DeliveryStatus.COMPLETED,
    }

    const response = await apiClient.post<DeliveryNote>('/api/delivery-notes', deliveryNoteData)

    return {
      data: response.data || response,
      success: response.success ?? true,
      message: response.message || 'Delivery note created successfully',
    }
  }

  async updateDeliveryNote(
    id: number,
    updates: Partial<Omit<DeliveryNote, 'id' | 'createdBy' | 'createdDate'>>,
  ): Promise<ApiResponse<DeliveryNote>> {
    const response = await apiClient.put<DeliveryNote>(`/api/delivery-notes/${id}`, updates)

    return {
      data: response.data || response,
      success: response.success ?? true,
      message: response.message || 'Delivery note updated successfully',
    }
  }

  async deleteDeliveryNote(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<void>(`/api/delivery-notes/${id}`)

    return {
      data: undefined as any,
      success: response.success ?? true,
      message: response.message || 'Delivery note deleted successfully',
    }
  }

  // Utility methods
  calculateTotalQuantity(items: DeliveryNoteItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  getDeliveryStatusLabel(status: DeliveryStatus): string {
    return deliveryStatuses.find(ds => ds.value === status)?.label || status
  }

  getDeliveryTypeLabel(type: DeliveryType): string {
    return deliveryTypes.find(dt => dt.value === type)?.label || type
  }
}

export const deliveryNotesService = new DeliveryNotesService()
