<template>
  <div class="deal-report-view">
    <!-- Header Section -->
    <div class="report-header">
      <div class="header-left">
        <h1 class="report-title">Deal Performance Analytics</h1>
        <p class="report-subtitle">
          AI-driven insights into your sales pipeline and deal performance
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
              v-model="selectedStage"
              placeholder="All Stages"
              clearable
              @change="updateCharts"
            >
              <el-option label="All Stages" value="" />
              <el-option
                v-for="stage in dealStages"
                :key="stage.id"
                :label="stage.name"
                :value="stage.id"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="selectedOwner"
              placeholder="All Owners"
              clearable
              @change="updateCharts"
            >
              <el-option label="All Owners" value="" />
              <el-option
                v-for="owner in dealOwners"
                :key="owner.id"
                :label="owner.name"
                :value="owner.id"
              />
            </el-select>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- Charts Grid -->
    <div class="charts-grid">
      <!-- Pipeline Funnel -->
      <el-card class="chart-card chart-card-wide" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Sales Pipeline Funnel</h3>
            <el-button link @click="generateAIInsight('funnel')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <div class="chart-container">
          <apexchart
            type="bar"
            height="300"
            :options="funnelChartOptions"
            :series="funnelChartSeries"
          ></apexchart>
        </div>
        <div v-if="aiInsights.funnel" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.funnel }}</p>
        </div>
      </el-card>

      <!-- Revenue Trend -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Monthly Revenue Trend</h3>
            <el-button link @click="generateAIInsight('revenue')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <div class="chart-container">
          <apexchart
            type="line"
            height="300"
            :options="revenueChartOptions"
            :series="revenueChartSeries"
          ></apexchart>
        </div>
        <div v-if="aiInsights.revenue" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.revenue }}</p>
        </div>
      </el-card>

      <!-- Deal Size Distribution -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Deal Size Distribution</h3>
            <el-button link @click="generateAIInsight('dealSize')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <div class="chart-container">
          <apexchart
            type="donut"
            height="300"
            :options="dealSizeChartOptions"
            :series="dealSizeChartSeries"
          ></apexchart>
        </div>
        <div v-if="aiInsights.dealSize" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.dealSize }}</p>
        </div>
      </el-card>

      <!-- Win Rate Analysis -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Win Rate by Stage</h3>
            <el-button link @click="generateAIInsight('winRate')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <div class="chart-container">
          <apexchart
            type="bar"
            height="300"
            :options="winRateChartOptions"
            :series="winRateChartSeries"
          ></apexchart>
        </div>
        <div v-if="aiInsights.winRate" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.winRate }}</p>
        </div>
      </el-card>

      <!-- Sales Cycle Analysis -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Average Sales Cycle</h3>
            <el-button link @click="generateAIInsight('salesCycle')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <div class="chart-container">
          <apexchart
            type="radar"
            height="300"
            :options="salesCycleChartOptions"
            :series="salesCycleChartSeries"
          ></apexchart>
        </div>
        <div v-if="aiInsights.salesCycle" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.salesCycle }}</p>
        </div>
      </el-card>

      <!-- Team Performance -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Team Performance</h3>
            <el-button link @click="generateAIInsight('teamPerformance')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <div class="chart-container">
          <apexchart
            type="line"
            height="300"
            :options="teamPerformanceChartOptions"
            :series="teamPerformanceChartSeries"
          ></apexchart>
        </div>
        <div v-if="aiInsights.teamPerformance" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.teamPerformance }}</p>
        </div>
      </el-card>
    </div>

    <!-- AI Summary Report -->
    <el-card class="summary-card" shadow="hover" v-if="aiSummary">
      <template #header>
        <div class="summary-header">
          <span class="material-symbols-outlined">psychology</span>
          <h3>AI-Generated Sales Intelligence Report</h3>
          <el-button type="primary" @click="generateAISummary" :loading="generatingSummary">
            Generate New Analysis
          </el-button>
        </div>
      </template>
      <div class="ai-summary-content">
        <div class="summary-section">
          <h4>Revenue Insights</h4>
          <ul>
            <li v-for="insight in aiSummary.revenueInsights" :key="insight">{{ insight }}</li>
          </ul>
        </div>
        <div class="summary-section">
          <h4>Pipeline Optimization</h4>
          <ul>
            <li v-for="optimization in aiSummary.pipelineOptimization" :key="optimization">
              {{ optimization }}
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
const selectedStage = ref('')
const selectedOwner = ref('')

// Data
const dealStages = ref([
  { id: 1, name: 'Prospecting' },
  { id: 2, name: 'Qualification' },
  { id: 3, name: 'Proposal' },
  { id: 4, name: 'Negotiation' },
  { id: 5, name: 'Closed Won' },
  { id: 6, name: 'Closed Lost' },
])

const dealOwners = ref([
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'Sarah Johnson' },
  { id: 3, name: 'Mike Davis' },
  { id: 4, name: 'Lisa Wilson' },
])

// AI Insights
const aiInsights = ref({
  funnel: '',
  revenue: '',
  dealSize: '',
  winRate: '',
  salesCycle: '',
  teamPerformance: '',
})

const aiSummary = ref<{
  revenueInsights: string[]
  pipelineOptimization: string[]
  strategicRecommendations: string
} | null>(null)

// Chart configurations
const funnelChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 300,
    toolbar: { show: false },
  },
  title: {
    text: 'Sales Pipeline Funnel',
    align: 'center',
  },
  plotOptions: {
    bar: {
      horizontal: true,
      distributed: true,
    },
  },
  xaxis: {
    categories: ['Leads', 'Prospects', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'],
  },
  colors: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#85ce61'],
}))

