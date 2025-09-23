import { apiClient } from './apiClient'
import type { ApiResponse, PaginatedResponse } from './apiClient'

// Types
export interface Supplier {
  id: number
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  taxId: string
  status: 'active' | 'inactive' | 'suspended'
  rating: number
  suppliedMedicinesCount: number
  totalOrderValue: number
  lastOrderDate: string
  registrationDate: string
  paymentTerms: string
  deliveryTime: number // in days
  minimumOrderValue: number
  website?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface SupplierFilters {
  search?: string
  status?: string
  city?: string
  state?: string
  country?: string
  ratingMin?: number
  ratingMax?: number
  minimumOrderMin?: number
  minimumOrderMax?: number
  deliveryTimeMin?: number
  deliveryTimeMax?: number
}

export interface SupplierPagination {
  page: number
  size: number
  sort?: string
  direction?: 'asc' | 'desc'
}

// Mock data for development
const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'MediSupply Corp',
    contactPerson: 'John Smith',
    email: 'john@medisupply.com',
    phone: '+1-555-0101',
    address: '123 Medical Plaza',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    taxId: 'TAX-001',
    status: 'active',
    rating: 4.8,
    suppliedMedicinesCount: 150,
    totalOrderValue: 125000.5,
    lastOrderDate: '2024-12-10',
    registrationDate: '2020-01-15',
    paymentTerms: 'Net 30',
    deliveryTime: 3,
    minimumOrderValue: 1000,
    website: 'https://medisupply.com',
    notes: 'Reliable supplier for generic medicines',
    createdAt: '2020-01-15T10:00:00Z',
    updatedAt: '2024-12-10T14:30:00Z',
  },
  {
    id: 2,
    name: 'PharmaDistributors Ltd',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@pharmadist.com',
    phone: '+1-555-0202',
    address: '456 Healthcare Avenue',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    country: 'USA',
    taxId: 'TAX-002',
    status: 'active',
    rating: 4.5,
    suppliedMedicinesCount: 89,
    totalOrderValue: 89750.25,
    lastOrderDate: '2024-12-08',
    registrationDate: '2019-03-22',
    paymentTerms: 'Net 15',
    deliveryTime: 5,
    minimumOrderValue: 500,
    website: 'https://pharmadist.com',
    notes: 'Specializes in brand name medications',
    createdAt: '2019-03-22T09:15:00Z',
    updatedAt: '2024-12-08T16:45:00Z',
  },
  {
    id: 3,
    name: 'Global Health Solutions',
    contactPerson: 'Michael Chen',
    email: 'michael@globalhealthsolutions.com',
    phone: '+1-555-0303',
    address: '789 Wellness Street',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'USA',
    taxId: 'TAX-003',
    status: 'active',
    rating: 4.2,
    suppliedMedicinesCount: 67,
    totalOrderValue: 67320.75,
    lastOrderDate: '2024-12-05',
    registrationDate: '2021-06-10',
    paymentTerms: 'Net 45',
    deliveryTime: 7,
    minimumOrderValue: 750,
    website: 'https://globalhealthsolutions.com',
    notes: 'International supplier with competitive prices',
    createdAt: '2021-06-10T11:30:00Z',
    updatedAt: '2024-12-05T13:20:00Z',
  },
  {
    id: 4,
    name: 'QuickMeds Express',
    contactPerson: 'Emily Davis',
    email: 'emily@quickmeds.com',
    phone: '+1-555-0404',
    address: '321 Rapid Road',
    city: 'Miami',
    state: 'FL',
    zipCode: '33101',
    country: 'USA',
    taxId: 'TAX-004',
    status: 'active',
    rating: 4.7,
    suppliedMedicinesCount: 123,
    totalOrderValue: 156780.0,
    lastOrderDate: '2024-12-12',
    registrationDate: '2020-09-18',
    paymentTerms: 'Net 20',
    deliveryTime: 2,
    minimumOrderValue: 300,
    website: 'https://quickmeds.com',
    notes: 'Fast delivery, emergency supplies specialist',
    createdAt: '2020-09-18T14:45:00Z',
    updatedAt: '2024-12-12T10:15:00Z',
  },
  {
    id: 5,
    name: 'BioPharm Industries',
    contactPerson: 'Robert Wilson',
    email: 'robert@biopharm.com',
    phone: '+1-555-0505',
    address: '654 Science Park',
    city: 'Boston',
    state: 'MA',
    zipCode: '02101',
    country: 'USA',
    taxId: 'TAX-005',
    status: 'suspended',
    rating: 3.8,
    suppliedMedicinesCount: 45,
    totalOrderValue: 34560.25,
    lastOrderDate: '2024-11-15',
    registrationDate: '2022-01-30',
    paymentTerms: 'Net 60',
    deliveryTime: 10,
    minimumOrderValue: 2000,
    website: 'https://biopharm.com',
    notes: 'Currently under quality review',
    createdAt: '2022-01-30T08:00:00Z',
    updatedAt: '2024-11-15T17:30:00Z',
  },
  // Adding more suppliers to reach 59 total...
  {
    id: 6,
    name: 'HealthTech Supplies',
    contactPerson: 'Lisa Anderson',
    email: 'lisa@healthtech.com',
    phone: '+1-555-0606',
    address: '987 Innovation Drive',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    country: 'USA',
    taxId: 'TAX-006',
    status: 'active',
    rating: 4.6,
    suppliedMedicinesCount: 98,
    totalOrderValue: 112340.5,
    lastOrderDate: '2024-12-11',
    registrationDate: '2019-08-14',
    paymentTerms: 'Net 25',
    deliveryTime: 4,
    minimumOrderValue: 800,
    website: 'https://healthtech.com',
    notes: 'Technology-focused medical supplies',
    createdAt: '2019-08-14T12:20:00Z',
    updatedAt: '2024-12-11T15:40:00Z',
  },
]

