<template>
  <div class="profile-view">
    <!-- Header Section -->
    <div class="profile-header">
      <div class="header-left">
        <h1 class="profile-title">My Profile</h1>
        <p class="profile-subtitle">Manage your personal information and account details</p>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleSaveProfile" :loading="saving">
          <span class="material-symbols-outlined">save</span>
          Save Changes
        </el-button>
      </div>
    </div>

    <div class="profile-content">
      <!-- Profile Card -->
      <el-card class="profile-card" shadow="hover">
        <div class="profile-info">
          <div class="avatar-section">
            <el-avatar :size="120" :src="profile.avatar" class="profile-avatar">
              {{ profile?.firstName.charAt(0) }}{{ profile?.lastName.charAt(0) }}
            </el-avatar>
            <el-button link @click="handleUploadAvatar" class="upload-btn">
              <span class="material-symbols-outlined">camera_alt</span>
              Change Photo
            </el-button>
          </div>

          <div class="profile-details">
            <h2 class="profile-name">{{ profile.firstName }} {{ profile.lastName }}</h2>
            <p class="profile-role">{{ profile.role }} • {{ profile.department }}</p>
            <p class="profile-email">{{ profile.email }}</p>

            <div class="profile-stats">
              <!--              <div class="stat-item">-->
              <!--                <span class="stat-value">{{ profile.stats.dealsWon }}</span>-->
              <!--                <span class="stat-label">Deals Won</span>-->
              <!--              </div>-->
              <!--              <div class="stat-item">-->
              <!--                <span class="stat-value">{{ formatCurrency(profile.stats.revenue) }}</span>-->
              <!--                <span class="stat-label">Revenue Generated</span>-->
              <!--              </div>-->
              <!--              <div class="stat-item">-->
              <!--                <span class="stat-value">{{ profile.stats.teamSize }}</span>-->
              <!--                <span class="stat-label">Team Members</span>-->
              <!--              </div>-->
            </div>
          </div>
        </div>
      </el-card>

      <div class="profile-forms">
        <!-- Personal Information -->
        <el-card class="form-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="material-symbols-outlined">person</span>
              <h3>Personal Information</h3>
            </div>
          </template>

          <el-form :model="profile" label-width="140px" class="profile-form">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="First Name">
                  <el-input v-model="profile.firstName" placeholder="Enter first name" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Last Name">
                  <el-input v-model="profile.lastName" placeholder="Enter last name" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="Email">
                  <el-input v-model="profile.email" placeholder="Enter email address" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Phone">
                  <el-input v-model="profile.phone" placeholder="Enter phone number" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="Department">
                  <el-select
                    v-model="profile.department"
                    placeholder="Select department"
                    style="width: 100%"
                  >
                    <el-option label="Sales" value="Sales" />
                    <el-option label="Marketing" value="Marketing" />
                    <el-option label="Customer Success" value="Customer Success" />
                    <el-option label="Product" value="Product" />
                    <el-option label="Engineering" value="Engineering" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Role">
                  <el-input v-model="profile.role" placeholder="Enter job title" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="Bio">
              <el-input
                v-model="profile.bio"
                type="textarea"
                :rows="4"
                placeholder="Tell us about yourself..."
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { type User, userService } from '@/services/userService.ts'

// Reactive data
const saving = ref(false)

const profile = ref<Partial<User>>({
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@company.com',
  phone: '+1 (555) 123-4567',
  department: 'Sales',
  role: 'Senior Sales Manager',
  bio: 'Experienced sales professional with over 8 years in B2B software sales. Passionate about building lasting customer relationships and driving revenue growth.',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b047?w=400',
  stats: {
    dealsWon: 127,
    revenue: 2450000,
    teamSize: 8,
  },
})

onMounted(() => {
  loadProfile()
})

const loadProfile = async () => {
  const response = await userService.getProfile()
  profile.value = response.data
}

const handleSaveProfile = async () => {
  saving.value = true
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    ElMessage.success('Profile updated successfully')
  } catch (error) {
    ElMessage.error('Failed to update profile')
  } finally {
    saving.value = false
  }
}

const handleUploadAvatar = () => {
  ElMessage.info('Avatar upload dialog would open here')
}
</script>

<style scoped>
.profile-view {
  padding: 24px;
  background: #f8fafc;
  min-height: calc(100vh - 64px);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-left {
  flex: 1;
}

.profile-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
}

.profile-subtitle {
  font-size: 16px;
  color: #718096;
  margin: 0;
}

.profile-content {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 24px;
}

.profile-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.profile-info {
  text-align: center;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
}

.profile-avatar {
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.upload-btn {
  color: #3b82f6;
  font-size: 14px;
}

.profile-details {
  text-align: center;
}

.profile-name {
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 4px 0;
}

.profile-role {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.profile-email {
  font-size: 14px;
  color: #3b82f6;
  margin: 0 0 24px 0;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

.profile-forms {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
}

.form-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-header .material-symbols-outlined {
  font-size: 20px;
  color: #3b82f6;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.profile-form {
  padding-top: 8px;
}

:deep(.el-card__body) {
  padding: 24px;
}

:deep(.el-card__header) {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.el-form-item__label) {
  color: #374151;
  font-weight: 500;
}

:deep(.el-checkbox) {
  margin-bottom: 8px;
}

@media (max-width: 1024px) {
  .profile-content {
    grid-template-columns: 1fr;
  }

  .profile-card {
    order: -1;
  }
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .profile-stats {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
