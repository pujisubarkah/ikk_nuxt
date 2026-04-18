<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <div class="flex min-h-screen flex-col transition-all duration-300" :style="contentWrapperStyle">
      <HeaderProfile class="shrink-0" />
      <main class="flex-1 px-4 py-4 md:px-6 md:py-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import HeaderProfile from '@/components/HeaderProfile.vue';
import { useSidebarShell } from '@/composables/useSidebarShell';

const isMobile = ref(false);
const { isMobileSidebarOpen, isDesktopSidebarCollapsed } = useSidebarShell();

const contentWrapperStyle = computed(() => {
  if (isMobile.value) {
    return {
      marginLeft: `${isMobileSidebarOpen.value ? 0 : 72}px`,
    };
  }

  return {
    marginLeft: `${isDesktopSidebarCollapsed.value ? 72 : 230}px`,
  };
});

function checkScreenSize() {
  isMobile.value = window.innerWidth < 1024;
}

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize);
});
</script>
