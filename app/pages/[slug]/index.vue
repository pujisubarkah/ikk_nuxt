<template>
  <!-- Loading -->
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
      <p class="text-gray-600">Memuat dashboard...</p>
    </div>
  </div>

  <!-- Role tidak ditemukan -->
  <div v-else-if="!authStore.isAuthenticated" class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <p class="text-red-600 mb-4">Sesi tidak ditemukan. Silakan login kembali.</p>
      <NuxtLink
        to="/login"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Kembali ke Login
      </NuxtLink>
    </div>
  </div>

  <!-- Dashboard berdasarkan role_id -->
  <div v-else>
    <component :is="dashboardComponent" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'sidebar' });

import { computed, defineAsyncComponent } from 'vue';
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();

// isLoading true selama store belum terhidrasi (persist plugin async)
const isLoading = computed(() => authStore.role_id === null && !authStore.isAuthenticated === false);

// Lazy-load dashboard per role agar tidak dimuat semua sekaligus
const dashboardMap: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  '1': defineAsyncComponent(() => import('@/components/dashboard/AdminDashboard.vue')),
  '2': defineAsyncComponent(() => import('@/components/dashboard/KoornasDashboard.vue')),
  '3': defineAsyncComponent(() => import('@/components/dashboard/InstansiDashboard.vue')),
  '4': defineAsyncComponent(() => import('@/components/dashboard/KoorinsDashboard.vue')),
  '5': defineAsyncComponent(() => import('@/components/dashboard/EnumeratorDashboard.vue')),
};

const dashboardComponent = computed(() => {
  const roleId = String(authStore.role_id ?? '');
  return dashboardMap[roleId] ?? dashboardMap['4'];
});
</script>