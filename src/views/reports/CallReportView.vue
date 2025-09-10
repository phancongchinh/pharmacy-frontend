<template>
  <div class="call-report-view">
    <!-- Header Section -->
    <div class="report-header">
      <div class="header-left">
        <h1 class="report-title">Call Analytics Dashboard</h1>
        <p class="report-subtitle">AI-powered insights into your call performance and communication effectiveness</p>
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
            <el-select v-model="selectedType" placeholder="All Call Types" clearable @change="updateCharts">
              <el-option label="All Call Types" value="" />
              <el-option v-for="type in callTypes" :key="type.id" :label="type.name" :value="type.id" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="selectedAgent" placeholder="All Agents" clearable @change="updateCharts">
              <el-option label="All Agents" value="" />
              <el-option v-for="agent in callAgents" :key="agent.id" :label="agent.name" :value="agent.id" />
            </el-select>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- Charts Grid -->
    <div class="charts-grid">
      <!-- Call Volume Trends -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Call Volume Trends</h3>
            <el-button link @click="generateAIInsight('volume')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <apexchart
          type="area"
          height="300"
          :options="volumeChartOptions"
          :series="volumeChartSeries"
        />
        <div v-if="aiInsights.volume" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.volume }}</p>
        </div>
      </el-card>

      <!-- Call Duration Analysis -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Call Duration Distribution</h3>
            <el-button link @click="generateAIInsight('duration')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <apexchart
          type="pie"
          height="300"
          :options="durationChartOptions"
          :series="durationChartSeries"
        />
        <div v-if="aiInsights.duration" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.duration }}</p>
        </div>
      </el-card>

      <!-- Success Rate by Call Type -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Success Rate by Type</h3>
            <el-button link @click="generateAIInsight('successRate')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <apexchart
          type="bar"
          height="300"
          :options="successRateChartOptions"
          :series="successRateChartSeries"
        />
        <div v-if="aiInsights.successRate" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.successRate }}</p>
        </div>
      </el-card>

      <!-- Peak Hours Analysis -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Peak Calling Hours</h3>
            <el-button link @click="generateAIInsight('peakHours')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <apexchart
          type="area"
          height="300"
          :options="peakHoursChartOptions"
          :series="peakHoursChartSeries"
        />
        <div v-if="aiInsights.peakHours" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.peakHours }}</p>
        </div>
      </el-card>

      <!-- Agent Performance -->
      <el-card class="chart-card chart-card-wide" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Agent Performance Matrix</h3>
            <el-button link @click="generateAIInsight('agentPerformance')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <apexchart
          type="line"
          height="300"
          :options="agentPerformanceChartOptions"
          :series="agentPerformanceChartSeries"
        />
        <div v-if="aiInsights.agentPerformance" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.agentPerformance }}</p>
        </div>
      </el-card>

      <!-- Call Outcome Analysis -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Call Outcomes</h3>
            <el-button link @click="generateAIInsight('outcomes')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <apexchart
          type="donut"
          height="300"
          :options="outcomesChartOptions"
          :series="outcomesChartSeries"
        />
        <div v-if="aiInsights.outcomes" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.outcomes }}</p>
        </div>
      </el-card>
    </div>

    <!-- AI Summary Report -->
    <el-card class="summary-card" shadow="hover" v-if="aiSummary">
      <template #header>
        <div class="summary-header">
          <span class="material-symbols-outlined">psychology</span>
          <h3>AI-Generated Call Performance Intelligence</h3>
          <el-button type="primary" @click="generateAISummary" :loading="generatingSummary">
            Generate New Analysis
          </el-button>
        </div>
      </template>
      <div class="ai-summary-content">
        <div class="summary-section">
          <h4>Performance Highlights</h4>
          <ul>
            <li v-for="highlight in aiSummary.performanceHighlights" :key="highlight">{{ highlight }}</li>
          </ul>
        </div>
        <div class="summary-section">
          <h4>Efficiency Opportunities</h4>
          <ul>
            <li v-for="opportunity in aiSummary.efficiencyOpportunities" :key="opportunity">{{ opportunity }}</li>
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
const selectedAgent = ref('')

// Data
const callTypes = ref([
  { id: 1, name: 'Sales Call' },
  { id: 2, name: 'Follow-up' },
  { id: 3, name: 'Cold Call' },
  { id: 4, name: 'Support Call' },
])

const callAgents = ref([
  { id: 1, name: 'Alice Johnson' },
  { id: 2, name: 'Bob Smith' },
  { id: 3, name: 'Carol Davis' },
  { id: 4, name: 'David Wilson' },
])

// AI Insights
const aiInsights = ref({
  volume: '',
  duration: '',
  successRate: '',
  peakHours: '',
  agentPerformance: '',
  outcomes: ''
})

const aiSummary = ref<{
  performanceHighlights: string[]
  efficiencyOpportunities: string[]
  strategicRecommendations: string
} | null>(null)

// Chart configurations
const volumeChartOptions = computed(() => ({
  chart: {
    type: 'area',
    height: 300,
    toolbar: { show: false }
  },
  title: {
    text: 'Monthly Call Volume',
    align: 'center'
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  colors: ['#409EFF', '#67C23A'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.3,
      opacityTo: 0.1,
      stops: [0, 100]
    }
  },
  stroke: {
    curve: 'smooth'
  }
}))

const volumeChartSeries = computed(() => ([
  {
    name: 'Outbound',
    data: [450, 520, 480, 610, 580, 650, 620, 720, 680, 750, 700, 820]
  },
  {
    name: 'Inbound',
    data: [280, 320, 300, 380, 360, 420, 400, 460, 440, 480, 450, 520]
  }
]))

