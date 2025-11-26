<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="close">
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEdit ? 'Chỉnh sửa lớp học' : 'Tạo lớp học mới' }}
          </h2>
          <button @click="close" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên lớp học *</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ví dụ: Toán lớp 5A"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu *</label>
              <input
                v-model="formData.startDate"
                type="date"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
              <input
                v-model="formData.endDate"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Thời gian học *</label>
              <input
                v-model="formData.time"
                type="time"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Thời lượng (phút) *</label>
              <input
                v-model.number="formData.duration"
                type="number"
                required
                min="30"
                step="15"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="90"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Lịch học trong tuần *</label>
            <div class="flex flex-wrap gap-2">
              <label
                v-for="day in weekDays"
                :key="day.value"
                class="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="day.value"
                  v-model="formData.schedule"
                  class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span class="text-sm text-gray-700">{{ day.label }}</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Học sinh tham gia</label>
            <select
              v-model="formData.studentIds"
              multiple
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px]"
            >
              <option v-for="student in students" :key="student.id" :value="student.id">
                {{ student.name }} - {{ student.phone }}
              </option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Giữ Ctrl (Cmd trên Mac) để chọn nhiều học sinh</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
            <textarea
              v-model="formData.notes"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ghi chú về lớp học"
            ></textarea>
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
              {{ isEdit ? 'Cập nhật' : 'Tạo lớp' }}
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
  classData: Object
})

const emit = defineEmits(['close', 'submit'])

const store = useAppStore()
const isEdit = ref(false)

const weekDays = [
  { label: 'Thứ 2', value: 'monday' },
  { label: 'Thứ 3', value: 'tuesday' },
  { label: 'Thứ 4', value: 'wednesday' },
  { label: 'Thứ 5', value: 'thursday' },
  { label: 'Thứ 6', value: 'friday' },
  { label: 'Thứ 7', value: 'saturday' },
  { label: 'Chủ nhật', value: 'sunday' }
]

const students = computed(() => store.students)

const formData = ref({
  name: '',
  startDate: '',
  endDate: '',
  time: '',
  duration: 90,
  schedule: [],
  studentIds: [],
  notes: ''
})

watch(() => props.classData, (newClass) => {
  if (newClass) {
    isEdit.value = true
    formData.value = {
      name: newClass.name || '',
      startDate: newClass.startDate || '',
      endDate: newClass.endDate || '',
      time: newClass.time || '',
      duration: newClass.duration || 90,
      schedule: newClass.schedule || [],
      studentIds: newClass.studentIds || [],
      notes: newClass.notes || ''
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

const resetForm = () => {
  formData.value = {
    name: '',
    startDate: '',
    endDate: '',
    time: '',
    duration: 90,
    schedule: [],
    studentIds: [],
    notes: ''
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

