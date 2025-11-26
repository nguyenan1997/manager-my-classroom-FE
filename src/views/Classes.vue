<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Quản lý Lớp học</h1>
        <p class="text-gray-600">Tạo và lên lịch lớp học cho học sinh</p>
      </div>
      <button
        @click="openAddModal"
        class="btn btn-primary flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Tạo lớp học</span>
      </button>
    </div>

    <!-- Search -->
    <div class="card">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tìm kiếm theo tên lớp..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
    </div>

    <!-- Classes Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="classItem in filteredClasses"
        :key="classItem.id"
        class="card hover:shadow-lg transition-shadow duration-300"
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-semibold text-gray-900">{{ classItem.name }}</h3>
          <div class="flex space-x-2">
            <button
              @click="openEditModal(classItem)"
              class="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Chỉnh sửa"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="confirmDelete(classItem)"
              class="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Xóa"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div class="space-y-2 text-sm text-gray-600">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formatDate(classItem.startDate) }}</span>
            <span v-if="classItem.endDate">- {{ formatDate(classItem.endDate) }}</span>
          </div>

          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ classItem.time }} ({{ classItem.duration }} phút)</span>
          </div>

          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{{ getStudentCount(classItem) }} học sinh</span>
          </div>

          <div v-if="classItem.schedule && classItem.schedule.length > 0" class="mt-3 pt-3 border-t">
            <p class="text-xs font-medium text-gray-700 mb-1">Lịch học:</p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="day in classItem.schedule"
                :key="day"
                class="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs"
              >
                {{ getDayLabel(day) }}
              </span>
            </div>
          </div>

          <div v-if="classItem.notes" class="mt-3 pt-3 border-t">
            <p class="text-xs text-gray-500">{{ classItem.notes }}</p>
          </div>
        </div>
      </div>

      <div v-if="filteredClasses.length === 0" class="col-span-full text-center py-12 text-gray-500">
        Không tìm thấy lớp học nào
      </div>
    </div>

    <!-- Class Modal -->
    <ClassModal
      :show="showModal"
      :class-data="selectedClass"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../stores/useAppStore'
import ClassModal from '../components/ClassModal.vue'

const store = useAppStore()
const searchQuery = ref('')
const showModal = ref(false)
const selectedClass = ref(null)

const filteredClasses = computed(() => {
  if (!searchQuery.value) {
    return store.classes
  }
  
  const query = searchQuery.value.toLowerCase()
  return store.classes.filter(classItem => 
    classItem.name.toLowerCase().includes(query)
  )
})

const getStudentCount = (classItem) => {
  return classItem.studentIds ? classItem.studentIds.length : 0
}

const getDayLabel = (day) => {
  const labels = {
    monday: 'T2',
    tuesday: 'T3',
    wednesday: 'T4',
    thursday: 'T5',
    friday: 'T6',
    saturday: 'T7',
    sunday: 'CN'
  }
  return labels[day] || day
}

const openAddModal = () => {
  selectedClass.value = null
  showModal.value = true
}

const openEditModal = (classItem) => {
  selectedClass.value = classItem
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedClass.value = null
}

const handleSubmit = (formData) => {
  if (selectedClass.value) {
    store.updateClass(selectedClass.value.id, formData)
  } else {
    store.addClass(formData)
  }
}

const confirmDelete = (classItem) => {
  if (confirm(`Bạn có chắc chắn muốn xóa lớp học "${classItem.name}"?`)) {
    store.deleteClass(classItem.id)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}
</script>

