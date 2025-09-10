<template>
  <div class="email-report-view">
    <!-- Header Section -->
    <div class="report-header">
      <div class="header-left">
        <h1 class="report-title">Email Campaign Analytics</h1>
        <p class="report-subtitle">
          AI-powered insights into your email marketing performance and engagement
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
              v-model="selectedCampaign"
              placeholder="All Campaigns"
              clearable
              @change="updateCharts"
            >
              <el-option label="All Campaigns" value="" />
              <el-option
                v-for="campaign in emailCampaigns"
                :key="campaign.id"
                :label="campaign.name"
                :value="campaign.id"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="selectedSegment"
              placeholder="All Segments"
              clearable
              @change="updateCharts"
            >
              <el-option label="All Segments" value="" />
              <el-option
                v-for="segment in emailSegments"
                :key="segment.id"
                :label="segment.name"
                :value="segment.id"
              />
            </el-select>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- Charts Grid -->
    <div class="charts-grid">
      <!-- Email Performance Metrics -->
      <el-card class="chart-card chart-card-wide" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Email Performance Overview</h3>
            <el-button link @click="generateAIInsight('performance')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <apexchart
          type="line"
          height="300"
          :options="performanceChartOptions"
          :series="performanceChartSeries"
        ></apexchart>
        <div v-if="aiInsights.performance" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.performance }}</p>
        </div>
      </el-card>

      <!-- Open Rate Trends -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Open Rate Trends</h3>
            <el-button link @click="generateAIInsight('openRate')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <apexchart
          type="bar"
          height="300"
          :options="openRateChartOptions"
          :series="openRateChartSeries"
        ></apexchart>
        <div v-if="aiInsights.openRate" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.openRate }}</p>
        </div>
      </el-card>

      <!-- Click-Through Rate Analysis -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Click-Through Rates</h3>
            <el-button link @click="generateAIInsight('clickThrough')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <apexchart
          type="area"
          height="300"
          :options="clickThroughChartOptions"
          :series="clickThroughChartSeries"
        ></apexchart>
        <div v-if="aiInsights.clickThrough" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.clickThrough }}</p>
        </div>
      </el-card>

      <!-- Send Time Optimization -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Optimal Send Times</h3>
            <el-button link @click="generateAIInsight('sendTime')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <apexchart
          type="polarArea"
          height="300"
          :options="sendTimeChartOptions"
          :series="sendTimeChartSeries"
        ></apexchart>
        <div v-if="aiInsights.sendTime" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.sendTime }}</p>
        </div>
      </el-card>

      <!-- Subject Line Performance -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Subject Line Analysis</h3>
            <el-button link @click="generateAIInsight('subjectLine')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <apexchart
          type="donut"
          height="300"
          :options="subjectLineChartOptions"
          :series="subjectLineChartSeries"
        ></apexchart>
        <div v-if="aiInsights.subjectLine" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.subjectLine }}</p>
        </div>
      </el-card>

      <!-- Unsubscribe Analysis -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Unsubscribe Patterns</h3>
            <el-button link @click="generateAIInsight('unsubscribe')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <apexchart
          type="line"
          height="300"
          :options="unsubscribeChartOptions"
          :series="unsubscribeChartSeries"
        ></apexchart>
        <div v-if="aiInsights.unsubscribe" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.unsubscribe }}</p>
        </div>
      </el-card>
    </div>

    <!-- AI Summary Report -->
    <el-card class="summary-card" shadow="hover" v-if="aiSummary">
      <template #header>
        <div class="summary-header">
          <span class="material-symbols-outlined">psychology</span>
          <h3>AI-Generated Email Marketing Intelligence</h3>
          <el-button type="primary" @click="generateAISummary" :loading="generatingSummary">
            Generate New Analysis
          </el-button>
        </div>
      </template>
      <div class="ai-summary-content">
        <div class="summary-section">
          <h4>Performance Insights</h4>
          <ul>
            <li v-for="insight in aiSummary.performanceInsights" :key="insight">{{ insight }}</li>
          </ul>
        </div>
        <div class="summary-section">
          <h4>Optimization Recommendations</h4>
          <ul>
            <li
              v-for="recommendation in aiSummary.optimizationRecommendations"
              :key="recommendation"
            >
              {{ recommendation }}
            </li>
          </ul>
        </div>
        <div class="summary-section">
          <h4>Strategic Outlook</h4>
          <p>{{ aiSummary.strategicOutlook }}</p>
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
const selectedCampaign = ref('')
const selectedSegment = ref('')

