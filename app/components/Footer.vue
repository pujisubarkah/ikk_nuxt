<template>
  <footer class="bg-[#16578d] text-white py-4 mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <p>&copy; {{ year }} Sistem Informasi Indeks Kualitas Kebijakan</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>
