<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p class="text-gray-600">Tổng quan hệ thống quản lý học sinh</p>
      </div>
      <router-link
        v-if="store.isParent"
        to="/students"
        class="btn btn-primary flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Thêm học sinh</span>
      </router-link>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Tổng học sinh</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalStudents }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Tổng lớp học</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalClasses }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Tổng gói học</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalSubscriptions }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Buổi học đã dùng</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalUsedSessions }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <h2 class="text-xl font-semibold mb-4">Học sinh mới nhất</h2>
        <div class="space-y-3">
          <div v-for="student in recentStudents" :key="student.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium text-gray-900">{{ student.name }}</p>
              <p class="text-sm text-gray-600">{{ student.email || student.phone }}</p>
            </div>
            <span class="text-xs text-gray-500">{{ formatDate(student.createdAt) }}</span>
          </div>
          <p v-if="recentStudents.length === 0" class="text-gray-500 text-center py-4">Chưa có học sinh nào</p>
        </div>
      </div>

      <div class="card">
        <h2 class="text-xl font-semibold mb-4">Gói học sắp hết</h2>
        <div class="space-y-3">
          <div v-for="sub in lowSessions" :key="sub.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium text-gray-900">{{ getStudentName(sub.studentId) }}</p>
              <p class="text-sm text-gray-600">{{ sub.remainingSessions }} buổi còn lại</p>
            </div>
            <span :class="sub.remainingSessions <= 5 ? 'text-red-600' : 'text-orange-600'" class="text-sm font-semibold">
              {{ sub.remainingSessions }}/{{ sub.totalSessions }}
            </span>
          </div>
          <p v-if="lowSessions.length === 0" class="text-gray-500 text-center py-4">Tất cả gói học đều đủ</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/useAppStore'

const store = useAppStore()

const stats = computed(() => ({
  totalStudents: store.students.length,
  totalClasses: store.classes.length,
  totalSubscriptions: store.subscriptions.length,
  totalUsedSessions: store.subscriptions.reduce((sum, sub) => sum + sub.usedSessions, 0)
}))

const recentStudents = computed(() => {
  return [...store.students]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

const lowSessions = computed(() => {
  return store.subscriptions
    .filter(sub => sub.remainingSessions <= 10)
    .sort((a, b) => a.remainingSessions - b.remainingSessions)
    .slice(0, 5)
})

const getStudentName = (studentId) => {
  const student = store.getStudentById(studentId)
  return student ? student.name : 'Không tìm thấy'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}
</script>

