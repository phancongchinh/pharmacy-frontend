<template>
  <div class="page-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="page-header-content">
        <h1 class="page-title">Suppliers</h1>
        <p class="page-subtitle">Manage your pharmacy suppliers</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleAddSupplier">
          <span class="material-symbols-outlined">add</span>
          Add Supplier
        </el-button>
        <!--        <el-button @click="drawerVisible = true">-->
        <!--          <span class="material-symbols-outlined">filter_list</span>-->
        <!--          Filters-->
        <!--          <el-badge-->
        <!--            v-if="activeFiltersCount > 0"-->
        <!--            :value="activeFiltersCount"-->
        <!--            class="filter-badge"-->
        <!--          />-->
        <!--        </el-button>-->
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="suppliers-content">
      <!-- Table Container with sticky pagination -->

      <div class="mb-3 d-flex align-items-center justify-content-between">
        <el-input
          v-model="filters.search"
          placeholder="Search suppliers by name, contact person, email, or phone..."
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
          :data="suppliers"
          v-loading="loading"
          class=""
          @selection-change="handleSelectionChange"
          empty-text="No suppliers found"
          ref="suppliersTable"
          :row-class-name="getRowClassName"
        >
          <el-table-column type="selection" width="55" />

          <el-table-column prop="name" label="Supplier Name" min-width="200">
            <template #default="{ row }">
              <div class="supplier-info">
                <div class="supplier-name">{{ row.name }}</div>
                <div class="supplier-contact">{{ row.contactPerson }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="email" label="Contact Info" min-width="180">
            <template #default="{ row }">
              <div class="contact-info">
                <div class="email">{{ row.email }}</div>
                <div class="phone">{{ row.phone }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="address" label="Location" min-width="150">
            <template #default="{ row }">
              <div class="location-info">
                <div class="address">{{ row.address }}</div>
                <div class="city-state">{{ row.city }}, {{ row.state }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="Status" min-width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="suppliedMedicinesCount" label="Medicines" min-width="100">
            <template #default="{ row }">
              <span class="medicines-count">{{ row.suppliedMedicinesCount }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="totalOrderValue" label="Total Orders" min-width="130">
            <template #default="{ row }">
              <span class="order-value">${{ formatCurrency(row.totalOrderValue) }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="lastOrderDate" label="Last Order" min-width="120">
            <template #default="{ row }">
              <span class="last-order">{{ formatDate(row.lastOrderDate) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Actions" width="140" fixed="right">
            <template #default="{ row }">
              <div class="table-actions">
                <el-button type="primary" size="small" text @click="handleViewSupplier(row)">
                  <span class="material-symbols-outlined">visibility</span>
                </el-button>
                <el-button type="primary" size="small" text @click="handleEditSupplier(row)">
                  <span class="material-symbols-outlined">edit</span>
                </el-button>
                <el-button type="danger" size="small" text @click="handleDeleteSupplier(row)">
                  <span class="material-symbols-outlined">delete</span>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- Sticky Pagination -->
    <div class="pagination-container" :class="{ sticky: isScrolledToBottom }">
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
      title="Filter Suppliers"
      direction="rtl"
      size="400px"
      class="filters-drawer"
      append-to-body
    >
      <div class="filters-content">
        <div class="filter-group">
          <label class="filter-label">Status</label>
          <el-select
            v-model="filters.status"
            placeholder="Select status"
            clearable
            @change="handleFilterChange"
          >
            <el-option
              v-for="status in supplierStatuses"
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

    <!-- Supplier Dialog (Add/Edit/View) -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="1000px"
      class="supplier-dialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="supplierForm"
        :model="currentSupplier"
        :rules="supplierRules"
        label-width="140px"
        class="supplier-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Supplier Name" prop="name">
              <el-input
                v-model="currentSupplier.name"
                placeholder="Enter supplier name"
                :disabled="dialogMode === 'view'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Contact Person" prop="contactPerson">
              <el-input
                v-model="currentSupplier.contactPerson"
                placeholder="Enter contact person name"
                :disabled="dialogMode === 'view'"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Email" prop="email">
              <el-input
                v-model="currentSupplier.email"
                placeholder="Enter email address"
                :disabled="dialogMode === 'view'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Phone" prop="phone">
              <el-input
                v-model="currentSupplier.phone"
                placeholder="Enter phone number"
                :disabled="dialogMode === 'view'"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Address" prop="address">
          <el-input
            v-model="currentSupplier.address"
            placeholder="Enter full address"
            :disabled="dialogMode === 'view'"
          />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Status" prop="status">
              <el-select
                v-model="currentSupplier.status"
                placeholder="Select status"
                :disabled="dialogMode === 'view'"
              >
                <el-option
                  v-for="status in supplierStatuses"
                  :key="status.value"
                  :label="status.label"
                  :value="status.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Website" prop="website">
          <el-input
            v-model="currentSupplier.website"
            placeholder="Enter website URL"
            :disabled="dialogMode === 'view'"
          />
        </el-form-item>

        <el-form-item label="Notes" prop="notes">
          <el-input
            v-model="currentSupplier.notes"
            type="textarea"
            :rows="3"
            placeholder="Enter additional notes"
            :disabled="dialogMode === 'view'"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">
            {{ dialogMode === 'view' ? 'Close' : 'Cancel' }}
          </el-button>
          <el-button
            v-if="dialogMode !== 'view'"
            type="primary"
            @click="handleSaveSupplier"
            :loading="saving"
          >
            {{ dialogMode === 'add' ? 'Create Supplier' : 'Update Supplier' }}
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
import { suppliersService, supplierStatuses } from '@/services/suppliersService'
import type { Supplier, SupplierFilters, SupplierPagination } from '@/services/suppliersService'

// Reactive data
const loading = ref(false)
const saving = ref(false)
const suppliers = ref<Supplier[]>([])
const selectedSuppliers = ref<Supplier[]>([])
const drawerVisible = ref(false)
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit' | 'view'>('add')
const isScrolledToBottom = ref(false)
const tableContainer = ref<HTMLElement>()
const suppliersTable = ref()
const supplierForm = ref<FormInstance>()

// Filters and pagination
const filters = ref<SupplierFilters>({
  search: '',
  status: '',
  city: '',
  state: '',
  ratingMin: undefined,
  ratingMax: undefined,
  minimumOrderMin: undefined,
  minimumOrderMax: undefined,
  deliveryTimeMin: undefined,
  deliveryTimeMax: undefined,
})

const pagination = ref<SupplierPagination>({
  page: 1,
  size: 20,
  sort: 'name',
  direction: 'asc',
})

const totalElements = ref(0)

// Current supplier for dialog
const currentSupplier = ref<Partial<Supplier>>({})

// Form validation rules
const supplierRules: FormRules = {
  name: [{ required: true, message: 'Supplier name is required', trigger: 'blur' }],
  contactPerson: [{ required: true, message: 'Contact person is required', trigger: 'blur' }],
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' },
  ],
  phone: [{ required: true, message: 'Phone is required', trigger: 'blur' }],
  address: [{ required: true, message: 'Address is required', trigger: 'blur' }],
  city: [{ required: true, message: 'City is required', trigger: 'blur' }],
  state: [{ required: true, message: 'State is required', trigger: 'blur' }],
  status: [{ required: true, message: 'Status is required', trigger: 'change' }],
  paymentTerms: [{ required: true, message: 'Payment terms is required', trigger: 'change' }],
  deliveryTime: [{ required: true, message: 'Delivery time is required', trigger: 'blur' }],
  minimumOrderValue: [
    { required: true, message: 'Minimum order value is required', trigger: 'blur' },
  ],
  rating: [{ required: true, message: 'Rating is required', trigger: 'change' }],
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
      return 'Add New Supplier'
    case 'edit':
      return 'Edit Supplier'
    case 'view':
      return 'View Supplier Details'
    default:
      return 'Supplier'
  }
})

// Methods
const loadSuppliers = async () => {
  try {
    loading.value = true
    const response = await suppliersService.getSuppliers(filters.value, {
      ...pagination.value,
      page: pagination.value.page - 1, // Convert to 0-based for API
    })
    suppliers.value = response.data.data.content
    totalElements.value = response.data.data.page.totalElements
  } catch (error) {
    ElMessage.error('Failed to load suppliers')
    console.error('Error loading suppliers:', error)
  } finally {
    loading.value = false
  }
}

const handleSearchChange = () => {
  pagination.value.page = 1
  loadSuppliers()
}

const handleFilterChange = () => {
  pagination.value.page = 1
  loadSuppliers()
}

const handleSortChange = ({ prop, order }: { prop: string; order: string | null }) => {
  if (order) {
    pagination.value.sort = prop
    pagination.value.direction = order === 'ascending' ? 'asc' : 'desc'
  } else {
    pagination.value.sort = undefined
    pagination.value.direction = 'asc'
  }
  loadSuppliers()
}

const handleSizeChange = (size: number) => {
  pagination.value.size = size
  pagination.value.page = 1
  loadSuppliers()
}

const handleCurrentChange = (page: number) => {
  pagination.value.page = page
  loadSuppliers()
}

const handleSelectionChange = (selection: Supplier[]) => {
  selectedSuppliers.value = selection
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: '',
    city: '',
    state: '',
    ratingMin: undefined,
    ratingMax: undefined,
    minimumOrderMin: undefined,
    minimumOrderMax: undefined,
    deliveryTimeMin: undefined,
    deliveryTimeMax: undefined,
  }
  pagination.value.page = 1
  loadSuppliers()
}

const applyFilters = () => {
  drawerVisible.value = false
  pagination.value.page = 1
  loadSuppliers()
}

// CRUD operations
const handleAddSupplier = () => {
  currentSupplier.value = {
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    taxId: '',
    status: 'active',
    rating: 5,
    suppliedMedicinesCount: 0,
    totalOrderValue: 0,
    lastOrderDate: new Date().toISOString().split('T')[0],
    registrationDate: new Date().toISOString().split('T')[0],
    paymentTerms: 'Net 30',
    deliveryTime: 7,
    minimumOrderValue: 1000,
    website: '',
    notes: '',
  }
  dialogMode.value = 'add'
  dialogVisible.value = true
}

const handleViewSupplier = (supplier: Supplier) => {
  currentSupplier.value = { ...supplier }
  dialogMode.value = 'view'
  dialogVisible.value = true
}

const handleEditSupplier = (supplier: Supplier) => {
  currentSupplier.value = { ...supplier }
  dialogMode.value = 'edit'
  dialogVisible.value = true
}

const handleSaveSupplier = async () => {
  if (!supplierForm.value) return

  try {
    const valid = await supplierForm.value.validate()
    if (!valid) return

    saving.value = true

    if (dialogMode.value === 'add') {
      await suppliersService.createSupplier(
        currentSupplier.value as Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>,
      )
      ElMessage.success('Supplier created successfully')
    } else if (dialogMode.value === 'edit') {
      await suppliersService.updateSupplier(currentSupplier.value.id!, currentSupplier.value)
      ElMessage.success('Supplier updated successfully')
    }

    dialogVisible.value = false
    loadSuppliers()
  } catch (error) {
    ElMessage.error(`Failed to ${dialogMode.value} supplier`)
    console.error(`Error ${dialogMode.value}ing supplier:`, error)
  } finally {
    saving.value = false
  }
}

const handleDeleteSupplier = async (supplier: Supplier) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete supplier "${supplier.name}"?`,
      'Delete Supplier',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )

    await suppliersService.deleteSupplier(supplier.id)
    ElMessage.success('Supplier deleted successfully')
    loadSuppliers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete supplier')
      console.error('Error deleting supplier:', error)
    }
  }
}

const handleBulkDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete ${selectedSuppliers.value.length} selected suppliers?`,
      'Delete Suppliers',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )

    const ids = selectedSuppliers.value.map((s) => s.id)
    await suppliersService.bulkDeleteSuppliers(ids)
    ElMessage.success(`${ids.length} suppliers deleted successfully`)
    selectedSuppliers.value = []
    loadSuppliers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete suppliers')
      console.error('Error deleting suppliers:', error)
    }
  }
}

