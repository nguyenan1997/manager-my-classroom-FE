<template>
  <div id="app" class="min-h-screen flex flex-col">
    <Navbar v-if="!isAuthPage" />
    <main :class="isAuthPage ? '' : 'container mx-auto px-4 py-8 flex-1'">
      <router-view />
    </main>
    <Footer v-if="!isAuthPage" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
const isAuthPage = computed(() => route.name === 'Auth')
</script>