const funnelChartSeries = computed(() => [
  {
    name: 'Pipeline',
    data: [100, 80, 60, 40, 20, 15],
  },
])

const revenueChartOptions = computed(() => ({
  chart: {
    type: 'line',
    height: 300,
    toolbar: { show: false },
  },
  title: {
    text: 'Monthly Revenue',
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
      formatter: (val) => `$${val}K`,
    },
  },
  stroke: {
    width: [2, 2],
    dashArray: [0, 5],
  },
  colors: ['#E6A23C', '#67C23A'],
}))

const revenueChartSeries = computed(() => [
  {
    name: 'Target',
    data: [500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050],
  },
  {
    name: 'Actual',
    data: [480, 620, 580, 720, 690, 810, 780, 920, 880, 980, 1020, 1100],
  },
])

const dealSizeChartOptions = computed(() => ({
  chart: {
    type: 'donut',
    height: 300,
  },
  title: {
    text: 'Deal Size Distribution',
    align: 'center',
  },
  labels: ['$0-10K', '$10K-50K', '$50K-100K', '$100K+'],
  colors: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C'],
}))

const dealSizeChartSeries = computed(() => [145, 89, 56, 23])

const winRateChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 300,
    toolbar: { show: false },
  },
  title: {
    text: 'Win Rate by Stage',
    align: 'center',
  },
  xaxis: {
    categories: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation'],
  },
  yaxis: {
    labels: {
      formatter: (val) => `${val}%`,
    },
  },
  colors: ['#409EFF'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.5,
      gradientToColors: ['#1890ff'],
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100],
    },
  },
}))

const winRateChartSeries = computed(() => [
  {
    name: 'Win Rate',
    data: [15, 35, 65, 85],
  },
])

const salesCycleChartOptions = computed(() => ({
  chart: {
    type: 'radar',
    height: 300,
  },
  title: {
    text: 'Average Sales Cycle (Days)',
    align: 'center',
  },
  xaxis: {
    categories: [
      'Small Deals',
      'Medium Deals',
      'Large Deals',
      'Enterprise',
      'New Customers',
      'Existing Customers',
    ],
  },
  colors: ['#F56C6C'],
  fill: {
    opacity: 0.3,
  },
}))

const salesCycleChartSeries = computed(() => [
  {
    name: 'Sales Cycle',
    data: [30, 45, 75, 90, 65, 40],
  },
])

const teamPerformanceChartOptions = computed(() => ({
  chart: {
    type: 'line',
    height: 300,
    toolbar: { show: false },
  },
  title: {
    text: 'Team Performance',
    align: 'center',
  },
  xaxis: {
    categories: ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Wilson'],
  },
  yaxis: [
    {
      title: { text: 'Deals Closed' },
    },
    {
      opposite: true,
      title: { text: 'Revenue ($K)' },
    },
  ],
  colors: ['#409EFF', '#67C23A'],
}))

const teamPerformanceChartSeries = computed(() => [
  {
    name: 'Deals Closed',
    type: 'column',
    data: [25, 32, 18, 28],
  },
  {
    name: 'Revenue Generated',
    type: 'line',
    data: [450, 620, 320, 580],
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
      funnel:
        'Your pipeline shows a 15% conversion rate from leads to closed deals. The biggest drop-off occurs between Qualification and Proposal stages (25% loss). Focus on improving qualification criteria to reduce pipeline leakage.',
      revenue:
        'Revenue is trending 8% above target with strong Q4 performance. December shows exceptional results, likely due to year-end buying decisions. Consider replicating Q4 strategies in Q1 to maintain momentum.',
      dealSize:
        '67% of deals are under $50K, but deals over $100K contribute 45% of total revenue. Prioritize enterprise sales training and account-based marketing to increase average deal size.',
      winRate:
        'Win rates improve significantly in later stages, reaching 85% at negotiation. Early-stage qualification improvements could increase overall pipeline efficiency by 23%.',
      salesCycle:
        'Enterprise deals take 90 days on average, 45% longer than medium deals. Implementing structured enterprise sales processes could reduce cycle time and improve forecasting accuracy.',
      teamPerformance:
        'Sarah Johnson leads in both volume and revenue. Her methods should be documented and shared. Mike Davis shows potential for improvement with targeted coaching on closing techniques.',
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
      revenueInsights: [
        'Q4 revenue is 8% above target, with December showing exceptional 15% growth',
        'Average deal size has increased 12% compared to last quarter',
        'Enterprise deals (>$100K) contribute 45% of revenue despite being 12% of volume',
        'Win rate has improved from 12% to 15% year-over-year',
      ],
      pipelineOptimization: [
        '25% of deals are lost between Qualification and Proposal - implement better qualification criteria',
        'Sales cycle for enterprise deals can be reduced by 15 days with structured processes',
        'Team performance varies by 40% - knowledge sharing and coaching needed',
        'Pipeline velocity could increase 23% with improved early-stage qualification',
      ],
      strategicRecommendations:
        "Focus on enterprise sales development and implement account-based marketing strategies. The data shows clear opportunities to increase average deal size and reduce sales cycles. Consider investing in advanced sales training for the team, particularly around enterprise selling methodologies. December's exceptional performance indicates strong market demand - capitalize on this momentum in Q1 planning.",
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
.deal-report-view {
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
