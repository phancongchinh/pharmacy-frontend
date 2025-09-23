<template>
  <div class="page-container">
    <!-- Header Section with improved typography -->
    <div class="page-header">
      <div class="page-header-content">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Welcome back! Here's what's happening with your business today.</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" class="modern-button">
          <span class="material-symbols-outlined">add</span>
          New Report
        </el-button>
      </div>
    </div>

    <!-- Key Metrics Grid with modern cards -->
    <div class="metrics-section">
      <div class="metrics-grid">
        <div class="metric-card modern-card" v-for="(metric, index) in keyMetrics" :key="index">
          <div class="metric-header">
            <div
              class="metric-trend"
              :class="calculateStatsChanges(statsOverviews, metric.stat).class"
            >
              <span class="material-symbols-outlined">
                {{
                  calculateStatsChanges(statsOverviews, metric.stat).class === 'positive'
                    ? 'trending_up'
                    : 'trending_down'
                }}
              </span>
              {{ calculateStatsChanges(statsOverviews, metric.stat).value }}
            </div>
          </div>
          <div class="metric-body">
            <div class="metric-value">{{ format(statsOverviews[metric.stat], metric.format) }}</div>
            <div class="metric-label">{{ metric.title }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section with modern layout -->
    <div class="charts-section">
      <div class="charts-row">
        <!-- Revenue Chart -->
        <div class="chart-container large">
          <div class="chart-card modern-card">
            <div class="chart-header">
              <div class="chart-title-section">
                <h3 class="chart-title">Revenue Analytics</h3>
                <p class="chart-subtitle">Monthly revenue performance</p>
              </div>
              <div class="chart-controls">
                <el-select v-model="revenueTimeframe" size="default" class="modern-select">
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
                :options="revenueChartOptions"
                :series="revenueChartSeries"
              />
            </div>
          </div>
        </div>

        <!-- Sales Distribution -->
        <div class="chart-container medium">
          <div class="chart-card modern-card">
            <div class="chart-header">
              <div class="chart-title-section">
                <h3 class="chart-title">Sales Distribution</h3>
                <p class="chart-subtitle">By category</p>
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
        <!-- Customer Growth -->
        <div class="chart-container medium">
          <div class="chart-card modern-card">
            <div class="chart-header">
              <div class="chart-title-section">
                <h3 class="chart-title">Customer Growth</h3>
                <p class="chart-subtitle">New vs returning customers</p>
              </div>
            </div>
            <div class="chart-body">
              <apexchart
                type="line"
                height="320"
                :options="customerGrowthOptions"
                :series="customerGrowthSeries"
              />
            </div>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div class="chart-container large">
          <div class="chart-card modern-card">
            <div class="chart-header">
              <div class="chart-title-section">
                <h3 class="chart-title">Performance Overview</h3>
                <p class="chart-subtitle">Sales & profit comparison</p>
              </div>
            </div>
            <div class="chart-body">
              <apexchart
                type="bar"
                height="320"
                :options="performanceChartOptions"
                :series="performanceChartSeries"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Feed Section -->
    <div class="activity-section">
      <div class="activity-card modern-card">
        <div class="activity-header">
          <div class="activity-title-section">
            <div class="activity-icon">
              <span class="material-symbols-outlined">notifications</span>
            </div>
            <div>
              <h3 class="activity-title">Recent Activity</h3>
              <p class="activity-subtitle">Latest updates from your team</p>
            </div>
          </div>
          <el-button text class="view-all-btn">View All</el-button>
        </div>

        <div class="activity-list">
          <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
            <div class="activity-avatar">
              <el-avatar :size="48" :src="activity.user.avatar" class="user-avatar">
                {{ activity.user.name.charAt(0) }}
              </el-avatar>
            </div>
            <div class="activity-content">
              <div class="activity-main">
                <div class="activity-text">
                  <span class="user-name">{{ activity.user.name }}</span>
                  <span class="action-text">{{ activity.action }}</span>
                  <span class="target-text">{{ activity.target }}</span>
                </div>
                <div class="activity-meta">
                  <span class="team-badge">{{ activity.team }}</span>
                  <span class="time-text">{{ formatActivityTime(activity.timestamp) }}</span>
                </div>
              </div>
              <div class="activity-action-icon">
                <span class="material-symbols-outlined">{{ activity.icon }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.modern-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
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

/* Responsive Design */
@media (max-width: 1024px) {
  .charts-row {
    grid-template-columns: 1fr;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 20px;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .header-content .dashboard-title {
    font-size: 32px;
  }
}
</style>
