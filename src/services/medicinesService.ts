import { apiClient } from './apiClient'
import type { ApiResponse, PaginatedResponse } from './apiClient'

// Types
export interface Medicine {
  id: number
  name: string
  genericName: string
  manufacturer: string
  category: string
  dosageForm: string
  strength: string
  unitPrice: number
  stockQuantity: number
  expiryDate: string
  batchNumber: string
  status: 'active' | 'inactive' | 'discontinued'
  createdAt: string
  updatedAt: string
}

export interface MedicineFilters {
  search?: string
  category?: string
  manufacturer?: string
  status?: string
  dosageForm?: string
  priceMin?: number
  priceMax?: number
  expiryDateFrom?: string
  expiryDateTo?: string
  stockMin?: number
  stockMax?: number
}

export interface MedicinePagination {
  page: number
  size: number
  sort?: string
  direction?: 'asc' | 'desc'
}

// Mock data for development
const mockMedicines: Medicine[] = [
  {
    id: 1,
    name: 'Paracetamol Tablets',
    genericName: 'Acetaminophen',
    manufacturer: 'PharmaCorp',
    category: 'Pain Relief',
    dosageForm: 'Tablet',
    strength: '500mg',
    unitPrice: 12.50,
    stockQuantity: 250,
    expiryDate: '2026-08-15',
    batchNumber: 'PC2025001',
    status: 'active',
    createdAt: '2025-01-15T08:30:00Z',
    updatedAt: '2025-09-10T14:20:00Z'
  },
  {
    id: 2,
    name: 'Amoxicillin Capsules',
    genericName: 'Amoxicillin',
    manufacturer: 'MediPharm',
    category: 'Antibiotics',
    dosageForm: 'Capsule',
    strength: '250mg',
    unitPrice: 28.75,
    stockQuantity: 180,
    expiryDate: '2025-12-20',
    batchNumber: 'MP2024015',
    status: 'active',
    createdAt: '2024-12-01T10:15:00Z',
    updatedAt: '2025-09-08T09:45:00Z'
  },
  {
    id: 3,
    name: 'Lisinopril Tablets',
    genericName: 'Lisinopril',
    manufacturer: 'CardioMed',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    strength: '10mg',
    unitPrice: 45.20,
    stockQuantity: 120,
    expiryDate: '2027-03-10',
    batchNumber: 'CM2025003',
    status: 'active',
    createdAt: '2025-03-05T11:20:00Z',
    updatedAt: '2025-09-11T16:30:00Z'
  },
  {
    id: 4,
    name: 'Insulin Glargine Injection',
    genericName: 'Insulin Glargine',
    manufacturer: 'DiabetesRx',
    category: 'Diabetes',
    dosageForm: 'Injection',
    strength: '100IU/mL',
    unitPrice: 125.80,
    stockQuantity: 45,
    expiryDate: '2025-11-30',
    batchNumber: 'DR2024012',
    status: 'active',
    createdAt: '2024-11-15T13:45:00Z',
    updatedAt: '2025-09-09T12:15:00Z'
  },
  {
    id: 5,
    name: 'Omeprazole Capsules',
    genericName: 'Omeprazole',
    manufacturer: 'GastroHealth',
    category: 'Gastrointestinal',
    dosageForm: 'Capsule',
    strength: '20mg',
    unitPrice: 18.90,
    stockQuantity: 0,
    expiryDate: '2024-10-15',
    batchNumber: 'GH2023008',
    status: 'discontinued',
    createdAt: '2023-08-20T09:30:00Z',
    updatedAt: '2025-09-05T08:00:00Z'
  },
  {
    id: 6,
    name: 'Metformin Tablets',
    genericName: 'Metformin Hydrochloride',
    manufacturer: 'DiabetesRx',
    category: 'Diabetes',
    dosageForm: 'Tablet',
    strength: '850mg',
    unitPrice: 15.25,
    stockQuantity: 300,
    expiryDate: '2026-12-31',
    batchNumber: 'DR2025004',
    status: 'active',
    createdAt: '2025-02-10T09:15:00Z',
    updatedAt: '2025-09-12T11:20:00Z'
  },
  {
    id: 7,
    name: 'Salbutamol Inhaler',
    genericName: 'Salbutamol Sulfate',
    manufacturer: 'RespiCare',
    category: 'Respiratory',
    dosageForm: 'Inhaler',
    strength: '100mcg/dose',
    unitPrice: 32.40,
    stockQuantity: 75,
    expiryDate: '2026-06-15',
    batchNumber: 'RC2025002',
    status: 'active',
    createdAt: '2025-03-15T14:30:00Z',
    updatedAt: '2025-09-11T16:45:00Z'
  },
  {
    id: 8,
    name: 'Hydrochlorothiazide Tablets',
    genericName: 'Hydrochlorothiazide',
    manufacturer: 'CardioMed',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    strength: '25mg',
    unitPrice: 22.10,
    stockQuantity: 0,
    expiryDate: '2026-04-20',
    batchNumber: 'CM2025005',
    status: 'inactive',
    createdAt: '2025-01-25T10:45:00Z',
    updatedAt: '2025-09-08T13:15:00Z'
  },
  {
    id: 9,
    name: 'Cetirizine Tablets',
    genericName: 'Cetirizine Hydrochloride',
    manufacturer: 'MediPharm',
    category: 'Respiratory',
    dosageForm: 'Tablet',
    strength: '10mg',
    unitPrice: 8.95,
    stockQuantity: 150,
    expiryDate: '2026-09-30',
    batchNumber: 'MP2025003',
    status: 'active',
    createdAt: '2025-04-05T08:20:00Z',
    updatedAt: '2025-09-10T12:30:00Z'
  },
  {
    id: 10,
    name: 'Diclofenac Gel',
    genericName: 'Diclofenac Sodium',
    manufacturer: 'DermaTech',
    category: 'Dermatology',
    dosageForm: 'Cream',
    strength: '1%',
    unitPrice: 14.75,
    stockQuantity: 25,
    expiryDate: '2025-12-15',
    batchNumber: 'DT2024008',
    status: 'active',
    createdAt: '2024-10-12T15:25:00Z',
    updatedAt: '2025-09-09T14:40:00Z'
  },
  {
    id: 11,
    name: 'Vitamin D3 Drops',
    genericName: 'Cholecalciferol',
    manufacturer: 'VitaLife',
    category: 'Vitamins & Supplements',
    dosageForm: 'Drops',
    strength: '1000IU/drop',
    unitPrice: 24.80,
    stockQuantity: 85,
    expiryDate: '2027-01-20',
    batchNumber: 'VL2025001',
    status: 'active',
    createdAt: '2025-01-08T11:10:00Z',
    updatedAt: '2025-09-11T09:50:00Z'
  },
  {
    id: 12,
    name: 'Loratadine Syrup',
    genericName: 'Loratadine',
    manufacturer: 'RespiCare',
    category: 'Respiratory',
    dosageForm: 'Syrup',
    strength: '5mg/5mL',
    unitPrice: 16.30,
    stockQuantity: 40,
    expiryDate: '2026-05-10',
    batchNumber: 'RC2025003',
    status: 'active',
    createdAt: '2025-02-20T13:45:00Z',
    updatedAt: '2025-09-10T15:20:00Z'
  },
  {
    id: 13,
    name: 'Aspirin Tablets',
    genericName: 'Acetylsalicylic Acid',
    manufacturer: 'PharmaCorp',
    category: 'Pain Relief',
    dosageForm: 'Tablet',
    strength: '325mg',
    unitPrice: 7.25,
    stockQuantity: 200,
    expiryDate: '2026-11-25',
    batchNumber: 'PC2025006',
    status: 'active',
    createdAt: '2025-03-12T10:30:00Z',
    updatedAt: '2025-09-12T08:15:00Z'
  },
  {
    id: 14,
    name: 'Simvastatin Tablets',
    genericName: 'Simvastatin',
    manufacturer: 'CardioMed',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    strength: '20mg',
    unitPrice: 35.60,
    stockQuantity: 110,
    expiryDate: '2026-08-05',
    batchNumber: 'CM2025007',
    status: 'active',
    createdAt: '2025-04-18T12:20:00Z',
    updatedAt: '2025-09-11T14:35:00Z'
  },
  {
    id: 15,
    name: 'Ranitidine Tablets',
    genericName: 'Ranitidine Hydrochloride',
    manufacturer: 'GastroHealth',
    category: 'Gastrointestinal',
    dosageForm: 'Tablet',
    strength: '150mg',
    unitPrice: 12.40,
    stockQuantity: 0,
    expiryDate: '2025-10-30',
    batchNumber: 'GH2024009',
    status: 'discontinued',
    createdAt: '2024-08-15T09:40:00Z',
    updatedAt: '2025-09-08T16:25:00Z'
  },
  {
    id: 16,
    name: 'Gabapentin Capsules',
    genericName: 'Gabapentin',
    manufacturer: 'NeuroMed',
    category: 'Neurology',
    dosageForm: 'Capsule',
    strength: '300mg',
    unitPrice: 42.15,
    stockQuantity: 65,
    expiryDate: '2026-07-12',
    batchNumber: 'NM2025002',
    status: 'active',
    createdAt: '2025-01-30T14:15:00Z',
    updatedAt: '2025-09-09T11:40:00Z'
  },
  {
    id: 17,
    name: 'Fluoxetine Capsules',
    genericName: 'Fluoxetine Hydrochloride',
    manufacturer: 'NeuroMed',
    category: 'Neurology',
    dosageForm: 'Capsule',
    strength: '20mg',
    unitPrice: 38.90,
    stockQuantity: 30,
    expiryDate: '2026-02-28',
    batchNumber: 'NM2025003',
    status: 'active',
    createdAt: '2025-02-05T15:50:00Z',
    updatedAt: '2025-09-10T10:25:00Z'
  },
  {
    id: 18,
    name: 'Prednisolone Tablets',
    genericName: 'Prednisolone',
    manufacturer: 'MediPharm',
    category: 'Pain Relief',
    dosageForm: 'Tablet',
    strength: '5mg',
    unitPrice: 19.85,
    stockQuantity: 90,
    expiryDate: '2026-10-18',
    batchNumber: 'MP2025004',
    status: 'active',
    createdAt: '2025-03-22T08:35:00Z',
    updatedAt: '2025-09-11T13:45:00Z'
  },
  {
    id: 19,
    name: 'Tamoxifen Tablets',
    genericName: 'Tamoxifen Citrate',
    manufacturer: 'OncoPharm',
    category: 'Oncology',
    dosageForm: 'Tablet',
    strength: '20mg',
    unitPrice: 89.20,
    stockQuantity: 15,
    expiryDate: '2025-11-08',
    batchNumber: 'OP2024001',
    status: 'active',
    createdAt: '2024-09-12T11:25:00Z',
    updatedAt: '2025-09-08T14:50:00Z'
  },
  {
    id: 20,
    name: 'Levothyroxine Tablets',
    genericName: 'Levothyroxine Sodium',
    manufacturer: 'PharmaCorp',
    category: 'Vitamins & Supplements',
    dosageForm: 'Tablet',
    strength: '50mcg',
    unitPrice: 26.45,
    stockQuantity: 140,
    expiryDate: '2027-05-15',
    batchNumber: 'PC2025008',
    status: 'active',
    createdAt: '2025-04-10T09:20:00Z',
    updatedAt: '2025-09-12T07:30:00Z'
  },
  {
    id: 21,
    name: 'Clopidogrel Tablets',
    genericName: 'Clopidogrel Bisulfate',
    manufacturer: 'CardioMed',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    strength: '75mg',
    unitPrice: 52.30,
    stockQuantity: 0,
    expiryDate: '2026-01-22',
    batchNumber: 'CM2025009',
    status: 'inactive',
    createdAt: '2025-01-05T13:10:00Z',
    updatedAt: '2025-09-09T12:40:00Z'
  },
  {
    id: 22,
    name: 'Montelukast Tablets',
    genericName: 'Montelukast Sodium',
    manufacturer: 'RespiCare',
    category: 'Respiratory',
    dosageForm: 'Tablet',
    strength: '10mg',
    unitPrice: 34.75,
    stockQuantity: 55,
    expiryDate: '2026-09-12',
    batchNumber: 'RC2025004',
    status: 'active',
    createdAt: '2025-02-28T16:45:00Z',
    updatedAt: '2025-09-10T14:15:00Z'
  },
  {
    id: 23,
    name: 'Hydrocortisone Cream',
    genericName: 'Hydrocortisone',
    manufacturer: 'DermaTech',
    category: 'Dermatology',
    dosageForm: 'Cream',
    strength: '1%',
    unitPrice: 11.60,
    stockQuantity: 35,
    expiryDate: '2026-03-30',
    batchNumber: 'DT2025002',
    status: 'active',
    createdAt: '2025-03-05T11:30:00Z',
    updatedAt: '2025-09-11T15:25:00Z'
  },
  {
    id: 24,
    name: 'Domperidone Tablets',
    genericName: 'Domperidone',
    manufacturer: 'GastroHealth',
    category: 'Gastrointestinal',
    dosageForm: 'Tablet',
    strength: '10mg',
    unitPrice: 21.15,
    stockQuantity: 80,
    expiryDate: '2026-12-08',
    batchNumber: 'GH2025003',
    status: 'active',
    createdAt: '2025-04-22T10:55:00Z',
    updatedAt: '2025-09-12T09:40:00Z'
  },
  {
    id: 25,
    name: 'Calcium Carbonate Tablets',
    genericName: 'Calcium Carbonate',
    manufacturer: 'VitaLife',
    category: 'Vitamins & Supplements',
    dosageForm: 'Tablet',
    strength: '500mg',
    unitPrice: 13.80,
    stockQuantity: 160,
    expiryDate: '2027-02-14',
    batchNumber: 'VL2025003',
    status: 'active',
    createdAt: '2025-01-18T14:40:00Z',
    updatedAt: '2025-09-10T11:55:00Z'
  },
  {
    id: 26,
    name: 'Azithromycin Tablets',
    genericName: 'Azithromycin',
    manufacturer: 'MediPharm',
    category: 'Antibiotics',
    dosageForm: 'Tablet',
    strength: '250mg',
    unitPrice: 45.60,
    stockQuantity: 20,
    expiryDate: '2025-12-25',
    batchNumber: 'MP2024005',
    status: 'active',
    createdAt: '2024-11-20T13:25:00Z',
    updatedAt: '2025-09-09T16:10:00Z'
  },
  {
    id: 27,
    name: 'Warfarin Tablets',
    genericName: 'Warfarin Sodium',
    manufacturer: 'CardioMed',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    strength: '5mg',
    unitPrice: 28.35,
    stockQuantity: 95,
    expiryDate: '2026-06-30',
    batchNumber: 'CM2025010',
    status: 'active',
    createdAt: '2025-03-08T12:15:00Z',
    updatedAt: '2025-09-11T08:50:00Z'
  },
  {
    id: 28,
    name: 'Sertraline Tablets',
    genericName: 'Sertraline Hydrochloride',
    manufacturer: 'NeuroMed',
    category: 'Neurology',
    dosageForm: 'Tablet',
    strength: '50mg',
    unitPrice: 41.20,
    stockQuantity: 42,
    expiryDate: '2026-04-15',
    batchNumber: 'NM2025004',
    status: 'active',
    createdAt: '2025-02-12T15:30:00Z',
    updatedAt: '2025-09-10T13:20:00Z'
  },
  {
    id: 29,
    name: 'Cisplatin Injection',
    genericName: 'Cisplatin',
    manufacturer: 'OncoPharm',
    category: 'Oncology',
    dosageForm: 'Injection',
    strength: '50mg/50mL',
    unitPrice: 156.90,
    stockQuantity: 8,
    expiryDate: '2025-10-20',
    batchNumber: 'OP2024002',
    status: 'active',
    createdAt: '2024-08-25T10:45:00Z',
    updatedAt: '2025-09-08T15:35:00Z'
  },
  {
    id: 30,
    name: 'Folic Acid Tablets',
    genericName: 'Folic Acid',
    manufacturer: 'VitaLife',
    category: 'Vitamins & Supplements',
    dosageForm: 'Tablet',
    strength: '5mg',
    unitPrice: 9.45,
    stockQuantity: 220,
    expiryDate: '2027-08-10',
    batchNumber: 'VL2025004',
    status: 'active',
    createdAt: '2025-04-15T11:20:00Z',
    updatedAt: '2025-09-12T10:15:00Z'
  },
  {
    id: 31,
    name: 'Clindamycin Capsules',
    genericName: 'Clindamycin Hydrochloride',
    manufacturer: 'MediPharm',
    category: 'Antibiotics',
    dosageForm: 'Capsule',
    strength: '150mg',
    unitPrice: 32.85,
    stockQuantity: 0,
    expiryDate: '2025-11-15',
    batchNumber: 'MP2024006',
    status: 'inactive',
    createdAt: '2024-10-08T14:50:00Z',
    updatedAt: '2025-09-09T09:25:00Z'
  },
  {
    id: 32,
    name: 'Amlodipine Tablets',
    genericName: 'Amlodipine Besylate',
    manufacturer: 'CardioMed',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    strength: '5mg',
    unitPrice: 19.70,
    stockQuantity: 130,
    expiryDate: '2026-12-20',
    batchNumber: 'CM2025011',
    status: 'active',
    createdAt: '2025-01-20T09:40:00Z',
    updatedAt: '2025-09-11T12:45:00Z'
  },
  {
    id: 33,
    name: 'Pantoprazole Tablets',
    genericName: 'Pantoprazole Sodium',
    manufacturer: 'GastroHealth',
    category: 'Gastrointestinal',
    dosageForm: 'Tablet',
    strength: '40mg',
    unitPrice: 23.55,
    stockQuantity: 70,
    expiryDate: '2026-05-25',
    batchNumber: 'GH2025004',
    status: 'active',
    createdAt: '2025-03-18T13:15:00Z',
    updatedAt: '2025-09-10T16:30:00Z'
  },
  {
    id: 34,
    name: 'Betamethasone Cream',
    genericName: 'Betamethasone Valerate',
    manufacturer: 'DermaTech',
    category: 'Dermatology',
    dosageForm: 'Cream',
    strength: '0.1%',
    unitPrice: 17.25,
    stockQuantity: 28,
    expiryDate: '2026-01-12',
    batchNumber: 'DT2025003',
    status: 'active',
    createdAt: '2025-02-25T12:35:00Z',
    updatedAt: '2025-09-09T14:20:00Z'
  },
  {
    id: 35,
    name: 'Iron Sulfate Tablets',
    genericName: 'Ferrous Sulfate',
    manufacturer: 'VitaLife',
    category: 'Vitamins & Supplements',
    dosageForm: 'Tablet',
    strength: '325mg',
    unitPrice: 11.90,
    stockQuantity: 185,
    expiryDate: '2026-11-30',
    batchNumber: 'VL2025005',
    status: 'active',
    createdAt: '2025-04-08T10:25:00Z',
    updatedAt: '2025-09-12T08:40:00Z'
  },
  {
    id: 36,
    name: 'Ciprofloxacin Tablets',
    genericName: 'Ciprofloxacin Hydrochloride',
    manufacturer: 'MediPharm',
    category: 'Antibiotics',
    dosageForm: 'Tablet',
    strength: '500mg',
    unitPrice: 38.40,
    stockQuantity: 25,
    expiryDate: '2025-12-10',
    batchNumber: 'MP2024007',
    status: 'active',
    createdAt: '2024-11-05T15:15:00Z',
    updatedAt: '2025-09-08T11:45:00Z'
  },
  {
    id: 37,
    name: 'Losartan Tablets',
    genericName: 'Losartan Potassium',
    manufacturer: 'CardioMed',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    strength: '50mg',
    unitPrice: 29.80,
    stockQuantity: 105,
    expiryDate: '2026-07-18',
    batchNumber: 'CM2025012',
    status: 'active',
    createdAt: '2025-03-28T11:50:00Z',
    updatedAt: '2025-09-11T15:10:00Z'
  },
  {
    id: 38,
    name: 'Diazepam Tablets',
    genericName: 'Diazepam',
    manufacturer: 'NeuroMed',
    category: 'Neurology',
    dosageForm: 'Tablet',
    strength: '5mg',
    unitPrice: 24.65,
    stockQuantity: 38,
    expiryDate: '2026-02-08',
    batchNumber: 'NM2025005',
    status: 'active',
    createdAt: '2025-01-12T14:25:00Z',
    updatedAt: '2025-09-10T12:55:00Z'
  },
  {
    id: 39,
    name: 'Doxorubicin Injection',
    genericName: 'Doxorubicin Hydrochloride',
    manufacturer: 'OncoPharm',
    category: 'Oncology',
    dosageForm: 'Injection',
    strength: '50mg/25mL',
    unitPrice: 189.75,
    stockQuantity: 12,
    expiryDate: '2025-09-30',
    batchNumber: 'OP2024003',
    status: 'active',
    createdAt: '2024-07-18T13:40:00Z',
    updatedAt: '2025-09-09T10:30:00Z'
  },
  {
    id: 40,
    name: 'Multivitamin Tablets',
    genericName: 'Multivitamin Complex',
    manufacturer: 'VitaLife',
    category: 'Vitamins & Supplements',
    dosageForm: 'Tablet',
    strength: 'Standard',
    unitPrice: 18.20,
    stockQuantity: 240,
    expiryDate: '2027-06-15',
    batchNumber: 'VL2025006',
    status: 'active',
    createdAt: '2025-02-08T09:35:00Z',
    updatedAt: '2025-09-11T14:50:00Z'
  },
  {
    id: 41,
    name: 'Erythromycin Tablets',
    genericName: 'Erythromycin',
    manufacturer: 'MediPharm',
    category: 'Antibiotics',
    dosageForm: 'Tablet',
    strength: '250mg',
    unitPrice: 26.90,
    stockQuantity: 0,
    expiryDate: '2025-10-05',
    batchNumber: 'MP2024008',
    status: 'discontinued',
    createdAt: '2024-08-12T16:20:00Z',
    updatedAt: '2025-09-08T13:25:00Z'
  },
  {
    id: 42,
    name: 'Atenolol Tablets',
    genericName: 'Atenolol',
    manufacturer: 'CardioMed',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    strength: '50mg',
    unitPrice: 16.75,
    stockQuantity: 88,
    expiryDate: '2026-08-22',
    batchNumber: 'CM2025013',
    status: 'active',
    createdAt: '2025-04-02T12:10:00Z',
    updatedAt: '2025-09-12T09:15:00Z'
  },
  {
    id: 43,
    name: 'Lansoprazole Capsules',
    genericName: 'Lansoprazole',
    manufacturer: 'GastroHealth',
    category: 'Gastrointestinal',
    dosageForm: 'Capsule',
    strength: '30mg',
    unitPrice: 31.45,
    stockQuantity: 62,
    expiryDate: '2026-04-10',
    batchNumber: 'GH2025005',
    status: 'active',
    createdAt: '2025-03-15T10:45:00Z',
    updatedAt: '2025-09-10T15:40:00Z'
  },
  {
    id: 44,
    name: 'Mupirocin Ointment',
    genericName: 'Mupirocin',
    manufacturer: 'DermaTech',
    category: 'Dermatology',
    dosageForm: 'Ointment',
    strength: '2%',
    unitPrice: 22.30,
    stockQuantity: 18,
    expiryDate: '2025-11-20',
    batchNumber: 'DT2024004',
    status: 'active',
    createdAt: '2024-09-28T14:55:00Z',
    updatedAt: '2025-09-09T11:20:00Z'
  },
  {
    id: 45,
    name: 'Magnesium Oxide Tablets',
    genericName: 'Magnesium Oxide',
    manufacturer: 'VitaLife',
    category: 'Vitamins & Supplements',
    dosageForm: 'Tablet',
    strength: '400mg',
    unitPrice: 14.60,
    stockQuantity: 175,
    expiryDate: '2027-01-08',
    batchNumber: 'VL2025007',
    status: 'active',
    createdAt: '2025-01-28T11:30:00Z',
    updatedAt: '2025-09-11T13:25:00Z'
  },
  {
    id: 46,
    name: 'Doxycycline Capsules',
    genericName: 'Doxycycline Hyclate',
    manufacturer: 'MediPharm',
    category: 'Antibiotics',
    dosageForm: 'Capsule',
    strength: '100mg',
    unitPrice: 35.15,
    stockQuantity: 33,
    expiryDate: '2025-12-28',
    batchNumber: 'MP2024009',
    status: 'active',
    createdAt: '2024-12-15T13:15:00Z',
    updatedAt: '2025-09-08T16:45:00Z'
  },
  {
    id: 47,
    name: 'Furosemide Tablets',
    genericName: 'Furosemide',
    manufacturer: 'CardioMed',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    strength: '40mg',
    unitPrice: 12.85,
    stockQuantity: 92,
    expiryDate: '2026-09-15',
    batchNumber: 'CM2025014',
    status: 'active',
    createdAt: '2025-02-18T15:25:00Z',
    updatedAt: '2025-09-12T11:35:00Z'
  },
  {
    id: 48,
    name: 'Alprazolam Tablets',
    genericName: 'Alprazolam',
    manufacturer: 'NeuroMed',
    category: 'Neurology',
    dosageForm: 'Tablet',
    strength: '0.5mg',
    unitPrice: 33.70,
    stockQuantity: 27,
    expiryDate: '2026-03-12',
    batchNumber: 'NM2025006',
    status: 'active',
    createdAt: '2025-02-02T12:40:00Z',
    updatedAt: '2025-09-09T14:15:00Z'
  },
  {
    id: 49,
    name: 'Carboplatin Injection',
    genericName: 'Carboplatin',
    manufacturer: 'OncoPharm',
    category: 'Oncology',
    dosageForm: 'Injection',
    strength: '150mg/15mL',
    unitPrice: 142.60,
    stockQuantity: 6,
    expiryDate: '2025-08-18',
    batchNumber: 'OP2024004',
    status: 'active',
    createdAt: '2024-06-30T11:10:00Z',
    updatedAt: '2025-09-08T09:55:00Z'
  },
  {
    id: 50,
    name: 'Omega-3 Capsules',
    genericName: 'Omega-3 Fatty Acids',
    manufacturer: 'VitaLife',
    category: 'Vitamins & Supplements',
    dosageForm: 'Capsule',
    strength: '1000mg',
    unitPrice: 27.40,
    stockQuantity: 195,
    expiryDate: '2027-04-25',
    batchNumber: 'VL2025008',
    status: 'active',
    createdAt: '2025-03-10T10:20:00Z',
    updatedAt: '2025-09-11T16:10:00Z'
  },
  {
    id: 51,
    name: 'Cephalexin Capsules',
    genericName: 'Cephalexin',
    manufacturer: 'MediPharm',
    category: 'Antibiotics',
    dosageForm: 'Capsule',
    strength: '500mg',
    unitPrice: 29.65,
    stockQuantity: 0,
    expiryDate: '2025-09-22',
    batchNumber: 'MP2024010',
    status: 'inactive',
    createdAt: '2024-07-08T14:30:00Z',
    updatedAt: '2025-09-09T12:50:00Z'
  },
  {
    id: 52,
    name: 'Bisoprolol Tablets',
    genericName: 'Bisoprolol Fumarate',
    manufacturer: 'CardioMed',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    strength: '5mg',
    unitPrice: 21.90,
    stockQuantity: 78,
    expiryDate: '2026-10-12',
    batchNumber: 'CM2025015',
    status: 'active',
    createdAt: '2025-04-25T09:45:00Z',
    updatedAt: '2025-09-10T13:30:00Z'
  },
  {
    id: 53,
    name: 'Esomeprazole Tablets',
    genericName: 'Esomeprazole Magnesium',
    manufacturer: 'GastroHealth',
    category: 'Gastrointestinal',
    dosageForm: 'Tablet',
    strength: '20mg',
    unitPrice: 26.80,
    stockQuantity: 54,
    expiryDate: '2026-06-08',
    batchNumber: 'GH2025006',
    status: 'active',
    createdAt: '2025-01-15T15:20:00Z',
    updatedAt: '2025-09-12T14:25:00Z'
  },
  {
    id: 54,
    name: 'Tretinoin Cream',
    genericName: 'Tretinoin',
    manufacturer: 'DermaTech',
    category: 'Dermatology',
    dosageForm: 'Cream',
    strength: '0.025%',
    unitPrice: 34.50,
    stockQuantity: 22,
    expiryDate: '2025-12-30',
    batchNumber: 'DT2024005',
    status: 'active',
    createdAt: '2024-10-22T12:15:00Z',
    updatedAt: '2025-09-08T15:40:00Z'
  },
  {
    id: 55,
    name: 'Zinc Sulfate Tablets',
    genericName: 'Zinc Sulfate',
    manufacturer: 'VitaLife',
    category: 'Vitamins & Supplements',
    dosageForm: 'Tablet',
    strength: '220mg',
    unitPrice: 16.25,
    stockQuantity: 148,
    expiryDate: '2026-12-05',
    batchNumber: 'VL2025009',
    status: 'active',
    createdAt: '2025-04-12T11:40:00Z',
    updatedAt: '2025-09-11T10:20:00Z'
  },
  {
    id: 56,
    name: 'Trimethoprim Tablets',
    genericName: 'Trimethoprim',
    manufacturer: 'MediPharm',
    category: 'Antibiotics',
    dosageForm: 'Tablet',
    strength: '200mg',
    unitPrice: 22.75,
    stockQuantity: 41,
    expiryDate: '2025-11-12',
    batchNumber: 'MP2024011',
    status: 'active',
    createdAt: '2024-09-18T13:55:00Z',
    updatedAt: '2025-09-09T16:20:00Z'
  },
  {
    id: 57,
    name: 'Carvedilol Tablets',
    genericName: 'Carvedilol',
    manufacturer: 'CardioMed',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    strength: '25mg',
    unitPrice: 37.85,
    stockQuantity: 0,
    expiryDate: '2026-05-18',
    batchNumber: 'CM2025016',
    status: 'inactive',
    createdAt: '2025-03-25T16:10:00Z',
    updatedAt: '2025-09-10T08:45:00Z'
  },
  {
    id: 58,
    name: 'Lorazepam Tablets',
    genericName: 'Lorazepam',
    manufacturer: 'NeuroMed',
    category: 'Neurology',
    dosageForm: 'Tablet',
    strength: '1mg',
    unitPrice: 28.95,
    stockQuantity: 36,
    expiryDate: '2026-01-28',
    batchNumber: 'NM2025007',
    status: 'active',
    createdAt: '2025-01-08T14:45:00Z',
    updatedAt: '2025-09-12T12:30:00Z'
  },
  {
    id: 59,
    name: 'Paclitaxel Injection',
    genericName: 'Paclitaxel',
    manufacturer: 'OncoPharm',
    category: 'Oncology',
    dosageForm: 'Injection',
    strength: '100mg/16.7mL',
    unitPrice: 234.80,
    stockQuantity: 4,
    expiryDate: '2025-07-22',
    batchNumber: 'OP2024005',
    status: 'active',
    createdAt: '2024-05-15T10:25:00Z',
    updatedAt: '2025-09-08T14:35:00Z'
  }
]