// Data
const emailCampaigns = ref([
  { id: 1, name: 'Newsletter' },
  { id: 2, name: 'Product Updates' },
  { id: 3, name: 'Promotional' },
  { id: 4, name: 'Welcome Series' },
])

const emailSegments = ref([
  { id: 1, name: 'New Subscribers' },
  { id: 2, name: 'Active Users' },
  { id: 3, name: 'Inactive Users' },
  { id: 4, name: 'VIP Customers' },
])

// AI Insights
const aiInsights = ref({
  performance: '',
  openRate: '',
  clickThrough: '',
  sendTime: '',
  subjectLine: '',
  unsubscribe: '',
})

const aiSummary = ref<{
  performanceInsights: string[]
  optimizationRecommendations: string[]
  strategicOutlook: string
} | null>(null)

// Chart configurations
const performanceChartOptions = computed(() => ({
  chart: {
    type: 'line',
    height: 300,
    toolbar: { show: false },
  },
  title: {
    text: 'Email Campaign Performance',
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
  colors: ['#909399', '#409EFF', '#67C23A', '#E6A23C'],
  stroke: {
    curve: 'smooth',
  },
}))

const performanceChartSeries = computed(() => [
  {
    name: 'Sent',
    data: [12000, 13200, 14500, 15800, 16200, 17500, 18200, 19800, 20500, 21200, 22800, 24000],
  },
  {
    name: 'Delivered',
    data: [11400, 12540, 13775, 15010, 15390, 16625, 17290, 18810, 19475, 20140, 21660, 22800],
  },
  {
    name: 'Opened',
    data: [2850, 3135, 3444, 3753, 3847, 4156, 4323, 4703, 4869, 5035, 5415, 5700],
  },
  {
    name: 'Clicked',
    data: [570, 627, 689, 751, 769, 831, 865, 941, 974, 1007, 1083, 1140],
  },
])

const openRateChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 300,
    toolbar: { show: false },
  },
  title: {
    text: 'Open Rate by Campaign Type',
    align: 'center',
  },
  xaxis: {
    categories: ['Newsletter', 'Product Updates', 'Promotional', 'Welcome Series'],
  },
  yaxis: {
    labels: {
      formatter: (val) => `${val}%`,
    },
  },
  colors: ['#67C23A'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.5,
      gradientToColors: ['#85ce61'],
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100],
    },
  },
}))

const openRateChartSeries = computed(() => [
  {
    name: 'Open Rate',
    data: [24.5, 18.2, 15.8, 32.1],
  },
])

const clickThroughChartOptions = computed(() => ({
  chart: {
    type: 'area',
    height: 300,
    toolbar: { show: false },
  },
  title: {
    text: 'Click-Through Rate Trends',
    align: 'center',
  },
  xaxis: {
    categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
  },
  yaxis: {
    labels: {
      formatter: (val) => `${val}%`,
    },
  },
  colors: ['#E6A23C'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.3,
      opacityTo: 0.1,
      stops: [0, 100],
    },
  },
  stroke: {
    curve: 'smooth',
  },
}))

const clickThroughChartSeries = computed(() => [
  {
    name: 'CTR',
    data: [4.2, 3.8, 4.5, 5.1, 4.7, 5.3, 4.9, 5.8],
  },
])

