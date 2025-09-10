<template>
  <div class="contact-report-view">
    <!-- Header Section -->
    <div class="report-header">
      <div class="header-left">
        <h1 class="report-title">Contact Analytics Dashboard</h1>
        <p class="report-subtitle">AI-powered insights into your contact performance and trends</p>
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
            <el-select v-model="selectedSource" placeholder="All Sources" clearable @change="updateCharts">
              <el-option label="All Sources" value="" />
              <el-option v-for="source in contactSources" :key="source.id" :label="source.name" :value="source.id" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="selectedStatus" placeholder="All Statuses" clearable @change="updateCharts">
              <el-option label="All Statuses" value="" />
              <el-option v-for="status in contactStatuses" :key="status.id" :label="status.name" :value="status.id" />
            </el-select>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- Charts Grid -->
    <div class="charts-grid">
      <!-- Contact Growth Trend -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Contact Growth Trend</h3>
            <el-button link @click="generateAIInsight('growth')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <div class="chart-container">
          <apexchart type="area" height="300" :options="growthChartOptions" :series="growthChartSeries"></apexchart>
        </div>
        <div v-if="aiInsights.growth" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.growth }}</p>
        </div>
      </el-card>

      <!-- Contact Sources Distribution -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Contact Sources Distribution</h3>
            <el-button link @click="generateAIInsight('sources')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <div class="chart-container">
          <apexchart type="pie" height="300" :options="sourcesChartOptions" :series="sourcesChartSeries"></apexchart>
        </div>
        <div v-if="aiInsights.sources" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.sources }}</p>
        </div>
      </el-card>

      <!-- Contact Status Analysis -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Contact Status Analysis</h3>
            <el-button link @click="generateAIInsight('status')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <div class="chart-container">
          <apexchart type="bar" height="300" :options="statusChartOptions" :series="statusChartSeries"></apexchart>
        </div>
        <div v-if="aiInsights.status" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.status }}</p>
        </div>
      </el-card>

      <!-- Contact Value Distribution -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Contact Value Distribution</h3>
            <el-button link @click="generateAIInsight('value')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <div class="chart-container">
          <apexchart type="donut" height="300" :options="valueChartOptions" :series="valueChartSeries"></apexchart>
        </div>
        <div v-if="aiInsights.value" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.value }}</p>
        </div>
      </el-card>

      <!-- Geographic Distribution -->
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Geographic Distribution</h3>
            <el-button link @click="generateAIInsight('geographic')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <div class="chart-container">
          <apexchart type="bar" height="300" :options="geoChartOptions" :series="geoChartSeries"></apexchart>
        </div>
        <div v-if="aiInsights.geographic" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.geographic }}</p>
        </div>
      </el-card>

      <!-- Contact Activity Heatmap -->
      <el-card class="chart-card chart-card-wide" shadow="hover">
        <template #header>
          <div class="chart-header">
            <h3>Contact Activity Heatmap</h3>
            <el-button link @click="generateAIInsight('activity')">
              <span class="material-symbols-outlined">psychology</span>
              AI Insights
            </el-button>
          </div>
        </template>
        <div class="chart-container">
          <apexchart type="heatmap" height="300" :options="heatmapChartOptions" :series="heatmapChartSeries"></apexchart>
        </div>
        <div v-if="aiInsights.activity" class="ai-insight">
          <div class="ai-insight-header">
            <span class="material-symbols-outlined">psychology</span>
            <span>AI Analysis</span>
          </div>
          <p>{{ aiInsights.activity }}</p>
        </div>
      </el-card>
    </div>

    <!-- AI Summary Report -->
    <el-card class="summary-card" shadow="hover" v-if="aiSummary">
      <template #header>
        <div class="summary-header">
          <span class="material-symbols-outlined">psychology</span>
          <h3>AI-Generated Executive Summary</h3>
          <el-button type="primary" @click="generateAISummary" :loading="generatingSummary">
            Generate New Summary
          </el-button>
        </div>
      </template>
      <div class="ai-summary-content">
        <div class="summary-section">
          <h4>Key Findings</h4>
          <ul>
            <li v-for="finding in aiSummary.keyFindings" :key="finding">{{ finding }}</li>
          </ul>
        </div>
        <div class="summary-section">
          <h4>Recommendations</h4>
          <ul>
            <li v-for="recommendation in aiSummary.recommendations" :key="recommendation">{{ recommendation }}</li>
          </ul>
        </div>
        <div class="summary-section">
          <h4>Trends & Patterns</h4>
          <p>{{ aiSummary.trends }}</p>
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
const selectedSource = ref('')
const selectedStatus = ref('')

// Data
const contactSources = ref([
  { id: 1, name: 'Website' },
  { id: 2, name: 'Social Media' },
  { id: 3, name: 'Referral' },
  { id: 4, name: 'Email Campaign' },
])

const contactStatuses = ref([
  { id: 1, name: 'New' },
  { id: 2, name: 'Qualified' },
  { id: 3, name: 'Contacted' },
  { id: 4, name: 'Converted' },
])

// AI Insights
const aiInsights = ref({
  growth: '',
  sources: '',
  status: '',
  value: '',
  geographic: '',
  activity: ''
})

