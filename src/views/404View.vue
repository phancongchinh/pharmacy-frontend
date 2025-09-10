<template>
  <div class="error-view">
    <div class="error-container">
      <div class="error-content">
        <!-- Error Code -->
        <div class="error-code">
          <span class="code-number">404</span>
          <span class="code-text">NOT FOUND</span>
        </div>

        <!-- Error Icon -->
        <div class="error-icon">
          <span class="material-symbols-outlined">search_off</span>
        </div>

        <!-- Error Message -->
        <div class="error-message">
          <h1>Page Not Found</h1>
          <p>Sorry, the page you are looking for doesn't exist or has been moved.</p>
          <p class="error-url"><strong>Requested URL:</strong> {{ currentPath }}</p>
        </div>

        <!-- Search Suggestions -->
        <div class="search-section">
          <h3>Try searching for what you need:</h3>
          <el-input
            v-model="searchQuery"
            placeholder="Search pages, features, or help..."
            size="large"
            @keyup.enter="performSearch"
          >
            <template #prefix>
              <span class="material-symbols-outlined">search</span>
            </template>
            <template #suffix>
              <el-button link @click="performSearch">
                <span class="material-symbols-outlined">arrow_forward</span>
              </el-button>
            </template>
          </el-input>
        </div>

        <!-- Quick Links -->
        <div class="quick-links">
          <h3>Or try these popular pages:</h3>
          <div class="links-grid">
            <div class="link-card" @click="navigateTo('/dashboard')">
              <span class="material-symbols-outlined">dashboard</span>
              <span class="link-title">Dashboard</span>
              <span class="link-desc">Your main workplace</span>
            </div>
            <div class="link-card" @click="navigateTo('/contacts')">
              <span class="material-symbols-outlined">contacts</span>
              <span class="link-title">Contacts</span>
              <span class="link-desc">Manage customers</span>
            </div>
            <div class="link-card" @click="navigateTo('/deals')">
              <span class="material-symbols-outlined">handshake</span>
              <span class="link-title">Deals</span>
              <span class="link-desc">Track opportunities</span>
            </div>
            <div class="link-card" @click="navigateTo('/appointments')">
              <span class="material-symbols-outlined">calendar_month</span>
              <span class="link-title">Appointments</span>
              <span class="link-desc">Schedule meetings</span>
            </div>
            <div class="link-card" @click="navigateTo('/emails')">
              <span class="material-symbols-outlined">mail</span>
              <span class="link-title">Emails</span>
              <span class="link-desc">Email campaigns</span>
            </div>
            <div class="link-card" @click="navigateTo('/conversations')">
              <span class="material-symbols-outlined">chat</span>
              <span class="link-title">Conversations</span>
              <span class="link-desc">Customer chats</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="error-actions">
          <el-button type="primary" size="large" @click="goBack">
            <span class="material-symbols-outlined">arrow_back</span>
            Go Back
          </el-button>
          <el-button size="large" @click="goHome">
            <span class="material-symbols-outlined">home</span>
            Go Home
          </el-button>
          <el-button size="large" @click="reportIssue">
            <span class="material-symbols-outlined">bug_report</span>
            Report Issue
          </el-button>
        </div>

        <!-- Help Section -->
        <div class="help-section">
          <div class="help-card">
            <span class="material-symbols-outlined">help_center</span>
            <div class="help-content">
              <h4>Still can't find what you're looking for?</h4>
              <p>Check our help documentation or contact support for assistance.</p>
              <div class="help-links">
                <el-button link type="primary" @click="openHelp"> View Help Center </el-button>
                <el-button link type="primary" @click="contactSupport"> Contact Support </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recently Visited -->
        <div v-if="recentPages.length > 0" class="recent-pages">
          <h4>Recently Visited Pages:</h4>
          <div class="recent-list">
            <div
              v-for="page in recentPages"
              :key="page.path"
              class="recent-item"
              @click="navigateTo(page.path)"
            >
              <span class="material-symbols-outlined">{{ page.icon }}</span>
              <div class="recent-info">
                <span class="recent-title">{{ page.title }}</span>
                <span class="recent-time">{{ formatTime(page.visitedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

// Reactive data
const searchQuery = ref('')

// Mock recent pages data
const recentPages = ref([
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: 'dashboard',
    visitedAt: '2025-07-06T14:30:00Z',
  },
  {
    path: '/contacts',
    title: 'Contacts',
    icon: 'contacts',
    visitedAt: '2025-07-06T13:45:00Z',
  },
  {
    path: '/deals',
    title: 'Deals',
    icon: 'handshake',
    visitedAt: '2025-07-06T12:20:00Z',
  },
])

// Computed properties
const currentPath = computed(() => route.fullPath)

// Methods
const navigateTo = (path: string) => {
  router.push(path)
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/dashboard')
  }
}

const goHome = () => {
  router.push('/dashboard')
}

const performSearch = () => {
  if (!searchQuery.value.trim()) {
    ElMessage.warning('Please enter a search term')
    return
  }

  ElMessage.info(`Searching for: ${searchQuery.value}`)
  // In real app, implement search functionality
  // router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
}

const reportIssue = async () => {
  try {
    await ElMessageBox.prompt('Please describe the issue you encountered:', 'Report Issue', {
      confirmButtonText: 'Send Report',
      cancelButtonText: 'Cancel',
      inputType: 'textarea',
      inputPlaceholder: 'Describe the problem...',
    })

    ElMessage.success('Issue reported successfully. Thank you for your feedback!')
    // In real app, send issue report to support system
  } catch {
    // User cancelled
  }
}

const openHelp = () => {
  ElMessage.info('Opening help center...')
  // In real app, open help center
  window.open('https://help.company.com', '_blank')
}

const contactSupport = () => {
  ElMessage.info('Opening support chat...')
  // In real app, open support chat or email
  window.open('mailto:support@company.com?subject=404 Error - Page Not Found', '_blank')
}

const formatTime = (timeString: string) => {
  const date = new Date(timeString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    return diffMinutes < 1 ? 'just now' : `${diffMinutes}m ago`
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`
  }
  return date.toLocaleDateString()
}

// Track page visit (in real app, this would be in a service)
const trackPageVisit = () => {
  // In real app, track 404 errors for analytics
  console.log('404 Error tracked:', currentPath.value)
}

onMounted(() => {
  trackPageVisit()
})
</script>

<style scoped>
.error-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.error-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.error-content {
  padding: 40px;
  text-align: center;
}

.error-code {
  margin-bottom: 24px;
}

.code-number {
  display: block;
  font-size: 72px;
  font-weight: 900;
  color: #3b82f6;
  line-height: 1;
  margin-bottom: 8px;
}

.code-text {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 2px;
}

.error-icon {
  margin-bottom: 24px;
}

.error-icon .material-symbols-outlined {
  font-size: 64px;
  color: #6b7280;
}

.error-message {
  margin-bottom: 32px;
}

.error-message h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 12px 0;
}

.error-message p {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.error-url {
  background: #f3f4f6;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: #374151 !important;
  word-break: break-all;
}

.search-section {
  margin-bottom: 32px;
}

.search-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.quick-links {
  margin-bottom: 32px;
}

.quick-links h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.link-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.link-card:hover {
  background: #eff6ff;
  border-color: #3b82f6;
  transform: translateY(-2px);
}

.link-card .material-symbols-outlined {
  font-size: 24px;
  color: #3b82f6;
  margin-bottom: 8px;
}

.link-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.link-desc {
  display: block;
  font-size: 12px;
  color: #6b7280;
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.error-actions .el-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
}

.help-section {
  margin-bottom: 24px;
}

.help-card {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  text-align: left;
}

.help-card .material-symbols-outlined {
  color: #0284c7;
  font-size: 24px;
  margin-top: 2px;
}

.help-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #0c4a6e;
  margin: 0 0 8px 0;
}

.help-content p {
  font-size: 14px;
  color: #075985;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.help-links {
  display: flex;
  gap: 16px;
}

.recent-pages {
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  text-align: left;
}

.recent-pages h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.recent-item:hover {
  background: #e5e7eb;
}

.recent-item .material-symbols-outlined {
  color: #6b7280;
  font-size: 20px;
}

.recent-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.recent-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.recent-time {
  font-size: 12px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .error-content {
    padding: 24px;
  }

  .code-number {
    font-size: 56px;
  }

  .error-message h1 {
    font-size: 24px;
  }

  .links-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .error-actions {
    gap: 8px;
  }

  .error-actions .el-button {
    height: 44px;
    font-size: 15px;
  }

  .help-card {
    flex-direction: column;
    gap: 12px;
  }

  .help-links {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
