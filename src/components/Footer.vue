<template>
  <footer class="bg-gray-800 text-white mt-auto">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-xl font-bold mb-4">PV Technical</h3>
          <p class="text-gray-400">
            Dự án Frontend sử dụng Vue.js và Tailwind CSS
          </p>
        </div>
        
        <div>
          <h4 class="text-lg font-semibold mb-4">Liên kết</h4>
          <ul class="space-y-2 text-gray-400">
            <li>
              <router-link to="/" class="hover:text-white transition-colors">
                Dashboard
              </router-link>
            </li>
            <li>
              <router-link to="/students" class="hover:text-white transition-colors">
                Học sinh
              </router-link>
            </li>
            <li>
              <router-link to="/classes" class="hover:text-white transition-colors">
                Lớp học
              </router-link>
            </li>
            <li>
              <router-link to="/subscriptions" class="hover:text-white transition-colors">
                Gói học
              </router-link>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 class="text-lg font-semibold mb-4">Thông tin</h4>
          <p class="text-gray-400">
            © 2024 PV Technical. All rights reserved.
          </p>
        </div>
      </div>
      
      <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
        <p>Built with Vue.js & Tailwind CSS</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

