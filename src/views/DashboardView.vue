<template>
  <div class="dashboard-view">
    <!-- Header Section -->
    <div class="dashboard-header">
      <h1 class="dashboard-title">Dashboard Overview</h1>
      <p class="dashboard-subtitle">Real-time analytics and insights</p>
    </div>

    <div class="metrics-grid">
      <!-- Key Metrics Cards -->
      <el-card
        class="metric-card"
        shadow="hover"
        v-for="(metric, index) in keyMetrics"
        :key="index"
      >
        <div class="metric-content">
          <div class="metric-icon revenue" :class="metric.iconClass">
            <span class="material-symbols-outlined">{{ metric.icon }}</span>
          </div>
          <div class="metric-details">
            <h3 class="metric-value">{{ format(statsOverviews[metric.stat], metric.format) }}</h3>
            <p class="metric-label">{{ metric.title }}</p>
            <span
              class="metric-change positive"
              :class="calculateStatsChanges(statsOverviews, metric.stat).class"
            >
              {{ calculateStatsChanges(statsOverviews, metric.stat).value }}
            </span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Charts Section -->
    <div class="charts-grid">
      <!-- Revenue Chart -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Revenue Overview</h3>
            <el-select v-model="revenueTimeframe" size="small" style="width: 120px">
              <el-option label="Last 7 days" value="7d" />
              <el-option label="Last 30 days" value="30d" />
              <el-option label="Last 3 months" value="3m" />
            </el-select>
          </div>
        </template>
        <apexchart
          type="area"
          height="300"
          :options="revenueChartOptions"
          :series="revenueChartSeries"
        />
      </el-card>

      <!-- Sales by Category -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Sales by Category</h3>
          </div>
        </template>
        <apexchart
          type="donut"
          height="300"
          :options="categoryChartOptions"
          :series="categoryChartSeries"
        />
      </el-card>

      <!-- Customer Growth -->
      <el-card class="chart-card wide" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Customer Growth</h3>
            <div class="chart-legend">
              <span class="legend-item">
                <span class="legend-color new"></span>
                New Customers
              </span>
              <span class="legend-item">
                <span class="legend-color returning"></span>
                Returning Customers
              </span>
            </div>
          </div>
        </template>
        <apexchart
          type="line"
          height="300"
          :options="customerGrowthOptions"
          :series="customerGrowthSeries"
        />
      </el-card>

      <!-- Monthly Performance -->
      <el-card class="chart-card wide" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Monthly Performance</h3>
          </div>
        </template>
        <apexchart
          type="bar"
          height="300"
          :options="performanceChartOptions"
          :series="performanceChartSeries"
        />
      </el-card>
    </div>

    <!-- Recent Organization Activity -->
    <el-card class="activity-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="material-symbols-outlined">history</span>
          <h3>Recent Organization Activity</h3>
        </div>
      </template>

      <div class="activity-list">
        <div v-for="activity in recentActivities" :key="activity.id" class="activity-item-detailed">
          <el-avatar :size="40" :src="activity.user.avatar">
            {{ activity.user.name.charAt(0) }}
          </el-avatar>
          <div class="activity-content">
            <div class="activity-text">
              <strong>{{ activity.user.name }}</strong>
              {{ activity.action }}
              <strong>{{ activity.target }}</strong>
              in
              <span class="team-link">{{ activity.team }}</span>
            </div>
            <div class="activity-time">{{ formatActivityTime(activity.timestamp) }}</div>
          </div>
          <div class="activity-icon">
            <span class="material-symbols-outlined">{{ activity.icon }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue'
import { keyMetrics, dashboardService, type StatsOverview } from '@/services/dashboardService.ts'
import {
  formatNumber,
  formatPercentage,
  formatCurrency,
  calculateStatsChanges,
  format,
} from '@/services/utilities.ts'

import { ElMessage } from 'element-plus'

// Types
interface Activity {
  id: number
  user: {
    name: string
    avatar?: string
  }
  action: string
  target: string
  team: string
  timestamp: string
  icon: string
}

// Reactive data
const revenueTimeframe = ref('30d')

// Recent Activities Data
const recentActivities = ref<Activity[]>([
  {
    id: 1,
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b047?w=150',
    },
    action: 'completed task',
    target: 'Q1 Sales Review',
    team: 'TechCorp Sales Division',
    timestamp: '2025-07-16T10:30:00Z',
    icon: 'check_circle',
  },
  {
    id: 2,
    user: { name: 'Mike Chen' },
    action: 'added new project',
    target: 'Enterprise Client Onboarding',
    team: 'TechCorp Sales Division',
    timestamp: '2025-07-16T09:15:00Z',
    icon: 'add_circle',
  },
  {
    id: 3,
    user: {
      name: 'Amanda Taylor',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    },
    action: 'updated campaign',
    target: 'Social Media Strategy',
    team: 'Marketing Growth Hub',
    timestamp: '2025-07-16T08:20:00Z',
    icon: 'edit',
  },
  {
    id: 4,
    user: { name: 'Alex Thompson' },
    action: 'deployed feature',
    target: 'User Dashboard v2.0',
    team: 'Product Development Team',
    timestamp: '2025-07-16T07:45:00Z',
    icon: 'rocket_launch',
  },
  {
    id: 5,
    user: {
      name: 'Rachel Green',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    },
    action: 'resolved issue',
    target: 'Customer Login Bug',
    team: 'Customer Success Squad',
    timestamp: '2025-07-16T06:30:00Z',
    icon: 'bug_report',
  },
])

// Methods
const formatActivityTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

