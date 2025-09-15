<template>
  <div class="medicines-view">
    <!-- Header Section -->
    <div class="medicines-header">
      <div class="header-content">
        <h1 class="page-title">Medicines</h1>
        <p class="page-subtitle">Manage your pharmacy inventory</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" class="modern-button" @click="handleAddMedicine">
          <span class="material-symbols-outlined">add</span>
          Add Medicine
        </el-button>
        <el-button class="filter-button" @click="drawerVisible = true">
          <span class="material-symbols-outlined">filter_list</span>
          Filters
          <el-badge
            v-if="activeFiltersCount > 0"
            :value="activeFiltersCount"
            class="filter-badge"
          />
        </el-button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="medicines-content">
      <!-- Search Bar -->
      <div class="search-section">
        <el-input
          v-model="filters.search"
          placeholder="Search medicines by name, generic name, or manufacturer..."
          class="search-input"
          size="large"
          clearable
          @input="handleSearchChange"
        >
          <template #prefix>
            <span class="material-symbols-outlined">search</span>
          </template>
        </el-input>
      </div>

      <!-- Table Container with sticky pagination -->
      <div class="table-container" ref="tableContainer">
        <!-- Medicines Table -->
        <div class="table-wrapper">
          <el-table
            :data="medicines"
            v-loading="loading"
            class="medicines-table"
            stripe
            @sort-change="handleSortChange"
            empty-text="No medicines found"
            ref="medicinesTable"
            :row-class-name="getRowClassName"
          >
            <el-table-column type="selection" width="55" />

            <el-table-column prop="name" label="Medicine Name" min-width="200" sortable="custom">
              <template #default="{ row }">
                <div class="medicine-info">
                  <div class="medicine-name">{{ row.name }}</div>
                  <div class="medicine-generic">{{ row.genericName }}</div>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="manufacturer"
              label="Manufacturer"
              min-width="150"
              sortable="custom"
            />

            <el-table-column prop="category" label="Category" min-width="130" sortable="custom">
              <template #default="{ row }">
                <el-tag type="info" size="small">{{ row.category }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="dosageForm" label="Form" min-width="100">
              <template #default="{ row }">
                <span class="dosage-form">{{ row.dosageForm }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="strength" label="Strength" min-width="100" />

            <el-table-column prop="unitPrice" label="Price" min-width="100" sortable="custom">
              <template #default="{ row }">
                <span class="price">${{ row.unitPrice.toFixed(2) }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="stockQuantity" label="Stock" min-width="100" sortable="custom">
              <template #default="{ row }">
                <div class="stock-info">
                  <span :class="getStockClass(row.stockQuantity)">{{ row.stockQuantity }}</span>
                  <el-tag v-if="row.stockQuantity === 0" type="danger" size="small"
                    >Out of Stock</el-tag
                  >
                  <el-tag v-else-if="row.stockQuantity < 50" type="warning" size="small"
                    >Low Stock</el-tag
                  >
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="expiryDate"
              label="Expiry Date"
              min-width="120"
              sortable="custom"
            >
              <template #default="{ row }">
                <div class="expiry-info">
                  <span :class="getExpiryClass(row.expiryDate)">
                    {{ formatDate(row.expiryDate) }}
                  </span>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="status" label="Status" min-width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)" size="small">
                  {{ row.status.charAt(0).toUpperCase() + row.status.slice(1) }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="Actions" width="120" fixed="right">
              <template #default="{ row }">
                <div class="action-buttons">
                  <el-button type="primary" size="small" text @click="handleEditMedicine(row)">
                    <span class="material-symbols-outlined">edit</span>
                  </el-button>
                  <el-button type="danger" size="small" text @click="handleDeleteMedicine(row)">
                    <span class="material-symbols-outlined">delete</span>
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- Sticky Pagination -->
        <div class="pagination-container" :class="{ 'pagination-sticky': isPaginationSticky }">
          <div class="pagination-wrapper">
            <div class="pagination-info">
              Showing {{ startRecord }} to {{ endRecord }} of {{ totalRecords }} medicines
            </div>
            <el-pagination
              v-model:current-page="pagination.page"
              v-model:page-size="pagination.size"
              :page-sizes="[10, 25, 50, 100]"
              :total="totalRecords"
              layout="sizes, prev, pager, next, jumper"
              @current-change="handlePageChange"
              @size-change="handleSizeChange"
              class="modern-pagination"
            />
          </div>
        </div>
      </div>
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
      <div class="drawer-content">
        <!-- Category Filter -->
        <div class="filter-group">
          <label class="filter-label">Category</label>
          <el-select
            v-model="filters.category"
            placeholder="Select category"
            clearable
            class="filter-select"
          >
            <el-option
              v-for="category in medicineCategories"
              :key="category"
              :label="category"
              :value="category"
            />
          </el-select>
        </div>

        <!-- Manufacturer Filter -->
        <div class="filter-group">
          <label class="filter-label">Manufacturer</label>
          <el-select
            v-model="filters.manufacturer"
            placeholder="Select manufacturer"
            clearable
            class="filter-select"
          >
            <el-option
              v-for="manufacturer in medicineManufacturers"
              :key="manufacturer"
              :label="manufacturer"
              :value="manufacturer"
            />
          </el-select>
        </div>

        <!-- Status Filter -->
        <div class="filter-group">
          <label class="filter-label">Status</label>
          <el-select
            v-model="filters.status"
            placeholder="Select status"
            clearable
            class="filter-select"
          >
            <el-option
              v-for="status in medicineStatuses"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </div>

        <!-- Dosage Form Filter -->
        <div class="filter-group">
          <label class="filter-label">Dosage Form</label>
          <el-select
            v-model="filters.dosageForm"
            placeholder="Select dosage form"
            clearable
            class="filter-select"
          >
            <el-option v-for="form in dosageForms" :key="form" :label="form" :value="form" />
          </el-select>
        </div>

        <!-- Price Range Filter -->
        <div class="filter-group">
          <label class="filter-label">Price Range</label>
          <div class="range-inputs">
            <el-input
              v-model.number="filters.priceMin"
              placeholder="Min price"
              type="number"
              class="range-input"
            >
              <template #prefix>$</template>
            </el-input>
            <span class="range-separator">to</span>
            <el-input
              v-model.number="filters.priceMax"
              placeholder="Max price"
              type="number"
              class="range-input"
            >
              <template #prefix>$</template>
            </el-input>
          </div>
        </div>

        <!-- Stock Range Filter -->
        <div class="filter-group">
          <label class="filter-label">Stock Quantity</label>
          <div class="range-inputs">
            <el-input
              v-model.number="filters.stockMin"
              placeholder="Min stock"
              type="number"
              class="range-input"
            />
            <span class="range-separator">to</span>
            <el-input
              v-model.number="filters.stockMax"
              placeholder="Max stock"
              type="number"
              class="range-input"
            />
          </div>
        </div>

        <!-- Expiry Date Range Filter -->
        <div class="filter-group">
          <label class="filter-label">Expiry Date Range</label>
          <el-date-picker
            v-model="expiryDateRange"
            type="daterange"
            range-separator="to"
            start-placeholder="From date"
            end-placeholder="To date"
            class="filter-date-picker"
            @change="handleExpiryDateChange"
          />
        </div>

        <!-- Filter Actions -->
        <div class="filter-actions">
          <el-button @click="clearFilters" class="clear-button"> Clear All </el-button>
          <el-button type="primary" @click="applyFilters" class="apply-button">
            Apply Filters
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted, nextTick } from 'vue'
import {
  medicinesService,
  type Medicine,
  type MedicineFilters,
  type MedicinePagination,
  medicineCategories,
  medicineManufacturers,
  dosageForms,
  medicineStatuses,
} from '@/services/medicinesService'
import { formatDate } from '@/services/utilities'
import { ElMessage, ElMessageBox } from 'element-plus'

// Reactive data
const loading = ref(false)
const medicines = ref<Medicine[]>([])
const drawerVisible = ref(false)
const tableContainer = ref<HTMLElement>()
const medicinesTable = ref()
const isPaginationSticky = ref(false)

// Filters
const filters = ref<MedicineFilters>({
  search: '',
  category: '',
  manufacturer: '',
  status: '',
  dosageForm: '',
  priceMin: undefined,
  priceMax: undefined,
  stockMin: undefined,
  stockMax: undefined,
  expiryDateFrom: '',
  expiryDateTo: '',
})

const expiryDateRange = ref<[Date, Date] | null>(null)

// Pagination
const pagination = ref<MedicinePagination>({
  page: 1,
  size: 25,
  sort: 'name',
  direction: 'asc',
})

const totalRecords = ref(0)

// Computed properties
const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.value.category) count++
  if (filters.value.manufacturer) count++
  if (filters.value.status) count++
  if (filters.value.dosageForm) count++
  if (filters.value.priceMin !== undefined) count++
  if (filters.value.priceMax !== undefined) count++
  if (filters.value.stockMin !== undefined) count++
  if (filters.value.stockMax !== undefined) count++
  if (filters.value.expiryDateFrom) count++
  if (filters.value.expiryDateTo) count++
  return count
})