const durationChartOptions = computed(() => ({
  chart: {
    type: 'pie',
    height: 300
  },
  title: {
    text: 'Call Duration Distribution',
    align: 'center'
  },
  labels: ['0-5 minutes', '5-15 minutes', '15-30 minutes', '30+ minutes'],
  colors: ['#F56C6C', '#E6A23C', '#67C23A', '#409EFF']
}))

const durationChartSeries = computed(() => [145, 234, 189, 89])

const successRateChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 300,
    toolbar: { show: false }
  },
  title: {
    text: 'Success Rate by Call Type',
    align: 'center'
  },
  xaxis: {
    categories: ['Sales Call', 'Follow-up', 'Cold Call', 'Support Call']
  },
  yaxis: {
    labels: {
      formatter: (val) => `${val}%`
    }
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
      stops: [0, 100]
    }
  }
}))

const successRateChartSeries = computed(() => ([
  {
    name: 'Success Rate',
    data: [68, 82, 35, 91]
  }
]))

const peakHoursChartOptions = computed(() => ({
  chart: {
    type: 'area',
    height: 300,
    toolbar: { show: false }
  },
  title: {
    text: 'Call Volume by Hour',
    align: 'center'
  },
  xaxis: {
    categories: ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM']
  },
  colors: ['#E6A23C'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.3,
      opacityTo: 0.1,
      stops: [0, 100]
    }
  },
  stroke: {
    curve: 'smooth'
  }
}))

const peakHoursChartSeries = computed(() => ([
  {
    name: 'Calls',
    data: [45, 78, 92, 105, 89, 67, 112, 134, 98, 76, 43]
  }
]))

const agentPerformanceChartOptions = computed(() => ({
  chart: {
    type: 'line',
    height: 300,
    toolbar: { show: false }
  },
  title: {
    text: 'Agent Performance Comparison',
    align: 'center'
  },
  xaxis: {
    categories: ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson']
  },
  yaxis: [
    {
      title: { text: 'Calls Made' }
    },
    {
      opposite: true,
      title: { text: 'Success Rate (%)' }
    }
  ],
  colors: ['#409EFF', '#67C23A', '#E6A23C']
}))

const agentPerformanceChartSeries = computed(() => ([
  {
    name: 'Calls Made',
    type: 'column',
    data: [156, 142, 178, 134]
  },
  {
    name: 'Success Rate',
    type: 'line',
    data: [72, 68, 78, 65]
  },
  {
    name: 'Avg Duration (min)',
    type: 'column',
    data: [12.5, 15.2, 11.8, 14.7]
  }
]))

const outcomesChartOptions = computed(() => ({
  chart: {
    type: 'donut',
    height: 300
  },
  title: {
    text: 'Call Outcomes',
    align: 'center'
  },
  labels: ['Successful', 'No Answer', 'Voicemail', 'Busy', 'Wrong Number'],
  colors: ['#67C23A', '#F56C6C', '#E6A23C', '#909399', '#409EFF']
}))

const outcomesChartSeries = computed(() => [320, 180, 120, 90, 45])

// Methods
const refreshData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
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
    await new Promise(resolve => setTimeout(resolve, 1500))

    const insights = {
      volume: "Call volume increased 18% in Q4 with outbound calls driving growth. December peak of 820 calls indicates strong end-of-year push. Inbound calls remain steady, suggesting consistent market demand.",
      duration: "Optimal call duration is 15-30 minutes (28% of calls) showing highest conversion rates. Calls under 5 minutes (22%) often indicate early disconnections - focus on improving opening techniques.",
      successRate: "Support calls achieve 91% success rate due to engaged audience. Cold calls at 35% need improvement through better qualification. Sales calls show solid 68% with room for growth.",
      peakHours: "Peak performance window: 2-4 PM with 134 calls at 3 PM. Morning slots (9-11 AM) show consistent high volume. Avoid calling after 5 PM due to declining answer rates.",
      agentPerformance: "Carol Davis leads with 178 calls and 78% success rate. Alice maintains good volume (156) with 72% success. Focus coaching on Bob Smith and David Wilson to improve conversion rates.",
      outcomes: "42% success rate is strong for industry standards. 'No Answer' (24%) represents largest opportunity - implement callback strategies. Voicemail follow-up systems needed for 16% of calls."
    }

    aiInsights.value[type as keyof typeof aiInsights.value] = insights[type as keyof typeof insights]
    ElMessage.success('AI insights generated successfully')
  } catch (error) {
    ElMessage.error('Failed to generate AI insights')
  }
}

const generateAISummary = async () => {
  generatingSummary.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))

    aiSummary.value = {
      performanceHighlights: [
        "Q4 call volume increased 18% with 820 peak calls in December",
        "Overall success rate of 42% exceeds industry average of 35%",
        "Peak performance window identified: 2-4 PM daily",
        "Carol Davis achieves top performance with 78% success rate"
      ],
      efficiencyOpportunities: [
        "24% 'No Answer' rate - implement systematic callback strategies",
        "Cold call success rate at 35% - needs qualification improvement",
        "22% of calls under 5 minutes - enhance opening script training",
        "Voicemail follow-up systems needed for 16% of call volume"
      ],
      strategicRecommendations: "Focus on scaling high-performing practices from Carol Davis across the team. Implement automated callback systems to address the 24% no-answer rate. The strong Q4 momentum and above-average success rates indicate readiness for 20-25% volume expansion. Prioritize afternoon calling windows and develop specialized training for cold call conversion improvement."
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
.call-report-view {
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
