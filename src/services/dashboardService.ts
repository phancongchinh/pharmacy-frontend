import { apiClient } from './apiClient'
import type { ApiResponse } from './apiClient'

// Types
export interface StatsOverview {
  wonDealsValue: number
  wonDealsCount: number
  activeCustomersCount: number
  conversionRate: number
  comparison: {
    wonDealsValue: number
    wonDealsCount: number
    activeCustomersCount: number
    conversionRate: number
  }
}

export interface CustomerGrowthData {
  newCustomers: number[]
  returningCustomers: number[]
  labels: string[]
}

export interface RevenueData {
  data: number[]
  labels: string[]
}

// Key metrics configuration
export const keyMetrics = [
  {
    title: 'Total Revenue',
    stat: 'wonDealsValue',
    format: 'currency',
    icon: 'trending_up',
    iconClass: 'revenue'
  },
  {
    title: 'Active Customers',
    stat: 'activeCustomersCount',
    format: 'number',
    icon: 'people',
    iconClass: 'customers'
  },
  {
    title: 'Total Orders',
    stat: 'wonDealsCount',
    format: 'number',
    icon: 'shopping_cart',
    iconClass: 'orders'
  },
  {
    title: 'Conversion Rate',
    stat: 'conversionRate',
    format: 'percentage',
    icon: 'analytics',
    iconClass: 'conversion'
  }
]

// Dashboard Service
class DashboardService {
  async getStatsOverview(): Promise<ApiResponse<StatsOverview>> {
    try {
      // Mock data for now - replace with actual API call
      const mockData: StatsOverview = {
        wonDealsValue: 125000,
        wonDealsCount: 1543,
        activeCustomersCount: 2847,
        conversionRate: 0.234,
        comparison: {
          wonDealsValue: 95000,
          wonDealsCount: 1234,
          activeCustomersCount: 2456,
          conversionRate: 0.198
        }
      }

      return {
        data: mockData,
        success: true,
        message: 'Stats overview loaded successfully'
      }
    } catch (error) {
      throw new Error('Failed to fetch stats overview')
    }
  }

  async getCustomerGrowth(): Promise<ApiResponse<CustomerGrowthData>> {
    try {
      const mockData: CustomerGrowthData = {
        newCustomers: [44, 55, 57, 56, 61, 58, 63, 60, 66],
        returningCustomers: [76, 85, 101, 98, 87, 105, 91, 114, 94],
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
      }

      return {
        data: mockData,
        success: true,
        message: 'Customer growth data loaded successfully'
      }
    } catch (error) {
      throw new Error('Failed to fetch customer growth data')
    }
  }

  async getRevenueData(timeframe: string = '30d'): Promise<ApiResponse<RevenueData>> {
    try {
      // Mock data based on timeframe
      let mockData: RevenueData

      switch (timeframe) {
        case '7d':
          mockData = {
            data: [31000, 40000, 35000, 50000, 49000, 60000, 70000],
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          }
          break
        case '3m':
          mockData = {
            data: [310000, 420000, 380000, 520000, 480000, 610000, 720000, 650000, 750000, 820000, 890000, 950000],
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          }
          break
        default: // 30d
          mockData = {
            data: [31000, 40000, 35000, 50000, 49000, 60000, 70000, 91000, 125000],
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
          }
      }

      return {
        data: mockData,
        success: true,
        message: 'Revenue data loaded successfully'
      }
    } catch (error) {
      throw new Error('Failed to fetch revenue data')
    }
  }
}

export const dashboardService = new DashboardService()
