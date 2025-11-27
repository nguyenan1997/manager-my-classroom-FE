<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Quản lý Gói học</h1>
        <p class="text-gray-600">Theo dõi và quản lý gói học của học sinh</p>
      </div>
      <button
        v-if="store.isManager || store.isParent"
        @click="openAddModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Tạo gói học</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl shadow-md p-6">
        <p class="text-sm text-gray-600 mb-1">Tổng gói học</p>
        <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-md p-6">
        <p class="text-sm text-gray-600 mb-1">Tổng buổi đã dùng</p>
        <p class="text-2xl font-bold text-orange-600">{{ stats.totalUsed }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-md p-6">
        <p class="text-sm text-gray-600 mb-1">Tổng buổi còn lại</p>
        <p class="text-2xl font-bold text-blue-600">{{ stats.totalRemaining }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-md p-6">
        <p class="text-sm text-gray-600 mb-1">Gói còn buổi</p>
        <p class="text-2xl font-bold text-green-600">{{ stats.active }}</p>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm theo tên học sinh, tên gói..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          v-if="store.isManager && store.students.length > 0"
          v-model="selectedStudentId"
          @change="handleStudentFilter"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tất cả học sinh</option>
          <option
            v-for="student in store.students"
            :key="student.id"
            :value="student.id"
          >
            {{ student.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Subscriptions Table -->
    <div class="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="text-left py-3 px-4 font-semibold text-gray-700">Học sinh</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-700">Tên gói</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-700">Ngày bắt đầu</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-700">Ngày kết thúc</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-700">Buổi học</th>
            <th class="text-right py-3 px-4 font-semibold text-gray-700">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="subscription in filteredSubscriptions"
            :key="subscription.id"
            class="border-b border-gray-100 hover:bg-gray-50"
          >
            <td class="py-3 px-4">
              <router-link
                :to="`/students/${subscription.student_id || subscription.studentId || subscription.student?.id}`"
                class="font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                {{ getStudentName(subscription) }}
              </router-link>
              <div v-if="subscription.student?.current_grade" class="text-xs text-gray-500 mt-1">
                Lớp: {{ subscription.student.current_grade }}
              </div>
            </td>
            <td class="py-3 px-4">
              <router-link
                :to="`/subscriptions/${subscription.id}`"
                class="font-medium text-gray-900 hover:text-blue-600 hover:underline"
              >
                {{ subscription.package_name || subscription.name }}
              </router-link>
            </td>
            <td class="py-3 px-4 text-gray-700">{{ formatDate(subscription.start_date || subscription.startDate) }}</td>
            <td class="py-3 px-4 text-gray-700">
              {{ subscription.end_date ? formatDate(subscription.end_date) : (subscription.endDate ? formatDate(subscription.endDate) : '-') }}
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center space-x-2">
                <span class="text-sm">
                  <span class="text-orange-600 font-semibold">{{ subscription.used_sessions || subscription.usedSessions || 0 }}</span>
                  /
                  <span class="text-gray-600">{{ subscription.total_sessions || subscription.totalSessions }}</span>
                </span>
                <span class="text-xs text-gray-500">
                  ({{ subscription.remaining_sessions || subscription.remainingSessions || 0 }} còn lại)
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all"
                  :style="{ width: `${getUsedPercentage(subscription)}%` }"
                ></div>
              </div>
            </td>
            <td class="py-3 px-4">
              <div class="flex justify-end space-x-2">
                <button
                  v-if="getRemainingSessions(subscription) > 0 && store.isManager"
                  @click="useSession(subscription)"
                  :disabled="isUsing"
                  class="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  title="Sử dụng 1 buổi"
                >
                  Sử dụng
                </button>
                <button
                  v-if="store.isManager"
                  @click="openEditModal(subscription)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Chỉnh sửa"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  v-if="store.isManager"
                  @click="confirmDelete(subscription)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Xóa"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredSubscriptions.length === 0">
            <td colspan="6" class="py-8 text-center text-gray-500">
              Không tìm thấy gói học nào
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Subscription Modal -->
    <SubscriptionModal
      :show="showModal"
      :subscription="selectedSubscription"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/useAppStore'
import SubscriptionModal from '../components/SubscriptionModal.vue'

const store = useAppStore()
const searchQuery = ref('')
const selectedStudentId = ref('')
const showModal = ref(false)
const selectedSubscription = ref(null)
const isUsing = ref(false)

// Load subscriptions from API on mount
onMounted(async () => {
  try {
    // Load students first if not loaded (for manager filter dropdown and parent to create subscriptions)
    if ((store.isManager || store.isParent) && store.students.length === 0) {
      await store.loadStudents()
    }
    // Load subscriptions
    await store.loadSubscriptions()
  } catch (error) {
    console.error('Error loading subscriptions:', error)
  }
})

const handleStudentFilter = async () => {
  try {
    await store.loadSubscriptions(selectedStudentId.value || null)
  } catch (error) {
    console.error('Error filtering subscriptions:', error)
  }
}

const stats = computed(() => {
  const total = store.subscriptions.length
  const totalUsed = store.subscriptions.reduce((sum, s) => 
    sum + (s.used_sessions || s.usedSessions || 0), 0
  )
  const totalRemaining = store.subscriptions.reduce((sum, s) => 
    sum + (s.remaining_sessions || s.remainingSessions || 0), 0
  )
  const active = store.subscriptions.filter(s => 
    (s.remaining_sessions || s.remainingSessions || 0) > 0
  ).length
  
  return { total, active, totalUsed, totalRemaining }
})

const filteredSubscriptions = computed(() => {
  let result = store.subscriptions || []

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(sub => {
      const studentName = getStudentName(sub).toLowerCase()
      const packageName = (sub.package_name || sub.name || '').toLowerCase()
      return studentName.includes(query) || packageName.includes(query)
    })
  }

  return result
})

const getStudentName = (subscription) => {
  // Nếu response đã có thông tin student, sử dụng trực tiếp
  if (subscription.student?.name) {
    return subscription.student.name
  }
  // Fallback: tìm trong store
  const studentId = subscription.student_id || subscription.studentId || subscription.student?.id
  if (!studentId) return 'Không tìm thấy'
  const student = store.getStudentById(studentId)
  return student ? student.name : 'Không tìm thấy'
}

const getRemainingSessions = (subscription) => {
  return subscription.remaining_sessions || subscription.remainingSessions || 0
}

const getUsedPercentage = (subscription) => {
  const total = subscription.total_sessions || subscription.totalSessions || 1
  const used = subscription.used_sessions || subscription.usedSessions || 0
  return Math.min((used / total) * 100, 100)
}

const openAddModal = () => {
  selectedSubscription.value = null
  showModal.value = true
}

const openEditModal = (subscription) => {
  selectedSubscription.value = subscription
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedSubscription.value = null
}

const handleSubmit = async (formData) => {
  if (selectedSubscription.value) {
    // Update subscription
    const result = await store.updateSubscription(selectedSubscription.value.id, formData)
    if (!result.success) {
      alert(result.message || 'Cập nhật gói học thất bại')
    } else {
      closeModal()
      // Reload subscriptions
      await store.loadSubscriptions()
    }
  } else {
    // Create new subscription
    const result = await store.addSubscription(formData)
    if (!result.success) {
      alert(result.message || 'Tạo gói học thất bại')
    } else {
      closeModal()
      // Reload subscriptions
      await store.loadSubscriptions()
    }
  }
}

const useSession = async (subscription) => {
  if (isUsing.value) return
  
  if (!confirm(`Xác nhận sử dụng 1 buổi học cho "${subscription.package_name || subscription.name}"?`)) {
    return
  }
  
  isUsing.value = true
  try {
    const result = await store.useSession(subscription.id)
    if (!result.success) {
      alert(result.message || 'Sử dụng buổi học thất bại')
    } else {
      // Reload subscriptions to update data
      await store.loadSubscriptions()
    }
  } catch (error) {
    console.error('Error using session:', error)
    alert('Đã có lỗi xảy ra khi sử dụng buổi học')
  } finally {
    isUsing.value = false
  }
}

const confirmDelete = async (subscription) => {
  if (!confirm(`Bạn có chắc chắn muốn xóa gói học "${subscription.package_name || subscription.name}"?`)) {
    return
  }
  
  const result = await store.deleteSubscription(subscription.id)
  if (!result.success) {
    alert(result.message || 'Xóa gói học thất bại')
  } else {
    // Reload subscriptions
    await store.loadSubscriptions()
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}
</script>
