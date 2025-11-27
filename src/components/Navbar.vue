<template>
  <nav class="bg-white shadow-md">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-2">
          <router-link to="/" class="text-2xl font-bold text-primary-600">
            PV Technical
          </router-link>
        </div>
        
        <div class="hidden md:flex items-center space-x-6">
          <router-link
            to="/"
            class="text-gray-700 hover:text-primary-600 transition-colors duration-200"
            active-class="text-primary-600 font-semibold"
          >
            Dashboard
          </router-link>
          <template v-if="store.isManager">
            <router-link
              to="/students"
              class="text-gray-700 hover:text-primary-600 transition-colors duration-200"
              active-class="text-primary-600 font-semibold"
            >
              Học sinh
            </router-link>
            <router-link
              to="/classes"
              class="text-gray-700 hover:text-primary-600 transition-colors duration-200"
              active-class="text-primary-600 font-semibold"
            >
              Lớp học
            </router-link>
            <router-link
              to="/subscriptions"
              class="text-gray-700 hover:text-primary-600 transition-colors duration-200"
              active-class="text-primary-600 font-semibold"
            >
              Gói học
            </router-link>
          </template>
          <template v-if="store.isParent">
            <router-link
              to="/students"
              class="text-gray-700 hover:text-primary-600 transition-colors duration-200"
              active-class="text-primary-600 font-semibold"
            >
              Học sinh
            </router-link>
          </template>
        </div>

        <div class="flex items-center space-x-4">
          <!-- User Info -->
          <div v-if="store.currentUser" class="hidden md:flex items-center space-x-3">
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ store.currentUser.name }}</p>
              <p class="text-xs text-gray-500">
                {{ store.isManager ? 'Quản lý' : 'Phụ huynh' }}
                <span v-if="store.currentUser.studentName"> - {{ store.currentUser.studentName }}</span>
              </p>
            </div>
            <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <button
              @click="handleLogout"
              class="px-4 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-1"
              title="Đăng xuất"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>

          <button class="md:hidden text-gray-700 hover:text-primary-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/useAppStore'

const router = useRouter()
const store = useAppStore()

const handleLogout = () => {
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    store.logout()
    router.push('/login')
  }
}
</script>

