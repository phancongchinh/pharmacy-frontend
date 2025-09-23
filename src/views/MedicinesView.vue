<template>
  <div class="page-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="page-header-content">
        <h1 class="page-title">Medicines</h1>
        <p class="page-subtitle">Manage your pharmacy medicines and batches</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleAddMedicine">
          <span class="material-symbols-outlined">add</span>
          Add Medicine
        </el-button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="medicines-content">
      <div class="mb-3 d-flex align-items-center justify-content-between">
        <el-input
          v-model="filters.search"
          placeholder="Search medicines by name, generic name, manufacturer..."
          class="search-input"
          clearable
          @input="handleSearchChange"
        >
          <template #prefix>
            <span class="material-symbols-outlined">search</span>
          </template>
        </el-input>

        <el-button @click="drawerVisible = true">
          <span class="material-symbols-outlined">filter_list</span>
          Filters
          <el-badge
            v-if="activeFiltersCount > 0"
            :value="activeFiltersCount"
            class="filter-badge"
          />
        </el-button>
      </div>

      <el-card shadow="never">
        <el-table
          :data="medicines"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          empty-text="No medicines found"
          ref="medicinesTable"
          :row-class-name="getRowClassName"
          @expand-change="handleExpandChange"
        >
          <el-table-column type="expand" width="55">
            <template #default="{ row }">
              <div class="batch-details">
                <h4 class="batch-title">Medicine Batches</h4>
                <el-table :data="row.batches" class="batch-table">
                  <el-table-column prop="batchNumber" label="Batch Number" min-width="120" />
                  <el-table-column prop="expiryDate" label="Expiry Date" min-width="120">
                    <template #default="{ row: batch }">
                      <span :class="{ 'expiry-warning': isExpiringsoon(batch.expiryDate) }">
                        {{ formatDate(batch.expiryDate) }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="quantity" label="Quantity" min-width="100">
                    <template #default="{ row: batch }">
                      <span class="batch-quantity">{{ batch.quantity }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="unitPrice" label="Unit Price" min-width="100">
                    <template #default="{ row: batch }">
                      <span class="batch-price">${{ formatCurrency(batch.unitPrice) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="status" label="Status" min-width="100">
                    <template #default="{ row: batch }">
                      <el-tag :type="getBatchStatusType(batch.status)" size="small">
                        {{ batch.status }}
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </el-table-column>

          <el-table-column type="selection" width="55" />

          <el-table-column prop="name" label="Medicine Name" min-width="200">
            <template #default="{ row }">
              <div class="medicine-info">
                <div class="medicine-name">{{ row.name }}</div>
                <div class="medicine-generic">{{ row.genericName }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="manufacturer" label="Manufacturer" min-width="150">
            <template #default="{ row }">
              <div class="manufacturer-info">
                <div class="manufacturer">{{ row.manufacturer }}</div>
                <div class="category">{{ row.category }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="dosageForm" label="Form & Strength" min-width="130">
            <template #default="{ row }">
              <div class="dosage-info">
                <div class="form">{{ row.dosageForm }}</div>
                <div class="strength">{{ row.strength }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="unitPrice" label="Unit Price" min-width="110">
            <template #default="{ row }">
              <span class="order-value">${{ formatCurrency(row.unitPrice) }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="stockQuantity" label="Stock" min-width="100">
            <template #default="{ row }">
              <span :class="getStockClass(row.stockQuantity)">{{ row.stockQuantity }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="Status" min-width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="Actions" width="100" fixed="right">
            <template #default="{ row }">
              <el-dropdown @command="(command) => handleActionCommand(command, row)">
                <el-button type="primary" size="small" text>
                  <span class="material-symbols-outlined">more_vert</span>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="view">
                      <span class="material-symbols-outlined">visibility</span>
                      View
                    </el-dropdown-item>
                    <el-dropdown-item command="edit">
                      <span class="material-symbols-outlined">edit</span>
                      Edit
                    </el-dropdown-item>
                    <el-dropdown-item command="add-batch" divided>
                      <span class="material-symbols-outlined">add_box</span>
                      Add Batch
                    </el-dropdown-item>
                    <el-dropdown-item command="delete" divided>
                      <span class="material-symbols-outlined">delete</span>
                      Delete
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- Sticky Pagination -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :total="totalElements"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- Filters Drawer -->
    <el-drawer
      v-model="drawerVisible"
      title="Filter Medicines"
      direction="rtl"
      size="400px"
      class="filters-drawer"
      append-to-body
    >
      <div class="filters-content">
        <div class="filter-group">
          <label class="filter-label">Category</label>
          <el-select
            v-model="filters.category"
            placeholder="Select category"
            clearable
            @change="handleFilterChange"
          >
            <el-option
              v-for="category in medicineCategories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Status</label>
          <el-select
            v-model="filters.status"
            placeholder="Select status"
            clearable
            @change="handleFilterChange"
          >
            <el-option
              v-for="status in medicineStatuses"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </div>

        <div class="filter-actions">
          <el-button @click="clearFilters">Clear All Filters</el-button>
          <el-button type="primary" @click="applyFilters">Apply Filters</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- Medicine Dialog (Add/Edit/View) -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="1000px"
      class="medicine-dialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="medicineForm"
        :model="currentMedicine"
        :rules="medicineRules"
        label-width="140px"
        class="medicine-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Medicine Name" prop="name">
              <el-input
                v-model="currentMedicine.name"
                placeholder="Enter medicine name"
                :disabled="dialogMode === 'view'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Generic Name" prop="genericName">
              <el-input
                v-model="currentMedicine.genericName"
                placeholder="Enter generic name"
                :disabled="dialogMode === 'view'"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Manufacturer" prop="manufacturer">
              <el-input
                v-model="currentMedicine.manufacturer"
                placeholder="Enter manufacturer"
                :disabled="dialogMode === 'view'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Category" prop="category">
              <el-select
                v-model="currentMedicine.category"
                placeholder="Select category"
                :disabled="dialogMode === 'view'"
              >
                <el-option
                  v-for="category in medicineCategories"
                  :key="category.value"
                  :label="category.label"
                  :value="category.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Dosage Form" prop="dosageForm">
              <el-input
                v-model="currentMedicine.dosageForm"
                placeholder="Enter dosage form"
                :disabled="dialogMode === 'view'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Strength" prop="strength">
              <el-input
                v-model="currentMedicine.strength"
                placeholder="Enter strength"
                :disabled="dialogMode === 'view'"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Unit Price" prop="unitPrice">
              <el-input-number
                v-model="currentMedicine.unitPrice"
                :min="0"
                :precision="2"
                :disabled="dialogMode === 'view'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Status" prop="status">
              <el-select
                v-model="currentMedicine.status"
                placeholder="Select status"
                :disabled="dialogMode === 'view'"
              >
                <el-option
                  v-for="status in medicineStatuses"
                  :key="status.value"
                  :label="status.label"
                  :value="status.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">
            {{ dialogMode === 'view' ? 'Close' : 'Cancel' }}
          </el-button>
          <el-button
            v-if="dialogMode !== 'view'"
            type="primary"
            @click="handleSaveMedicine"
            :loading="saving"
          >
            {{ dialogMode === 'add' ? 'Create Medicine' : 'Update Medicine' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { medicinesService } from '@/services/medicinesService'
import type { Medicine, MedicineFilters, MedicinePagination } from '@/services/medicinesService'

// Reactive data
const loading = ref(false)
const saving = ref(false)
const medicines = ref<Medicine[]>([])
const selectedMedicines = ref<Medicine[]>([])
const drawerVisible = ref(false)
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit' | 'view'>('add')
const medicinesTable = ref()
const medicineForm = ref<FormInstance>()

// Mock data for categories and statuses
const medicineCategories = [
  { value: 'pain-relief', label: 'Pain Relief' },
  { value: 'antibiotics', label: 'Antibiotics' },
  { value: 'cardiovascular', label: 'Cardiovascular' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'respiratory', label: 'Respiratory' },
  { value: 'gastrointestinal', label: 'Gastrointestinal' },
]

const medicineStatuses = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'discontinued', label: 'Discontinued' },
]

// Filters and pagination
const filters = ref<MedicineFilters>({
  search: '',
  category: '',
  manufacturer: '',
  status: '',
  dosageForm: '',
  priceMin: undefined,
  priceMax: undefined,
  expiryDateFrom: '',
  expiryDateTo: '',
  stockMin: undefined,
  stockMax: undefined,
})

const pagination = ref<MedicinePagination>({
  page: 1,
  size: 20,
  sort: 'name',
  direction: 'asc',
})

const totalElements = ref(0)

// Current medicine for dialog
const currentMedicine = ref<Partial<Medicine>>({})

// Form validation rules
const medicineRules: FormRules = {
  name: [{ required: true, message: 'Medicine name is required', trigger: 'blur' }],
  genericName: [{ required: true, message: 'Generic name is required', trigger: 'blur' }],
  manufacturer: [{ required: true, message: 'Manufacturer is required', trigger: 'blur' }],
  category: [{ required: true, message: 'Category is required', trigger: 'change' }],
  dosageForm: [{ required: true, message: 'Dosage form is required', trigger: 'blur' }],
  strength: [{ required: true, message: 'Strength is required', trigger: 'blur' }],
  unitPrice: [{ required: true, message: 'Unit price is required', trigger: 'blur' }],
  status: [{ required: true, message: 'Status is required', trigger: 'change' }],
}

// Computed properties
const activeFiltersCount = computed(() => {
  return Object.values(filters.value).filter(
    (value) => value !== '' && value !== undefined && value !== null,
  ).length
})

const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case 'add':
      return 'Add New Medicine'
    case 'edit':
      return 'Edit Medicine'
    case 'view':
      return 'View Medicine Details'
    default:
      return 'Medicine'
  }
})

// Methods
const loadMedicines = async () => {
  try {
    loading.value = true
    const response = await medicinesService.getMedicines(filters.value, {
      ...pagination.value,
      page: pagination.value.page - 1,
    })
    medicines.value = response.data.data.content
    totalElements.value = response.data.data.page.totalElements
  } catch (error) {
    ElMessage.warning('API unavailable, loading sample data')
    console.warn('Error loading medicines from API, using mock data:', error)

    // Use mock data when API fails
    medicines.value = mockMedicinesData
    totalElements.value = mockMedicinesData.length
  } finally {
    loading.value = false
  }
}

// Mock medicines data for fallback
const mockMedicinesData = [
  {
    id: 1,
    name: 'Paracetamol Tablets',
    genericName: 'Acetaminophen',
    manufacturer: 'PharmaCorp',
    category: 'pain-relief',
    dosageForm: 'Tablet',
    strength: '500mg',
    unitPrice: 12.50,
    stockQuantity: 250,
    expiryDate: '2026-08-15',
    batchNumber: 'PC2025001',
    status: 'active',
    createdAt: '2025-01-15T08:30:00Z',
    updatedAt: '2025-09-10T14:20:00Z',
    batches: [
      {
        id: 1,
        batchNumber: 'PC2025001',
        expiryDate: '2026-08-15',
        quantity: 150,
        unitPrice: 12.50,
        status: 'active',
      },
      {
        id: 2,
        batchNumber: 'PC2025002',
        expiryDate: '2026-12-20',
        quantity: 100,
        unitPrice: 12.50,
        status: 'active',
      },
    ]
  },
  {
    id: 2,
    name: 'Amoxicillin Capsules',
    genericName: 'Amoxicillin',
    manufacturer: 'MediPharm',
    category: 'antibiotics',
    dosageForm: 'Capsule',
    strength: '250mg',
    unitPrice: 28.75,
    stockQuantity: 180,
    expiryDate: '2025-12-20',
    batchNumber: 'MP2024015',
    status: 'active',
    createdAt: '2024-12-01T10:15:00Z',
    updatedAt: '2025-09-08T09:45:00Z',
    batches: [
      {
        id: 3,
        batchNumber: 'MP2024015',
        expiryDate: '2025-12-20',
        quantity: 120,
        unitPrice: 28.75,
        status: 'active',
      },
      {
        id: 4,
        batchNumber: 'MP2025001',
        expiryDate: '2026-06-15',
        quantity: 60,
        unitPrice: 28.75,
        status: 'active',
      },
    ]
  },
  {
    id: 3,
    name: 'Lisinopril Tablets',
    genericName: 'Lisinopril',
    manufacturer: 'CardioMed',
    category: 'cardiovascular',
    dosageForm: 'Tablet',
    strength: '10mg',
    unitPrice: 45.20,
    stockQuantity: 120,
    expiryDate: '2027-03-10',
    batchNumber: 'CM2025003',
    status: 'active',
    createdAt: '2025-03-05T11:20:00Z',
    updatedAt: '2025-09-11T16:30:00Z',
    batches: [
      {
        id: 5,
        batchNumber: 'CM2025003',
        expiryDate: '2027-03-10',
        quantity: 80,
        unitPrice: 45.20,
        status: 'active',
      },
      {
        id: 6,
        batchNumber: 'CM2025004',
        expiryDate: '2027-01-22',
        quantity: 40,
        unitPrice: 45.20,
        status: 'active',
      },
    ]
  },
  {
    id: 4,
    name: 'Insulin Glargine Injection',
    genericName: 'Insulin Glargine',
    manufacturer: 'DiabetesRx',
    category: 'diabetes',
    dosageForm: 'Injection',
    strength: '100IU/mL',
    unitPrice: 125.80,
    stockQuantity: 45,
    expiryDate: '2025-11-30',
    batchNumber: 'DR2024012',
    status: 'active',
    createdAt: '2024-11-15T13:45:00Z',
    updatedAt: '2025-09-09T12:15:00Z',
    batches: [
      {
        id: 7,
        batchNumber: 'DR2024012',
        expiryDate: '2025-11-30',
        quantity: 25,
        unitPrice: 125.80,
        status: 'low-stock',
      },
      {
        id: 8,
        batchNumber: 'DR2025001',
        expiryDate: '2026-03-15',
        quantity: 20,
        unitPrice: 125.80,
        status: 'active',
      },
    ]
  },
  {
    id: 5,
    name: 'Omeprazole Capsules',
    genericName: 'Omeprazole',
    manufacturer: 'GastroHealth',
    category: 'gastrointestinal',
    dosageForm: 'Capsule',
    strength: '20mg',
    unitPrice: 18.90,
    stockQuantity: 0,
    expiryDate: '2024-10-15',
    batchNumber: 'GH2023008',
    status: 'discontinued',
    createdAt: '2023-08-20T09:30:00Z',
    updatedAt: '2025-09-05T08:00:00Z',
    batches: []
  },
  {
    id: 6,
    name: 'Metformin Tablets',
    genericName: 'Metformin Hydrochloride',
    manufacturer: 'DiabetesRx',
    category: 'diabetes',
    dosageForm: 'Tablet',
    strength: '850mg',
    unitPrice: 15.25,
    stockQuantity: 300,
    expiryDate: '2026-12-31',
    batchNumber: 'DR2025004',
    status: 'active',
    createdAt: '2025-02-10T09:15:00Z',
    updatedAt: '2025-09-12T11:20:00Z',
    batches: [
      {
        id: 9,
        batchNumber: 'DR2025004',
        expiryDate: '2026-12-31',
        quantity: 200,
        unitPrice: 15.25,
        status: 'active',
      },
      {
        id: 10,
        batchNumber: 'DR2025005',
        expiryDate: '2027-02-28',
        quantity: 100,
        unitPrice: 15.25,
        status: 'active',
      },
    ]
  },
]

// ...existing code...
