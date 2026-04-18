<template>
  <div>
    <!-- Mobile overlay -->
    <div
      v-if="isMobile && isMobileSidebarOpen"
      class="fixed inset-0 bg-black/50 z-20"
      @click="toggleSidebar"
    />

    <aside
      :class="[
        'main-sidebar bg-[#1f4f85] text-white flex flex-col overflow-hidden z-30 transition-all duration-300 ease-in-out',
        { rail: isRail },
      ]"
      :style="{ width: `${sidebarWidth}px` }"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div class="sidebar-logo flex justify-center items-center mt-6 mb-4">
        <NuxtLink :to="menuGroups[0]?.items[0]?.to || '/'" class="focus:outline-none">
          <img src="/lanri.png" alt="Logo SIKLAN" class="h-12 md:h-[50px] w-auto cursor-pointer" />
        </NuxtLink>
      </div>

      <form v-if="!isRail" class="sidebar-form px-4 mb-2" @submit.prevent>
        <div class="flex rounded overflow-hidden bg-gray-200">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="flex-1 px-3 py-2 text-sm"
            aria-label="Search menu"
          />
          <button type="submit" class="px-3 flex items-center justify-center" aria-label="Submit search">
            <IconSearch :size="18" />
          </button>
        </div>
      </form>

      <div class="divider my-2 border-t border-gray-300 mx-2" v-if="!isRail" />

      <ul class="sidebar-menu flex-1 px-2 overflow-y-auto">
        <template v-for="group in filteredMenuGroups" :key="group.key">
          <li v-if="!isRail" class="header text-xs text-blue-200 tracking-wider py-2 px-3 font-semibold uppercase">
            {{ group.groupLabel || 'Menu Navigasi' }}
          </li>
          <li v-for="item in group.items" :key="item.key">
            <NuxtLink
              :to="item.to"
              :title="isRail ? item.label : undefined"
              :class="[
                'menu-item py-2.5 px-3 rounded transition-colors',
                isActive(item.to)
                  ? 'bg-emerald-600 text-white'
                  : 'hover:bg-blue-900/70',
              ]"
              @click="closeSidebarOnMobile"
            >
              <component :is="item.icon" :size="20" class="flex-shrink-0" />
              <span v-if="!isRail" class="text-sm font-medium truncate">{{ item.label }}</span>
            </NuxtLink>
          </li>
        </template>
      </ul>

      <button
        v-if="isMobile && isMobileSidebarOpen"
        class="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-md"
        @click="toggleSidebar"
        aria-label="Close sidebar"
      >
        <IconX :size="20" />
      </button>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import { IconX, IconSearch } from '@tabler/icons-vue';
import { useMenuConfiguration } from '@/composables/useMenuConfiguration';
import { useSidebarShell } from '@/composables/useSidebarShell';

const { menuGroupsRole1: menuGroups } = useMenuConfiguration();
const { isMobileSidebarOpen, isDesktopSidebarCollapsed } = useSidebarShell();
const route = useRoute();

const isMobile = ref(false);
const isRail = computed(() => {
  if (isMobile.value) return !isMobileSidebarOpen.value;
  return isDesktopSidebarCollapsed.value;
});
const searchQuery = ref('');

const sidebarWidth = computed(() => {
  if (isMobile.value) {
    return isMobileSidebarOpen.value ? 256 : 72;
  }
  return isDesktopSidebarCollapsed.value ? 72 : 230;
});

const filteredMenuGroups = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return menuGroups.value;

  return menuGroups.value
    .map((group) => {
      const items = group.items.filter((item) => item.label.toLowerCase().includes(query));
      return {
        ...group,
        items,
      };
    })
    .filter((group) => group.items.length > 0);
});

function checkScreenSize() {
  isMobile.value = window.innerWidth < 1024;
  if (window.innerWidth >= 1024) {
    isMobileSidebarOpen.value = false;
  }
}

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize);
});

function toggleSidebar() {
  if (isMobile.value) {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
    return;
  }

  isDesktopSidebarCollapsed.value = !isDesktopSidebarCollapsed.value;
}

function closeSidebarOnMobile() {
  if (isMobile.value) isMobileSidebarOpen.value = false;
}

function isActive(to: string) {
  return route.path === to || route.path.startsWith(`${to}/`);
}
</script>

<style scoped>
.main-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
}

.sidebar-menu {
  scrollbar-width: none;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-menu::-webkit-scrollbar {
  width: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  width: 100%;
}

.menu-item span {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.25;
}

.rail .menu-item {
  justify-content: center;
  gap: 0;
  padding: 12px;
}

.sidebar-form input {
  background-color: #f3f4f6 !important;
  border: 1px solid #e5e7eb !important;
  color: #222 !important;
  transition: background 0.2s, border 0.2s, color 0.2s;
}

.sidebar-form input::placeholder {
  color: #888 !important;
}

.sidebar-form input:focus,
.sidebar-form input:hover {
  background-color: #f3f4f6 !important;
  border-color: #60a5fa !important;
  color: #222 !important;
}

.sidebar-form button {
  background-color: #f3f4f6 !important;
  border: 1px solid #e5e7eb !important;
  color: #444 !important;
  transition: background 0.2s, border 0.2s, color 0.2s;
}

.sidebar-form button:focus,
.sidebar-form button:hover {
  background-color: #f3f4f6 !important;
  border-color: #60a5fa !important;
  color: #222 !important;
}
</style>
