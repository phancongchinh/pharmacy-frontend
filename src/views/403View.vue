<template>
  <div class="error-view">
    <div class="error-container">
      <div class="error-content">
        <!-- Error Code -->
        <div class="error-code">
          <span class="code-number">403</span>
          <span class="code-text">FORBIDDEN</span>
        </div>

        <!-- Error Icon -->
        <div class="error-icon">
          <span class="material-symbols-outlined">block</span>
        </div>

        <!-- Error Message -->
        <div class="error-message">
          <h1>Access Denied</h1>
          <p>Sorry, you don't have permission to access this resource.</p>
          <p class="error-details">{{ errorReason }}</p>
        </div>

        <!-- Possible Reasons -->
        <div class="error-reasons">
          <h3>This might be because:</h3>
          <ul>
            <li>You don't have the required permissions for this action</li>
            <li>Your account role doesn't allow access to this feature</li>
            <li>Your session has expired and needs to be refreshed</li>
            <li>This resource is restricted to certain user groups</li>
          </ul>
        </div>

        <!-- Actions -->
        <div class="error-actions">
          <el-button type="primary" size="large" @click="goBack">
            <span class="material-symbols-outlined">arrow_back</span>
            Go Back
          </el-button>
          <el-button size="large" @click="goToDashboard">
            <span class="material-symbols-outlined">dashboard</span>
            Go to Dashboard
          </el-button>
          <el-button size="large" @click="contactSupport">
            <span class="material-symbols-outlined">support_agent</span>
            Contact Support
          </el-button>
        </div>

        <!-- Additional Help -->
        <div class="additional-help">
          <div class="help-card">
            <span class="material-symbols-outlined">help</span>
            <div class="help-content">
              <h4>Need Help?</h4>
              <p>
                If you believe this is an error, please contact your administrator or our support
                team.
              </p>
              <el-button link type="primary" @click="requestAccess"> Request Access</el-button>
            </div>
          </div>
        </div>

        <!-- User Info -->
        <div class="user-info">
          <p><strong>Current User:</strong> {{ currentUser.name }} ({{ currentUser.role }})</p>
          <p><strong>Organization:</strong> {{ currentUser.organization }}</p>
          <p><strong>Time:</strong> {{ formatCurrentTime() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

// Current user info (would come from auth store in real app)
const currentUser = ref({
  name: 'John Doe',
  role: 'Sales Representative',
  organization: 'TechCorp Inc.',
})

// Error reason based on route or query params
const errorReason = ref('')

// Methods
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/dashboard')
  }
}

const goToDashboard = () => {
  router.push('/dashboard')
}

const contactSupport = () => {
  ElMessage.info('Redirecting to support page...')
  // In real app, open support chat or email
  window.open('mailto:support@company.com?subject=Access Denied - 403 Error', '_blank')
}

const requestAccess = async () => {
  try {
    await ElMessageBox.confirm(
      'Would you like to send an access request to your administrator?',
      'Request Access',
      {
        confirmButtonText: 'Send Request',
        cancelButtonText: 'Cancel',
        type: 'info',
      },
    )

    ElMessage.success('Access request sent to administrator')
    // In real app, send API request to admin
  } catch {
    // User cancelled
  }
}

const formatCurrentTime = () => {
  return new Date().toLocaleString()
}

const getErrorReason = () => {
  const reason = route.query.reason as string
  switch (reason) {
    case 'insufficient_permissions':
      return 'Your current role does not have sufficient permissions for this action.'
    case 'expired_session':
      return 'Your session has expired. Please log in again.'
    case 'organization_restriction':
      return 'This resource is not available for your organization.'
    case 'feature_disabled':
      return 'This feature is currently disabled for your account.'
    default:
      return 'You are not authorized to access this resource.'
  }
}

onMounted(() => {
  errorReason.value = getErrorReason()
})
</script>

<style scoped>
.error-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.error-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 80%;
  width: 100%;
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
  color: #ef4444;
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
  color: #ef4444;
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

.error-details {
  font-weight: 500;
  color: #ef4444 !important;
}

.error-reasons {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
  text-align: left;
}

.error-reasons h3 {
  font-size: 16px;
  font-weight: 600;
  color: #dc2626;
  margin: 0 0 12px 0;
}

.error-reasons ul {
  margin: 0;
  padding-left: 20px;
}

.error-reasons li {
  font-size: 14px;
  color: #991b1b;
  margin-bottom: 6px;
  line-height: 1.4;
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

.additional-help {
  margin-bottom: 24px;
}

.help-card {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  text-align: left;
}

.help-card .material-symbols-outlined {
  color: #3b82f6;
  font-size: 24px;
  margin-top: 2px;
}

.help-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e40af;
  margin: 0 0 8px 0;
}

.help-content p {
  font-size: 14px;
  color: #1e40af;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.user-info {
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
  text-align: left;
}

.user-info p {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.user-info p:last-child {
  margin-bottom: 0;
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
}
</style>
