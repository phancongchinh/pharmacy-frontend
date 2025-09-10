<template>
  <div class="appointment-report-view">
    <!-- Header Section -->
    <div class="report-header">
      <div class="header-left">
        <h1 class="report-title">Appointment Analytics Dashboard</h1>
        <p class="report-subtitle">
          AI-powered insights into your scheduling patterns and appointment performance
        </p>
        <div class="ai-badge">
          <span class="material-symbols-outlined">psychology</span>
          <span>AI Enhanced Analytics</span>
        </div>
      </div>
      <div class="header-right">
        <el-button @click="refreshData" :loading="loading">
          <span class="material-symbols-outlined">refresh</span>
          Refresh
        </el-button>
        <el-button type="primary" @click="exportReport">
          <span class="material-symbols-outlined">download</span>
          Export Report
        </el-button>
      </div>
    </div>

    <!-- Filters Section -->
    <el-card class="filters-card" shadow="hover">
      <div class="filters-content">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="to"
              start-placeholder="Start date"
              end-placeholder="End date"
              @change="updateCharts"
            />
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="selectedType"
              placeholder="All Types"
              clearable
              @change="updateCharts"
            >
              <el-option label="All Types" value="" />
              <el-option
                v-for="type in appointmentTypes"
                :key="type.id"
                :label="type.name"
                :value="type.id"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="selectedStatus"
              placeholder="All Statuses"
              clearable
              @change="updateCharts"
            >
              <el-option label="All Statuses" value="" />
              <el-option
                v-for="status in appointmentStatuses"
                :key="status.id"
                :label="status.name"
                :value="status.id"
              />
            </el-select>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- Charts Grid -->
    <div class="charts-grid">
      <!-- Appointment Volume Trend -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Appointment Volume Trend</h3>
            <el-button link @click="generateAIInsight('volume')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <div class="chart-container">
          <apexchart
            type="line"
            height="300"
            :options="volumeChartOptions"
            :series="volumeChartSeries"
          ></apexchart>
        </div>
        <div v-if="aiInsights.volume" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.volume }}</p>
        </div>
      </el-card>

      <!-- Show-up Rate Analysis -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Show-up Rate Analysis</h3>
            <el-button link @click="generateAIInsight('showUp')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <div class="chart-container">
          <apexchart
            type="pie"
            height="300"
            :options="showUpChartOptions"
            :series="showUpChartSeries"
          ></apexchart>
        </div>
        <div v-if="aiInsights.showUp" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.showUp }}</p>
        </div>
      </el-card>

      <!-- Appointment Types Distribution -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Appointment Types</h3>
            <el-button link @click="generateAIInsight('types')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <div class="chart-container">
          <apexchart
            type="bar"
            height="300"
            :options="typesChartOptions"
            :series="typesChartSeries"
          ></apexchart>
        </div>
        <div v-if="aiInsights.types" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.types }}</p>
        </div>
      </el-card>

      <!-- Time Slot Performance -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Time Slot Performance</h3>
            <el-button link @click="generateAIInsight('timeSlots')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <div class="chart-container">
          <apexchart
            type="polarArea"
            height="300"
            :options="timeSlotsChartOptions"
            :series="timeSlotsChartSeries"
          ></apexchart>
        </div>
        <div v-if="aiInsights.timeSlots" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.timeSlots }}</p>
        </div>
      </el-card>

      <!-- Weekly Pattern Analysis -->
      <el-card class="chart-card chart-card-wide" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Weekly Appointment Patterns</h3>
            <el-button link @click="generateAIInsight('weeklyPattern')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <div class="chart-container">
          <apexchart
            type="heatmap"
            height="300"
            :options="weeklyPatternChartOptions"
            :series="weeklyPatternChartSeries"
          ></apexchart>
        </div>
        <div v-if="aiInsights.weeklyPattern" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.weeklyPattern }}</p>
        </div>
      </el-card>

      <!-- Conversion Rate by Source -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Conversion by Source</h3>
            <el-button link @click="generateAIInsight('conversion')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <div class="chart-container">
          <apexchart
            type="radar"
            height="300"
            :options="conversionChartOptions"
            :series="conversionChartSeries"
          ></apexchart>
        </div>
        <div v-if="aiInsights.conversion" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.conversion }}</p>
        </div>
      </el-card>
    </div>

    <!-- AI Summary Report -->
    <el-card class="summary-card" shadow="hover" v-if="aiSummary">
      <template #header>
        <div class="summary-header">
          <span class="material-symbols-outlined">psychology</span>
          <h3>AI-Generated Scheduling Intelligence Report</h3>
          <el-button type="primary" @click="generateAISummary" :loading="generatingSummary">
            Generate New Analysis
          </el-button>
        </div>
      </template>
      <div class="ai-summary-content">
        <div class="summary-section">
          <h4>Scheduling Efficiency</h4>
          <ul>
            <li v-for="insight in aiSummary.schedulingEfficiency" :key="insight">{{ insight }}</li>
          </ul>
        </div>
        <div class="summary-section">
          <h4>Optimization Opportunities</h4>
          <ul>
            <li v-for="opportunity in aiSummary.optimizationOpportunities" :key="opportunity">
              {{ opportunity }}
            </li>
          </ul>
        </div>
        <div class="summary-section">
          <h4>Strategic Recommendations</h4>
          <p>{{ aiSummary.strategicRecommendations }}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import VueApexCharts from 'vue3-apexcharts'

