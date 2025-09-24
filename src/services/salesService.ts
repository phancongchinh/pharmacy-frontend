import { apiClient } from './apiClient'
import type { ApiResponse } from './apiClient'

// Types based on backend models
export interface Sale {
  id: number
  saleNumber: string
  customerName?: string
  customerPhone?: string
  notes?: string
  saleItems?: SaleItem[]
  paymentMethod: PaymentMethod
  status: SaleStatus
  // Auditable fields from backend
  createdBy?: string
  createdDate?: string
  lastModifiedBy?: string
  lastModifiedDate?: string
  isDeleted?: boolean
}

export interface SaleItem {
  id: number
  sale?: Sale
  medicineBatch: any // MedicineBatch reference
  quantity: number
  unitPrice: number
  notes?: string
  status: SaleItemStatus
  // Auditable fields from backend
  createdBy?: string
  createdDate?: string
  lastModifiedBy?: string
  lastModifiedDate?: string
  isDeleted?: boolean
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

export enum SaleStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  PARTIALLY_RETURNED = 'PARTIALLY_RETURNED',
  REFUNDED = 'REFUNDED'
}

export enum SaleItemStatus {
  PENDING = 'PENDING',
  SOLD = 'SOLD',
  RETURNED = 'RETURNED'
}

export interface SaleFilters {
  status?: SaleStatus
  paymentMethod?: PaymentMethod
  customerName?: string
  dateFrom?: string
  dateTo?: string
}

// Constants for UI
export const paymentMethods = [
  { label: 'Cash', value: PaymentMethod.CASH },
  { label: 'Bank Transfer', value: PaymentMethod.BANK_TRANSFER },
]

export const saleStatuses = [
  { label: 'Pending', value: SaleStatus.PENDING },
  { label: 'Completed', value: SaleStatus.COMPLETED },
  { label: 'Cancelled', value: SaleStatus.CANCELLED },
  { label: 'Partially Returned', value: SaleStatus.PARTIALLY_RETURNED },
  { label: 'Refunded', value: SaleStatus.REFUNDED },
]

export const saleItemStatuses = [
  { label: 'Pending', value: SaleItemStatus.PENDING },
  { label: 'Sold', value: SaleItemStatus.SOLD },
  { label: 'Returned', value: SaleItemStatus.RETURNED },
]

// Service class
class SalesService {
  async getSales(): Promise<ApiResponse<Sale[]>> {
    const response = await apiClient.get<Sale[]>('/api/sales')

    return {
      data: response.data || response,
      success: response.success ?? true,
      message: response.message || 'Sales retrieved successfully',
    }
  }

  async getSaleById(id: number): Promise<ApiResponse<Sale>> {
    const response = await apiClient.get<Sale>(`/api/sales/${id}`)

    return {
      data: response.data || response,
      success: response.success ?? true,
      message: response.message || 'Sale retrieved successfully',
    }
  }

  async createSale(
    sale: Omit<Sale, 'id' | 'createdBy' | 'createdDate' | 'lastModifiedBy' | 'lastModifiedDate' | 'isDeleted'>,
  ): Promise<ApiResponse<Sale>> {
    // Ensure status defaults to PENDING
    const saleData = {
      ...sale,
      status: sale.status ?? SaleStatus.PENDING,
    }

    const response = await apiClient.post<Sale>('/api/sales', saleData)

    return {
      data: response.data || response,
      success: response.success ?? true,
      message: response.message || 'Sale created successfully',
    }
  }

  async updateSale(
    id: number,
    updates: Partial<Omit<Sale, 'id' | 'createdBy' | 'createdDate'>>,
  ): Promise<ApiResponse<Sale>> {
    const response = await apiClient.put<Sale>(`/api/sales/${id}`, updates)

    return {
      data: response.data || response,
      success: response.success ?? true,
      message: response.message || 'Sale updated successfully',
    }
  }

  async deleteSale(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<void>(`/api/sales/${id}`)

    return {
      data: undefined as any,
      success: response.success ?? true,
      message: response.message || 'Sale deleted successfully',
    }
  }

  // Utility methods
  calculateSaleTotal(saleItems: SaleItem[]): number {
    return saleItems.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice)
    }, 0)
  }

  getPaymentMethodLabel(method: PaymentMethod): string {
    return paymentMethods.find(pm => pm.value === method)?.label || method
  }

  getSaleStatusLabel(status: SaleStatus): string {
    return saleStatuses.find(ss => ss.value === status)?.label || status
  }
}

export const salesService = new SalesService()
