<template>
  <div class="logout-view">
    <div class="logout-container">
      <div class="logout-content">
        <!-- Logo -->
        <div class="logout-logo">
          <svg
            width="60"
            height="60"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="40" height="40" rx="8" fill="#4F46E5" />
            <path d="M20 8L28 16L20 24L12 16L20 8Z" fill="white" />
          </svg>
          <span class="logo-text">CRM Pro</span>
        </div>

        <!-- Logout Message -->
        <div class="logout-message">
          <h1>{{ logoutMessage }}</h1>
          <p v-if="!isLoggingOut">You have been successfully signed out</p>
          <p v-else>Signing you out...</p>
        </div>

        <!-- Loading Spinner -->
        <div v-if="isLoggingOut" class="logout-spinner">
          <el-loading />
        </div>

        <!-- Actions -->
        <div v-if="!isLoggingOut" class="logout-actions">
          <el-button type="primary" @click="goToLogin">
            <span class="material-symbols-outlined">login</span>
            Sign In Again
          </el-button>
          <el-button @click="goToHome">
            <span class="material-symbols-outlined">home</span>
            Go to Homepage
          </el-button>
        </div>

        <!-- Security Notice -->
        <div v-if="!isLoggingOut" class="security-notice">
          <div class="notice-content">
            <span class="material-symbols-outlined">security</span>
            <div class="notice-text">
              <p><strong>For your security</strong></p>
              <p>Please close this browser window if you're on a shared computer</p>
            </div>
          </div>
        </div>

        <!-- Session Info -->
        <div v-if="!isLoggingOut && sessionInfo" class="session-info">
          <!--          <h3>Session Summary</h3>-->
          <div class="session-details">
            <div class="session-item">
              <span class="label">Login Time:</span>
              <span class="value">{{ formatTime(sessionInfo.loginTime) }}</span>
            </div>
            <div class="session-item">
              <span class="label">Session Duration:</span>
              <span class="value">{{ sessionInfo.duration }}</span>
            </div>
            <div class="session-item">
              <span class="label">Last Activity:</span>
              <span class="value">{{ formatTime(sessionInfo.lastActivity) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ElLoading } from 'element-plus'

const router = useRouter()

// Reactive data
const isLoggingOut = ref(true)
const logoutMessage = ref('Signing out...')

// Session information
const sessionInfo = ref({
  loginTime: '2025-07-06T09:00:00Z',
  lastActivity: '2025-07-06T15:30:00Z',
  duration: '6 hours 30 minutes',
})

// Perform a logout process
const performLogout = async () => {
  try {
    // Simulate logout API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // Clear local storage/session storage
    localStorage.clear()
    sessionStorage.clear()
    ElMessage.success('Successfully logged out')
  } catch (error) {
    console.error('Logout error:', error)
    ElMessage.warning('Logout completed with some issues')
  } finally {
    // Update state
    isLoggingOut.value = false
    logoutMessage.value = 'Goodbye!'
  }
}

// Navigation methods
const goToLogin = () => {
  router.push('/login')
}

const goToHome = () => {
  router.push('/home')
}

// Format time helper
const formatTime = (timeString: string) => {
  return new Date(timeString).toLocaleString()
}

// Lifecycle
onMounted(() => {
  performLogout()
})
</script>

<style scoped>
.logout-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.logout-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 500px;
  width: 100%;
}

.logout-content {
  padding: 40px;
  text-align: center;
}

.logout-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
}

.logout-icon {
  margin-bottom: 24px;
}

.logout-icon .material-symbols-outlined {
  font-size: 64px;
  color: #6b7280;
}

.logout-message {
  margin-bottom: 32px;
}

.logout-message h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
}

.logout-message p {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.logout-spinner {
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
}

.logout-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.logout-actions .el-button {
  width: 100%;
  height: 40px;
  margin: 0;
}

.security-notice {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 24px;
}

.notice-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
}

.notice-content .material-symbols-outlined {
  color: #f59e0b;
  font-size: 20px;
  margin-top: 2px;
}

.notice-text p {
  margin: 0;
  font-size: 14px;
  color: #92400e;
  line-height: 1.4;
}

.notice-text p:first-child {
  margin-bottom: 4px;
}

.session-info {
  background: #f9fafb;
  border-radius: 8px;
  padding: 20px;
  text-align: left;
}

.session-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  text-align: center;
}

.session-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.session-item .label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.session-item .value {
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
}

@media (max-width: 480px) {
  .logout-content {
    padding: 24px;
  }

  .logout-message h1 {
    font-size: 24px;
  }

  .logout-actions {
    gap: 8px;
  }

  .logout-actions .el-button {
    height: 44px;
    font-size: 15px;
  }
}
</style>
