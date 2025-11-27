<template>
  <div class="space-y-6" v-if="student">
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
          <h1 class="text-3xl font-bold text-gray-900">{{ student.name }}</h1>
          <p class="text-gray-600">Chi tiết thông tin học sinh</p>
        </div>
      </div>
    </div>

    <!-- Student Information -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Thông tin học sinh</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
          <p class="text-gray-900">{{ student.name }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
          <p class="text-gray-900">{{ formatDate(student.dob) }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
          <p class="text-gray-900">{{ student.gender === 'male' ? 'Nam' : student.gender === 'female' ? 'Nữ' : '-' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Lớp hiện tại</label>
          <p class="text-gray-900">{{ student.current_grade || '-' }}</p>
        </div>
      </div>
    </div>

    <!-- Parent Information -->
    <div v-if="student.parent" class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Thông tin phụ huynh</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tên phụ huynh</label>
          <p class="text-gray-900">{{ student.parent.name }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          <p class="text-gray-900">{{ student.parent.phone }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <p class="text-gray-900">{{ student.parent.email }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
          <p class="text-gray-900">{{ formatDate(student.parent.created_at) }}</p>
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
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '../stores/useAppStore'

const route = useRoute()
const router = useRouter()
const store = useAppStore()

const student = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  const studentId = route.params.id
  if (!studentId) {
    error.value = 'Không tìm thấy ID học sinh'
    loading.value = false
    return
  }

  try {
    loading.value = true
    const result = await store.fetchStudentById(studentId)
    
    if (!result.success) {
      error.value = result.message || 'Không thể tải thông tin học sinh'
    } else {
      student.value = result.data
    }
  } catch (err) {
    console.error('Error fetching student:', err)
    error.value = 'Đã có lỗi xảy ra khi tải thông tin học sinh'
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}
</script>