// Reactive data
const loading = ref(false)
const generatingSummary = ref(false)
const dateRange = ref<[Date, Date] | null>(null)
const selectedType = ref('')
const selectedStatus = ref('')

// Data
const appointmentTypes = ref([
  { id: 1, name: 'Sales Meeting' },
  { id: 2, name: 'Demo' },
  { id: 3, name: 'Follow-up' },
  { id: 4, name: 'Consultation' },
])

const appointmentStatuses = ref([
  { id: 1, name: 'Scheduled' },
  { id: 2, name: 'Completed' },
  { id: 3, name: 'No-show' },
  { id: 4, name: 'Cancelled' },
])

// AI Insights
const aiInsights = ref({
  volume: '',
  showUp: '',
  types: '',
  timeSlots: '',
  weeklyPattern: '',
  conversion: '',
})

const aiSummary = ref<{
  schedulingEfficiency: string[]
  optimizationOpportunities: string[]
  strategicRecommendations: string
} | null>(null)

// Chart configurations
const volumeChartOptions = computed(() => ({
  chart: {
    type: 'line',
    height: 300,
    toolbar: { show: false },
  },
  title: {
    text: 'Monthly Appointments',
    align: 'center',
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
  },
  colors: ['#409EFF', '#67C23A'],
  stroke: {
    curve: 'smooth',
  },
}))

const volumeChartSeries = computed(() => [
  {
    name: 'Scheduled',
    data: [65, 78, 85, 92, 88, 105, 98, 112, 108, 125, 118, 135],
  },
  {
    name: 'Completed',
    data: [52, 65, 70, 78, 75, 89, 82, 96, 92, 108, 102, 115],
  },
])

const showUpChartOptions = computed(() => ({
  chart: {
    type: 'pie',
    height: 300,
  },
  title: {
    text: 'Show-up Rate',
    align: 'center',
  },
  labels: ['Completed', 'No-show', 'Cancelled', 'Rescheduled'],
  colors: ['#67C23A', '#F56C6C', '#E6A23C', '#409EFF'],
}))

const showUpChartSeries = computed(() => [752, 145, 89, 23])

const typesChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 300,
    toolbar: { show: false },
  },
  title: {
    text: 'Appointment Types',
    align: 'center',
  },
  xaxis: {
    categories: ['Sales Meeting', 'Demo', 'Follow-up', 'Consultation'],
  },
  colors: ['#E6A23C'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.5,
      gradientToColors: ['#F56C6C'],
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100],
    },
  },
}))

const typesChartSeries = computed(() => [
  {
    name: 'Appointments',
    data: [245, 189, 167, 134],
  },
])

const timeSlotsChartOptions = computed(() => ({
  chart: {
    type: 'polarArea',
    height: 300,
  },
  title: {
    text: 'Popular Time Slots',
    align: 'center',
  },
  labels: ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'],
  colors: [
    '#909399',
    '#67C23A',
    '#409EFF',
    '#E6A23C',
    '#F56C6C',
    '#85ce61',
    '#529b2e',
    '#337ecc',
    '#b88230',
  ],
}))

const timeSlotsChartSeries = computed(() => [45, 67, 89, 76, 54, 92, 85, 71, 43])

const weeklyPatternChartOptions = computed(() => ({
  chart: {
    type: 'heatmap',
    height: 300,
    toolbar: { show: false },
  },
  title: {
    text: 'Weekly Appointment Heatmap',
    align: 'center',
  },
  xaxis: {
    type: 'category',
    categories: ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'],
  },
  plotOptions: {
    heatmap: {
      shadeIntensity: 0.5,
      colorScale: {
        ranges: [
          {
            from: 0,
            to: 10,
            name: 'Low',
            color: '#FFE4E1',
          },
          {
            from: 11,
            to: 20,
            name: 'Medium',
            color: '#FF9999',
          },
          {
            from: 21,
            to: 25,
            name: 'High',
            color: '#FF0000',
          },
        ],
      },
    },
  },
}))

const weeklyPatternChartSeries = computed(() => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  return days.map((day) => ({
    name: day,
    data: Array.from({ length: 9 }, () => Math.floor(Math.random() * 20) + 5),
  }))
})

const conversionChartOptions = computed(() => ({
  chart: {
    type: 'radar',
    height: 300,
  },
  title: {
    text: 'Conversion Rate by Source',
    align: 'center',
  },
  xaxis: {
    categories: ['Website', 'Social Media', 'Referral', 'Email', 'Phone', 'Walk-in'],
  },
  colors: ['#67C23A'],
  fill: {
    opacity: 0.3,
  },
}))