const sendTimeChartOptions = computed(() => ({
  chart: {
    type: 'polarArea',
    height: 300,
  },
  title: {
    text: 'Open Rate by Send Time',
    align: 'center',
  },
  labels: ['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'],
  colors: ['#F56C6C', '#E6A23C', '#409EFF', '#67C23A', '#85ce61', '#529b2e', '#337ecc', '#b88230'],
}))

const sendTimeChartSeries = computed(() => [12.5, 18.2, 25.8, 22.1, 26.3, 21.7, 19.4, 15.8])

const subjectLineChartOptions = computed(() => ({
  chart: {
    type: 'donut',
    height: 300,
  },
  title: {
    text: 'Subject Line Performance',
    align: 'center',
  },
  labels: ['Question-based', 'Urgency-driven', 'Personalized', 'Benefit-focused'],
  colors: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C'],
}))

const subjectLineChartSeries = computed(() => [35, 28, 22, 15])

const unsubscribeChartOptions = computed(() => ({
  chart: {
    type: 'line',
    height: 300,
    toolbar: { show: false },
  },
  title: {
    text: 'Unsubscribe Rate Trends',
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
  yaxis: {
    labels: {
      formatter: (val) => `${val}%`,
    },
  },
  colors: ['#F56C6C'],
  annotations: {
    yaxis: [
      {
        y: 0.8,
        borderColor: '#999',
        label: {
          text: 'Average',
          style: {
            color: '#fff',
            background: '#999',
          },
        },
      },
    ],
  },
}))

const unsubscribeChartSeries = computed(() => [
  {
    name: 'Unsubscribe Rate',
    data: [0.8, 0.6, 0.9, 1.2, 0.7, 0.5, 0.8, 1.1, 0.9, 0.7, 0.6, 0.8],
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
      performance:
        'Email deliverability is excellent at 95%, above industry standard. Open rates are strong at 25% average, with Welcome Series performing best at 32.1%. Focus on scaling high-performing campaign types.',
      openRate:
        'Welcome Series campaigns show 32% open rate, significantly outperforming promotional emails (15.8%). Personalization in Welcome Series drives engagement. Apply similar personalization to other campaign types.',
      clickThrough:
        'CTR trending upward with 5.8% peak in Week 8. This 38% improvement indicates growing audience engagement. Current trajectory suggests potential for 6-7% CTR with continued optimization.',
      sendTime:
        'Optimal send time is 2 PM with 26.3% open rate, followed by 10 AM at 25.8%. Avoid evening sends (8 PM) which show 15.8% open rate. Schedule critical campaigns between 10 AM - 4 PM.',
      subjectLine:
        'Question-based subject lines perform best (35% of high-performing emails). Urgency-driven subjects show strong secondary performance (28%). A/B test combining question format with urgency elements.',
      unsubscribe:
        'Unsubscribe rate stable at 0.8% average, well below industry benchmark of 2%. April spike (1.2%) correlates with increased promotional frequency. Maintain current frequency limits.',
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
      performanceInsights: [
        '95% deliverability rate exceeds industry standards with consistent performance',
        'Welcome Series campaigns achieve 32.1% open rate, 2x higher than promotional emails',
        'Click-through rates improved 38% over 8-week period, reaching 5.8% peak',
        'Unsubscribe rate remains healthy at 0.8%, well below 2% industry benchmark',
      ],
      optimizationRecommendations: [
        'Scale Welcome Series personalization techniques to Newsletter and Product Update campaigns',
        'Implement question-based subject lines across all campaign types for improved open rates',
        'Optimize send times: schedule all critical campaigns between 10 AM - 4 PM',
        'A/B test combining question format with urgency elements in subject lines',
      ],
      strategicOutlook:
        'Email marketing performance is strong with significant growth potential. The upward CTR trend and excellent deliverability create a foundation for scaling efforts. Focus on applying Welcome Series personalization strategies across all campaigns while maintaining optimal send timing. The low unsubscribe rate indicates audience satisfaction, supporting increased frequency for high-performing content types.',
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
.email-report-view {
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