// Utility methods
const getStatusType = (status: string) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'inactive':
      return 'info'
    case 'suspended':
      return 'danger'
    default:
      return 'info'
  }
}

const getStatusLabel = (status: string) => {
  return supplierStatuses.find((s) => s.value === status)?.label || status
}

const getRowClassName = ({ row }: { row: Supplier }) => {
  if (row.status === 'suspended') return 'row-suspended'
  if (row.status === 'inactive') return 'row-inactive'
  return ''
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Scroll handling for sticky pagination
const handleScroll = () => {
  if (!tableContainer.value) return

  const { scrollTop, scrollHeight, clientHeight } = tableContainer.value
  isScrolledToBottom.value = scrollTop + clientHeight >= scrollHeight - 10
}

// Lifecycle hooks
onMounted(() => {
  loadSuppliers()

  if (tableContainer.value) {
    tableContainer.value.addEventListener('scroll', handleScroll)
  }
})

// Watch for dialog visibility to reset form
watch(dialogVisible, (newVal) => {
  if (!newVal && supplierForm.value) {
    supplierForm.value.resetFields()
  }
})
</script>

<style scoped>
.delete-button {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-section {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.search-input {
  max-width: 600px;
}

.table-wrapper {
  min-height: 400px;
}

.supplier-info .supplier-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.supplier-info .supplier-contact {
  font-size: 12px;
  color: #6b7280;
}

.contact-info .email {
  color: #1f2937;
  margin-bottom: 4px;
}

.contact-info .phone {
  font-size: 12px;
  color: #6b7280;
}

.location-info .address {
  color: #1f2937;
  margin-bottom: 4px;
}

.location-info .city-state {
  font-size: 12px;
  color: #6b7280;
}

.medicines-count {
  font-weight: 500;
}

.order-value {
  font-weight: 600;
  color: #059669;
}

.delivery-time {
  color: #6b7280;
}

.last-order {
  font-size: 12px;
  color: #6b7280;
}

.table-actions {
  display: flex;
}

.pagination-container {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: white;
  display: flex;
  justify-content: center;
  transition: all 0.3s ease;
}

.pagination-container.sticky {
  position: sticky;
  bottom: 0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.supplier-dialog .supplier-form {
  max-height: 60vh;
}

.dialog-footer {
  display: flex;
  gap: 12px;
}

/* Row styling */
:deep(.row-suspended) {
  background-color: #fef2f2 !important;
}

:deep(.row-inactive) {
  background-color: #f9fafb !important;
}
</style>
