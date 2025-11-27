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

    <!-- Student Classes -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Lớp học đã đăng ký</h2>
      <div v-if="loadingClasses" class="text-center py-8">
        <p class="text-gray-500">Đang tải danh sách lớp học...</p>
      </div>
      <div v-else-if="studentClasses.length === 0" class="text-center py-8">
        <p class="text-gray-500">Học sinh chưa đăng ký lớp học nào</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="classItem in studentClasses"
          :key="classItem.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start mb-2">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">{{ classItem.name }}</h3>
              <p class="text-sm text-blue-600">{{ classItem.subject }}</p>
            </div>
            <router-link
              :to="`/classes`"
              class="text-blue-600 hover:text-blue-800 text-sm"
            >
              Xem
            </router-link>
          </div>
          <div class="space-y-1 text-sm text-gray-600">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ getDayLabel(classItem.day_of_week) }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ classItem.time_slot }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{{ classItem.teacher_name }}</span>
            </div>
            <div v-if="classItem.registered_at" class="text-xs text-gray-500 mt-2">
              Đăng ký: {{ formatDate(classItem.registered_at) }}
            </div>
          </div>
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
const studentClasses = ref([])
const loadingClasses = ref(false)

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
      // Load student classes
      await loadStudentClasses(studentId)
    }
  } catch (err) {
    console.error('Error fetching student:', err)
    error.value = 'Đã có lỗi xảy ra khi tải thông tin học sinh'
  } finally {
    loading.value = false
  }
})

const loadStudentClasses = async (studentId) => {
  try {
    loadingClasses.value = true
    const result = await store.getStudentClasses(studentId)
    if (result.success) {
      studentClasses.value = result.data || []
    }
  } catch (err) {
    console.error('Error loading student classes:', err)
  } finally {
    loadingClasses.value = false
  }
}

const getDayLabel = (day) => {
  const labels = {
    'Monday': 'Thứ 2',
    'Tuesday': 'Thứ 3',
    'Wednesday': 'Thứ 4',
    'Thursday': 'Thứ 5',
    'Friday': 'Thứ 6',
    'Saturday': 'Thứ 7',
    'Sunday': 'Chủ nhật'
  }
  return labels[day] || day
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}
</script>

