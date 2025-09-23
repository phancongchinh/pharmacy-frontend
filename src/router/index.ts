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
      path: '/profile',
      name: 'profile',
      component: () => import('../views/MyProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/medicines',
      name: 'medicines',
      component: () => import('../views/MedicinesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/suppliers',
      name: 'suppliers',
      component: () => import('../views/SuppliersView.vue'),
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
