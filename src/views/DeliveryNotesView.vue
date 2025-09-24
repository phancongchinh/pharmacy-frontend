<template>
  <div class="page-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="page-header-content">
        <h1 class="page-title">Delivery Notes</h1>
        <p class="page-subtitle">Manage outgoing medicine delivery notes</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleAddDeliveryNote">
          <span class="material-symbols-outlined">add</span>
          New Delivery Note
        </el-button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="delivery-notes-content">
      <div class="mb-3 d-flex align-items-center justify-content-between">
        <el-input
          v-model="filters.search"
          placeholder="Search delivery notes by number, customer, tracking..."
          class="search-input"
          clearable
          @input="handleSearchChange"
        >
          <template #prefix>
            <span class="material-symbols-outlined">search</span>
          </template>
        </el-input>

        <div class="header-filters">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="handleDateRangeChange"
            class="date-picker"
          />
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
      </div>

      <el-card shadow="never">
        <el-table
          :data="deliveryNotes"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          empty-text="No delivery notes found"
          ref="deliveryNotesTable"
          :row-class-name="getRowClassName"
        >
          <el-table-column type="selection" width="55" />

          <el-table-column prop="deliveryNumber" label="Delivery Number" min-width="140">
            <template #default="{ row }">
              <div class="delivery-info">
                <div class="delivery-number">{{ row.deliveryNumber }}</div>
                <div class="delivery-date">{{ formatDate(row.deliveryDate) }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="customer" label="Customer" min-width="180">
            <template #default="{ row }">
              <div class="customer-info">
                <div class="customer-name">{{ row.customerName }}</div>
                <div class="customer-address">{{ row.deliveryAddress.split(',')[0] }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="items" label="Items" min-width="120">
            <template #default="{ row }">
              <div class="items-info">
                <span class="item-count">{{ row.totalItems }} items</span>
                <div class="medicines-preview">
                  {{
                    row.medicines
                      .slice(0, 2)
                      .map((m) => m.name)
                      .join(', ')
                  }}
                  <span v-if="row.medicines.length > 2">+{{ row.medicines.length - 2 }} more</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="deliveryMethod" label="Delivery Method" min-width="130">
            <template #default="{ row }">
              <div class="delivery-method-info">
                <el-tag :type="getDeliveryMethodType(row.deliveryMethod)" size="small">
                  {{ getDeliveryMethodLabel(row.deliveryMethod) }}
                </el-tag>
                <div class="tracking-number" v-if="row.trackingNumber">
                  Track: {{ row.trackingNumber }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="totalValue" label="Total Value" min-width="120">
            <template #default="{ row }">
              <div class="amount-info">
                <div class="total-amount">${{ formatCurrency(row.totalValue) }}</div>
                <div class="delivery-fee" v-if="row.deliveryFee > 0">
                  Fee: ${{ formatCurrency(row.deliveryFee) }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="deliveredBy" label="Delivered By" min-width="130">
            <template #default="{ row }">
              <div class="deliverer-info">
                <div class="deliverer-name">{{ row.deliveredBy || 'Pending' }}</div>
                <div class="delivery-time" v-if="row.deliveredAt">
                  {{ formatTime(row.deliveredAt) }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="Status" min-width="110">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="priority" label="Priority" min-width="100">
            <template #default="{ row }">
              <el-tag :type="getPriorityType(row.priority)" size="small">
                {{ getPriorityLabel(row.priority) }}
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
                    <el-dropdown-item command="edit" v-if="row.status === 'pending'">
                      <span class="material-symbols-outlined">edit</span>
                      Edit
                    </el-dropdown-item>
                    <el-dropdown-item command="track" v-if="row.trackingNumber" divided>
                      <span class="material-symbols-outlined">location_on</span>
                      Track Package
                    </el-dropdown-item>
                    <el-dropdown-item command="complete" v-if="row.status === 'in-transit'">
                      <span class="material-symbols-outlined">check_circle</span>
                      Mark Delivered
                    </el-dropdown-item>
                    <el-dropdown-item command="print">
                      <span class="material-symbols-outlined">print</span>
                      Print Note
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
      title="Filter Delivery Notes"
      direction="rtl"
      size="400px"
      class="filters-drawer"
      append-to-body
    >
      <div class="filters-content">
        <div class="filter-group">
          <label class="filter-label">Delivery Method</label>
          <el-select
            v-model="filters.deliveryMethod"
            placeholder="Select delivery method"
            clearable
            @change="handleFilterChange"
          >
            <el-option
              v-for="method in deliveryMethods"
              :key="method.value"
              :label="method.label"
              :value="method.value"
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
              v-for="status in deliveryStatuses"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Priority</label>
          <el-select
            v-model="filters.priority"
            placeholder="Select priority"
            clearable
            @change="handleFilterChange"
          >
            <el-option
              v-for="priority in priorities"
              :key="priority.value"
              :label="priority.label"
              :value="priority.value"
            />
          </el-select>
        </div>

        <div class="filter-actions">
          <el-button @click="clearFilters">Clear All Filters</el-button>
          <el-button type="primary" @click="applyFilters">Apply Filters</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- Delivery Note Details Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="1200px"
      class="delivery-dialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="delivery-details" v-if="currentDeliveryNote.id">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-section">
              <h3>Delivery Information</h3>
              <div class="detail-item">
                <label>Delivery Number:</label>
                <span>{{ currentDeliveryNote.deliveryNumber }}</span>
              </div>
              <div class="detail-item">
                <label>Delivery Date:</label>
                <span>{{ formatDateTime(currentDeliveryNote.deliveryDate) }}</span>
              </div>
              <div class="detail-item">
                <label>Expected Delivery:</label>
                <span>{{ formatDateTime(currentDeliveryNote.expectedDelivery) }}</span>
              </div>
              <div class="detail-item">
                <label>Delivery Method:</label>
                <el-tag
                  :type="getDeliveryMethodType(currentDeliveryNote.deliveryMethod)"
                  size="small"
                >
                  {{ getDeliveryMethodLabel(currentDeliveryNote.deliveryMethod) }}
                </el-tag>
              </div>
              <div class="detail-item" v-if="currentDeliveryNote.trackingNumber">
                <label>Tracking Number:</label>
                <span>{{ currentDeliveryNote.trackingNumber }}</span>
              </div>
              <div class="detail-item">
                <label>Status:</label>
                <el-tag :type="getStatusType(currentDeliveryNote.status)" size="small">
                  {{ getStatusLabel(currentDeliveryNote.status) }}
                </el-tag>
              </div>
              <div class="detail-item">
                <label>Priority:</label>
                <el-tag :type="getPriorityType(currentDeliveryNote.priority)" size="small">
                  {{ getPriorityLabel(currentDeliveryNote.priority) }}
                </el-tag>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-section">
              <h3>Customer & Delivery Information</h3>
              <div class="detail-item">
                <label>Customer:</label>
                <span>{{ currentDeliveryNote.customerName }}</span>
              </div>
              <div class="detail-item">
                <label>Phone:</label>
                <span>{{ currentDeliveryNote.customerPhone }}</span>
              </div>
              <div class="detail-item">
                <label>Email:</label>
                <span>{{ currentDeliveryNote.customerEmail || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <label>Delivery Address:</label>
                <span>{{ currentDeliveryNote.deliveryAddress }}</span>
              </div>
              <div class="detail-item" v-if="currentDeliveryNote.deliveredBy">
                <label>Delivered By:</label>
                <span>{{ currentDeliveryNote.deliveredBy }}</span>
              </div>
              <div class="detail-item" v-if="currentDeliveryNote.deliveredAt">
                <label>Delivered At:</label>
                <span>{{ formatDateTime(currentDeliveryNote.deliveredAt) }}</span>
              </div>
            </div>
          </el-col>
        </el-row>

        <div class="detail-section">
          <h3>Items for Delivery</h3>
          <el-table :data="currentDeliveryNote.medicines" class="items-table">
            <el-table-column prop="name" label="Medicine" min-width="200" />
            <el-table-column prop="batchNumber" label="Batch Number" width="140" />
            <el-table-column prop="expiryDate" label="Expiry Date" width="120">
              <template #default="{ row }">
                {{ formatDate(row.expiryDate) }}
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="Quantity" width="100" />
            <el-table-column prop="unitPrice" label="Unit Price" width="120">
              <template #default="{ row }"> ${{ formatCurrency(row.unitPrice) }} </template>
            </el-table-column>
            <el-table-column prop="total" label="Total" width="120">
              <template #default="{ row }">
                ${{ formatCurrency(row.quantity * row.unitPrice) }}
              </template>
            </el-table-column>
            <el-table-column prop="specialInstructions" label="Instructions" min-width="150">
              <template #default="{ row }">
                {{ row.specialInstructions || 'None' }}
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="detail-section">
          <h3>Delivery Summary</h3>
          <div class="delivery-summary">
            <div class="summary-row">
              <span>Total Items:</span>
              <span>{{ currentDeliveryNote.totalItems }}</span>
            </div>
            <div class="summary-row">
              <span>Total Quantity:</span>
              <span>{{ currentDeliveryNote.totalQuantity }}</span>
            </div>
            <div class="summary-row">
              <span>Items Value:</span>
              <span>${{ formatCurrency(currentDeliveryNote.totalValue) }}</span>
            </div>
            <div class="summary-row" v-if="currentDeliveryNote.deliveryFee > 0">
              <span>Delivery Fee:</span>
              <span>${{ formatCurrency(currentDeliveryNote.deliveryFee) }}</span>
            </div>
            <div class="summary-row total-row">
              <span>Total Amount:</span>
              <span
                >${{
                  formatCurrency(
                    currentDeliveryNote.totalValue + (currentDeliveryNote.deliveryFee || 0),
                  )
                }}</span
              >
            </div>
          </div>
        </div>

        <div class="detail-section" v-if="currentDeliveryNote.specialInstructions">
          <h3>Special Instructions</h3>
          <p class="instructions-text">{{ currentDeliveryNote.specialInstructions }}</p>
        </div>

        <div class="detail-section" v-if="currentDeliveryNote.notes">
          <h3>Notes</h3>
          <p class="notes-text">{{ currentDeliveryNote.notes }}</p>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Close</el-button>
          <el-button type="primary" @click="handlePrintDeliveryNote" v-if="currentDeliveryNote.id">
            <span class="material-symbols-outlined">print</span>
            Print Note
          </el-button>
          <el-button
            type="success"
            @click="handleMarkAsDelivered"
            v-if="currentDeliveryNote.status === 'in-transit'"
          >
            <span class="material-symbols-outlined">check_circle</span>
            Mark as Delivered
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- New Delivery Note Dialog -->
    <el-dialog
      v-model="dialogVisible"
      title="New Delivery Note"
      width="800px"
      class="delivery-dialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="delivery-note-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="form-item">
              <label>Delivery Number</label>
              <el-input
                v-model="currentDeliveryNote.deliveryNumber"
                placeholder="Auto-generated"
                disabled
              />
            </div>
            <div class="form-item">
              <label>Delivery Date</label>
              <el-date-picker
                v-model="currentDeliveryNote.deliveryDate"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                @change="handleDeliveryDateChange"
                placeholder="Select delivery date"
                class="w-full"
              />
            </div>
            <div class="form-item">
              <label>Expected Delivery</label>
              <el-date-picker
                v-model="currentDeliveryNote.expectedDelivery"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                @change="handleExpectedDeliveryChange"
                placeholder="Select expected delivery date"
                class="w-full"
              />
            </div>
            <div class="form-item">
              <label>Customer Name</label>
              <el-input
                v-model="currentDeliveryNote.customerName"
                placeholder="Enter customer name"
                clearable
              />
            </div>
            <div class="form-item">
              <label>Customer Phone</label>
              <el-input
                v-model="currentDeliveryNote.customerPhone"
                placeholder="Enter customer phone"
                clearable
              />
            </div>
            <div class="form-item">
              <label>Customer Email</label>
              <el-input
                v-model="currentDeliveryNote.customerEmail"
                placeholder="Enter customer email"
                clearable
              />
            </div>
            <div class="form-item">
              <label>Delivery Address</label>
              <el-input
                v-model="currentDeliveryNote.deliveryAddress"
                placeholder="Enter delivery address"
                clearable
              />
            </div>
            <div class="form-item">
              <label>Delivery Method</label>
              <el-select
                v-model="currentDeliveryNote.deliveryMethod"
                placeholder="Select delivery method"
                @change="handleDeliveryMethodChange"
                clearable
              >
                <el-option
                  v-for="method in deliveryMethods"
                  :key="method.value"
                  :label="method.label"
                  :value="method.value"
                />
              </el-select>
            </div>
            <div class="form-item">
              <label>Tracking Number</label>
              <el-input
                v-model="currentDeliveryNote.trackingNumber"
                placeholder="Auto-generated"
                disabled
              />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="form-item">
              <label>Delivered By</label>
              <el-input
                v-model="currentDeliveryNote.deliveredBy"
                placeholder="Enter deliverer name"
                clearable
              />
            </div>
            <div class="form-item">
              <label>Delivered At</label>
              <el-input
                v-model="currentDeliveryNote.deliveredAt"
                placeholder="Enter delivery time"
                clearable
              />
            </div>
            <div class="form-item">
              <label>Status</label>
              <el-select v-model="currentDeliveryNote.status" placeholder="Select status" clearable>
                <el-option
                  v-for="status in deliveryStatuses"
                  :key="status.value"
                  :label="status.label"
                  :value="status.value"
                />
              </el-select>
            </div>
            <div class="form-item">
              <label>Priority</label>
              <el-select
                v-model="currentDeliveryNote.priority"
                placeholder="Select priority"
                clearable
              >
                <el-option
                  v-for="priority in priorities"
                  :key="priority.value"
                  :label="priority.label"
                  :value="priority.value"
                />
              </el-select>
            </div>
            <div class="form-item">
              <label>Special Instructions</label>
              <el-input
                v-model="currentDeliveryNote.specialInstructions"
                placeholder="Enter special instructions"
                clearable
              />
            </div>
            <div class="form-item">
              <label>Notes</label>
              <el-input
                v-model="currentDeliveryNote.notes"
                placeholder="Enter additional notes"
                clearable
              />
            </div>
          </el-col>
        </el-row>

        <div class="form-actions">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveDeliveryNote">Save Delivery Note</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  deliveryNotesService,
  type DeliveryNote,
  type DeliveryNoteFilters,
  DeliveryStatus,
  DeliveryType,
} from '@/services/deliveryNotesService'

// Reactive data
const loading = ref(false)
const deliveryNotes = ref<DeliveryNote[]>([])
const selectedDeliveryNotes = ref<DeliveryNote[]>([])
const drawerVisible = ref(false)
const dialogVisible = ref(false)
const deliveryNotesTable = ref()
const dateRange = ref<[string, string] | null>(null)

// Use constants from service
const deliveryStatuses = [
  { value: DeliveryStatus.COMPLETED, label: 'Completed' },
  { value: DeliveryStatus.CANCELLED, label: 'Cancelled' },
]

const deliveryMethods = [
  { value: 'courier', label: 'Courier' },
  { value: 'self-pickup', label: 'Self Pickup' },
  { value: 'postal', label: 'Postal Service' },
  { value: 'express', label: 'Express Delivery' },
]

const deliveryTypes = [
  { value: DeliveryType.FOR_SALES, label: 'For Sales' },
  { value: DeliveryType.FOR_INTERNAL_USE, label: 'For Internal Use' },
  { value: DeliveryType.FOR_RETURNS, label: 'For Returns' },
  { value: DeliveryType.FOR_DAMAGED_GOODS, label: 'For Damaged Goods' },
  { value: DeliveryType.FOR_EXPIRY_MANAGEMENT, label: 'For Expiry Management' },
]

// Filters and pagination
const filters = ref<DeliveryNoteFilters>({})

const pagination = ref({
  page: 1,
  size: 20,
  sort: 'deliveryDate',
  direction: 'desc' as 'asc' | 'desc',
})

const totalElements = ref(0)
const currentDeliveryNote = ref<Partial<DeliveryNote>>({})

// Computed properties
const activeFiltersCount = computed(() => {
  return (
    Object.values(filters.value).filter(
      (value) => value !== '' && value !== undefined && value !== null,
    ).length + (dateRange.value ? 1 : 0)
  )
})

const dialogTitle = computed(() => {
  return currentDeliveryNote.value.id
    ? `Delivery Note - ${currentDeliveryNote.value.deliveryNumber}`
    : 'Delivery Note Details'
})

// Methods - Updated to use real API
const loadDeliveryNotes = async () => {
  try {
    loading.value = true

    const response = await deliveryNotesService.getDeliveryNotes()
    if (response.success && response.data) {
      deliveryNotes.value = response.data
      totalElements.value = response.data.length // Backend doesn't return pagination info yet
    } else {
      ElMessage.error(response.message || 'Failed to load delivery notes')
    }
  } catch (error) {
    ElMessage.error('Failed to load delivery notes')
    console.error('Error loading delivery notes:', error)
  } finally {
    loading.value = false
  }
}

const handleSearchChange = () => {
  pagination.value.page = 1
  loadDeliveryNotes()
}

const handleDateRangeChange = () => {
  if (dateRange.value) {
    filters.value.dateFrom = dateRange.value[0]
    filters.value.dateTo = dateRange.value[1]
  } else {
    filters.value.dateFrom = ''
    filters.value.dateTo = ''
  }
  pagination.value.page = 1
  loadDeliveryNotes()
}

const handleFilterChange = () => {
  pagination.value.page = 1
  loadDeliveryNotes()
}

const handleSizeChange = (size: number) => {
  pagination.value.size = size
  pagination.value.page = 1
  loadDeliveryNotes()
}

const handleCurrentChange = (page: number) => {
  pagination.value.page = page
  loadDeliveryNotes()
}

const handleSelectionChange = (selection: DeliveryNote[]) => {
  selectedDeliveryNotes.value = selection
}

const clearFilters = () => {
  filters.value = {}
  dateRange.value = null
  pagination.value.page = 1
  loadDeliveryNotes()
}

const applyFilters = () => {
  drawerVisible.value = false
  pagination.value.page = 1
  loadDeliveryNotes()
}

// CRUD operations - Updated to use real API
const handleAddDeliveryNote = () => {
  ElMessage.info('New delivery note functionality to be implemented')
}

const handleViewDeliveryNote = async (deliveryNote: DeliveryNote) => {
  try {
    const response = await deliveryNotesService.getDeliveryNoteById(deliveryNote.id)
    if (response.success && response.data) {
      currentDeliveryNote.value = response.data
      dialogVisible.value = true
    } else {
      ElMessage.error(response.message || 'Failed to load delivery note details')
    }
  } catch (error) {
    ElMessage.error('Failed to load delivery note details')
    console.error('Error loading delivery note:', error)
  }
}

const handleEditDeliveryNote = (deliveryNote: DeliveryNote) => {
  ElMessage.info('Edit delivery note functionality to be implemented')
}

const handleDeleteDeliveryNote = async (deliveryNote: DeliveryNote) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete delivery note "${deliveryNote.deliveryNumber}"?`,
      'Delete Delivery Note',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )

    const response = await deliveryNotesService.deleteDeliveryNote(deliveryNote.id)
    if (response.success) {
      ElMessage.success('Delivery note deleted successfully')
      loadDeliveryNotes()
    } else {
      ElMessage.error(response.message || 'Failed to delete delivery note')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete delivery note')
      console.error('Error deleting delivery note:', error)
    }
  }
}

const handleActionCommand = (command: string, deliveryNote: DeliveryNote) => {
  switch (command) {
    case 'view':
      handleViewDeliveryNote(deliveryNote)
      break
    case 'edit':
      handleEditDeliveryNote(deliveryNote)
      break
    case 'delete':
      handleDeleteDeliveryNote(deliveryNote)
      break
  }
}

// Utility methods
const getStatusType = (status: DeliveryStatus) => {
  return deliveryNotesService.getDeliveryStatusLabel(status) === 'Completed' ? 'success' : 'danger'
}

const getStatusLabel = (status: DeliveryStatus) => {
  return deliveryNotesService.getDeliveryStatusLabel(status)
}

const getDeliveryTypeLabel = (type: DeliveryType) => {
  return deliveryNotesService.getDeliveryTypeLabel(type)
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

// Lifecycle hooks
onMounted(() => {
  loadDeliveryNotes()
})
</script>

<style scoped>
/* Inherit common styles */
.search-input {
  max-width: 600px;
}

.header-filters {
  display: flex;
  gap: 12px;
  align-items: center;
}

.date-picker {
  width: 240px;
}

.delivery-info .delivery-number {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.delivery-info .delivery-date {
  font-size: 12px;
  color: #6b7280;
}

.customer-info .customer-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.customer-info .customer-address {
  font-size: 12px;
  color: #6b7280;
}

.items-info .item-count {
  font-weight: 500;
  color: #1f2937;
}

.items-info .medicines-preview {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.delivery-method-info .tracking-number {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.amount-info .total-amount {
  font-weight: 600;
  color: #059669;
  margin-bottom: 4px;
}

.amount-info .delivery-fee {
  font-size: 12px;
  color: #6b7280;
}

.deliverer-info .deliverer-name {
  color: #1f2937;
  margin-bottom: 4px;
}

.deliverer-info .delivery-time {
  font-size: 12px;
  color: #6b7280;
}

.delivery-details {
  max-height: 70vh;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h3 {
  margin: 0 0 16px 0;
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.detail-item label {
  font-weight: 500;
  color: #6b7280;
}

.items-table {
  margin-top: 16px;
}

.delivery-summary {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.total-row {
  border-top: 1px solid #e5e7eb;
  padding-top: 8px;
  font-weight: 600;
  font-size: 16px;
}

.instructions-text,
.notes-text {
  background: #f9fafb;
  padding: 12px;
  border-radius: 4px;
  margin: 0;
  color: #6b7280;
}

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

/* Dropdown menu item styling */
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-dropdown-menu__item .material-symbols-outlined) {
  font-size: 18px;
}

.delivery-dialog .delivery-details {
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

.delivery-note-form {
  max-height: 70vh;
  overflow-y: auto;
}

.form-item {
  margin-bottom: 16px;
}

.form-item label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}
</style>
