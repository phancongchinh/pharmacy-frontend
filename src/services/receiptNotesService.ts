import { apiClient } from './apiClient'
import type { ApiResponse } from './apiClient'

// Types based on backend models
export interface ReceiptNote {
  id: number
  receiptNumber: string
  supplier: any // Supplier reference
  receiptDate: string
  supplierInvoiceNumber?: string
  supplierInvoiceDate?: string
  totalAmount: number
  discountAmount: number
  status: ReceiptStatus
  notes?: string
  receivedBy?: string
  receiptNoteItems?: ReceiptNoteItem[]
  // Auditable fields from backend
  createdBy?: string
  createdDate?: string
  lastModifiedBy?: string
  lastModifiedDate?: string
  isDeleted?: boolean
}

export interface ReceiptNoteItem {
  id: number
  receiptNote?: ReceiptNote
  medicineBatch: any // MedicineBatch reference
  quantity: number
  unitPrice: number
  totalPrice: number
  discountAmount: number
  finalAmount: number
  notes?: string
  // Auditable fields from backend
  createdBy?: string
  createdDate?: string
  lastModifiedBy?: string
  lastModifiedDate?: string
  isDeleted?: boolean
}

export enum ReceiptStatus {
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface ReceiptNoteFilters {
  status?: ReceiptStatus
  supplierId?: number
  dateFrom?: string
  dateTo?: string
}

// Constants for UI
export const receiptStatuses = [
  { label: 'Completed', value: ReceiptStatus.COMPLETED },
  { label: 'Cancelled', value: ReceiptStatus.CANCELLED },
]

// Service class
class ReceiptNotesService {
  async getReceiptNotes(): Promise<ApiResponse<ReceiptNote[]>> {
    const response = await apiClient.get<ReceiptNote[]>('/api/receipt-notes')

    return {
      data: response.data || response,
      success: response.success ?? true,
      message: response.message || 'Receipt notes retrieved successfully',
    }
  }

  async getReceiptNoteById(id: number): Promise<ApiResponse<ReceiptNote>> {
    const response = await apiClient.get<ReceiptNote>(`/api/receipt-notes/${id}`)

    return {
      data: response.data || response,
      success: response.success ?? true,
      message: response.message || 'Receipt note retrieved successfully',
    }
  }

  async createReceiptNote(
    receiptNote: Omit<ReceiptNote, 'id' | 'createdBy' | 'createdDate' | 'lastModifiedBy' | 'lastModifiedDate' | 'isDeleted'>,
  ): Promise<ApiResponse<ReceiptNote>> {
    // Ensure status and discountAmount defaults
    const receiptNoteData = {
      ...receiptNote,
      status: receiptNote.status ?? ReceiptStatus.COMPLETED,
      discountAmount: receiptNote.discountAmount ?? 0,
    }

    const response = await apiClient.post<ReceiptNote>('/api/receipt-notes', receiptNoteData)

    return {
      data: response.data || response,
      success: response.success ?? true,
      message: response.message || 'Receipt note created successfully',
    }
  }

  async updateReceiptNote(
    id: number,
    updates: Partial<Omit<ReceiptNote, 'id' | 'createdBy' | 'createdDate'>>,
  ): Promise<ApiResponse<ReceiptNote>> {
    const response = await apiClient.put<ReceiptNote>(`/api/receipt-notes/${id}`, updates)

    return {
      data: response.data || response,
      success: response.success ?? true,
      message: response.message || 'Receipt note updated successfully',
    }
  }

  async deleteReceiptNote(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<void>(`/api/receipt-notes/${id}`)

    return {
      data: undefined as any,
      success: response.success ?? true,
      message: response.message || 'Receipt note deleted successfully',
    }
  }

  // Utility methods
  calculateReceiptTotal(items: ReceiptNoteItem[]): number {
    return items.reduce((total, item) => {
      return total + item.finalAmount
    }, 0)
  }

  calculateItemTotal(item: ReceiptNoteItem): number {
    const totalPrice = item.quantity * item.unitPrice
    return totalPrice - item.discountAmount
  }

  getReceiptStatusLabel(status: ReceiptStatus): string {
    return receiptStatuses.find(rs => rs.value === status)?.label || status
  }
}

export const receiptNotesService = new ReceiptNotesService()