const aiSummary = ref<{
  keyFindings: string[]
  recommendations: string[]
  trends: string
} | null>(null)

// Chart configurations
const growthChartOptions = computed(() => ({
  chart: {
    type: 'area',
    height: 300,
    toolbar: {
      show: false
    }
  },
  title: {
    text: 'Monthly Contact Growth',
    align: 'center'
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  colors: ['#409EFF'],
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

const growthChartSeries = computed(() => ([
  {
    name: 'Contacts',
    data: [120, 200, 150, 280, 180, 320, 250, 400, 300, 450, 380, 520]
  }
]))

const sourcesChartOptions = computed(() => ({
  chart: {
    type: 'pie',
    height: 300
  },
  title: {
    text: 'Contact Sources',
    align: 'center'
  },
  labels: ['Website', 'Social Media', 'Referral', 'Email Campaign'],
  colors: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C']
}))

const sourcesChartSeries = computed(() => [335, 310, 234, 135])

const statusChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 300,
    toolbar: {
      show: false
    }
  },
  title: {
    text: 'Contact Status Distribution',
    align: 'center'
  },
  xaxis: {
    categories: ['New', 'Qualified', 'Contacted', 'Converted']
  },
  colors: ['#188df0'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.5,
      gradientToColors: ['#83bff6'],
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100]
    }
  }
}))

const statusChartSeries = computed(() => ([
  {
    name: 'Contacts',
    data: [220, 182, 191, 134]
  }
]))

const valueChartOptions = computed(() => ({
  chart: {
    type: 'donut',
    height: 300
  },
  title: {
    text: 'Contact Value Ranges',
    align: 'center'
  },
  labels: ['$0-1K', '$1K-5K', '$5K-10K', '$10K+'],
  colors: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C']
}))

const valueChartSeries = computed(() => [48, 32, 28, 12])

const geoChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 300,
    toolbar: {
      show: false
    }
  },
  title: {
    text: 'Geographic Distribution',
    align: 'center'
  },
  xaxis: {
    categories: ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania']
  },
  colors: ['#67C23A']
}))

const geoChartSeries = computed(() => ([
  {
    name: 'Contacts',
    data: [450, 320, 280, 120, 80, 60]
  }
]))

const heatmapChartOptions = computed(() => ({
  chart: {
    type: 'heatmap',
    height: 300,
    toolbar: {
      show: false
    }
  },
  title: {
    text: 'Contact Activity by Hour & Day',
    align: 'center'
  },
  xaxis: {
    type: 'category',
    categories: ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a',
                 '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p']
  },
  plotOptions: {
    heatmap: {
      shadeIntensity: 0.5,
      colorScale: {
        ranges: [{
          from: 0,
          to: 30,
          name: 'Low',
          color: '#FFE4E1'
        }, {
          from: 31,
          to: 60,
          name: 'Medium',
          color: '#FF9999'
        }, {
          from: 61,
          to: 100,
          name: 'High',
          color: '#FF0000'
        }]
      }
    }
  }
}))

const heatmapChartSeries = computed(() => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days.map(day => ({
    name: day,
    data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))
  }))
})

// Methods
const refreshData = async () => {
  loading.value = true
  try {
    // Simulate API call
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
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500))

    const insights = {
      growth: "Based on the trend analysis, contact acquisition has increased by 34% over the last quarter. The growth pattern shows strong seasonal correlation with marketing campaigns, particularly in March and September.",
      sources: "Website leads generate the highest conversion rate at 23%, while social media provides the largest volume. Consider increasing investment in website optimization and LinkedIn advertising.",
      status: "67% of new contacts remain unqualified after 30 days. Implementing automated qualification workflows could improve efficiency by an estimated 45%.",
      value: "High-value contacts ($10K+) represent only 12% of the database but contribute to 58% of total revenue. Focus on identifying and nurturing similar profiles.",
      geographic: "North American contacts show the highest engagement rates. European contacts have 28% longer sales cycles but higher average deal values.",
      activity: "Peak contact activity occurs between 2-4 PM on Tuesdays and Wednesdays. Scheduling outreach during these windows could improve response rates by 23%."
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
    // Simulate AI summary generation
    await new Promise(resolve => setTimeout(resolve, 2000))

    aiSummary.value = {
      keyFindings: [
        "Contact acquisition rate has increased 34% quarter-over-quarter",
        "Website leads show highest conversion rate at 23%",
        "67% of contacts remain unqualified after 30 days",
        "High-value contacts ($10K+) contribute 58% of total revenue despite being only 12% of database"
      ],
      recommendations: [
        "Implement automated lead qualification workflows to improve efficiency",
        "Increase investment in website optimization and LinkedIn advertising",
        "Focus on identifying and nurturing high-value contact profiles",
        "Schedule outreach activities between 2-4 PM on Tuesday/Wednesday for optimal response rates"
      ],
      trends: "The data reveals strong seasonal patterns in contact acquisition, with Q3 showing the highest growth. Geographic analysis indicates untapped potential in European markets, while activity patterns suggest optimal engagement windows for outreach campaigns."
    }

    ElMessage.success('AI summary generated successfully')
  } catch (error) {
    ElMessage.error('Failed to generate AI summary')
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
.contact-report-view {
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
  min-height: 300px;
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
