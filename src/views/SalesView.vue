<template>
  <div class="page-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="page-header-content">
        <h1 class="page-title">Sales</h1>
        <p class="page-subtitle">Manage all sales transactions</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleAddSale">
          <span class="material-symbols-outlined">add</span>
          New Sale
        </el-button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="sales-content">
      <div class="mb-3 d-flex align-items-center justify-content-between">
        <el-input
          v-model="filters.search"
          placeholder="Search sales by customer name, invoice number..."
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
          :data="sales"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          empty-text="No sales found"
          ref="salesTable"
          :row-class-name="getRowClassName"
        >
          <el-table-column type="selection" width="55" />

          <el-table-column prop="invoiceNumber" label="Invoice #" min-width="120">
            <template #default="{ row }">
              <div class="invoice-info">
                <div class="invoice-number">{{ row.invoiceNumber }}</div>
                <div class="sale-date">{{ formatDate(row.saleDate) }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="customerName" label="Customer" min-width="180">
            <template #default="{ row }">
              <div class="customer-info">
                <div class="customer-name">{{ row.customerName }}</div>
                <div class="customer-phone">{{ row.customerPhone }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="items" label="Items" min-width="120">
            <template #default="{ row }">
              <div class="items-info">
                <span class="item-count">{{ row.totalItems }} items</span>
                <div class="medicines-preview">
                  {{ row.medicines.slice(0, 2).map(m => m.name).join(', ') }}
                  <span v-if="row.medicines.length > 2">...</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="totalAmount" label="Total Amount" min-width="120">
            <template #default="{ row }">
              <div class="amount-info">
                <div class="total-amount">${{ formatCurrency(row.totalAmount) }}</div>
                <div class="discount" v-if="row.discount > 0">
                  -${{ formatCurrency(row.discount) }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="paymentMethod" label="Payment" min-width="110">
            <template #default="{ row }">
              <div class="payment-info">
                <el-tag :type="getPaymentMethodType(row.paymentMethod)" size="small">
                  {{ getPaymentMethodLabel(row.paymentMethod) }}
                </el-tag>
                <div class="payment-status">{{ row.paymentStatus }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="salesPerson" label="Sales Person" min-width="130">
            <template #default="{ row }">
              <div class="salesperson-info">
                <div class="salesperson-name">{{ row.salesPerson }}</div>
                <div class="sale-time">{{ formatTime(row.saleDate) }}</div>
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
                    <el-dropdown-item command="print-receipt">
                      <span class="material-symbols-outlined">print</span>
                      Print Receipt
                    </el-dropdown-item>
                    <el-dropdown-item command="refund" divided v-if="row.status === 'completed'">
                      <span class="material-symbols-outlined">assignment_return</span>
                      Process Refund
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
      title="Filter Sales"
      direction="rtl"
      size="400px"
      class="filters-drawer"
      append-to-body
    >
      <div class="filters-content">
        <div class="filter-group">
          <label class="filter-label">Payment Method</label>
          <el-select
            v-model="filters.paymentMethod"
            placeholder="Select payment method"
            clearable
            @change="handleFilterChange"
          >
            <el-option
              v-for="method in paymentMethods"
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
              v-for="status in saleStatuses"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Sales Person</label>
          <el-select
            v-model="filters.salesPerson"
            placeholder="Select sales person"
            clearable
            @change="handleFilterChange"
          >
            <el-option
              v-for="person in salesPersons"
              :key="person.value"
              :label="person.label"
              :value="person.value"
            />
          </el-select>
        </div>

        <div class="filter-actions">
          <el-button @click="clearFilters">Clear All Filters</el-button>
          <el-button type="primary" @click="applyFilters">Apply Filters</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- Sale Details Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="1200px"
      class="sale-dialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="sale-details" v-if="currentSale.id">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-section">
              <h3>Sale Information</h3>
              <div class="detail-item">
                <label>Invoice Number:</label>
                <span>{{ currentSale.invoiceNumber }}</span>
              </div>
              <div class="detail-item">
                <label>Sale Date:</label>
                <span>{{ formatDateTime(currentSale.saleDate) }}</span>
              </div>
              <div class="detail-item">
                <label>Sales Person:</label>
                <span>{{ currentSale.salesPerson }}</span>
              </div>
              <div class="detail-item">
                <label>Status:</label>
                <el-tag :type="getStatusType(currentSale.status)" size="small">
                  {{ getStatusLabel(currentSale.status) }}
                </el-tag>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-section">
              <h3>Customer Information</h3>
              <div class="detail-item">
                <label>Name:</label>
                <span>{{ currentSale.customerName }}</span>
              </div>
              <div class="detail-item">
                <label>Phone:</label>
                <span>{{ currentSale.customerPhone }}</span>
              </div>
              <div class="detail-item">
                <label>Email:</label>
                <span>{{ currentSale.customerEmail || 'N/A' }}</span>
              </div>
            </div>
          </el-col>
        </el-row>

        <div class="detail-section">
          <h3>Items Sold</h3>
          <el-table :data="currentSale.medicines" class="items-table">
            <el-table-column prop="name" label="Medicine" min-width="200" />
            <el-table-column prop="quantity" label="Quantity" width="100" />
            <el-table-column prop="unitPrice" label="Unit Price" width="120">
              <template #default="{ row }">
                ${{ formatCurrency(row.unitPrice) }}
              </template>
            </el-table-column>
            <el-table-column prop="total" label="Total" width="120">
              <template #default="{ row }">
                ${{ formatCurrency(row.quantity * row.unitPrice) }}
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="detail-section">
          <h3>Payment Summary</h3>
          <div class="payment-summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>${{ formatCurrency(currentSale.subtotal) }}</span>
            </div>
            <div class="summary-row" v-if="currentSale.discount > 0">
              <span>Discount:</span>
              <span>-${{ formatCurrency(currentSale.discount) }}</span>
            </div>
            <div class="summary-row" v-if="currentSale.tax > 0">
              <span>Tax:</span>
              <span>${{ formatCurrency(currentSale.tax) }}</span>
            </div>
            <div class="summary-row total-row">
              <span>Total:</span>
              <span>${{ formatCurrency(currentSale.totalAmount) }}</span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Close</el-button>
          <el-button type="primary" @click="handlePrintReceipt" v-if="currentSale.id">
            <span class="material-symbols-outlined">print</span>
            Print Receipt
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// Types
interface Sale {
  id: number
  invoiceNumber: string
  saleDate: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  salesPerson: string
  totalItems: number
  subtotal: number
  discount: number
  tax: number
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  status: string
  medicines: Array<{
    id: number
    name: string
    quantity: number
    unitPrice: number
  }>
}

interface SaleFilters {
  search?: string
  dateFrom?: string
  dateTo?: string
  paymentMethod?: string
  status?: string
  salesPerson?: string
  amountMin?: number
  amountMax?: number
}

interface SalePagination {
  page: number
  size: number
  sort?: string
  direction?: 'asc' | 'desc'
}

// Reactive data
const loading = ref(false)
const sales = ref<Sale[]>([])
const selectedSales = ref<Sale[]>([])
const drawerVisible = ref(false)
const dialogVisible = ref(false)
const salesTable = ref()
const dateRange = ref<[string, string] | null>(null)

// Mock data for dropdowns
const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'mobile', label: 'Mobile Payment' },
  { value: 'insurance', label: 'Insurance' },
]

const saleStatuses = [
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'cancelled', label: 'Cancelled' },
]

const salesPersons = [
  { value: 'john-doe', label: 'John Doe' },
  { value: 'jane-smith', label: 'Jane Smith' },
  { value: 'mike-johnson', label: 'Mike Johnson' },
]

// Filters and pagination
const filters = ref<SaleFilters>({
  search: '',
  dateFrom: '',
  dateTo: '',
  paymentMethod: '',
  status: '',
  salesPerson: '',
  amountMin: undefined,
  amountMax: undefined,
})

const pagination = ref<SalePagination>({
  page: 1,
  size: 20,
  sort: 'saleDate',
  direction: 'desc',
})

const totalElements = ref(0)
const currentSale = ref<Partial<Sale>>({})

// Mock sales data
const mockSales: Sale[] = [
  {
    id: 1,
    invoiceNumber: 'INV-2025-001',
    saleDate: '2025-09-23T10:30:00Z',
    customerName: 'Alice Johnson',
    customerPhone: '+1234567890',
    customerEmail: 'alice@email.com',
    salesPerson: 'John Doe',
    totalItems: 3,
    subtotal: 45.50,
    discount: 2.25,
    tax: 4.33,
    totalAmount: 47.58,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    status: 'completed',
    medicines: [
      { id: 1, name: 'Paracetamol 500mg', quantity: 2, unitPrice: 12.50 },
      { id: 2, name: 'Amoxicillin 250mg', quantity: 1, unitPrice: 20.50 },
    ]
  },
  {
    id: 2,
    invoiceNumber: 'INV-2025-002',
    saleDate: '2025-09-23T14:15:00Z',
    customerName: 'Bob Smith',
    customerPhone: '+1234567891',
    salesPerson: 'Jane Smith',
    totalItems: 1,
    subtotal: 125.80,
    discount: 0,
    tax: 12.58,
    totalAmount: 138.38,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    status: 'completed',
    medicines: [
      { id: 3, name: 'Insulin Glargine 100IU/mL', quantity: 1, unitPrice: 125.80 },
    ]
  },
]

// Computed properties
const activeFiltersCount = computed(() => {
  return Object.values(filters.value).filter(
    (value) => value !== '' && value !== undefined && value !== null,
  ).length + (dateRange.value ? 1 : 0)
})

const dialogTitle = computed(() => {
  return currentSale.value.id ? `Sale Details - ${currentSale.value.invoiceNumber}` : 'Sale Details'
})

// Methods
const loadSales = async () => {
  try {
    loading.value = true
    // Mock API call - replace with actual service
    await new Promise(resolve => setTimeout(resolve, 500))
    sales.value = mockSales
    totalElements.value = mockSales.length
  } catch (error) {
    ElMessage.error('Failed to load sales')
    console.error('Error loading sales:', error)
  } finally {
    loading.value = false
  }
}

const handleSearchChange = () => {
  pagination.value.page = 1
  loadSales()
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
  loadSales()
}

const handleFilterChange = () => {
  pagination.value.page = 1
  loadSales()
}

const handleSizeChange = (size: number) => {
  pagination.value.size = size
  pagination.value.page = 1
  loadSales()
}

const handleCurrentChange = (page: number) => {
  pagination.value.page = page
  loadSales()
}

const handleSelectionChange = (selection: Sale[]) => {
  selectedSales.value = selection
}

const clearFilters = () => {
  filters.value = {
    search: '',
    dateFrom: '',
    dateTo: '',
    paymentMethod: '',
    status: '',
    salesPerson: '',
    amountMin: undefined,
    amountMax: undefined,
  }
  dateRange.value = null
  pagination.value.page = 1
  loadSales()
}

const applyFilters = () => {
  drawerVisible.value = false
  pagination.value.page = 1
  loadSales()
}

// CRUD operations
const handleAddSale = () => {
  ElMessage.info('New sale functionality to be implemented')
}

const handleViewSale = (sale: Sale) => {
  currentSale.value = { ...sale }
  dialogVisible.value = true
}

const handlePrintReceipt = () => {
  ElMessage.success('Receipt printed successfully')
}

const handleProcessRefund = (sale: Sale) => {
  ElMessageBox.confirm(
    `Are you sure you want to process a refund for invoice ${sale.invoiceNumber}?`,
    'Process Refund',
    {
      confirmButtonText: 'Process Refund',
      cancelButtonText: 'Cancel',
      type: 'warning',
    },
  ).then(() => {
    ElMessage.success('Refund processed successfully')
    loadSales()
  }).catch(() => {
    // User cancelled
  })
}

const handleDeleteSale = async (sale: Sale) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete sale "${sale.invoiceNumber}"?`,
      'Delete Sale',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )
    ElMessage.success('Sale deleted successfully')
    loadSales()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete sale')
    }
  }
}

const handleActionCommand = (command: string, sale: Sale) => {
  switch (command) {
    case 'view':
      handleViewSale(sale)
      break
    case 'print-receipt':
      handlePrintReceipt()
      break
    case 'refund':
      handleProcessRefund(sale)
      break
    case 'delete':
      handleDeleteSale(sale)
      break
  }
}

// Utility methods
const getStatusType = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success'
    case 'pending':
      return 'warning'
    case 'refunded':
      return 'info'
    case 'cancelled':
      return 'danger'
    default:
      return 'info'
  }
}

const getStatusLabel = (status: string) => {
  return saleStatuses.find((s) => s.value === status)?.label || status
}

const getPaymentMethodType = (method: string) => {
  switch (method) {
    case 'cash':
      return 'success'
    case 'card':
      return 'primary'
    case 'mobile':
      return 'warning'
    case 'insurance':
      return 'info'
    default:
      return 'info'
  }
}

const getPaymentMethodLabel = (method: string) => {
  return paymentMethods.find((m) => m.value === method)?.label || method
}

const getRowClassName = ({ row }: { row: Sale }) => {
  if (row.status === 'cancelled') return 'row-suspended'
  if (row.status === 'refunded') return 'row-inactive'
  return ''
}

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

// Lifecycle hooks
onMounted(() => {
  loadSales()
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

.invoice-info .invoice-number {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.invoice-info .sale-date {
  font-size: 12px;
  color: #6b7280;
}

.customer-info .customer-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.customer-info .customer-phone {
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

.amount-info .discount {
  font-size: 12px;
  color: #f59e0b;
}

.payment-info .payment-status {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.salesperson-info .salesperson-name {
  color: #1f2937;
  margin-bottom: 4px;
}

.salesperson-info .sale-time {
  font-size: 12px;
  color: #6b7280;
}

.sale-details {
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

.payment-summary {
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

.sale-dialog .sale-details {
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