// Revenue Chart Configuration
const revenueChartSeries = ref([
  {
    name: 'Revenue',
    data: [31000, 40000, 35000, 50000, 49000, 60000, 70000, 91000, 125000],
  },
])

const revenueChartOptions = ref({
  chart: {
    type: 'area',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  colors: ['#667eea'],
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
          color: '#667eea',
          opacity: 0.8,
        },
        {
          offset: 100,
          color: '#764ba2',
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
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
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
    theme: 'light',
  },
})

// Category Chart Configuration
const categoryChartSeries = ref([44, 55, 13, 43, 22])

const categoryChartOptions = ref({
  chart: {
    type: 'donut',
  },
  colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'radial',
      shadeIntensity: 0.5,
      gradientToColors: ['#ff8e8e', '#6ee0d7', '#67c4e8', '#b9dcc7', '#fed680'],
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 0.7,
      stops: [0, 100],
    },
  },
  labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'],
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

// Customer Growth Chart Configuration
const customerGrowthSeries = ref([
  {
    name: 'New Customers',
    data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
  },
  {
    name: 'Returning Customers',
    data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
  },
])

const customerGrowthOptions = ref({
  chart: {
    type: 'line',
    toolbar: {
      show: false,
    },
  },
  colors: ['#ff6b6b', '#4ecdc4'],
  stroke: {
    width: 4,
    curve: 'smooth',
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      gradientToColors: ['#ff8e8e', '#6ee0d7'],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100, 100, 100],
    },
  },
  markers: {
    size: 6,
    colors: ['#fff'],
    strokeColors: ['#ff6b6b', '#4ecdc4'],
    strokeWidth: 3,
    hover: {
      size: 8,
    },
  },
  grid: {
    borderColor: '#f1f1f1',
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
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

// Performance Chart Configuration
const performanceChartSeries = ref([
  {
    name: 'Sales',
    data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 78, 85, 92],
  },
  {
    name: 'Profit',
    data: [35, 41, 36, 26, 45, 48, 52, 53, 41, 65, 72, 78],
  },
])

const performanceChartOptions = ref({
  chart: {
    type: 'bar',
    toolbar: {
      show: false,
    },
  },
  colors: ['#667eea', '#764ba2'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.5,
      gradientToColors: ['#8b9dfc', '#9a73b5'],
      inverseColors: true,
      opacityFrom: 0.85,
      opacityTo: 0.55,
      stops: [0, 100],
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
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
        return '$' + value + 'k'
      },
    },
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return '$' + val + 'k'
      },
    },
  },
})

const statsOverviews = ref<StatsOverview>({
  wonDealsValue: 0,
  wonDealsCount: 0,
  activeCustomersCount: 0,
  conversionRate: 0,
  comparison: {
    wonDealsValue: 0,
    wonDealsCount: 0,
    activeCustomersCount: 0,
    conversionRate: 0,
  },
})

onMounted(() => {
  // loadStatsOverview()
  // loadCustomerGrowthReport()
  // Any initialization logic can go here
})

onBeforeMount(() => {
  loadStatsOverview()
  loadCustomerGrowthReport()
  // Any initialization logic can go here
})

const loadStatsOverview = async () => {
  try {
    const response = await dashboardService.getStatsOverview()
    statsOverviews.value = response.data
  } catch (error) {
    ElMessage.error('Failed to load overview statistics')
  }
}

const loadCustomerGrowthReport = async () => {}
</script>

<style scoped>
.dashboard-view {
  padding: 24px;
  background: #f8fafc;
  min-height: calc(100vh - 64px);
}

.dashboard-header {
  margin-bottom: 32px;
}

.dashboard-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
}

.dashboard-subtitle {
  font-size: 16px;
  color: #718096;
  margin: 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.metric-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.metric-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.metric-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.metric-icon.revenue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.metric-icon.customers {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
}

.metric-icon.orders {
  background: linear-gradient(135deg, #4ecdc4 0%, #6ee0d7 100%);
}

.metric-icon.conversion {
  background: linear-gradient(135deg, #45b7d1 0%, #67c4e8 100%);
}

.metric-icon .material-symbols-outlined {
  font-size: 28px;
  font-weight: 100;
}

.metric-details {
  flex: 1;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 4px 0;
}

.metric-label {
  font-size: 14px;
  color: #718096;
  margin: 0 0 8px 0;
}

.metric-change {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 8px;
}

.metric-change.positive {
  color: #10b981;
  background: #ecfdf5;
}

.metric-change.negative {
  color: #ef4444;
  background: #fef2f2;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.chart-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.chart-card.wide {
  grid-column: 1 / -1;
}

@media (min-width: 1200px) {
  .chart-card.wide {
    grid-column: span 2;
  }
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.chart-legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #718096;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-color.new {
  background: #ff6b6b;
}

.legend-color.returning {
  background: #4ecdc4;
}

:deep(.el-card__header) {
  padding: 20px;
  border-bottom: 1px solid #f1f1f1;
}

:deep(.el-card__body) {
  padding: 20px;
}

.activity-card {
  margin-top: 32px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.activity-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 0 16px;
}

.activity-item-detailed {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f1f1f1;
}

.activity-item-detailed:last-child {
  border-bottom: none;
}

.activity-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-text {
  font-size: 14px;
  color: #1a202c;
}

.activity-time {
  font-size: 12px;
  color: #718096;
}

.team-link {
  color: #4ecdc4;
  font-weight: 500;
}

.activity-icon {
  width: 24px;
  height: 24px;
  color: #667eea;
}
</style>
