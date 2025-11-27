<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="close">
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEdit ? 'Chỉnh sửa học sinh' : 'Thêm học sinh mới' }}
          </h2>
          <button @click="close" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Nhập họ và tên"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ngày sinh *</label>
              <input
                v-model="formData.dob"
                type="date"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Giới tính *</label>
              <select
                v-model="formData.gender"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Lớp hiện tại *</label>
            <input
              v-model="formData.current_grade"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ví dụ: 5, 6, 7, 8, 9, 10, 11, 12"
            />
            <p class="text-xs text-gray-500 mt-1">Nhập lớp hiện tại của học sinh</p>
          </div>

          <!-- Parent Information - Chỉ hiển thị cho Manager -->
          <div v-if="isManager" class="border-t pt-4">
            <h3 class="text-lg font-semibold mb-4">Thông tin phụ huynh</h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tên phụ huynh</label>
              <input
                v-model="formData.parentName"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tên phụ huynh"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">SĐT phụ huynh</label>
                <input
                  v-model="formData.parentPhone"
                  type="tel"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0123456789"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email phụ huynh</label>
                <input
                  v-model="formData.parentEmail"
                  type="email"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
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
              class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {{ isEdit ? 'Cập nhật' : 'Thêm mới' }}
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
  student: Object
})

const emit = defineEmits(['close', 'submit'])

const store = useAppStore()
const isEdit = ref(false)
const isManager = computed(() => store.isManager)

const formData = ref({
  name: '',
  dob: '',
  gender: '',
  current_grade: '',
  parentName: '',
  parentPhone: '',
  parentEmail: ''
})

const resetForm = () => {
  formData.value = {
    name: '',
    dob: '',
    gender: '',
    current_grade: '',
    parentName: '',
    parentPhone: '',
    parentEmail: ''
  }
}

watch(() => props.student, (newStudent) => {
  if (newStudent) {
    isEdit.value = true
    formData.value = {
      name: newStudent.name || '',
      dob: newStudent.dob || newStudent.dateOfBirth || '',
      gender: newStudent.gender || '',
      current_grade: newStudent.current_grade || '',
      parentName: newStudent.parentName || '',
      parentPhone: newStudent.parentPhone || '',
      parentEmail: newStudent.parentEmail || ''
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

