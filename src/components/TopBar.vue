<template>
  <el-header class="topbar">
    <div class="topbar-content">
      <div class="topbar-left">
        <el-button @click="$emit('toggle-sidebar')" link class="sidebar-toggle-button" size="large">
          <span class="material-symbols-outlined">menu</span>
        </el-button>
      </div>

      <div class="topbar-right">
        <!-- Notifications -->
        <el-badge :value="3" class="notification-badge">
          <el-button link class="notification-button">
            <span class="material-symbols-outlined">notifications</span>
          </el-button>
        </el-badge>

        <!-- User menu dropdown -->
        <el-dropdown trigger="click" @command="handleCommand">
          <el-button link class="user-menu-button">
            <el-avatar :size="36" v-if="user.avatar" :src="user.avatar" :alt="user.name">
            </el-avatar>
            <el-avatar v-else :size="36">
              {{ user.name?.charAt(0) }}
            </el-avatar>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled>
                <div class="user-info">
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-email">{{ user.email }}</div>
                </div>
              </el-dropdown-item>
              <el-dropdown-item divided command="profile">
                <el-icon>
                  <User />
                </el-icon>
                My Profile
              </el-dropdown-item>
              <el-dropdown-item command="teams">
                <el-icon>
                  <Suitcase />
                </el-icon>
                Organizations
              </el-dropdown-item>
              <el-dropdown-item command="plan">
                <el-icon>
                  <CreditCard />
                </el-icon>
                My Plan
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon>
                  <Setting />
                </el-icon>
                Settings
              </el-dropdown-item>
              <el-dropdown-item divided command="signout">
                <el-icon>
                  <SwitchButton />
                </el-icon>
                Sign out
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { CreditCard, Setting, Suitcase, SwitchButton, User } from '@element-plus/icons-vue'

// Define emits
defineEmits<{
  'toggle-sidebar': []
}>()

// User data
const user = ref({
  name: '',
  email: '',
  avatar: ''
})

// Organization data
const currentOrganizationId = ref<string>('')

onBeforeMount(() => {
  // Load current organization ID from localStorage
  const oid = localStorage.getItem('oid')
  if (oid) {
    currentOrganizationId.value = oid
  }
})

onMounted(async () => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}')
  if (userData) {
    user.value.name = userData.fullName
    user.value.email = userData.email
    user.value.avatar = userData.avatar
  }
})

// Handle dropdown commands
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'signout':
      router.push('/logout')
      break
    default:
      break
  }
}
</script>

<style scoped>
.topbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Sidebar toggle button - always visible */
.sidebar-toggle-button {
  border-radius: 6px;
  padding: 0 !important;
  transition: all 0.2s ease;
}

.sidebar-toggle-button:hover {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.notification-button {
  padding: 8px;
}

.user-menu-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
}

.user-info {
  padding: 8px 0;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.user-email {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 2px;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-badge__content) {
  border: 2px solid white;
}

/* Adjust button styling for material icons */
.sidebar-toggle-button .material-symbols-outlined {
  font-size: 24px;
}

.notification-button .material-symbols-outlined {
  font-size: 20px;
}

.user-menu-button .material-symbols-outlined {
  font-size: 18px;
  margin-left: 4px;
}

:deep(.el-dropdown-menu__item) .material-symbols-outlined {
  margin-right: 8px;
  font-size: 18px;
}

/* Organization selector */
.organization-selector {
  min-width: 200px;
}

.organization-option {
  display: flex;
  flex-direction: column;
}

.organization-name {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.organization-role {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