// Generate more mock suppliers to reach 59 total
const generateMoreSuppliers = (): Supplier[] => {
  const additionalSuppliers: Supplier[] = []
  const cities = [
    'Atlanta',
    'Dallas',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    'San Jose',
    'Austin',
    'Jacksonville',
    'Fort Worth',
  ]
  const states = ['GA', 'TX', 'AZ', 'PA', 'TX', 'CA', 'CA', 'TX', 'FL', 'TX']
  const companies = [
    'MedCore',
    'PharmaTech',
    'HealthFirst',
    'MediLink',
    'CarePlus',
    'VitalSupply',
    'WellnessCorp',
    'MedX',
    'PharmaSolutions',
    'HealthBridge',
  ]
  const statuses: ('active' | 'inactive' | 'suspended')[] = [
    'active',
    'active',
    'active',
    'active',
    'active',
    'inactive',
    'suspended',
  ]

  for (let i = 7; i <= 59; i++) {
    const cityIndex = (i - 7) % cities.length
    const companyIndex = (i - 7) % companies.length
    const statusIndex = (i - 7) % statuses.length

    additionalSuppliers.push({
      id: i,
      name: `${companies[companyIndex]} ${i}`,
      contactPerson: `Contact Person ${i}`,
      email: `contact${i}@${companies[companyIndex].toLowerCase()}.com`,
      phone: `+1-555-${String(i).padStart(4, '0')}`,
      address: `${i * 10} Medical Street`,
      city: cities[cityIndex],
      state: states[cityIndex],
      zipCode: `${10000 + i}`,
      country: 'USA',
      taxId: `TAX-${String(i).padStart(3, '0')}`,
      status: statuses[statusIndex],
      rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
      suppliedMedicinesCount: Math.floor(Math.random() * 200) + 20,
      totalOrderValue: Math.round((Math.random() * 200000 + 10000) * 100) / 100,
      lastOrderDate: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      registrationDate: `${2018 + Math.floor(Math.random() * 6)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      paymentTerms: ['Net 15', 'Net 30', 'Net 45', 'Net 60'][Math.floor(Math.random() * 4)],
      deliveryTime: Math.floor(Math.random() * 14) + 1,
      minimumOrderValue: [300, 500, 750, 1000, 1500, 2000][Math.floor(Math.random() * 6)],
      website: `https://${companies[companyIndex].toLowerCase()}${i}.com`,
      notes: `Notes for ${companies[companyIndex]} ${i}`,
      createdAt: `${2018 + Math.floor(Math.random() * 6)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00Z`,
      updatedAt: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00Z`,
    })
  }

  return additionalSuppliers
}

const allMockSuppliers = [...mockSuppliers, ...generateMoreSuppliers()]

// Constants
export const supplierStatuses = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Suspended', value: 'suspended' },
]

export const paymentTermsOptions = ['Net 15', 'Net 30', 'Net 45', 'Net 60']

export const supplierCities = Array.from(new Set(allMockSuppliers.map((s) => s.city))).sort()
export const supplierStates = Array.from(new Set(allMockSuppliers.map((s) => s.state))).sort()
export const supplierCountries = Array.from(new Set(allMockSuppliers.map((s) => s.country))).sort()

// Service functions
class SuppliersService {
  async getSuppliers(
    filters: SupplierFilters = {},
    pagination: SupplierPagination,
  ): Promise<ApiResponse<PaginatedResponse<Supplier>>> {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredSuppliers = [...allMockSuppliers]

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredSuppliers = filteredSuppliers.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchLower) ||
          supplier.contactPerson.toLowerCase().includes(searchLower) ||
          supplier.email.toLowerCase().includes(searchLower) ||
          supplier.phone.includes(filters.search!) ||
          supplier.city.toLowerCase().includes(searchLower),
      )
    }

    if (filters.status) {
      filteredSuppliers = filteredSuppliers.filter((supplier) => supplier.status === filters.status)
    }

    if (filters.city) {
      filteredSuppliers = filteredSuppliers.filter((supplier) => supplier.city === filters.city)
    }

    if (filters.state) {
      filteredSuppliers = filteredSuppliers.filter((supplier) => supplier.state === filters.state)
    }

    if (filters.country) {
      filteredSuppliers = filteredSuppliers.filter(
        (supplier) => supplier.country === filters.country,
      )
    }

    if (filters.ratingMin !== undefined) {
      filteredSuppliers = filteredSuppliers.filter(
        (supplier) => supplier.rating >= filters.ratingMin!,
      )
    }

    if (filters.ratingMax !== undefined) {
      filteredSuppliers = filteredSuppliers.filter(
        (supplier) => supplier.rating <= filters.ratingMax!,
      )
    }

    if (filters.minimumOrderMin !== undefined) {
      filteredSuppliers = filteredSuppliers.filter(
        (supplier) => supplier.minimumOrderValue >= filters.minimumOrderMin!,
      )
    }

    if (filters.minimumOrderMax !== undefined) {
      filteredSuppliers = filteredSuppliers.filter(
        (supplier) => supplier.minimumOrderValue <= filters.minimumOrderMax!,
      )
    }

    if (filters.deliveryTimeMin !== undefined) {
      filteredSuppliers = filteredSuppliers.filter(
        (supplier) => supplier.deliveryTime >= filters.deliveryTimeMin!,
      )
    }

    if (filters.deliveryTimeMax !== undefined) {
      filteredSuppliers = filteredSuppliers.filter(
        (supplier) => supplier.deliveryTime <= filters.deliveryTimeMax!,
      )
    }

    // Apply sorting
    if (pagination.sort) {
      filteredSuppliers.sort((a, b) => {
        const aValue = (a as any)[pagination.sort!]
        const bValue = (b as any)[pagination.sort!]

        let comparison = 0
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue)
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue
        } else {
          comparison = String(aValue).localeCompare(String(bValue))
        }

        return pagination.direction === 'desc' ? -comparison : comparison
      })
    }

    // Apply pagination
    const totalElements = filteredSuppliers.length
    const totalPages = Math.ceil(totalElements / pagination.size)
    const startIndex = pagination.page * pagination.size
    const endIndex = startIndex + pagination.size
    const paginatedSuppliers = filteredSuppliers.slice(startIndex, endIndex)

    return {
      data: {
        data: {
          content: paginatedSuppliers,
          links: 0,
          page: {
            number: pagination.page,
            size: pagination.size,
            totalElements,
            totalPages,
          },
        },
      },
      success: true,
      message: 'Suppliers retrieved successfully',
    }
  }

  async getSupplierById(id: number): Promise<ApiResponse<Supplier>> {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const supplier = allMockSuppliers.find((s) => s.id === id)
    if (!supplier) {
      throw new Error('Supplier not found')
    }

    return {
      data: supplier,
      success: true,
      message: 'Supplier retrieved successfully',
    }
  }

  async createSupplier(
    supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ApiResponse<Supplier>> {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newSupplier: Supplier = {
      ...supplier,
      id: Math.max(...allMockSuppliers.map((s) => s.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    allMockSuppliers.push(newSupplier)

    return {
      data: newSupplier,
      success: true,
      message: 'Supplier created successfully',
    }
  }

  async updateSupplier(
    id: number,
    updates: Partial<Omit<Supplier, 'id' | 'createdAt'>>,
  ): Promise<ApiResponse<Supplier>> {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    const supplierIndex = allMockSuppliers.findIndex((s) => s.id === id)
    if (supplierIndex === -1) {
      throw new Error('Supplier not found')
    }

    const updatedSupplier = {
      ...allMockSuppliers[supplierIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    allMockSuppliers[supplierIndex] = updatedSupplier

    return {
      data: updatedSupplier,
      success: true,
      message: 'Supplier updated successfully',
    }
  }

  async deleteSupplier(id: number): Promise<ApiResponse<void>> {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const supplierIndex = allMockSuppliers.findIndex((s) => s.id === id)
    if (supplierIndex === -1) {
      throw new Error('Supplier not found')
    }

    allMockSuppliers.splice(supplierIndex, 1)

    return {
      data: undefined as any,
      success: true,
      message: 'Supplier deleted successfully',
    }
  }

  async bulkDeleteSuppliers(ids: number[]): Promise<ApiResponse<void>> {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    for (const id of ids) {
      const supplierIndex = allMockSuppliers.findIndex((s) => s.id === id)
      if (supplierIndex !== -1) {
        allMockSuppliers.splice(supplierIndex, 1)
      }
    }

    return {
      data: undefined as any,
      success: true,
      message: `${ids.length} suppliers deleted successfully`,
    }
  }
}

export const suppliersService = new SuppliersService()
