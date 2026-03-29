import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/auth/success',
    name: 'auth-success',
    component: () => import('../views/AuthCallback.vue'),
    meta: { guest: true }
  },
  {
    path: '/auth/callback',
    name: 'auth-callback',
    component: () => import('../views/AuthCallback.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
    meta: { guest: true }
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { auth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue'),
    meta: { auth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/Admin.vue'),
    meta: { auth: true, admin: true }
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('../views/AdminUsers.vue'),
    meta: { auth: true, admin: true }
  },
  {
    path: '/admin/services',
    name: 'admin-services',
    component: () => import('../views/AdminServices.vue'),
    meta: { auth: true, admin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth on first load
  if (!authStore.initialized) {
    await authStore.init()
  }

  // Guest only routes (login, register)
  if (to.meta.guest && authStore.isAuthenticated) {
    return next({ name: 'dashboard' })
  }

  // Auth required routes
  if (to.meta.auth && !authStore.isAuthenticated) {
    return next({ name: 'login' })
  }

  // Admin required routes
  if (to.meta.admin && authStore.user?.role !== 'admin') {
    return next({ name: 'dashboard' })
  }

  next()
})

export default router
