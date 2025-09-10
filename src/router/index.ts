import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: () => import('../views/ContactsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/deals',
      name: 'deals',
      component: () => import('../views/DealsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/calls',
      name: 'calls',
      component: () => import('../views/CallsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/emails',
      name: 'emails',
      component: () => import('../views/EmailsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/conversations',
      name: 'conversations',
      component: () => import('../views/ConversationsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/appointments',
      name: 'appointments',
      component: () => import('../views/AppointmentsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/automation',
      name: 'automation',
      component: () => import('../views/AutomationView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/ecommerce',
      name: 'ecommerce',
      component: () => import('../views/EcommerceView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/organizations',
      name: 'organizations',
      component: () => import('../views/MyOrganizationsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/workplace',
      name: 'workplace',
      component: () => import('../views/WorkplaceView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/integration',
      name: 'integration',
      component: () => import('../views/IntegrationsView.vue'),
      meta: { requiresAuth: true },
    },
    // Report routes
    {
      path: '/reports/contacts',
      name: 'contact-report',
      component: () => import('../views/reports/ContactReportView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/reports/deals',
      name: 'deal-report',
      component: () => import('../views/reports/DealReportView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/reports/appointments',
      name: 'appointment-report',
      component: () => import('../views/reports/AppointmentReportView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/reports/emails',
      name: 'email-report',
      component: () => import('../views/reports/EmailReportView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/reports/calls',
      name: 'call-report',
      component: () => import('../views/reports/CallReportView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/oauth/:platform/authorize/callback',
      name: 'oauth-callback',
      component: () => import('../views/OAuthCallbackView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/MyProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/plan',
      name: 'plan',
      component: () => import('../views/MyPlanView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('../views/LogoutView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/403',
      name: 'forbidden',
      component: () => import('../views/403View.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/404',
      name: 'notfound',
      component: () => import('../views/404View.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    },
  ],
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const atk = localStorage.getItem('atk')
  const oid = localStorage.getItem('oid')
  const user = localStorage.getItem('user')
  const invalidSession = !atk || !oid || !user
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // Prevent redirect loops - if already going to login, just proceed
  if (to.path === '/login' && invalidSession) {
    next()
    return
  }

  // If auth required but session invalid, redirect to login
  if (requiresAuth && invalidSession) {
    next('/login')
    return
  }

  // If logged in and trying to access login page, redirect to dashboard
  if (to.path === '/login' && !invalidSession) {
    next('/')
    return
  }

  // Otherwise proceed normally
  next()
})

export default router
