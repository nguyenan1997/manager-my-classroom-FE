<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Quản lý Học sinh</h1>
        <p class="text-gray-600">Quản lý thông tin học sinh và phụ huynh</p>
      </div>
      <button
        @click="openAddModal"
        class="btn btn-primary flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Thêm học sinh</span>
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="card">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <!-- Students Table -->
    <div class="card overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="text-left py-3 px-4 font-semibold text-gray-700">Họ và tên</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-700">Số điện thoại</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-700">Phụ huynh</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-700">Ngày tạo</th>
            <th class="text-right py-3 px-4 font-semibold text-gray-700">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="student in filteredStudents"
            :key="student.id"
            class="border-b border-gray-100 hover:bg-gray-50"
          >
            <td class="py-3 px-4">
              <div class="font-medium text-gray-900">{{ student.name }}</div>
              <div v-if="student.dateOfBirth" class="text-sm text-gray-500">
                {{ formatDate(student.dateOfBirth) }}
              </div>
            </td>
            <td class="py-3 px-4 text-gray-700">{{ student.email || '-' }}</td>
            <td class="py-3 px-4 text-gray-700">{{ student.phone }}</td>
            <td class="py-3 px-4">
              <div v-if="student.parentName" class="text-sm">
                <div class="font-medium text-gray-900">{{ student.parentName }}</div>
                <div class="text-gray-600">{{ student.parentPhone }}</div>
              </div>
              <span v-else class="text-gray-400">-</span>
            </td>
            <td class="py-3 px-4 text-gray-600 text-sm">{{ formatDate(student.createdAt) }}</td>
            <td class="py-3 px-4">
              <div class="flex justify-end space-x-2">
                <button
                  @click="openEditModal(student)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Chỉnh sửa"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="confirmDelete(student)"
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
          <tr v-if="filteredStudents.length === 0">
            <td colspan="6" class="py-8 text-center text-gray-500">
              Không tìm thấy học sinh nào
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Student Modal -->
    <StudentModal
      :show="showModal"
      :student="selectedStudent"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../stores/useAppStore'
import StudentModal from '../components/StudentModal.vue'

const store = useAppStore()
const searchQuery = ref('')
const showModal = ref(false)
const selectedStudent = ref(null)

const filteredStudents = computed(() => {
  if (!searchQuery.value) {
    return store.students
  }
  
  const query = searchQuery.value.toLowerCase()
  return store.students.filter(student => 
    student.name.toLowerCase().includes(query) ||
    (student.email && student.email.toLowerCase().includes(query)) ||
    student.phone.includes(query) ||
    (student.parentName && student.parentName.toLowerCase().includes(query))
  )
})

const openAddModal = () => {
  selectedStudent.value = null
  showModal.value = true
}

const openEditModal = (student) => {
  selectedStudent.value = student
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedStudent.value = null
}

const handleSubmit = (formData) => {
  if (selectedStudent.value) {
    // Update existing student
    store.updateStudent(selectedStudent.value.id, formData)
    
    // Update parent if exists
    if (formData.parentName || formData.parentPhone || formData.parentEmail) {
      const existingParent = store.parents.find(p => 
        p.phone === formData.parentPhone || p.email === formData.parentEmail
      )
      
      if (existingParent) {
        store.updateParent(existingParent.id, {
          name: formData.parentName,
          phone: formData.parentPhone,
          email: formData.parentEmail
        })
      } else {
        store.addParent({
          name: formData.parentName,
          phone: formData.parentPhone,
          email: formData.parentEmail,
          studentId: selectedStudent.value.id
        })
      }
    }
  } else {
    // Add new student
    const newStudent = store.addStudent(formData)
    
    // Add parent if provided
    if (formData.parentName || formData.parentPhone || formData.parentEmail) {
      store.addParent({
        name: formData.parentName,
        phone: formData.parentPhone,
        email: formData.parentEmail,
        studentId: newStudent.id
      })
    }
  }
}

const confirmDelete = (student) => {
  if (confirm(`Bạn có chắc chắn muốn xóa học sinh "${student.name}"?`)) {
    store.deleteStudent(student.id)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}
</script>

