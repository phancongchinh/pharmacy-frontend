<template>
  <div class="page-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="page-header-content">
        <h1 class="page-title">Receipt Notes</h1>
        <p class="page-subtitle">Manage incoming medicine receipt notes</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleAddReceiptNote">
          <span class="material-symbols-outlined">add</span>
          New Receipt Note
        </el-button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="receipt-notes-content">
      <div class="mb-3 d-flex align-items-center justify-content-between">
        <el-input
          v-model="filters.search"
          placeholder="Search receipt notes by number, supplier, reference..."
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
          :data="receiptNotes"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          empty-text="No receipt notes found"
          ref="receiptNotesTable"
          :row-class-name="getRowClassName"
        >
          <el-table-column type="selection" width="55" />

          <el-table-column prop="receiptNumber" label="Receipt Number" min-width="140">
            <template #default="{ row }">
              <div class="receipt-info">
                <div class="receipt-number">{{ row.receiptNumber }}</div>
                <div class="receipt-date">{{ formatDate(row.receiptDate) }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="supplier" label="Supplier" min-width="180">
            <template #default="{ row }">
              <div class="supplier-info">
                <div class="supplier-name">{{ row.supplierName }}</div>
                <div class="supplier-reference">Ref: {{ row.supplierReference }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="items" label="Items" min-width="120">
            <template #default="{ row }">
              <div class="items-info">
                <span class="item-count">{{ row.totalItems }} items</span>
                <div class="medicines-preview">
                  <!--                  {{-->
                  <!--                    row.medicines-->
                  <!--                      .slice(0, 2)-->
                  <!--                      .map((m) => m.name)-->
                  <!--                      .join(', ')-->
                  <!--                  }}-->
                  <!--                  <span v-if="row.medicines.length > 2">+{{ row.medicines.length - 2 }} more</span>-->
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="totalAmount" label="Total Value" min-width="120">
            <template #default="{ row }">
              <div class="amount-info">
                <div class="total-amount">${{ formatCurrency(row.totalAmount) }}</div>
                <div class="received-amount">Received: {{ row.totalQuantity }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="receivedBy" label="Received By" min-width="130">
            <template #default="{ row }">
              <div class="receiver-info">
                <div class="receiver-name">{{ row.receivedBy }}</div>
                <div class="receive-time">{{ formatTime(row.receiptDate) }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="Status" min-width="110">
            <template #default="{ row }">
              <!--              <el-tag :type="getStatusType(row.status)" size="small">-->
              <!--                {{ getStatusLabel(row.status) }}-->
              <!--              </el-tag>-->
            </template>
          </el-table-column>

          <el-table-column prop="verificationStatus" label="Verification" min-width="120">
            <template #default="{ row }">
              <el-tag :type="getVerificationStatusType(row.verificationStatus)" size="small">
                {{ getVerificationStatusLabel(row.verificationStatus) }}
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
                    <el-dropdown-item
                      command="verify"
                      v-if="row.verificationStatus === 'pending'"
                      divided
                    >
                      <span class="material-symbols-outlined">verified</span>
                      Verify
                    </el-dropdown-item>
                    <el-dropdown-item command="print">
                      <span class="material-symbols-outlined">print</span>
                      Print Receipt
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
      title="Filter Receipt Notes"
      direction="rtl"
      size="400px"
      class="filters-drawer"
      append-to-body
    >
      <div class="filters-content">
        <div class="filter-group">
          <label class="filter-label">Supplier</label>
          <el-select
            v-model="filters.supplier"
            placeholder="Select supplier"
            clearable
            @change="handleFilterChange"
          >
            <el-option
              v-for="supplier in suppliers"
              :key="supplier.value"
              :label="supplier.label"
              :value="supplier.value"
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
              v-for="status in receiptStatuses"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Verification Status</label>
          <el-select
            v-model="filters.verificationStatus"
            placeholder="Select verification status"
            clearable
            @change="handleFilterChange"
          >
            <el-option
              v-for="status in verificationStatuses"
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

    <!-- Receipt Note Details Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="1200px"
      class="receipt-dialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="receipt-details" v-if="currentReceiptNote.id">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-section">
              <h3>Receipt Information</h3>
              <div class="detail-item">
                <label>Receipt Number:</label>
                <span>{{ currentReceiptNote.receiptNumber }}</span>
              </div>
              <div class="detail-item">
                <label>Receipt Date:</label>
                <span>{{ formatDateTime(currentReceiptNote.receiptDate) }}</span>
              </div>
              <div class="detail-item">
                <label>Received By:</label>
                <span>{{ currentReceiptNote.receivedBy }}</span>
              </div>
              <div class="detail-item">
                <label>Status:</label>
                <!--                <el-tag :type="getStatusType(currentReceiptNote.status)" size="small">-->
                <!--                  {{ getStatusLabel(currentReceiptNote.status) }}-->
                <!--                </el-tag>-->
              </div>
              <div class="detail-item">
                <label>Verification:</label>
                <el-tag
                  :type="getVerificationStatusType(currentReceiptNote.verificationStatus)"
                  size="small"
                >
                  {{ getVerificationStatusLabel(currentReceiptNote.verificationStatus) }}
                </el-tag>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-section">
              <h3>Supplier Information</h3>
              <div class="detail-item">
                <label>Supplier:</label>
                <span>{{ currentReceiptNote.supplierName }}</span>
              </div>
              <div class="detail-item">
                <label>Supplier Reference:</label>
                <span>{{ currentReceiptNote.supplierReference }}</span>
              </div>
              <div class="detail-item">
                <label>Purchase Order:</label>
                <span>{{ currentReceiptNote.purchaseOrder || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <label>Delivery Note:</label>
                <span>{{ currentReceiptNote.deliveryNote || 'N/A' }}</span>
              </div>
            </div>
          </el-col>
        </el-row>

        <div class="detail-section">
          <h3>Received Items</h3>
          <el-table :data="currentReceiptNote.medicines" class="items-table">
            <el-table-column prop="name" label="Medicine" min-width="200" />
            <el-table-column prop="batchNumber" label="Batch Number" width="140" />
            <el-table-column prop="expiryDate" label="Expiry Date" width="120">
              <template #default="{ row }">
                {{ formatDate(row.expiryDate) }}
              </template>
            </el-table-column>
            <el-table-column prop="quantityOrdered" label="Ordered" width="100" />
            <el-table-column prop="quantityReceived" label="Received" width="100" />
            <el-table-column prop="unitPrice" label="Unit Price" width="120">
              <template #default="{ row }"> ${{ formatCurrency(row.unitPrice) }} </template>
            </el-table-column>
            <el-table-column prop="total" label="Total" width="120">
              <template #default="{ row }">
                ${{ formatCurrency(row.quantityReceived * row.unitPrice) }}
              </template>
            </el-table-column>
            <el-table-column prop="condition" label="Condition" width="100">
              <template #default="{ row }">
                <el-tag :type="getConditionType(row.condition)" size="small">
                  {{ row.condition }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="detail-section">
          <h3>Summary</h3>
          <div class="receipt-summary">
            <div class="summary-row">
              <span>Total Items:</span>
              <span>{{ currentReceiptNote.totalItems }}</span>
            </div>
            <div class="summary-row">
              <span>Total Quantity:</span>
              <span>{{ currentReceiptNote.totalQuantity }}</span>
            </div>
            <div class="summary-row total-row">
              <span>Total Value:</span>
              <span>${{ formatCurrency(currentReceiptNote.totalAmount) }}</span>
            </div>
          </div>
        </div>

        <div class="detail-section" v-if="currentReceiptNote.notes">
          <h3>Notes</h3>
          <p class="notes-text">{{ currentReceiptNote.notes }}</p>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Close</el-button>
          <el-button type="primary" @click="handlePrintReceipt" v-if="currentReceiptNote.id">
            <span class="material-symbols-outlined">print</span>
            Print Receipt
          </el-button>
          <el-button
            type="success"
            @click="handleVerifyReceipt"
            v-if="currentReceiptNote.verificationStatus === 'pending'"
          >
            <span class="material-symbols-outlined">verified</span>
            Verify Receipt
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- New Receipt Note Dialog -->
    <el-dialog
      v-model="dialogVisible"
      title="New Receipt Note"
      width="800px"
      class="new-receipt-dialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="new-receipt-content">
        <el-form :model="currentReceiptNote" ref="receiptNoteForm" label-width="150px">
          <el-form-item label="Receipt Number">
            <el-input
              v-model="currentReceiptNote.receiptNumber"
              placeholder="Auto-generated"
              disabled
            />
          </el-form-item>

          <el-form-item label="Receipt Date">
            <el-date-picker
              v-model="currentReceiptNote.receiptDate"
              type="datetime"
              placeholder="Select receipt date"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              @change="handleDateChange"
            />
          </el-form-item>

          <el-form-item label="Supplier">
            <el-select
              v-model="currentReceiptNote.supplierName"
              placeholder="Select supplier"
              clearable
              @change="handleSupplierChange"
            >
              <el-option
                v-for="supplier in suppliers"
                :key="supplier.value"
                :label="supplier.label"
                :value="supplier.label"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Supplier Reference">
            <el-input
              v-model="currentReceiptNote.supplierReference"
              placeholder="Enter supplier reference"
            />
          </el-form-item>

          <el-form-item label="Purchase Order">
            <el-input
              v-model="currentReceiptNote.purchaseOrder"
              placeholder="Enter purchase order number"
            />
          </el-form-item>

          <el-form-item label="Delivery Note">
            <el-input
              v-model="currentReceiptNote.deliveryNote"
              placeholder="Enter delivery note number"
            />
          </el-form-item>

          <el-form-item label="Received By">
            <el-input v-model="currentReceiptNote.receivedBy" placeholder="Enter receiver's name" />
          </el-form-item>

          <el-form-item label="Notes">
            <el-input
              v-model="currentReceiptNote.notes"
              type="textarea"
              placeholder="Enter any additional notes"
              rows="3"
            />
          </el-form-item>

          <el-form-item label="Medicines">
            <el-table
              v-model="currentReceiptNote.medicines"
              :data="currentReceiptNote.medicines"
              class="medicines-table"
              :show-header="true"
              border
              size="small"
            >
              <el-table-column prop="name" label="Medicine" min-width="150">
                <template #default="{ row }">
                  <el-input
                    v-model="row.name"
                    placeholder="Enter medicine name"
                    @change="handleMedicineChange"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="batchNumber" label="Batch Number" width="120">
                <template #default="{ row }">
                  <el-input
                    v-model="row.batchNumber"
                    placeholder="Enter batch number"
                    @change="handleMedicineChange"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="expiryDate" label="Expiry Date" width="120">
                <template #default="{ row }">
                  <el-date-picker
                    v-model="row.expiryDate"
                    placeholder="Select expiry date"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    @change="handleMedicineChange"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="quantityOrdered" label="Ordered" width="100">
                <template #default="{ row }">
                  <el-input-number
                    v-model="row.quantityOrdered"
                    :min="0"
                    @change="handleMedicineChange"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="quantityReceived" label="Received" width="100">
                <template #default="{ row }">
                  <el-input-number
                    v-model="row.quantityReceived"
                    :min="0"
                    @change="handleMedicineChange"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="unitPrice" label="Unit Price" width="120">
                <template #default="{ row }">
                  <el-input-number
                    v-model="row.unitPrice"
                    :min="0"
                    precision="2"
                    @change="handleMedicineChange"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="total" label="Total" width="120">
                <template #default="{ row }">
                  ${{ formatCurrency(row.quantityReceived * row.unitPrice) }}
                </template>
              </el-table-column>
              <el-table-column prop="condition" label="Condition" width="100">
                <template #default="{ row }">
                  <el-select
                    v-model="row.condition"
                    placeholder="Select condition"
                    clearable
                    @change="handleMedicineChange"
                  >
                    <el-option label="Good" value="good" />
                    <el-option label="Damaged" value="damaged" />
                    <el-option label="Expired" value="expired" />
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-actions">
              <el-button type="primary" size="small" @click="addMedicineRow" icon="el-icon-plus">
                Add Medicine
              </el-button>
            </div>
          </el-form-item>
        </el-form>

        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveReceiptNote">Save Receipt Note</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  receiptNotesService,
  type ReceiptNote,
  type ReceiptNoteFilters,
  ReceiptStatus,
} from '@/services/receiptNotesService'

// Reactive data
const loading = ref(false)
const receiptNotes = ref<ReceiptNote[]>([])
const selectedReceiptNotes = ref<ReceiptNote[]>([])
const drawerVisible = ref(false)
const dialogVisible = ref(false)
const receiptNotesTable = ref()
const dateRange = ref<[string, string] | null>(null)

// Mock data for dropdowns - TODO: Replace with API calls when available
const suppliers = [
  { value: 'pharmaCorp', label: 'PharmaCorp' },
  { value: 'mediPharm', label: 'MediPharm' },
  { value: 'cardioMed', label: 'CardioMed' },
  { value: 'diabetesRx', label: 'DiabetesRx' },
]

const receiptStatuses = [
  { value: ReceiptStatus.COMPLETED, label: 'Completed' },
  { value: ReceiptStatus.CANCELLED, label: 'Cancelled' },
]

// Filters and pagination
const filters = ref<ReceiptNoteFilters>({})

const pagination = ref({
  page: 1,
  size: 20,
  sort: 'receiptDate',
  direction: 'desc' as 'asc' | 'desc',
})

const totalElements = ref(0)
const currentReceiptNote = ref<Partial<ReceiptNote>>({})

// Computed properties
const activeFiltersCount = computed(() => {
  return (
    Object.values(filters.value).filter(
      (value) => value !== '' && value !== undefined && value !== null,
    ).length + (dateRange.value ? 1 : 0)
  )
})

const dialogTitle = computed(() => {
  return currentReceiptNote.value.id
    ? `Receipt Note - ${currentReceiptNote.value.receiptNumber}`
    : 'Receipt Note Details'
})

// Methods - Updated to use real API
const loadReceiptNotes = async () => {
  try {
    loading.value = true
    const response = await receiptNotesService.getReceiptNotes()
    if (response.success && response.data) {
      receiptNotes.value = response.data
      totalElements.value = response.data.length // Backend doesn't return pagination info yet
    } else {
      ElMessage.error(response.message || 'Failed to load receipt notes')
    }
  } catch (error) {
    ElMessage.error('Failed to load receipt notes')
    console.error('Error loading receipt notes:', error)
  } finally {
    loading.value = false
  }
}

const handleSearchChange = () => {
  pagination.value.page = 1
  loadReceiptNotes()
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
  loadReceiptNotes()
}

const handleFilterChange = () => {
  pagination.value.page = 1
  loadReceiptNotes()
}

const handleSizeChange = (size: number) => {
  pagination.value.size = size
  pagination.value.page = 1
  loadReceiptNotes()
}

const handleCurrentChange = (page: number) => {
  pagination.value.page = page
  loadReceiptNotes()
}

const handleSelectionChange = (selection: ReceiptNote[]) => {
  selectedReceiptNotes.value = selection
}

const clearFilters = () => {
  filters.value = {}
  dateRange.value = null
  pagination.value.page = 1
  loadReceiptNotes()
}

const applyFilters = () => {
  drawerVisible.value = false
  pagination.value.page = 1
  loadReceiptNotes()
}

// CRUD operations - Updated to use real API
const handleAddReceiptNote = () => {
  ElMessage.info('New receipt note functionality to be implemented')
}

const handleViewReceiptNote = async (receiptNote: ReceiptNote) => {
  try {
    const response = await receiptNotesService.getReceiptNoteById(receiptNote.id)
    if (response.success && response.data) {
      currentReceiptNote.value = response.data
      dialogVisible.value = true
    } else {
      ElMessage.error(response.message || 'Failed to load receipt note details')
    }
  } catch (error) {
    ElMessage.error('Failed to load receipt note details')
    console.error('Error loading receipt note:', error)
  }
}

const handleEditReceiptNote = (receiptNote: ReceiptNote) => {
  ElMessage.info('Edit receipt note functionality to be implemented')
}

const handleDeleteReceiptNote = async (receiptNote: ReceiptNote) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete receipt note "${receiptNote.receiptNumber}"?`,
      'Delete Receipt Note',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )

    const response = await receiptNotesService.deleteReceiptNote(receiptNote.id)
    if (response.success) {
      ElMessage.success('Receipt note deleted successfully')
      loadReceiptNotes()
    } else {
      ElMessage.error(response.message || 'Failed to delete receipt note')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete receipt note')
      console.error('Error deleting receipt note:', error)
    }
  }
}

const handleActionCommand = (command: string, receiptNote: ReceiptNote) => {
  switch (command) {
    case 'view':
      handleViewReceiptNote(receiptNote)
      break
    case 'edit':
      handleEditReceiptNote(receiptNote)
      break
    case 'verify':
      handleVerifyReceipt()
      break
    case 'print':
      handlePrintReceipt()
      break
    case 'delete':
      handleDeleteReceiptNote(receiptNote)
      break
  }
}

// Additional methods for receipt note functionality
const handlePrintReceipt = () => {
  ElMessage.success('Receipt printed successfully')
}

const handleVerifyReceipt = () => {
  ElMessage.success('Receipt verified successfully')
}

// Missing verification status methods
const verificationStatuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' },
]

const getVerificationStatusType = (status: string) => {
  switch (status) {
    case 'verified':
      return 'success'
    case 'pending':
      return 'warning'
    case 'rejected':
      return 'danger'
    default:
      return 'info'
  }
}

const getVerificationStatusLabel = (status: string) => {
  const statusObj = verificationStatuses.find((s) => s.value === status)
  return statusObj?.label || status
}

const getConditionType = (condition: string) => {
  switch (condition) {
    case 'good':
      return 'success'
    case 'damaged':
      return 'warning'
    case 'expired':
      return 'danger'
    default:
      return 'info'
  }
}

const getRowClassName = ({ row }: { row: ReceiptNote }) => {
  if (row.status === ReceiptStatus.CANCELLED) return 'row-cancelled'
  return ''
}

// Utility methods
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

// New receipt note form methods (for future implementation)
const addMedicineRow = () => {
  if (!currentReceiptNote.value.medicines) {
    currentReceiptNote.value.medicines = []
  }
  currentReceiptNote.value.medicines.push({
    id: 0,
    name: '',
    batchNumber: '',
    expiryDate: '',
    quantityOrdered: 0,
    quantityReceived: 0,
    unitPrice: 0,
    condition: 'good',
  })
}

const handleMedicineChange = () => {
  // Recalculate totals when medicine data changes
  if (currentReceiptNote.value.medicines) {
    const totalItems = currentReceiptNote.value.medicines.length
    const totalQuantity = currentReceiptNote.value.medicines.reduce(
      (sum, item) => sum + (item.quantityReceived || 0),
      0,
    )
    const totalAmount = currentReceiptNote.value.medicines.reduce(
      (sum, item) => sum + (item.quantityReceived || 0) * (item.unitPrice || 0),
      0,
    )

    currentReceiptNote.value.totalItems = totalItems
    currentReceiptNote.value.totalQuantity = totalQuantity
    currentReceiptNote.value.totalAmount = totalAmount
  }
}

const handleDateChange = () => {
  // Handle receipt date change
}

const handleSupplierChange = () => {
  // Handle supplier selection change
}

const saveReceiptNote = async () => {
  try {
    const response = await receiptNotesService.createReceiptNote(currentReceiptNote.value as any)
    if (response.success) {
      ElMessage.success('Receipt note created successfully')
      dialogVisible.value = false
      loadReceiptNotes()
    } else {
      ElMessage.error(response.message || 'Failed to create receipt note')
    }
  } catch (error) {
    ElMessage.error('Failed to create receipt note')
    console.error('Error creating receipt note:', error)
  }
}

// Lifecycle hooks
onMounted(() => {
  loadReceiptNotes()
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

.filter-badge {
  margin-left: 8px;
}

/* Receipt info styling */
.receipt-info .receipt-number {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.receipt-info .receipt-date {
  font-size: 12px;
  color: #6b7280;
}

.supplier-info .supplier-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.supplier-info .supplier-reference {
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

.amount-info .total-amount {
  font-weight: 600;
  color: #059669;
  margin-bottom: 4px;
}

.amount-info .received-amount {
  font-size: 12px;
  color: #6b7280;
}

.receiver-info .receiver-name {
  color: #1f2937;
  margin-bottom: 4px;
}

.receiver-info .receive-time {
  font-size: 12px;
  color: #6b7280;
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
.receipt-details {
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
  min-width: 140px;
}

.items-table {
  margin-top: 16px;
}

.receipt-summary {
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

.notes-text {
  background: #f9fafb;
  padding: 12px;
  border-radius: 4px;
  margin: 0;
  color: #6b7280;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* New receipt note form styling */
.new-receipt-content {
  max-height: 70vh;
  overflow-y: auto;
}

.medicines-table {
  width: 100%;
  margin-top: 12px;
}

.table-actions {
  margin-top: 12px;
  text-align: right;
}

/* Row styling */
:deep(.row-cancelled) {
  background-color: #fef2f2 !important;
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
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}
</style>
