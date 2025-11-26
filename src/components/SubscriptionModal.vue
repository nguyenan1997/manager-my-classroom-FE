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
              v-model="formData.studentId"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Chọn học sinh</option>
              <option v-for="student in students" :key="student.id" :value="student.id">
                {{ student.name }} - {{ student.phone }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên gói học *</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ví dụ: Gói 20 buổi"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tổng số buổi *</label>
              <input
                v-model.number="formData.totalSessions"
                type="number"
                required
                min="1"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="20"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
              <input
                v-model.number="formData.price"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="2000000"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
              <input
                v-model="formData.startDate"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
              <input
                v-model="formData.expiryDate"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              v-model="formData.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="active">Đang hoạt động</option>
              <option value="expired">Hết hạn</option>
              <option value="completed">Hoàn thành</option>
              <option value="paused">Tạm dừng</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
            <textarea
              v-model="formData.notes"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ghi chú về gói học"
            ></textarea>
          </div>

          <div v-if="isEdit" class="bg-gray-50 p-4 rounded-lg">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-600">Đã sử dụng:</p>
                <p class="text-lg font-semibold text-orange-600">{{ formData.usedSessions || 0 }} buổi</p>
              </div>
              <div>
                <p class="text-gray-600">Còn lại:</p>
                <p class="text-lg font-semibold text-green-600">{{ formData.remainingSessions || 0 }} buổi</p>
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

const students = computed(() => store.students)

const formData = ref({
  studentId: '',
  name: '',
  totalSessions: 0,
  price: 0,
  startDate: '',
  expiryDate: '',
  status: 'active',
  notes: '',
  usedSessions: 0,
  remainingSessions: 0
})

watch(() => props.subscription, (newSub) => {
  if (newSub) {
    isEdit.value = true
    formData.value = {
      studentId: newSub.studentId || '',
      name: newSub.name || '',
      totalSessions: newSub.totalSessions || 0,
      price: newSub.price || 0,
      startDate: newSub.startDate || '',
      expiryDate: newSub.expiryDate || '',
      status: newSub.status || 'active',
      notes: newSub.notes || '',
      usedSessions: newSub.usedSessions || 0,
      remainingSessions: newSub.remainingSessions || 0
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

watch(() => formData.value.totalSessions, (newTotal) => {
  if (!isEdit.value) {
    formData.value.remainingSessions = newTotal - (formData.value.usedSessions || 0)
  }
})

const resetForm = () => {
  formData.value = {
    studentId: '',
    name: '',
    totalSessions: 0,
    price: 0,
    startDate: '',
    expiryDate: '',
    status: 'active',
    notes: '',
    usedSessions: 0,
    remainingSessions: 0
  }
}

const handleSubmit = () => {
  emit('submit', { ...formData.value })
  close()
}

const close = () => {
  emit('close')
  resetForm()
}
</script>

