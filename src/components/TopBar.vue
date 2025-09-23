<template>
  <header class="top-bar">
    <div class="top-bar-content">
      <!-- Left side - Logo and title -->
      <div class="left-section">
        <div class="logo-section">
          <span class="material-symbols-outlined logo-icon">local_pharmacy</span>
          <h1 class="app-title">PharmaCare</h1>
        </div>
      </div>

      <!-- Right side - User actions -->
      <div class="right-section">
        <!-- Search -->
        <!--        <div class="search-container">-->
        <!--          <el-input-->
        <!--            v-model="searchQuery"-->
        <!--            placeholder="Search medicines, suppliers..."-->
        <!--            class="search-input"-->
        <!--            clearable-->
        <!--          >-->
        <!--            <template #prefix>-->
        <!--              <span class="material-symbols-outlined">search</span>-->
        <!--            </template>-->
        <!--          </el-input>-->
        <!--        </div>-->

        <!-- Notifications dropdown -->
        <div class="notification-container" ref="notificationRef">
          <el-button
            class="notification-btn"
            :class="{ 'has-alerts': hasUnreadAlerts }"
            @click="toggleNotifications"
          >
            <span class="material-symbols-outlined" style="transform: scale(1.3)"
              >notifications</span
            >
            <el-badge
              v-if="unreadAlertsCount > 0"
              :value="unreadAlertsCount"
              :max="99"
              class="notification-badge"
            />
          </el-button>

          <!-- Notification Dropdown -->
          <div v-show="showNotifications" class="notification-dropdown" @click.stop>
            <div class="dropdown-header">
              <h3 class="dropdown-title">Notifications</h3>
              <el-button
                v-if="unreadAlertsCount > 0"
                text
                size="small"
                @click="markAllAsRead"
                class="mark-all-read-btn"
              >
                Mark all as read
              </el-button>
            </div>

            <div class="dropdown-content">
              <div v-if="criticalAlerts.length === 0" class="no-notifications">
                <span class="material-symbols-outlined">notifications_off</span>
                <p>No notifications at this time</p>
              </div>

              <div v-else class="alerts-list">
                <div
                  v-for="alert in criticalAlerts"
                  :key="alert.id"
                  class="alert-item"
                  :class="[alert.type, { unread: !alert.read }]"
                  @click="markAsRead(alert.id)"
                >
                  <div class="alert-icon">
                    <span class="material-symbols-outlined">
                      {{ getAlertIcon(alert.type) }}
                    </span>
                  </div>
                  <div class="alert-content">
                    <div class="alert-title">{{ alert.title }}</div>
                    <div class="alert-message">{{ alert.message }}</div>
                    <div class="alert-time">{{ formatTime(alert.createdAt) }}</div>
                  </div>
                  <div v-if="alert.quantity" class="alert-quantity">
                    {{ alert.quantity }}
                  </div>
                </div>
              </div>
            </div>

            <div class="dropdown-footer">
              <el-button text class="view-all-btn" @click="viewAllNotifications">
                View all notifications
              </el-button>
            </div>
          </div>
        </div>

        <!-- User menu -->
        <el-dropdown trigger="click" class="user-dropdown">
          <div class="user-profile">
            <el-avatar :size="24" src="/api/placeholder/36/36" class="user-avatar" />
            <div class="user-info">
              <span class="user-name">John Doe</span>
              <span class="user-role">Pharmacist</span>
            </div>
            <span class="material-symbols-outlined dropdown-arrow">keyboard_arrow_down</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <span class="material-symbols-outlined">person</span>
                My Profile
              </el-dropdown-item>
              <el-dropdown-item>
                <span class="material-symbols-outlined">settings</span>
                Settings
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span class="material-symbols-outlined">logout</span>
                Logout
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

interface Alert {
  id: string
  type: 'critical' | 'warning' | 'expired'
  title: string
  message: string
  quantity?: string
  createdAt: Date
  read: boolean
}

// Reactive data
const searchQuery = ref('')
const showNotifications = ref(false)
const notificationRef = ref<HTMLElement>()

// Sample critical alerts data
const criticalAlerts = ref<Alert[]>([
  {
    id: '1',
    type: 'critical',
    title: 'Out of Stock',
    message: 'Paracetamol 500mg is completely out of stock',
    quantity: '0 units',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
  },
  {
    id: '2',
    type: 'critical',
    title: 'Low Stock Alert',
    message: 'Amoxicillin 250mg is running low',
    quantity: '5 units',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: false,
  },
  {
    id: '3',
    type: 'expired',
    title: 'Expired Medicine',
    message: 'Insulin injection has expired',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    read: false,
  },
  {
    id: '4',
    type: 'warning',
    title: 'Expiring Soon',
    message: 'Warfarin tablets will expire in 5 days',
    quantity: '12 units',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: true,
  },
  {
    id: '5',
    type: 'warning',
    title: 'Expiring Soon',
    message: 'Morphine syrup will expire in 3 days',
    quantity: '3 units',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    read: false,
  },
])

