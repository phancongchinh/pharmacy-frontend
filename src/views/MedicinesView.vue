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
import { medicinesService, type Medicine, type MedicineFilters, MedicineDosageForm } from '@/services/medicinesService'

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

// Use dosage forms from service
const dosageFormOptions = medicinesService.getDosageFormOptions()

// Mock data for categories and statuses - TODO: Replace with API calls when available
const medicineCategories = [
  { value: 'pain-relief', label: 'Pain Relief' },
  { value: 'antibiotics', label: 'Antibiotics' },
  { value: 'cardiovascular', label: 'Cardiovascular' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'respiratory', label: 'Respiratory' },
  { value: 'gastrointestinal', label: 'Gastrointestinal' },
]

const medicineStatuses = [
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
]

// Filters and pagination
const filters = ref<MedicineFilters>({
  active: undefined,
})

const pagination = ref({
  page: 1,
  size: 20,
  sort: 'name',
  direction: 'asc' as 'asc' | 'desc',
})

const totalElements = ref(0)

// Current medicine for dialog
const currentMedicine = ref<Partial<Medicine>>({})

// Form validation rules
const medicineRules: FormRules = {
  name: [{ required: true, message: 'Medicine name is required', trigger: 'blur' }],
  lowStockThreshold: [{ required: true, message: 'Low stock threshold is required', trigger: 'blur' }],
  dosageForm: [{ required: false, message: 'Dosage form is required', trigger: 'change' }],
  strength: [{ required: false, message: 'Strength is required', trigger: 'blur' }],
  prescriptionRequired: [{ required: true, message: 'Prescription requirement is required', trigger: 'change' }],
  active: [{ required: true, message: 'Status is required', trigger: 'change' }],
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

// Methods - Updated to use real API
const loadMedicines = async () => {
  try {
    loading.value = true

    const response = await medicinesService.getMedicines(filters.value)
    if (response.success && response.data) {
      medicines.value = response.data
      totalElements.value = response.data.length // Backend doesn't return pagination info yet
    } else {
      ElMessage.error(response.message || 'Failed to load medicines')
    }
  } catch (error) {
    ElMessage.error('Failed to load medicines')
    console.error('Error loading medicines:', error)
  } finally {
    loading.value = false
  }
}

const handleSearchChange = () => {
  pagination.value.page = 1
  loadMedicines()
}

const handleFilterChange = () => {
  pagination.value.page = 1
  loadMedicines()
}

const handleSizeChange = (size: number) => {
  pagination.value.size = size
  pagination.value.page = 1
  loadMedicines()
}

const handleCurrentChange = (page: number) => {
  pagination.value.page = page
  loadMedicines()
}

const handleSelectionChange = (selection: Medicine[]) => {
  selectedMedicines.value = selection
}

const handleExpandChange = (row: Medicine, expanded: boolean) => {
  if (expanded && (!row.medicineBatches || row.medicineBatches.length === 0)) {
    // Load medicine batches if not already loaded
    console.log('Loading batches for medicine:', row.id)
  }
}

const clearFilters = () => {
  filters.value = { active: undefined }
  pagination.value.page = 1
  loadMedicines()
}

const applyFilters = () => {
  drawerVisible.value = false
  pagination.value.page = 1
  loadMedicines()
}

// CRUD operations - Updated to use real API
const handleAddMedicine = () => {
  currentMedicine.value = {
    name: '',
    lowStockThreshold: 10,
    prescriptionRequired: false,
    active: true,
  }
  dialogMode.value = 'add'
  dialogVisible.value = true
}

const handleViewMedicine = async (medicine: Medicine) => {
  try {
    const response = await medicinesService.getMedicineById(medicine.id)
    if (response.success && response.data) {
      currentMedicine.value = response.data
      dialogMode.value = 'view'
      dialogVisible.value = true
    } else {
      ElMessage.error(response.message || 'Failed to load medicine details')
    }
  } catch (error) {
    ElMessage.error('Failed to load medicine details')
    console.error('Error loading medicine:', error)
  }
}

const handleEditMedicine = async (medicine: Medicine) => {
  try {
    const response = await medicinesService.getMedicineById(medicine.id)
    if (response.success && response.data) {
      currentMedicine.value = response.data
      dialogMode.value = 'edit'
      dialogVisible.value = true
    } else {
      ElMessage.error(response.message || 'Failed to load medicine details')
    }
  } catch (error) {
    ElMessage.error('Failed to load medicine details')
    console.error('Error loading medicine:', error)
  }
}

const handleSaveMedicine = async () => {
  if (!medicineForm.value) return

  try {
    const valid = await medicineForm.value.validate()
    if (!valid) return

    saving.value = true

    if (dialogMode.value === 'add') {
      const response = await medicinesService.createMedicine(currentMedicine.value as any)
      if (response.success) {
        ElMessage.success('Medicine created successfully')
        dialogVisible.value = false
        loadMedicines()
      } else {
        ElMessage.error(response.message || 'Failed to create medicine')
      }
    } else if (dialogMode.value === 'edit') {
      const response = await medicinesService.updateMedicine(currentMedicine.value.id!, currentMedicine.value)
      if (response.success) {
        ElMessage.success('Medicine updated successfully')
        dialogVisible.value = false
        loadMedicines()
      } else {
        ElMessage.error(response.message || 'Failed to update medicine')
      }
    }
  } catch (error) {
    ElMessage.error(`Failed to ${dialogMode.value} medicine`)
    console.error(`Error ${dialogMode.value} medicine:`, error)
  } finally {
    saving.value = false
  }
}

const handleDeleteMedicine = async (medicine: Medicine) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete medicine "${medicine.name}"?`,
      'Delete Medicine',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )

    const response = await medicinesService.deleteMedicine(medicine.id)
    if (response.success) {
      ElMessage.success('Medicine deactivated successfully')
      loadMedicines()
    } else {
      ElMessage.error(response.message || 'Failed to delete medicine')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete medicine')
      console.error('Error deleting medicine:', error)
    }
  }
}

const handleAddBatch = (medicine: Medicine) => {
  ElMessage.info('Add batch functionality to be implemented')
}

const handleActionCommand = (command: string, medicine: Medicine) => {
  switch (command) {
    case 'view':
      handleViewMedicine(medicine)
      break
    case 'edit':
      handleEditMedicine(medicine)
      break
    case 'add-batch':
      handleAddBatch(medicine)
      break
    case 'delete':
      handleDeleteMedicine(medicine)
      break
  }
}

// Utility methods
const getStatusType = (active: boolean) => {
  return active ? 'success' : 'danger'
}

const getStatusLabel = (active: boolean) => {
  return active ? 'Active' : 'Inactive'
}

const getStockClass = (quantity: number) => {
  if (quantity === 0) return 'stock-out'
  if (quantity <= 10) return 'stock-low'
  return 'stock-normal'
}

const getBatchStatusType = (status: string) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'low-stock':
      return 'warning'
    case 'expired':
      return 'danger'
    default:
      return 'info'
  }
}

const getRowClassName = ({ row }: { row: Medicine }) => {
  if (!row.active) return 'row-inactive'
  return ''
}

const isExpiringsoon = (expiryDate: string) => {
  const expiry = new Date(expiryDate)
  const today = new Date()
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 30 && diffDays > 0
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle hooks
onMounted(() => {
  loadMedicines()
})
</script>

<style scoped>
/* Inherit common styles */
.search-input {
  max-width: 600px;
}

.filter-badge {
  margin-left: 8px;
}

/* Medicine info styling */
.medicine-info .medicine-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.medicine-info .medicine-generic {
  font-size: 12px;
  color: #6b7280;
}

.manufacturer-info .manufacturer {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}

.manufacturer-info .category {
  font-size: 12px;
  color: #6b7280;
}

.dosage-info .form {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}

.dosage-info .strength {
  font-size: 12px;
  color: #6b7280;
}

.order-value {
  font-weight: 600;
  color: #059669;
}

/* Stock quantity styling */
.stock-normal {
  color: #059669;
  font-weight: 500;
}

.stock-low {
  color: #f59e0b;
  font-weight: 600;
}

.stock-out {
  color: #ef4444;
  font-weight: 600;
}

/* Batch details styling */
.batch-details {
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  margin: 10px;
}

.batch-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px;
}

.batch-table {
  background: white;
  border-radius: 6px;
}

.expiry-warning {
  color: #ef4444;
  font-weight: 600;
}

.batch-quantity {
  font-weight: 500;
  color: #1f2937;
}

.batch-price {
  color: #059669;
  font-weight: 500;
}

/* Pagination container */
.pagination-container {
  position: sticky;
  bottom: 0;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: white;
  display: flex;
  justify-content: center;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  transition: all 0.3s ease;
}

/* Filters drawer */
.filters-drawer {
  padding: 20px;
}

.filter-group {
  margin-bottom: 20px;
}

.filter-label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
  display: block;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

/* Dialog styling */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.medicine-form {
  padding: 0 24px;
}

/* Row styling */
:deep(.row-inactive) {
  background-color: #f9fafb !important;
  opacity: 0.7;
}

/* Dropdown menu item styling */
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-dropdown-menu__item .material-symbols-outlined) {
  font-size: 18px;
}

/* Material symbols styling */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