const conversionChartSeries = computed(() => [
  {
    name: 'Conversion Rate',
    data: [85, 72, 90, 78, 68, 45],
  },
])

// Methods
const refreshData = async () => {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    ElMessage.success('Data refreshed successfully')
  } catch (error) {
    ElMessage.error('Failed to refresh data')
  } finally {
    loading.value = false
  }
}

const updateCharts = () => {
  // Charts will automatically update due to computed properties
}

const generateAIInsight = async (type: string) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const insights = {
      volume:
        'Appointment volume shows consistent 12% month-over-month growth. September peak corresponds with back-to-school business season. December dip is expected but recovery strategy needed for Q1.',
      showUp:
        'Overall show-up rate is 74%, which is above industry average of 68%. No-shows peak on Mondays (18%) and drop to 8% on Wednesdays. Implement Monday reminder campaigns.',
      types:
        'Sales meetings have highest conversion rate (34%) but demos show strongest growth trend (28% increase). Consider expanding demo capacity and improving sales meeting efficiency.',
      timeSlots:
        '2-3 PM shows highest booking rate and best show-up percentage (89%). Morning slots (9-11 AM) have 23% higher conversion rates. Optimize availability during peak performance windows.',
      weeklyPattern:
        'Tuesday-Thursday shows optimal performance with 15% higher completion rates. Friday afternoon appointments have 31% higher no-show rates. Consider reducing Friday afternoon availability.',
      conversion:
        'Referral appointments show highest conversion (90%) but lowest volume. Website appointments have strong volume but need conversion improvement. Focus on referral program expansion.',
    }

    aiInsights.value[type as keyof typeof aiInsights.value] =
      insights[type as keyof typeof insights]
    ElMessage.success('AI insights generated successfully')
  } catch (error) {
    ElMessage.error('Failed to generate AI insights')
  }
}

const generateAISummary = async () => {
  generatingSummary.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    aiSummary.value = {
      schedulingEfficiency: [
        'Overall show-up rate of 74% exceeds industry benchmark by 6%',
        'Peak performance window identified: Tuesday-Thursday, 2-3 PM',
        'Sales meetings show 34% conversion rate with room for volume expansion',
        'Monthly growth rate of 12% indicates strong demand trend',
      ],
      optimizationOpportunities: [
        'Monday appointments have highest no-show rates - implement targeted reminder campaigns',
        'Friday afternoon slots show 31% higher no-shows - consider reducing availability',
        'Referral appointments have 90% conversion but low volume - expand referral programs',
        'Demo appointments showing 28% growth - increase capacity and streamline process',
      ],
      strategicRecommendations:
        'Focus on expanding the referral program to increase high-converting appointment volume. Implement dynamic scheduling that prioritizes Tuesday-Thursday slots and reduces Friday afternoon availability. The strong overall performance suggests capacity for 15-20% growth with optimized scheduling patterns. Consider automated reminder systems targeting Monday appointments specifically.',
    }

    ElMessage.success('AI analysis generated successfully')
  } catch (error) {
    ElMessage.error('Failed to generate AI analysis')
  } finally {
    generatingSummary.value = false
  }
}

const exportReport = () => {
  ElMessage.info('Export functionality will be implemented')
}

onMounted(() => {
  generateAISummary()
})
</script>

<style scoped>
.appointment-report-view {
  padding: 24px;
  background: #f8fafc;
  min-height: calc(100vh - 64px);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-left {
  flex: 1;
}

.report-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
}

.report-subtitle {
  font-size: 16px;
  color: #718096;
  margin: 0 0 12px 0;
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.header-right {
  display: flex;
  gap: 12px;
}

.filters-card {
  margin-bottom: 24px;
}

.filters-content {
  padding: 8px 0;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.chart-card {
  min-height: 400px;
}

.chart-card-wide {
  grid-column: 1 / -1;
  min-height: 400px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.ai-insight {
  margin-top: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 8px;
  color: white;
}

.ai-insight-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  margin-bottom: 8px;
}

.ai-insight p {
  margin: 0;
  line-height: 1.5;
}

.summary-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
}

.summary-header h3 {
  margin: 0;
  color: white;
}

.ai-summary-content {
  padding: 16px 0;
}

.summary-section {
  margin-bottom: 24px;
}

.summary-section:last-child {
  margin-bottom: 0;
}

.summary-section h4 {
  margin: 0 0 12px 0;
  color: #f0f0f0;
  font-size: 16px;
}

.summary-section ul {
  margin: 0;
  padding-left: 20px;
}

.summary-section li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.summary-section p {
  margin: 0;
  line-height: 1.6;
  color: #f0f0f0;
}

:deep(.el-card__header) {
  padding: 18px 20px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.summary-card .el-card__header) {
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  .report-header {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