// Computed properties
const unreadAlertsCount = computed(() => {
  return criticalAlerts.value.filter((alert) => !alert.read).length
})

const hasUnreadAlerts = computed(() => {
  return unreadAlertsCount.value > 0
})

// Methods
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const markAsRead = (alertId: string) => {
  const alert = criticalAlerts.value.find((a) => a.id === alertId)
  if (alert) {
    alert.read = true
  }
}

const markAllAsRead = () => {
  criticalAlerts.value.forEach((alert) => {
    alert.read = true
  })
  ElMessage.success('All notifications marked as read')
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'critical':
      return 'error'
    case 'warning':
      return 'warning'
    case 'expired':
      return 'schedule'
    default:
      return 'info'
  }
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }
}

const viewAllNotifications = () => {
  showNotifications.value = false
  // Navigate to notifications page or show modal
  ElMessage.info('Navigate to notifications page')
}

// Click outside to close dropdown
const handleClickOutside = (event: Event) => {
  if (notificationRef.value && !notificationRef.value.contains(event.target as Node)) {
    showNotifications.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.top-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.top-bar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 54px;
  margin: 0 auto;
}

/* Left Section */
.left-section {
  display: flex;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 32px;
  color: white;
}

.app-title {
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
}

/* Right Section */
.right-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-container {
  width: 300px;
}

.search-input {
  --el-input-bg-color: rgba(255, 255, 255, 0.1);
  --el-input-border-color: rgba(255, 255, 255, 0.2);
  --el-input-focus-border-color: rgba(255, 255, 255, 0.4);
  --el-input-text-color: white;
  --el-input-placeholder-color: rgba(255, 255, 255, 0.7);
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.search-input :deep(.el-input__prefix) {
  color: rgba(255, 255, 255, 0.7);
}

/* Notification Container */
.notification-container {
  position: relative;
}

.notification-btn {
  width: 30px;
  height: 30px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

.notification-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.notification-btn.has-alerts {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
}

.notification-badge {
  position: absolute;
  top: -2px;
  right: -2px;
}

/* Notification Dropdown */
.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 380px;
  max-height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1001;
  transition: all 0.3s ease;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.dropdown-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.mark-all-read-btn {
  color: #667eea;
  font-weight: 600;
  padding: 4px 8px;
}

.dropdown-content {
  max-height: 350px;
  overflow-y: auto;
}

.no-notifications {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #64748b;
  text-align: center;
}

.no-notifications .material-symbols-outlined {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.alerts-list {
  padding: 8px 0;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.alert-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.alert-item.unread {
  background: rgba(59, 130, 246, 0.02);
}

.alert-item.critical {
  border-left-color: #ef4444;
}

.alert-item.warning {
  border-left-color: #f59e0b;
}

.alert-item.expired {
  border-left-color: #8b5cf6;
}

.alert-icon {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.alert-icon .material-symbols-outlined {
  width: 18px;
}

.alert-item.critical .alert-icon {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.alert-item.warning .alert-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.alert-item.expired .alert-icon {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-title {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
  margin-bottom: 4px;
}

.alert-message {
  color: #64748b;
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 6px;
}

.alert-time {
  color: #94a3b8;
  font-size: 12px;
}

.alert-quantity {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.dropdown-footer {
  padding: 6px 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(248, 250, 252, 0.5);
}

.view-all-btn {
  width: 100%;
  color: #667eea;
  font-weight: 600;
}

/* User Dropdown */
.user-dropdown {
  cursor: pointer;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.user-profile:hover {
  background: rgba(255, 255, 255, 0.15);
}

.user-avatar {
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: white;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  opacity: 0.8;
}

.dropdown-arrow {
  color: rgba(255, 255, 255, 0.7);
  font-size: 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .top-bar-content {
    padding: 0 16px;
  }

  .search-container {
    display: none;
  }

  .notification-dropdown {
    width: 320px;
    right: -50px;
  }

  .user-info {
    display: none;
  }
}

/* Scrollbar styling */
.dropdown-content::-webkit-scrollbar {
  width: 4px;
}

.dropdown-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

.dropdown-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.dropdown-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
