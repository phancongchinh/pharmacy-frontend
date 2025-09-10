<template>
  <div class="login-container">
    <div class="login-content">
      <!-- Left side - Login Form -->
      <div class="login-form-section">
        <div class="login-form-container">
          <!-- Logo and Header -->
          <div class="login-header">
            <div class="logo">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="8" fill="#4F46E5" />
                <path d="M20 8L28 16L20 24L12 16L20 8Z" fill="white" />
              </svg>
              <span class="logo-text">CRM Pro</span>
            </div>
            <h1 class="login-title">Welcome back</h1>
            <p class="login-subtitle">Sign in to your account to continue</p>
          </div>

          <!-- Login Form -->
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            size="large"
            @submit.prevent="handleLogin"
          >
            <el-form-item prop="username">
              <label class="form-label">Username or email</label>
              <el-input
                v-model="loginForm.username"
                placeholder="Enter your username or email"
                prefix-icon="Message"
                clearable
              />
            </el-form-item>

            <el-form-item prop="password">
              <label class="form-label">Password</label>
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="Enter your password"
                prefix-icon="Lock"
                show-password
                clearable
              />
            </el-form-item>

            <div class="form-options">
              <!--              <el-checkbox v-model="loginForm.rememberMe">Remember me</el-checkbox>-->
              <span></span>
              <el-link type="primary" class="forgot-password">Forgot password?</el-link>
            </div>

            <el-form-item>
              <el-button
                type="primary"
                class="w-100"
                :loading="loading"
                @click="handleLogin"
                native-type="submit"
              >
                <span v-if="!loading">Sign in</span>
                <span v-else>Signing in...</span>
              </el-button>
            </el-form-item>
          </el-form>

          <!-- Social Login -->
          <div class="social-login">
            <div class="divider">
              <span>Or continue with</span>
            </div>
            <div class="social-buttons">
              <el-button
                id="btn-google-signin"
                class="social-button google"
                @click="handleGoogleLogin"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span class="ms-2">Google</span>
              </el-button>
              <el-button class="social-button microsoft" @click="handleMicrosoftLogin">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#f25022" d="M1 1h10v10H1z" />
                  <path fill="#00a4ef" d="M13 1h10v10H13z" />
                  <path fill="#7fba00" d="M1 13h10v10H1z" />
                  <path fill="#ffb900" d="M13 13h10v10H13z" />
                </svg>
                Microsoft
              </el-button>
            </div>
          </div>

          <!-- Sign up link -->
          <!--          <div class="signup-link">-->
          <!--            <span>Don't have an account? </span>-->
          <!--            <el-link type="primary" @click="goToSignup">Sign up for free</el-link>-->
          <!--          </div>-->
        </div>
      </div>

      <!-- Right side - Image/Branding -->
      <div class="login-image-section">
        <div class="image-content">
          <div class="feature-highlights">
            <h2>Manage your business relationships</h2>
            <div class="features">
              <div class="feature">
                <div class="feature-icon">
                  <span class="material-symbols-outlined">groups</span>
                </div>
                <div class="feature-text">
                  <h3>Contact Management</h3>
                  <p>Keep track of all your customers and leads in one place</p>
                </div>
              </div>
              <div class="feature">
                <div class="feature-icon">
                  <span class="material-symbols-outlined">trending_up</span>
                </div>
                <div class="feature-text">
                  <h3>Sales Pipeline</h3>
                  <p>Track deals and opportunities from lead to close</p>
                </div>
              </div>
              <div class="feature">
                <div class="feature-icon">
                  <span class="material-symbols-outlined">analytics</span>
                </div>
                <div class="feature-text">
                  <h3>Analytics & Reports</h3>
                  <p>Get insights into your sales performance and trends</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElForm } from 'element-plus'
import { userService } from '@/services/userService'
import { apiClient } from '@/services/apiClient'
import type { GoogleOAuthResponse } from '@/services/googleOAuthService.ts'

const router = useRouter()

// Form ref
const loginFormRef = ref<InstanceType<typeof ElForm>>()

// Loading state
const loading = ref(false)

// Form data
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false,
})

