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
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ví dụ: Lớp Toán 5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Môn học *</label>
            <input
              v-model="formData.subject"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ví dụ: Toán"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Thứ trong tuần *</label>
              <select
                v-model="formData.day_of_week"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Chọn thứ</option>
                <option value="Monday">Thứ 2</option>
                <option value="Tuesday">Thứ 3</option>
                <option value="Wednesday">Thứ 4</option>
                <option value="Thursday">Thứ 5</option>
                <option value="Friday">Thứ 6</option>
                <option value="Saturday">Thứ 7</option>
                <option value="Sunday">Chủ nhật</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Khung giờ học *</label>
              <input
                v-model="formData.time_slot"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ví dụ: 18:00-19:30"
              />
              <p class="text-xs text-gray-500 mt-1">Định dạng: HH:mm-HH:mm</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tên giáo viên *</label>
              <input
                v-model="formData.teacher_name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ví dụ: Cô Lan"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Số học sinh tối đa *</label>
              <input
                v-model.number="formData.max_students"
                type="number"
                required
                min="1"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="20"
              />
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
              {{ isEdit ? 'Cập nhật' : 'Tạo lớp' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  classData: Object
})

const emit = defineEmits(['close', 'submit'])

const isEdit = ref(false)
const formData = ref({
  name: '',
  subject: '',
  day_of_week: '',
  time_slot: '',
  teacher_name: '',
  max_students: 20
})

const resetForm = () => {
  formData.value = {
    name: '',
    subject: '',
    day_of_week: '',
    time_slot: '',
    teacher_name: '',
    max_students: 20
  }
}

watch(() => props.classData, (newClass) => {
  if (newClass) {
    isEdit.value = true
    formData.value = {
      name: newClass.name || '',
      subject: newClass.subject || '',
      day_of_week: newClass.day_of_week || '',
      time_slot: newClass.time_slot || '',
      teacher_name: newClass.teacher_name || '',
      max_students: newClass.max_students || 20
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