// Filter options
export const medicineCategories = [
  'Pain Relief',
  'Antibiotics',
  'Cardiovascular',
  'Diabetes',
  'Gastrointestinal',
  'Respiratory',
  'Dermatology',
  'Neurology',
  'Oncology',
  'Vitamins & Supplements'
]

export const medicineManufacturers = [
  'PharmaCorp',
  'MediPharm',
  'CardioMed',
  'DiabetesRx',
  'GastroHealth',
  'RespiCare',
  'DermaTech',
  'NeuroMed',
  'OncoPharm',
  'VitaLife'
]

export const dosageForms = [
  'Tablet',
  'Capsule',
  'Injection',
  'Syrup',
  'Drops',
  'Cream',
  'Ointment',
  'Patch',
  'Inhaler',
  'Suppository'
]

export const medicineStatuses = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Discontinued', value: 'discontinued' }
]

// Service class
class MedicinesService {
  async getMedicines(
    filters: MedicineFilters = {},
    pagination: MedicinePagination = { page: 0, size: 10 }
  ): Promise<PaginatedResponse<Medicine>> {
    try {
      // Mock implementation - replace with actual API call
      let filteredMedicines = [...mockMedicines]

      // Apply filters
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredMedicines = filteredMedicines.filter(
          medicine =>
            medicine.name.toLowerCase().includes(searchTerm) ||
            medicine.genericName.toLowerCase().includes(searchTerm) ||
            medicine.manufacturer.toLowerCase().includes(searchTerm)
        )
      }

      if (filters.category) {
        filteredMedicines = filteredMedicines.filter(
          medicine => medicine.category === filters.category
        )
      }

      if (filters.manufacturer) {
        filteredMedicines = filteredMedicines.filter(
          medicine => medicine.manufacturer === filters.manufacturer
        )
      }

      if (filters.status) {
        filteredMedicines = filteredMedicines.filter(
          medicine => medicine.status === filters.status
        )
      }

      if (filters.dosageForm) {
        filteredMedicines = filteredMedicines.filter(
          medicine => medicine.dosageForm === filters.dosageForm
        )
      }

      if (filters.priceMin !== undefined) {
        filteredMedicines = filteredMedicines.filter(
          medicine => medicine.unitPrice >= filters.priceMin!
        )
      }

      if (filters.priceMax !== undefined) {
        filteredMedicines = filteredMedicines.filter(
          medicine => medicine.unitPrice <= filters.priceMax!
        )
      }

      if (filters.stockMin !== undefined) {
        filteredMedicines = filteredMedicines.filter(
          medicine => medicine.stockQuantity >= filters.stockMin!
        )
      }

      if (filters.stockMax !== undefined) {
        filteredMedicines = filteredMedicines.filter(
          medicine => medicine.stockQuantity <= filters.stockMax!
        )
      }

      // Apply sorting
      if (pagination.sort) {
        filteredMedicines.sort((a, b) => {
          const aValue = (a as any)[pagination.sort!]
          const bValue = (b as any)[pagination.sort!]

          if (pagination.direction === 'desc') {
            return bValue > aValue ? 1 : -1
          }
          return aValue > bValue ? 1 : -1
        })
      }

      // Apply pagination
      const totalElements = filteredMedicines.length
      const totalPages = Math.ceil(totalElements / pagination.size)
      const startIndex = pagination.page * pagination.size
      const endIndex = startIndex + pagination.size
      const content = filteredMedicines.slice(startIndex, endIndex)

      return {
        data: {
          content,
          links: totalPages,
          page: {
            number: pagination.page,
            size: pagination.size,
            totalElements,
            totalPages
          }
        }
      }
    } catch (error) {
      throw new Error('Failed to fetch medicines')
    }
  }

  async getMedicine(id: number): Promise<ApiResponse<Medicine>> {
    try {
      const medicine = mockMedicines.find(m => m.id === id)
      if (!medicine) {
        throw new Error('Medicine not found')
      }

      return {
        data: medicine,
        success: true,
        message: 'Medicine loaded successfully'
      }
    } catch (error) {
      throw new Error('Failed to fetch medicine')
    }
  }

  async createMedicine(medicine: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Medicine>> {
    try {
      const newMedicine: Medicine = {
        ...medicine,
        id: Math.max(...mockMedicines.map(m => m.id)) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      mockMedicines.push(newMedicine)

      return {
        data: newMedicine,
        success: true,
        message: 'Medicine created successfully'
      }
    } catch (error) {
      throw new Error('Failed to create medicine')
    }
  }

  async updateMedicine(id: number, updates: Partial<Medicine>): Promise<ApiResponse<Medicine>> {
    try {
      const index = mockMedicines.findIndex(m => m.id === id)
      if (index === -1) {
        throw new Error('Medicine not found')
      }

      mockMedicines[index] = {
        ...mockMedicines[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }

      return {
        data: mockMedicines[index],
        success: true,
        message: 'Medicine updated successfully'
      }
    } catch (error) {
      throw new Error('Failed to update medicine')
    }
  }

  async deleteMedicine(id: number): Promise<ApiResponse<void>> {
    try {
      const index = mockMedicines.findIndex(m => m.id === id)
      if (index === -1) {
        throw new Error('Medicine not found')
      }

      mockMedicines.splice(index, 1)

      return {
        data: undefined,
        success: true,
        message: 'Medicine deleted successfully'
      }
    } catch (error) {
      throw new Error('Failed to delete medicine')
    }
  }
}

export const medicinesService = new MedicinesService()
