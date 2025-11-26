<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <section class="text-center py-16">
      <h1 class="text-5xl font-bold text-gray-900 mb-4">
        Chào mừng đến với
        <span class="text-primary-600">PV Technical</span>
      </h1>
      <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Dự án Frontend hiện đại được xây dựng với Vue.js và Tailwind CSS
      </p>
      <div class="flex justify-center space-x-4">
        <button class="btn btn-primary">
          Bắt đầu
        </button>
        <button class="btn btn-secondary">
          Tìm hiểu thêm
        </button>
      </div>
    </section>

    <!-- Features Section -->
    <section>
      <h2 class="text-3xl font-bold text-center mb-12">Tính năng</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card hover:shadow-lg transition-shadow duration-300">
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">Hiệu suất cao</h3>
          <p class="text-gray-600">
            Được xây dựng với Vite để có tốc độ phát triển và build nhanh chóng
          </p>
        </div>

        <div class="card hover:shadow-lg transition-shadow duration-300">
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">UI đẹp mắt</h3>
          <p class="text-gray-600">
            Sử dụng Tailwind CSS để tạo giao diện hiện đại và responsive
          </p>
        </div>

        <div class="card hover:shadow-lg transition-shadow duration-300">
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">An toàn & Ổn định</h3>
          <p class="text-gray-600">
            Vue.js 3 với Composition API cho code dễ bảo trì và mở rộng
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

