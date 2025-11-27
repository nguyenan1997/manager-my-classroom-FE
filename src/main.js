import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'
import Dashboard from './views/Dashboard.vue'
import Students from './views/Students.vue'
import StudentDetail from './views/StudentDetail.vue'
import Classes from './views/Classes.vue'
import Subscriptions from './views/Subscriptions.vue'
import Auth from './views/Auth.vue'
import { useAppStore } from './stores/useAppStore'

const routes = [
  {
    path: '/login',
    name: 'Auth',
    component: Auth,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/students',
    name: 'Students',
    component: Students,
    meta: { requiresAuth: true }
  },
  {
    path: '/students/:id',
    name: 'StudentDetail',
    component: StudentDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/classes',
    name: 'Classes',
    component: Classes,
    meta: { requiresAuth: true }
  },
  {
    path: '/subscriptions',
    name: 'Subscriptions',
    component: Subscriptions,
    meta: { requiresAuth: true, requiresManager: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const store = useAppStore()
  
  // Check authentication on app load
  if (!store.currentUser) {
    store.checkAuth()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const requiresManager = to.matched.some(record => record.meta.requiresManager)
  const requiresParent = to.matched.some(record => record.meta.requiresParent)
  const isAuthenticated = store.isAuthenticated
  const isManager = store.isManager
  const isParent = store.isParent

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if not authenticated
    next('/login')
  } else if (requiresGuest && isAuthenticated) {
    // Redirect to dashboard if already logged in
    next('/')
  } else if (requiresManager && !isManager) {
    // Redirect to dashboard if not manager
    next('/')
  } else {
    next()
  }
})

const pinia = createPinia()

createApp(App).use(pinia).use(router).mount('#app')

