<template>
  <div class="space-y-6" v-if="subscription">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="$router.back()"
          class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Quay lại"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ subscription.package_name || subscription.name }}</h1>
          <p class="text-gray-600">Chi tiết gói học</p>
        </div>
      </div>
      <button
        v-if="getRemainingSessions() > 0 && store.isManager"
        @click="useSession"
        :disabled="isUsing"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>Sử dụng 1 buổi</span>
      </button>
    </div>

    <!-- Subscription Information -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Thông tin gói học</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tên gói học</label>
          <p class="text-gray-900">{{ subscription.package_name || subscription.name }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Học sinh</label>
          <router-link
            :to="`/students/${subscription.student_id || subscription.studentId}`"
            class="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {{ getStudentName() }}
          </router-link>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
          <p class="text-gray-900">{{ formatDate(subscription.start_date || subscription.startDate) }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
          <p class="text-gray-900">
            {{ subscription.end_date ? formatDate(subscription.end_date) : (subscription.endDate ? formatDate(subscription.endDate) : '-') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Sessions Information -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Thông tin buổi học</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-gray-600 mb-1">Tổng số buổi</p>
          <p class="text-3xl font-bold text-blue-600">{{ subscription.total_sessions || subscription.totalSessions || 0 }}</p>
        </div>
        <div class="text-center p-4 bg-orange-50 rounded-lg">
          <p class="text-sm text-gray-600 mb-1">Đã sử dụng</p>
          <p class="text-3xl font-bold text-orange-600">{{ subscription.used_sessions || subscription.usedSessions || 0 }}</p>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <p class="text-sm text-gray-600 mb-1">Còn lại</p>
          <p class="text-3xl font-bold text-green-600">{{ getRemainingSessions() }}</p>
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div class="mt-6">
        <div class="flex justify-between text-sm text-gray-600 mb-2">
          <span>Tiến độ sử dụng</span>
          <span>{{ getUsedPercentage() }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-4">
          <div
            class="bg-blue-600 h-4 rounded-full transition-all"
            :style="{ width: `${getUsedPercentage()}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Đang tải thông tin...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6">
      <p class="text-red-800">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '../stores/useAppStore'

const route = useRoute()
const store = useAppStore()

const subscription = ref(null)
const loading = ref(true)
const error = ref(null)
const isUsing = ref(false)

onMounted(async () => {
  const subscriptionId = route.params.id
  if (!subscriptionId) {
    error.value = 'Không tìm thấy ID gói học'
    loading.value = false
    return
  }

  try {
    loading.value = true
    const result = await store.fetchSubscriptionById(subscriptionId)
    
    if (!result.success) {
      error.value = result.message || 'Không thể tải thông tin gói học'
    } else {
      subscription.value = result.data
    }
  } catch (err) {
    console.error('Error fetching subscription:', err)
    error.value = 'Đã có lỗi xảy ra khi tải thông tin gói học'
  } finally {
    loading.value = false
  }
})

const getStudentName = () => {
  if (!subscription.value) return 'Không tìm thấy'
  const studentId = subscription.value.student_id || subscription.value.studentId
  if (!studentId) return 'Không tìm thấy'
  const student = store.getStudentById(studentId)
  return student ? student.name : 'Không tìm thấy'
}

const getRemainingSessions = () => {
  if (!subscription.value) return 0
  return subscription.value.remaining_sessions || subscription.value.remainingSessions || 0
}

const getUsedPercentage = () => {
  if (!subscription.value) return 0
  const total = subscription.value.total_sessions || subscription.value.totalSessions || 1
  const used = subscription.value.used_sessions || subscription.value.usedSessions || 0
  return Math.min((used / total) * 100, 100)
}

const useSession = async () => {
  if (isUsing.value || !subscription.value) return
  
  if (!confirm(`Xác nhận sử dụng 1 buổi học cho "${subscription.value.package_name || subscription.value.name}"?`)) {
    return
  }
  
  isUsing.value = true
  try {
    const result = await store.useSession(subscription.value.id)
    if (!result.success) {
      alert(result.message || 'Sử dụng buổi học thất bại')
    } else {
      // Reload subscription data
      const reloadResult = await store.fetchSubscriptionById(subscription.value.id)
      if (reloadResult.success) {
        subscription.value = reloadResult.data
      }
    }
  } catch (err) {
    console.error('Error using session:', err)
    alert('Đã có lỗi xảy ra khi sử dụng buổi học')
  } finally {
    isUsing.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}
</script>

