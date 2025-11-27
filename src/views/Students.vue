<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{ store.isParent ? 'Học sinh của tôi' : 'Quản lý Học sinh' }}
        </h1>
        <p class="text-gray-600">
          {{ store.isParent ? 'Quản lý thông tin học sinh của bạn' : 'Quản lý thông tin học sinh và phụ huynh' }}
        </p>
      </div>
      <button
        v-if="store.isParent || store.isManager"
        @click="openAddModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Thêm học sinh</span>
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <!-- Students Table -->
    <div class="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="text-left py-3 px-4 font-semibold text-gray-700">Họ và tên</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-700">Ngày sinh</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-700">Giới tính</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-700">Lớp</th>
            <th v-if="store.isManager" class="text-left py-3 px-4 font-semibold text-gray-700">Phụ huynh</th>
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
              <router-link
                :to="`/students/${student.id}`"
                class="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                {{ student.name }}
              </router-link>
            </td>
            <td class="py-3 px-4 text-gray-700">
              {{ student.dob ? formatDate(student.dob) : (student.dateOfBirth ? formatDate(student.dateOfBirth) : '-') }}
            </td>
            <td class="py-3 px-4 text-gray-700">
              {{ student.gender === 'male' ? 'Nam' : student.gender === 'female' ? 'Nữ' : '-' }}
            </td>
            <td class="py-3 px-4 text-gray-700">{{ student.current_grade || '-' }}</td>
            <td v-if="store.isManager" class="py-3 px-4">
              <div v-if="student.parent || student.parentName" class="text-sm">
                <div class="font-medium text-gray-900">{{ student.parent?.name || student.parentName }}</div>
                <div class="text-gray-600">{{ student.parent?.phone || student.parentPhone }}</div>
              </div>
              <span v-else class="text-gray-400">-</span>
            </td>
            <td class="py-3 px-4 text-gray-600 text-sm">{{ formatDate(student.createdAt || student.created_at) }}</td>
            <td class="py-3 px-4">
              <div v-if="store.isManager || (store.isParent && canEditStudent(student))" class="flex justify-end space-x-2">
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
              <span v-else class="text-gray-400 text-sm">-</span>
            </td>
          </tr>
          <tr v-if="filteredStudents.length === 0">
            <td :colspan="store.isManager ? 7 : 6" class="py-8 text-center text-gray-500">
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
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/useAppStore'
import StudentModal from '../components/StudentModal.vue'

const store = useAppStore()
const searchQuery = ref('')
const showModal = ref(false)
const selectedStudent = ref(null)

// Load students from API when component is mounted
onMounted(async () => {
  try {
    await store.loadStudents()
  } catch (error) {
    console.error('Error loading students:', error)
  }
})

const filteredStudents = computed(() => {
  try {
    let studentsList = store.students || []
    
    // Parent đã lấy đúng danh sách từ API /api/students/my-children
    // nên không cần filter lại nữa
    // Manager lấy tất cả học sinh từ /api/students
    
    if (!searchQuery.value) {
      return studentsList
    }
    
    const query = searchQuery.value.toLowerCase()
    return studentsList.filter(student => 
      student?.name?.toLowerCase().includes(query) ||
      (student?.email && student.email.toLowerCase().includes(query)) ||
      (student?.phone && student.phone.includes(query)) ||
      (student?.parent?.name && student.parent.name.toLowerCase().includes(query))
    )
  } catch (error) {
    console.error('Error filtering students:', error)
    return []
  }
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

const canEditStudent = (student) => {
  // Parent chỉ có thể sửa/xóa con của mình
  if (store.isParent && store.currentUser?.id) {
    return (student.parent_id === store.currentUser.id || student.parentId === store.currentUser.id)
  }
  return false
}

const handleSubmit = async (formData) => {
  if (selectedStudent.value) {
    // Update student
    const result = await store.updateStudent(selectedStudent.value.id, formData)
    if (!result.success) {
      alert(result.message || 'Cập nhật học sinh thất bại')
    } else {
      closeModal()
      // Reload students
      await store.loadStudents()
    }
  } else {
    // Add new student
    if (store.isParent) {
      // Parent thêm học sinh - gọi API (parent_id sẽ tự động lấy từ currentUser)
      const result = await store.addStudent(formData)
      if (!result.success) {
        alert(result.message || 'Thêm học sinh thất bại')
      } else {
        closeModal()
      }
    } else if (store.isManager) {
      // Manager thêm học sinh - gọi API với parent_id nếu có
      // Nếu có parent info, cần tìm hoặc tạo parent trước
      let parentId = null
      
      if (formData.parentPhone || formData.parentEmail) {
        // Tìm parent theo phone hoặc email
        const existingParent = store.parents.find(p => 
          p.phone === formData.parentPhone || p.email === formData.parentEmail
        )
        
        if (existingParent) {
          parentId = existingParent.id
        } else if (formData.parentName && (formData.parentPhone || formData.parentEmail)) {
          // Tạo parent mới nếu chưa có
          const newParent = store.addParent({
            name: formData.parentName,
            phone: formData.parentPhone,
            email: formData.parentEmail
          })
          parentId = newParent?.id
        }
      }
      
      // Thêm parent_id vào formData nếu có
      const studentData = { ...formData }
      if (parentId) {
        studentData.parent_id = parentId
      }
      
      const result = await store.addStudent(studentData)
      if (!result.success) {
        alert(result.message || 'Thêm học sinh thất bại')
      } else {
        closeModal()
      }
    }
  }
}

const confirmDelete = async (student) => {
  if (!confirm(`Bạn có chắc chắn muốn xóa học sinh "${student.name}"?`)) {
    return
  }
  
  const result = await store.deleteStudent(student.id)
  if (!result.success) {
    alert(result.message || 'Xóa học sinh thất bại')
  } else {
    // Reload students
    await store.loadStudents()
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}
</script>

