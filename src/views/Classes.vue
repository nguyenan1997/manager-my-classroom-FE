<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{ store.isParent ? 'Lớp học' : 'Quản lý Lớp học' }}
        </h1>
        <p class="text-gray-600">
          {{ store.isParent ? 'Đăng ký lớp học cho con của bạn' : 'Tạo và quản lý lớp học' }}
        </p>
      </div>
      <button
        v-if="store.isManager"
        @click="openAddModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Tạo lớp học</span>
      </button>
    </div>

    <!-- Filter by Day -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <label class="text-sm font-medium text-gray-700 whitespace-nowrap">Lọc theo ngày:</label>
        <select
          v-model="selectedDay"
          @change="handleDayFilter"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tất cả các ngày</option>
          <option value="Monday">Thứ 2</option>
          <option value="Tuesday">Thứ 3</option>
          <option value="Wednesday">Thứ 4</option>
          <option value="Thursday">Thứ 5</option>
          <option value="Friday">Thứ 6</option>
          <option value="Saturday">Thứ 7</option>
          <option value="Sunday">Chủ nhật</option>
        </select>
        <button
          v-if="selectedDay"
          @click="clearDayFilter"
          class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tìm kiếm theo tên lớp, môn học, giáo viên..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <!-- Classes Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="classItem in filteredClasses"
        :key="classItem.id"
        class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-gray-900 mb-1">{{ classItem.name }}</h3>
            <p class="text-sm text-blue-600 font-medium">{{ classItem.subject }}</p>
          </div>
        </div>

        <div class="space-y-3 text-sm text-gray-600">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="font-medium">{{ getDayLabel(classItem.day_of_week) }}</span>
          </div>

          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ classItem.time_slot }}</span>
          </div>

          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{{ classItem.teacher_name }}</span>
          </div>

          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{{ getStudentCount(classItem) }} / {{ classItem.max_students }} học sinh</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="store.isParent" class="mt-4 pt-4 border-t">
          <button
            v-for="student in availableStudents"
            :key="student.id"
            @click="registerStudent(classItem.id, student.id)"
            :disabled="isRegistering || isStudentRegistered(classItem, student.id)"
            class="w-full mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
          >
            {{ isStudentRegistered(classItem, student.id) 
              ? `✓ ${student.name} đã đăng ký` 
              : `Đăng ký cho ${student.name}` }}
          </button>
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
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/useAppStore'
import ClassModal from '../components/ClassModal.vue'

const store = useAppStore()
const searchQuery = ref('')
const selectedDay = ref('')
const showModal = ref(false)
const selectedClass = ref(null)
const isRegistering = ref(false)

// Load classes from API on mount
onMounted(async () => {
  try {
    await store.loadClasses()
  } catch (error) {
    console.error('Error loading classes:', error)
  }
})

// Get available students for parent
const availableStudents = computed(() => {
  if (!store.isParent) return []
  return store.students.filter(student => 
    student.parent_id === store.currentUser?.id || 
    student.parentId === store.currentUser?.id
  )
})

const filteredClasses = computed(() => {
  let classesList = store.classes || []
  
  // Filter by day if selected
  if (selectedDay.value) {
    classesList = classesList.filter(classItem => 
      classItem.day_of_week === selectedDay.value
    )
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    classesList = classesList.filter(classItem => 
      classItem.name?.toLowerCase().includes(query) ||
      classItem.subject?.toLowerCase().includes(query) ||
      classItem.teacher_name?.toLowerCase().includes(query)
    )
  }
  
  return classesList
})

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

const getStudentCount = (classItem) => {
  // API có thể trả về số lượng học sinh đã đăng ký
  return classItem.registered_students?.length || classItem.student_count || 0
}

const isStudentRegistered = (classItem, studentId) => {
  // Kiểm tra xem học sinh đã đăng ký chưa
  return classItem.registered_students?.some(s => s.id === studentId || s === studentId) || false
}

const handleDayFilter = async () => {
  try {
    await store.loadClasses(selectedDay.value || null)
  } catch (error) {
    console.error('Error filtering classes:', error)
  }
}

const clearDayFilter = async () => {
  selectedDay.value = ''
  try {
    await store.loadClasses()
  } catch (error) {
    console.error('Error loading classes:', error)
  }
}

const openAddModal = () => {
  selectedClass.value = null
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedClass.value = null
}

const handleSubmit = async (formData) => {
  if (selectedClass.value) {
    // Update chưa có API
    alert('Chức năng sửa lớp học chưa được hỗ trợ')
    return
  } else {
    // Create new class
    const result = await store.addClass(formData)
    if (!result.success) {
      alert(result.message || 'Tạo lớp học thất bại')
    } else {
      closeModal()
      // Reload classes
      await store.loadClasses(selectedDay.value || null)
    }
  }
}

const registerStudent = async (classId, studentId) => {
  if (isRegistering.value) return
  
  isRegistering.value = true
  try {
    const result = await store.registerStudentToClass(classId, studentId)
    if (!result.success) {
      alert(result.message || 'Đăng ký lớp học thất bại')
    } else {
      // Reload classes to update registered students
      await store.loadClasses(selectedDay.value || null)
    }
  } catch (error) {
    console.error('Error registering student:', error)
    alert('Đã có lỗi xảy ra khi đăng ký')
  } finally {
    isRegistering.value = false
  }
}
</script>
