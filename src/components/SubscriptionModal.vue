<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="close">
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEdit ? 'Chỉnh sửa gói học' : 'Tạo gói học mới' }}
          </h2>
          <button @click="close" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Học sinh *</label>
            <select
              v-model="formData.student_id"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Chọn học sinh</option>
              <option v-for="student in students" :key="student.id" :value="student.id">
                {{ student.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên gói học *</label>
            <input
              v-model="formData.package_name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ví dụ: Gói 20 buổi, Gói 3 tháng"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tổng số buổi *</label>
            <input
              v-model.number="formData.total_sessions"
              type="number"
              required
              min="1"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="20"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu *</label>
              <input
                v-model="formData.start_date"
                type="date"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
              <input
                v-model="formData.end_date"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">Tùy chọn</p>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="close"
              class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {{ isEdit ? 'Cập nhật' : 'Tạo gói' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useAppStore } from '../stores/useAppStore'

const props = defineProps({
  show: Boolean,
  subscription: Object
})

const emit = defineEmits(['close', 'submit'])

const store = useAppStore()
const isEdit = ref(false)

// Filter students based on user role
const students = computed(() => {
  if (store.isManager) {
    // Manager can see all students
    return store.students
  } else if (store.isParent) {
    // Parent can only see their own children
    return store.students.filter(student => 
      student.parent_id === store.currentUser?.id || 
      student.parentId === store.currentUser?.id
    )
  }
  return []
})

const formData = ref({
  student_id: '',
  package_name: '',
  total_sessions: 20,
  start_date: '',
  end_date: ''
})

const resetForm = () => {
  formData.value = {
    student_id: '',
    package_name: '',
    total_sessions: 20,
    start_date: '',
    end_date: ''
  }
}

watch(() => props.subscription, (newSub) => {
  if (newSub) {
    isEdit.value = true
    formData.value = {
      student_id: newSub.student_id || newSub.studentId || '',
      package_name: newSub.package_name || newSub.name || '',
      total_sessions: newSub.total_sessions || newSub.totalSessions || 20,
      start_date: newSub.start_date || newSub.startDate || '',
      end_date: newSub.end_date || newSub.endDate || newSub.expiryDate || ''
    }
  } else {
    isEdit.value = false
    resetForm()
  }
}, { immediate: true })

watch(() => props.show, (newShow) => {
  if (!newShow) {
    resetForm()
  }
})

const handleSubmit = () => {
  emit('submit', { ...formData.value })
  close()
}

const close = () => {
  emit('close')
  resetForm()
}
</script>