const startRecord = computed(() => {
  return totalRecords.value === 0 ? 0 : (pagination.value.page - 1) * pagination.value.size + 1
})

const endRecord = computed(() => {
  const end = pagination.value.page * pagination.value.size
  return Math.min(end, totalRecords.value)
})

// Methods
const loadMedicines = async () => {
  loading.value = true
  try {
    const response = await medicinesService.getMedicines(filters.value, {
      ...pagination.value,
      page: pagination.value.page - 1, // API uses 0-based indexing
    })
    medicines.value = response.data.content
    totalRecords.value = response.data.page.totalElements
  } catch (error) {
    ElMessage.error('Failed to load medicines')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSearchChange = () => {
  pagination.value.page = 1
  loadMedicines()
}

const handlePageChange = (page: number) => {
  pagination.value.page = page
  loadMedicines()
}

const handleSizeChange = (size: number) => {
  pagination.value.size = size
  pagination.value.page = 1
  loadMedicines()
}

const handleSortChange = ({ prop, order }: { prop: string; order: string | null }) => {
  if (order) {
    pagination.value.sort = prop
    pagination.value.direction = order === 'ascending' ? 'asc' : 'desc'
  } else {
    pagination.value.sort = undefined
    pagination.value.direction = 'asc'
  }
  loadMedicines()
}

const applyFilters = () => {
  pagination.value.page = 1
  loadMedicines()
  drawerVisible.value = false
}

const clearFilters = () => {
  filters.value = {
    search: '',
    category: '',
    manufacturer: '',
    status: '',
    dosageForm: '',
    priceMin: undefined,
    priceMax: undefined,
    stockMin: undefined,
    stockMax: undefined,
    expiryDateFrom: '',
    expiryDateTo: '',
  }
  expiryDateRange.value = null
  pagination.value.page = 1
  loadMedicines()
}

const handleExpiryDateChange = (dates: [Date, Date] | null) => {
  if (dates) {
    filters.value.expiryDateFrom = dates[0].toISOString().split('T')[0]
    filters.value.expiryDateTo = dates[1].toISOString().split('T')[0]
  } else {
    filters.value.expiryDateFrom = ''
    filters.value.expiryDateTo = ''
  }
}

const handleAddMedicine = () => {
  // TODO: Implement add medicine functionality
  ElMessage.info('Add medicine functionality will be implemented')
}

const handleEditMedicine = (medicine: Medicine) => {
  // TODO: Implement edit medicine functionality
  ElMessage.info(`Edit medicine: ${medicine.name}`)
}

const handleDeleteMedicine = async (medicine: Medicine) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete "${medicine.name}"?`,
      'Confirm Deletion',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )

    await medicinesService.deleteMedicine(medicine.id)
    ElMessage.success('Medicine deleted successfully')
    loadMedicines()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete medicine')
    }
  }
}

// Utility methods
const getStockClass = (stock: number) => {
  if (stock === 0) return 'stock-out'
  if (stock < 50) return 'stock-low'
  return 'stock-normal'
}

const getExpiryClass = (expiryDate: string) => {
  const expiry = new Date(expiryDate)
  const today = new Date()
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'expiry-expired'
  if (diffDays < 90) return 'expiry-soon'
  return 'expiry-normal'
}

const getStatusType = (status: string) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'inactive':
      return 'warning'
    case 'discontinued':
      return 'danger'
    default:
      return 'info'
  }
}

const getRowClassName = ({ row }: { row: Medicine }) => {
  if (row.stockQuantity === 0) {
    return 'row-danger'
  }
  if (row.stockQuantity < 50) {
    return 'row-warning'
  }
  return ''
}

const getRowClassName = ({ row }: { row: Medicine }) => {
  if (row.stockQuantity === 0) {
    return 'row-danger'
  }
  if (row.stockQuantity < 50) {
    return 'row-warning'
  }
  return ''
}

// Sticky pagination logic
const handleScroll = () => {
  if (!tableContainer.value) return

  const containerRect = tableContainer.value.getBoundingClientRect()
  const windowHeight = window.innerHeight

  // Check if the table container bottom is above the viewport bottom
  isPaginationSticky.value = containerRect.bottom > windowHeight
}

// Lifecycle hooks
onMounted(() => {
  loadMedicines()
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
})

// Watch for filter changes (auto-apply on some filters)
watch(
  [
    () => filters.value.category,
    () => filters.value.manufacturer,
    () => filters.value.status,
    () => filters.value.dosageForm,
  ],
  () => {
    pagination.value.page = 1
    loadMedicines()
  },
)
</script>

<style scoped>
.medicines-view {
  padding: 32px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header Styles */
.medicines-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header-content .page-title {
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.header-content .page-subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0;
  font-weight: 400;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.modern-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.modern-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
}

.filter-button {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.filter-badge {
  position: absolute;
  top: -8px;
  right: -8px;
}

/* Search Section */
.search-section {
  margin-bottom: 24px;
}

.search-input {
  max-width: 600px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Table Container */
.table-container {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-wrapper {
  min-height: 400px;
}
.medicines-table :deep(.row-danger) {
  background-color: rgba(220, 38, 38, 0.1);
}

.medicines-table :deep(.row-warning) {
  background-color: rgba(217, 119, 6, 0.1);
}


.medicines-table {
  background: transparent;
}

.medicines-table :deep(.el-table__header) {
  background: rgba(102, 126, 234, 0.05);
}

.medicines-table :deep(.el-table__header th) {
.medicines-table :deep(.row-danger) {
  background-color: rgba(220, 38, 38, 0.1);
}

.medicines-table :deep(.row-warning) {
  background-color: rgba(217, 119, 6, 0.1);
}

  background: transparent;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
  font-weight: 600;
  color: #1e293b;
}

.medicines-table :deep(.el-table__row:hover) {
  background-color: rgba(102, 126, 234, 0.05);
}

/* Table Cell Styles */
.medicine-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.medicine-name {
  font-weight: 600;
  color: #1e293b;
}

.medicine-generic {
  font-size: 12px;
  color: #64748b;
}

.dosage-form {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.price {
  font-weight: 600;
  color: #059669;
}

.stock-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stock-normal {
  color: #059669;
  font-weight: 600;
}

.stock-low {
  color: #d97706;
  font-weight: 600;
}

.stock-out {
  color: #dc2626;
  font-weight: 600;
}

.expiry-info {
  font-size: 14px;
}

.expiry-normal {
  color: #64748b;
}

.expiry-soon {
  color: #d97706;
  font-weight: 600;
}

.expiry-expired {
  color: #dc2626;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

/* Pagination Styles */
.pagination-container {
  height: 54px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.pagination-container.pagination-sticky {
  position: fixed;
  bottom: 0;
  left: 32px;
  right: 32px;
  z-index: 1000;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 24px;
}

.pagination-info {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.modern-pagination :deep(.el-pagination) {
  gap: 12px;
}

.modern-pagination :deep(.btn-prev),
.modern-pagination :deep(.btn-next) {
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.modern-pagination :deep(.el-pager li) {
  border-radius: 8px;
  margin: 0 2px;
}

/* Filters Drawer */
.filters-drawer :deep(.el-drawer__header) {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 0;
}

.filters-drawer :deep(.el-drawer__title) {
  color: white;
  font-weight: 600;
}

.drawer-content {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.filter-group {
  margin-bottom: 24px;
}

.filter-label {
  display: block;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  font-size: 14px;
}

.filter-select,
.filter-date-picker {
  width: 100%;
}

.filter-select :deep(.el-input__wrapper),
.filter-date-picker :deep(.el-input__wrapper) {
  border-radius: 8px;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
}

.range-input {
  flex: 1;
}

.range-separator {
  color: #64748b;
  font-size: 14px;
  white-space: nowrap;
}

.filter-actions {
  margin-top: auto;
  display: flex;
  gap: 12px;
  padding-top: 24px;