// Form validation rules
const loginRules = {
  username: [
    { required: true, message: 'Please enter your username or email', trigger: 'blur' },
    { min: 5, message: 'Username or email must be at least 5 characters', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' },
  ],
}

// Handle login
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    const valid = await loginFormRef.value.validate()
    if (!valid) return

    loading.value = true

    // Call login API
    const response = await userService.login({
      username: loginForm.username,
      password: loginForm.password,
    })

    const { atk, oid, user } = response.data

    if (atk && oid) {
      // Store token in local storage
      localStorage.setItem('atk', atk)
      localStorage.setItem('oid', oid)
      localStorage.setItem('user', user)
      // Redirect to dashboard
      router.push('/').then(() => {
        ElMessage.success('Login successful!')
      })
    } else {
      ElMessage.error('Login failed. Please check your credentials.')
    }
  } catch (error) {
    ElMessage.error('Login failed. Please check your credentials.')
  } finally {
    loading.value = false
  }
}

// Handle Google login using a single OAuth2 flow
const handleGoogleLogin = async () => {
  try {
    loading.value = true

    // Check if Google is available
    if (typeof window.google === 'undefined') {
      ElMessage.error('Google Sign-In is not available. Please refresh the page and try again.')
      loading.value = false
      return
    }

    // Use OAuth2 flow only - this provides both ID token and access token
    const tokenClient = window.google?.accounts?.oauth2?.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: 'email profile openid',
      callback: handleGoogleOAuthResponseCallbackForLogin,
    })

    // Request access token - this will show the Google account picker once
    tokenClient.requestAccessToken()
  } catch (error) {
    console.error('Google login error:', error)
    ElMessage.error('Google login failed. Please try again.')
    loading.value = false
  }
}

// Handle Google OAuth2 token callback
const handleGoogleOAuthResponseCallbackForLogin = async (oAuthResponse: GoogleOAuthResponse) => {
  try {
    if (oAuthResponse.access_token) {
      const response = await userService.loginWithGoogle({
        access_token: oAuthResponse.access_token,
      })
      const { atk, oid, user } = response.data
      if (atk && oid) {
        // Store token in local storage
        localStorage.setItem('atk', atk)
        localStorage.setItem('oid', oid)
        localStorage.setItem('user', user)

        // Redirect to dashboard
        router.push('/').then(() => {
          ElMessage.success('Google login successful!')
        })
      } else {
        ElMessage.error('Google login failed. Invalid response from server.')
      }
    } else {
      ElMessage.error('Google authentication failed.')
    }
  } catch (error) {
    console.error('Google token callback error:', error)
    ElMessage.error('Failed to process Google login.')
  } finally {
    loading.value = false
  }
}

// Handle Microsoft login
const handleMicrosoftLogin = () => {
  ElMessage.info('Microsoft login would be implemented here')
}

// Navigate to signup
const goToSignup = () => {
  router.push('/signup')
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
}

.login-content {
  display: flex;
  height: 85vh;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.login-form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  height: 100%;
}

.login-form-container {
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 25px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
}

.login-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
}

.login-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.login-form {
  margin-bottom: 32px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.forgot-password {
  font-size: 14px;
}

.social-login {
  margin-bottom: 32px;
}

.divider {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}

.divider span {
  background: white;
  padding: 0 16px;
  color: #6b7280;
  font-size: 14px;
}

.social-buttons {
  display: flex;
  gap: 12px;
}

.social-button {
  flex: 1;
  height: 40px;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  background: white;
  color: #374151;
}

.social-button:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.signup-link {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

.login-image-section {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: white;
}

.image-content {
  max-width: 500px;
}

.feature-highlights h2 {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 40px 0;
  line-height: 1.2;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.feature {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon .material-symbols-outlined {
  font-size: 24px;
  color: white;
}

.feature-text h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.feature-text p {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .login-content {
    flex-direction: column;
    margin: 0;
    border-radius: 0;
    min-height: 100vh;
  }

  .login-form-section {
    padding: 20px;
    min-height: auto;
  }

  .login-image-section {
    padding: 40px 20px;
  }

  .feature-highlights h2 {
    font-size: 28px;
  }

  .social-buttons {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .login-form-section {
    padding: 16px;
  }

  .login-title {
    font-size: 28px;
  }

  .features {
    gap: 24px;
  }
}
</style>
