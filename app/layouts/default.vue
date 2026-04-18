<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <div class="flex-grow flex flex-col relative">
      <slot />
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
</script>
