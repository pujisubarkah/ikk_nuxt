
<template>
  <nav class="bg-white shadow-md px-6 py-3 flex items-center justify-between">
    <!-- Logo & Images -->
    <div class="flex items-center gap-3">
      <img src="/lanri_.png" alt="LAN RI" width="48" height="32" class="h-8 w-auto object-contain" />
      <img src="/ikk_logo.png" alt="IKK" width="48" height="32" class="h-8 w-auto object-contain" />
      <span class="text-xl font-semibold text-blue-700">Indeks Kualitas Kebijakan</span>
    </div>

    <!-- Menu -->
    <ul class="hidden md:flex items-center gap-6 text-gray-700 font-medium">
      <li>
        <NuxtLink to="/">Beranda</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/penilaian">Penilaian</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/hasil">Hasil</NuxtLink>
      </li>
      <!-- Pengembangan Dropdown -->
      <li class="relative">
        <Menu as="div" class="relative inline-block text-left">
          <MenuButton as="button" class="cursor-pointer flex items-center gap-1 focus:outline-none">
            Pengembangan ▾
          </MenuButton>
          <MenuItems class="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg focus:outline-none">
            <div class="py-1">
              <MenuItem v-slot="{ active }">
                <NuxtLink :class="[active ? 'bg-gray-100' : '', 'px-4 py-2 block']" to="/panduan">📚 Panduan</NuxtLink>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <NuxtLink :class="[active ? 'bg-gray-100' : '', 'px-4 py-2 block']" to="/lms">🎓 LMS</NuxtLink>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <NuxtLink :class="[active ? 'bg-gray-100' : '', 'px-4 py-2 block']" to="/forum">💬 Forum</NuxtLink>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </li>
      <!-- Bantuan Dropdown -->
      <li class="relative">
        <Menu as="div" class="relative inline-block text-left">
          <MenuButton as="button" class="cursor-pointer flex items-center gap-1 focus:outline-none">
            Bantuan ▾
          </MenuButton>
          <MenuItems class="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg focus:outline-none">
            <div class="py-1">
              <MenuItem v-slot="{ active }">
                <NuxtLink :class="[active ? 'bg-gray-100' : '', 'px-4 py-2 block']" to="/faq">❓ FAQ</NuxtLink>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <NuxtLink :class="[active ? 'bg-gray-100' : '', 'px-4 py-2 block']" to="/helpdesk">📞 Helpdesk</NuxtLink>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </li>
      <!-- Login -->
      <li>
        <NuxtLink 
          to="/login"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Login
        </NuxtLink>
      </li>
    </ul>
    <!-- Mobile Button -->
    <button @click="isOpen = !isOpen" class="md:hidden">
      ☰
    </button>
  </nav>
  <!-- Mobile Menu -->
  <div v-if="isOpen" class="md:hidden bg-white shadow-md px-6 py-4 space-y-3">
    <NuxtLink to="/">Beranda</NuxtLink>
    <NuxtLink to="/penilaian">Penilaian</NuxtLink>
    <NuxtLink to="/hasil">Hasil</NuxtLink>
    <div>
      <p class="font-semibold">Pengembangan</p>
      <NuxtLink to="/panduan" class="block ml-2">Panduan</NuxtLink>
      <NuxtLink to="/lms" class="block ml-2">LMS</NuxtLink>
      <NuxtLink to="/forum" class="block ml-2">Forum</NuxtLink>
    </div>
    <div>
      <p class="font-semibold">Bantuan</p>
      <NuxtLink to="/faq" class="block ml-2">FAQ</NuxtLink>
      <NuxtLink to="/helpdesk" class="block ml-2">Helpdesk</NuxtLink>
    </div>
    <NuxtLink to="/login" class="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center">
      Login
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
const isOpen = ref(false)
</script>
