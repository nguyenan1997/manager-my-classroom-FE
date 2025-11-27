<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo/Title -->
      <div class="text-center">
        <h1 class="text-4xl font-bold text-primary-600 mb-2">PV Technical</h1>
        <p class="text-gray-600">Hệ thống quản lý lớp học</p>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="flex border-b border-gray-200">
          <button
            @click="activeTab = 'manager'"
            :class="[
              'flex-1 py-4 px-6 text-center font-medium transition-colors',
              activeTab === 'manager'
                ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Quản lý
          </button>
          <button
            @click="activeTab = 'parent'"
            :class="[
              'flex-1 py-4 px-6 text-center font-medium transition-colors',
              activeTab === 'parent'
                ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Phụ huynh
          </button>
        </div>

        <div class="p-6">
          <!-- Manager Tab -->
          <div v-if="activeTab === 'manager'">
            <!-- Manager Login Form -->
            <form @submit.prevent="handleManagerLogin" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  v-model="managerLoginForm.email"
                  type="email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
                <input
                  v-model="managerLoginForm.password"
                  type="password"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <div v-if="managerError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {{ managerError }}
              </div>

              <button
                type="submit"
                class="w-full btn btn-primary py-3"
                :disabled="isLoading"
              >
                <span v-if="isLoading">Đang xử lý...</span>
                <span v-else>Đăng nhập</span>
              </button>
            </form>
          </div>

          <!-- Parent Tab -->
          <div v-if="activeTab === 'parent'">
            <!-- Toggle Login/Register -->
            <div class="flex justify-center mb-6">
              <div class="bg-gray-100 rounded-lg p-1 inline-flex">
                <button
                  @click="parentMode = 'login'"
                  :class="[
                    'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    parentMode === 'login'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  ]"
                >
                  Đăng nhập
                </button>
                <button
                  @click="parentMode = 'register'"
                  :class="[
                    'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    parentMode === 'register'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  ]"
                >
                  Đăng ký
                </button>
              </div>
            </div>

            <!-- Parent Login Form -->
            <form v-if="parentMode === 'login'" @submit.prevent="handleParentLogin" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email hoặc Số điện thoại *</label>
                <input
                  v-model="parentLoginForm.identifier"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="email@example.com hoặc 0123456789"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
                <input
                  v-model="parentLoginForm.password"
                  type="password"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <div v-if="parentError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {{ parentError }}
              </div>

              <button
                type="submit"
                class="w-full btn btn-primary py-3"
                :disabled="isLoading"
              >
                <span v-if="isLoading">Đang xử lý...</span>
                <span v-else>Đăng nhập</span>
              </button>
            </form>

            <!-- Parent Register Form -->
            <form v-else @submit.prevent="handleParentRegister" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                <input
                  v-model="parentRegisterForm.name"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  v-model="parentRegisterForm.email"
                  type="email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                <input
                  v-model="parentRegisterForm.phone"
                  type="tel"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0123456789"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
                <input
                  v-model="parentRegisterForm.password"
                  type="password"
                  required
                  minlength="6"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tối thiểu 6 ký tự"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu *</label>
                <input
                  v-model="parentRegisterForm.confirmPassword"
                  type="password"
                  required
                  minlength="6"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Nhập lại mật khẩu"
                />
              </div>

              <div v-if="parentError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {{ parentError }}
              </div>

              <button
                type="submit"
                class="w-full btn btn-primary py-3"
                :disabled="isLoading"
              >
                <span v-if="isLoading">Đang xử lý...</span>
                <span v-else>Đăng ký</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <p class="text-center text-sm text-gray-500">
        © 2024 PV Technical. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/useAppStore'

const router = useRouter()
const store = useAppStore()

const activeTab = ref('manager')
const isLoading = ref(false)
const managerError = ref('')
const parentError = ref('')
const parentMode = ref('login')

// Manager Forms
const managerLoginForm = ref({
  email: '',
  password: ''
})

// Parent Forms
const parentLoginForm = ref({
  identifier: '', // email or phone
  password: ''
})

const parentRegisterForm = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const handleManagerLogin = async () => {
  managerError.value = ''
  isLoading.value = true

  try {
    const result = await store.loginManager({
      email: managerLoginForm.value.email,
      password: managerLoginForm.value.password
    })

    // Handle both old format (boolean) and new format (object)
    if (result === true || (result && result.success === true)) {
      router.push('/')
    } else {
      // Show error message from API or default message
      managerError.value = (result && result.message) || 'Email hoặc mật khẩu không đúng'
    }
  } catch (error) {
    managerError.value = 'Đã có lỗi xảy ra. Vui lòng thử lại.'
  } finally {
    isLoading.value = false
  }
}

const handleParentRegister = async () => {
  parentError.value = ''
  isLoading.value = true

  try {
    // Validate password match
    if (parentRegisterForm.value.password !== parentRegisterForm.value.confirmPassword) {
      parentError.value = 'Mật khẩu xác nhận không khớp'
      isLoading.value = false
      return
    }

    // Validate password length
    if (parentRegisterForm.value.password.length < 6) {
      parentError.value = 'Mật khẩu phải có ít nhất 6 ký tự'
      isLoading.value = false
      return
    }

    // Call API to register parent
    const success = await store.registerParent({
      name: parentRegisterForm.value.name,
      email: parentRegisterForm.value.email,
      phone: parentRegisterForm.value.phone,
      password: parentRegisterForm.value.password
    })

    if (success) {
      router.push('/')
    } else {
      parentError.value = 'Email hoặc số điện thoại đã được sử dụng'
    }
  } catch (error) {
    parentError.value = 'Đã có lỗi xảy ra. Vui lòng thử lại.'
  } finally {
    isLoading.value = false
  }
}

const handleParentLogin = async () => {
  parentError.value = ''
  isLoading.value = true

  try {
    // Call API to login parent
    const success = await store.loginParent({
      identifier: parentLoginForm.value.identifier, // email or phone
      password: parentLoginForm.value.password
    })

    if (success) {
      router.push('/')
    } else {
      parentError.value = 'Email/Số điện thoại hoặc mật khẩu không đúng'
    }
  } catch (error) {
    parentError.value = 'Đã có lỗi xảy ra. Vui lòng thử lại.'
  } finally {
    isLoading.value = false
  }
}
</script>

