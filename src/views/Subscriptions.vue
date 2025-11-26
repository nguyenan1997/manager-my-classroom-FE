<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Quản lý Gói học</h1>
        <p class="text-gray-600">Theo dõi và quản lý subscription của học sinh</p>
      </div>
      <button
        @click="openAddModal"
        class="btn btn-primary flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Tạo gói học</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card">
        <p class="text-sm text-gray-600 mb-1">Tổng gói học</p>
        <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
      </div>
      <div class="card">
        <p class="text-sm text-gray-600 mb-1">Đang hoạt động</p>
        <p class="text-2xl font-bold text-green-600">{{ stats.active }}</p>
      </div>
      <div class="card">
        <p class="text-sm text-gray-600 mb-1">Tổng buổi đã dùng</p>
        <p class="text-2xl font-bold text-orange-600">{{ stats.totalUsed }}</p>
      </div>
      <div class="card">
        <p class="text-sm text-gray-600 mb-1">Tổng buổi còn lại</p>
        <p class="text-2xl font-bold text-blue-600">{{ stats.totalRemaining }}</p>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="card">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm theo tên học sinh, tên gói..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="expired">Hết hạn</option>
          <option value="completed">Hoàn thành</option>
          <option value="paused">Tạm dừng</option>
        </select>
      </div>
    </div>

    <!-- Subscriptions Table -->
    <div class="card overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="text-left py-3 px-4 font-semibold text-gray-700">Học sinh</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-700">Tên gói</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-700">Buổi học</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-700">Giá</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-700">Trạng thái</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-700">Ngày tạo</th>
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
              <div class="font-medium text-gray-900">{{ getStudentName(subscription.studentId) }}</div>
            </td>
            <td class="py-3 px-4 text-gray-900">{{ subscription.name }}</td>
            <td class="py-3 px-4">
              <div class="flex items-center space-x-2">
                <span class="text-sm">
                  <span class="text-orange-600 font-semibold">{{ subscription.usedSessions }}</span>
                  /
                  <span class="text-gray-600">{{ subscription.totalSessions }}</span>
                </span>
                <span class="text-xs text-gray-500">
                  ({{ subscription.remainingSessions }} còn lại)
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  class="bg-primary-600 h-2 rounded-full transition-all"
                  :style="{ width: `${(subscription.usedSessions / subscription.totalSessions) * 100}%` }"
                ></div>
              </div>
            </td>
            <td class="py-3 px-4">
              <span v-if="subscription.price">{{ formatPrice(subscription.price) }}</span>
              <span v-else class="text-gray-400">-</span>
            </td>
            <td class="py-3 px-4">
              <span :class="getStatusClass(subscription.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                {{ getStatusLabel(subscription.status) }}
              </span>
            </td>
            <td class="py-3 px-4 text-gray-600 text-sm">{{ formatDate(subscription.createdAt) }}</td>
            <td class="py-3 px-4">
              <div class="flex justify-end space-x-2">
                <button
                  v-if="subscription.remainingSessions > 0 && subscription.status === 'active'"
                  @click="useSession(subscription)"
                  class="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Sử dụng 1 buổi"
                >
                  Sử dụng
                </button>
                <button
                  @click="openEditModal(subscription)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Chỉnh sửa"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
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
            <td colspan="7" class="py-8 text-center text-gray-500">
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
import { ref, computed } from 'vue'
import { useAppStore } from '../stores/useAppStore'
import SubscriptionModal from '../components/SubscriptionModal.vue'

const store = useAppStore()
const searchQuery = ref('')
const statusFilter = ref('')
const showModal = ref(false)
const selectedSubscription = ref(null)

const stats = computed(() => {
  const total = store.subscriptions.length
  const active = store.subscriptions.filter(s => s.status === 'active').length
  const totalUsed = store.subscriptions.reduce((sum, s) => sum + s.usedSessions, 0)
  const totalRemaining = store.subscriptions.reduce((sum, s) => sum + s.remainingSessions, 0)
  
  return { total, active, totalUsed, totalRemaining }
})

const filteredSubscriptions = computed(() => {
  let result = store.subscriptions

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(sub => {
      const studentName = getStudentName(sub.studentId).toLowerCase()
      return studentName.includes(query) || sub.name.toLowerCase().includes(query)
    })
  }

  if (statusFilter.value) {
    result = result.filter(sub => sub.status === statusFilter.value)
  }

  return result
})

const getStudentName = (studentId) => {
  const student = store.getStudentById(studentId)
  return student ? student.name : 'Không tìm thấy'
}

const getStatusLabel = (status) => {
  const labels = {
    active: 'Đang hoạt động',
    expired: 'Hết hạn',
    completed: 'Hoàn thành',
    paused: 'Tạm dừng'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    expired: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    paused: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
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

const handleSubmit = (formData) => {
  if (selectedSubscription.value) {
    store.updateSubscription(selectedSubscription.value.id, formData)
  } else {
    store.addSubscription(formData)
  }
}

const useSession = (subscription) => {
  if (confirm(`Xác nhận sử dụng 1 buổi học cho "${subscription.name}"?`)) {
    const success = store.useSession(subscription.id)
    if (!success) {
      alert('Không thể sử dụng buổi học. Gói học đã hết hoặc không hợp lệ.')
    }
  }
}

const confirmDelete = (subscription) => {
  if (confirm(`Bạn có chắc chắn muốn xóa gói học "${subscription.name}"?`)) {
    store.deleteSubscription(subscription.id)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
}
</script>

