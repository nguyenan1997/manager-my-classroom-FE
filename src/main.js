import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'
import Dashboard from './views/Dashboard.vue'
import Students from './views/Students.vue'
import Classes from './views/Classes.vue'
import Subscriptions from './views/Subscriptions.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/students',
    name: 'Students',
    component: Students
  },
  {
    path: '/classes',
    name: 'Classes',
    component: Classes
  },
  {
    path: '/subscriptions',
    name: 'Subscriptions',
    component: Subscriptions
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const pinia = createPinia()

createApp(App).use(pinia).use(router).mount('#app')

