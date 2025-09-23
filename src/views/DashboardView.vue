<template>
  <div class="page-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="page-header-content">
        <h1 class="page-title">Pharmacy Dashboard</h1>
        <p class="page-subtitle">Monitor your pharmacy operations and performance at a glance.</p>
      </div>
      <!--      <div class="header-actions">-->
      <!--        <el-button type="primary" class="modern-button">-->
      <!--          <span class="material-symbols-outlined">analytics</span>-->
      <!--          Generate Report-->
      <!--        </el-button>-->
      <!--      </div>-->
    </div>

    <!-- Key Metrics Grid for Pharmacy -->
    <div class="metrics-section">
      <div class="metrics-grid">
        <div class="metric-card modern-card">
          <div class="metric-header">
            <div class="metric-icon-wrapper revenue">
              <span class="material-symbols-outlined">attach_money</span>
            </div>
            <div class="metric-trend positive">
              <span class="material-symbols-outlined">trending_up</span>
              +12.5%
            </div>
          </div>
          <div class="metric-body">
            <div class="metric-value">${{ formatCurrency(pharmacyStats.totalRevenue) }}</div>
            <div class="metric-label">Total Revenue</div>
          </div>
        </div>

        <div class="metric-card modern-card">
          <div class="metric-header">
            <div class="metric-icon-wrapper medicines">
              <span class="material-symbols-outlined">medication</span>
            </div>
            <div class="metric-trend positive">
              <span class="material-symbols-outlined">trending_up</span>
              +8.3%
            </div>
          </div>
          <div class="metric-body">
            <div class="metric-value">{{ pharmacyStats.totalMedicines }}</div>
            <div class="metric-label">Total Medicines</div>
          </div>
        </div>

        <div class="metric-card modern-card">
          <div class="metric-header">
            <div class="metric-icon-wrapper sales">
              <span class="material-symbols-outlined">shopping_cart</span>
            </div>
            <div class="metric-trend positive">
              <span class="material-symbols-outlined">trending_up</span>
              +15.7%
            </div>
          </div>
          <div class="metric-body">
            <div class="metric-value">{{ pharmacyStats.totalSales }}</div>
            <div class="metric-label">Sales Today</div>
          </div>
        </div>

        <div class="metric-card modern-card">
          <div class="metric-header">
            <div class="metric-icon-wrapper customers">
              <span class="material-symbols-outlined">group</span>
            </div>
            <div class="metric-trend positive">
              <span class="material-symbols-outlined">trending_up</span>
              +5.2%
            </div>
          </div>
          <div class="metric-body">
            <div class="metric-value">{{ pharmacyStats.activeCustomers }}</div>
            <div class="metric-label">Active Customers</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <div class="charts-row">
        <!-- Sales Analytics Chart -->
        <div class="chart-container large">
          <div class="chart-card modern-card">
            <div class="chart-header">
              <div class="chart-title-section">
                <h3 class="chart-title">Sales Analytics</h3>
                <p class="chart-subtitle">Daily sales performance</p>
              </div>
              <div class="chart-controls">
                <el-select v-model="salesTimeframe" size="default" class="modern-select">
                  <el-option label="Last 7 days" value="7d" />
                  <el-option label="Last 30 days" value="30d" />
                  <el-option label="Last 3 months" value="3m" />
                </el-select>
              </div>
            </div>
            <div class="chart-body">
              <apexchart
                type="area"
                height="320"
                :options="salesChartOptions"
                :series="salesChartSeries"
              />
            </div>
          </div>
        </div>

        <!-- Medicine Categories Distribution -->
        <div class="chart-container medium">
          <div class="chart-card modern-card">
            <div class="chart-header">
              <div class="chart-title-section">
                <h3 class="chart-title">Medicine Categories</h3>
                <p class="chart-subtitle">Distribution by category</p>
              </div>
            </div>
            <div class="chart-body">
              <apexchart
                type="donut"
                height="320"
                :options="categoryChartOptions"
                :series="categoryChartSeries"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="charts-row">
        <!-- Low Stock Alert -->
        <div class="chart-container medium">
          <div class="chart-card modern-card">
            <div class="chart-header">
              <div class="chart-title-section">
                <h3 class="chart-title">Stock Levels</h3>
                <p class="chart-subtitle">Inventory monitoring</p>
              </div>
            </div>
            <div class="chart-body">
              <apexchart
                type="bar"
                height="320"
                :options="stockChartOptions"
                :series="stockChartSeries"
              />
            </div>
          </div>
        </div>

        <!-- Monthly Revenue vs Profit -->
        <div class="chart-container large">
          <div class="chart-card modern-card">
            <div class="chart-header">
              <div class="chart-title-section">
                <h3 class="chart-title">Revenue vs Profit</h3>
                <p class="chart-subtitle">Monthly performance comparison</p>
              </div>
            </div>
            <div class="chart-body">
              <apexchart
                type="line"
                height="320"
                :options="revenueChartOptions"
                :series="revenueChartSeries"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alerts and Quick Actions Section -->
    <div class="alerts-section">
      <div class="alerts-row">
        <!-- Critical Alerts -->
        <div class="alert-container">
          <div class="alert-card modern-card critical">
            <div class="alert-header">
              <div class="alert-icon">
                <span class="material-symbols-outlined">warning</span>
              </div>
              <div class="alert-title-section">
                <h3 class="alert-title">Critical Alerts</h3>
                <p class="alert-subtitle">Requires immediate attention</p>
              </div>
            </div>
            <div class="alert-list">
              <div v-for="alert in criticalAlerts" :key="alert.id" class="alert-item">
                <div class="alert-icon-small">
                  <span class="material-symbols-outlined">{{ alert.icon }}</span>
                </div>
                <div class="alert-content">
                  <div class="alert-message">{{ alert.message }}</div>
                  <div class="alert-time">{{ alert.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Expiring Medicines -->
        <div class="alert-container">
          <div class="alert-card modern-card warning">
            <div class="alert-header">
              <div class="alert-icon">
                <span class="material-symbols-outlined">schedule</span>
              </div>
              <div class="alert-title-section">
                <h3 class="alert-title">Expiring Soon</h3>
                <p class="alert-subtitle">Medicines expiring in 30 days</p>
              </div>
            </div>
            <div class="alert-list">
              <div v-for="medicine in expiringMedicines" :key="medicine.id" class="alert-item">
                <div class="alert-content">
                  <div class="alert-message">{{ medicine.name }}</div>
                  <div class="alert-time">Expires: {{ formatDate(medicine.expiryDate) }}</div>
                </div>
                <div class="alert-quantity">{{ medicine.quantity }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="alert-container">
          <div class="alert-card modern-card info">
            <div class="alert-header">
              <div class="alert-icon">
                <span class="material-symbols-outlined">bolt</span>
              </div>
              <div class="alert-title-section">
                <h3 class="alert-title">Quick Actions</h3>
                <p class="alert-subtitle">Common tasks</p>
              </div>
            </div>
            <div class="quick-actions">
              <el-button class="action-btn" @click="navigateToSales">
                <span class="material-symbols-outlined">add_shopping_cart</span>
                New Sale
              </el-button>
              <el-button class="action-btn" @click="navigateToMedicines">
                <span class="material-symbols-outlined">add_box</span>
                Add Medicine
              </el-button>
              <el-button class="action-btn" @click="navigateToReceipts">
                <span class="material-symbols-outlined">receipt</span>
                Receipt Note
              </el-button>
              <el-button class="action-btn" @click="navigateToDelivery">
                <span class="material-symbols-outlined">local_shipping</span>
                Delivery Note
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

// Pharmacy Statistics
const pharmacyStats = ref({
  totalRevenue: 125840,
  totalMedicines: 1247,
  totalSales: 89,
  activeCustomers: 456,
})

const salesTimeframe = ref('30d')

// Critical Alerts
const criticalAlerts = ref([
  {
    id: 1,
    icon: 'inventory_2',
    message: '15 medicines out of stock',
    time: '2 hours ago',
  },
  {
    id: 2,
    icon: 'warning',
    message: '3 medicines expired',
    time: '4 hours ago',
  },
  {
    id: 3,
    icon: 'priority_high',
    message: 'Prescription requires approval',
    time: '1 hour ago',
  },
])

// Expiring Medicines
const expiringMedicines = ref([
  {
    id: 1,
    name: 'Paracetamol 500mg',
    expiryDate: '2025-10-15',
    quantity: 45,
  },
  {
    id: 2,
    name: 'Amoxicillin 250mg',
    expiryDate: '2025-10-20',
    quantity: 23,
  },
  {
    id: 3,
    name: 'Insulin Glargine',
    expiryDate: '2025-10-25',
    quantity: 8,
  },
])

// Sales Chart Configuration
const salesChartSeries = ref([
  {
    name: 'Sales Amount',
    data: [4200, 5300, 4800, 6100, 5900, 7200, 8500, 6800, 7900, 8200, 9100, 8400],
  },
])

const salesChartOptions = ref({
  chart: {
    type: 'area',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  colors: ['#10b981'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.1,
      stops: [0, 90, 100],
      colorStops: [
        {
          offset: 0,
          color: '#10b981',
          opacity: 0.8,
        },
        {
          offset: 100,
          color: '#059669',
          opacity: 0.1,
        },
      ],
    },
  },
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  grid: {
    borderColor: '#f1f1f1',
  },
  xaxis: {
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    labels: {
      style: {
        colors: '#666',
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: '#666',
      },
      formatter: function (value: number) {
        return '$' + (value / 1000).toFixed(1) + 'k'
      },
    },
  },
  tooltip: {
    theme: 'light',
  },
})

// Medicine Categories Chart
const categoryChartSeries = ref([35, 28, 18, 12, 7])

const categoryChartOptions = ref({
  chart: {
    type: 'donut',
  },
  colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  labels: ['Pain Relief', 'Antibiotics', 'Cardiovascular', 'Diabetes', 'Respiratory'],
  legend: {
    position: 'bottom',
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
})

// Stock Levels Chart
const stockChartSeries = ref([
  {
    name: 'Current Stock',
    data: [244, 185, 156, 98, 67, 34, 12, 8, 3],
  },
])

const stockChartOptions = ref({
  chart: {
    type: 'bar',
    toolbar: {
      show: false,
    },
  },
  colors: ['#f59e0b'],
  plotOptions: {
    bar: {
      horizontal: true,
      columnWidth: '55%',
      borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    borderColor: '#f1f1f1',
  },
  xaxis: {
    categories: [
      'Paracetamol',
      'Amoxicillin',
      'Lisinopril',
      'Metformin',
      'Omeprazole',
      'Salbutamol',
      'Warfarin',
      'Insulin',
      'Morphine',
    ],
    labels: {
      style: {
        colors: '#666',
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: '#666',
      },
    },
  },
})

// Revenue vs Profit Chart
const revenueChartSeries = ref([
  {
    name: 'Revenue',
    data: [65000, 72000, 68000, 75000, 82000, 79000, 88000, 94000, 91000, 97000, 103000, 109000],
  },
  {
    name: 'Profit',
    data: [18000, 21000, 19000, 23000, 26000, 24000, 28000, 31000, 29000, 32000, 35000, 38000],
  },
])

const revenueChartOptions = ref({
  chart: {
    type: 'line',
    toolbar: {
      show: false,
    },
  },
  colors: ['#3b82f6', '#10b981'],
  stroke: {
    width: 4,
    curve: 'smooth',
  },
  markers: {
    size: 6,
    colors: ['#fff'],
    strokeColors: ['#3b82f6', '#10b981'],
    strokeWidth: 3,
    hover: {
      size: 8,
    },
  },
  grid: {
    borderColor: '#f1f1f1',
  },
  xaxis: {
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    labels: {
      style: {
        colors: '#666',
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: '#666',
      },
      formatter: function (value: number) {
        return '$' + (value / 1000).toFixed(0) + 'k'
      },
    },
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return '$' + val.toLocaleString()
      },
    },
  },
})

// Navigation methods
const navigateToSales = () => {
  router.push('/sales')
}

const navigateToMedicines = () => {
  router.push('/medicines')
}

const navigateToReceipts = () => {
  router.push('/receipt-notes')
}

const navigateToDelivery = () => {
  router.push('/delivery-notes')
}

// Utility methods
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle hooks
onMounted(() => {
  // Load dashboard data
})
</script>

<style scoped>
/* Header Styles */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header-content .dashboard-title {
  font-size: 42px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.header-content .dashboard-subtitle {
  font-size: 18px;
  color: #64748b;
  margin: 0;
  font-weight: 400;
}

.header-actions .modern-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.header-actions .modern-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
}

/* Modern Card Styles */
.modern-card {
  background: white;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.modern-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Metrics Section */
.metrics-section {
  margin-bottom: 40px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.metric-card {
  padding: 28px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.metric-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.metric-icon-wrapper.revenue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.metric-icon-wrapper.customers {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
}

.metric-icon-wrapper.orders {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
}

.metric-icon-wrapper.conversion {
  background: linear-gradient(135deg, #45b7d1 0%, #96c93d 100%);
}

/* Pharmacy-specific metric icons */
.metric-icon-wrapper.medicines {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.metric-icon-wrapper.sales {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.metric-trend.positive {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.metric-trend.negative {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.metric-body .metric-value {
  font-size: 36px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.metric-body .metric-label {
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
}

/* Charts Section */
.charts-section {
  margin-bottom: 40px;
}

.charts-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.charts-row:last-child {
  grid-template-columns: 1fr 2fr;
}

.chart-container.large {
  grid-column: span 1;
}

.chart-container.medium {
  grid-column: span 1;
}

.chart-card {
  padding: 0;
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 28px 28px 20px 28px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.chart-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.chart-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.chart-body {
  padding: 20px 28px 28px 28px;
}

.modern-select {
  border-radius: 10px;
}

/* Activity Section */
.activity-section {
  margin-bottom: 40px;
}

.activity-card {
  padding: 0;
  overflow: hidden;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 28px 20px 28px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.activity-title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.activity-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.activity-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.activity-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.view-all-btn {
  color: #667eea;
  font-weight: 600;
}

.activity-list {
  padding: 0 28px 28px 28px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.activity-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.user-avatar {
  border: 3px solid rgba(102, 126, 234, 0.1);
}

.activity-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.user-name {
  font-weight: 700;
  color: #1e293b;
}

.action-text {
  color: #64748b;
  margin: 0 4px;
}

.target-text {
  font-weight: 600;
  color: #1e293b;
}

.activity-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.team-badge {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.time-text {
  font-size: 14px;
  color: #94a3b8;
}

.activity-action-icon {
  width: 40px;
  height: 40px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
}

/* Alerts Section */
.alerts-section {
  margin-bottom: 40px;
}

.alerts-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.alert-card {
  padding: 24px;
}

.alert-card.critical {
  border-left: 4px solid #ef4444;
}

.alert-card.warning {
  border-left: 4px solid #f59e0b;
}

.alert-card.info {
  border-left: 4px solid #3b82f6;
}

.alert-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.alert-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.alert-card.critical .alert-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.alert-card.warning .alert-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.alert-card.info .alert-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.alert-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.alert-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.alert-icon-small {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.alert-content {
  flex: 1;
}

.alert-message {
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
}

.alert-time {
  font-size: 12px;
  color: #64748b;
}

.alert-quantity {
  font-weight: 600;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

.action-btn .material-symbols-outlined {
  font-size: 18px;
}

@media (max-width: 1024px) {
  .charts-row {
    grid-template-columns: 1fr;
  }

  .alerts-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>
