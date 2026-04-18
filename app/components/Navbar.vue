
<template>
  <nav class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="text-xl font-semibold text-[#16578d] tracking-wide">
          Indeks Kualitas Kebijakan
        </div>

        <div class="hidden md:flex space-x-6">
          <NuxtLink
            v-for="item in navItems"
            :key="item.href"
            :to="item.href"
            class="text-base text-gray-700 hover:text-[#16578d] font-medium transition duration-200 px-3 py-1 rounded hover:bg-blue-100"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
        <div class="flex items-center space-x-4">
          <img src="/lanri_.png" alt="LAN RI" width="80" height="40" class="h-10 w-auto object-contain" />
          <img src="/ikk_logo.png" alt="IKK" width="80" height="40" class="h-10 w-auto object-contain" />
        </div>
        <div class="md:hidden flex items-center">
          <button @click="open = !open" class="text-[#16578d] focus:outline-none">
            <component :is="open ? XIcon : MenuIcon" :size="28" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="open" class="md:hidden px-4 pb-4 bg-white border-t border-gray-100">
      <NuxtLink
        v-for="item in navItems"
        :key="item.href"
        :to="item.href"
        class="block py-2 px-3 text-base text-gray-700 hover:text-[#16578d] font-medium transition rounded hover:bg-blue-100"
        @click="open = false"
      >
        {{ item.label }}
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { IconMenu2, IconX } from '@tabler/icons-vue';

const navItems = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang', href: '/tentang' },
  { label: 'Panduan', href: '/panduan' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Helpdesk', href: '/desk' },
  { label: 'Login', href: '/login' },
];

const open = ref(false);
const MenuIcon = IconMenu2;
const XIcon = IconX;
</script>
