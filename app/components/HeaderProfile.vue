<template>
  <header class="w-full border-b-2 border-[#1f4f85]/30 bg-gradient-to-r from-[#1f4f85] to-[#1a6cb5] shadow-md">
    <div class="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-start md:justify-between md:px-6">
      <!-- Kiri: Informasi halaman -->
      <div class="flex min-w-0 items-start gap-3 text-left">
        <button
          type="button"
          class="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
          @click="toggleSidebar"
          aria-label="Toggle sidebar"
        >
          <IconMenu2 :size="18" />
        </button>

        <div>
        <span class="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/90">
          Command Center
        </span>
        <h1 class="mt-2 text-xl font-bold leading-tight text-white md:text-2xl">
          {{ roleLabel }}
        </h1>
        </div>
      </div>

      <!-- Kanan: Aksi dan profil -->
      <div class="flex items-center gap-3 self-start md:self-center">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
        >
          <IconBell :size="16" />
          Notifikasi
        </button>

        <UiDropdownmenu>
          <template #trigger>
            <button
              type="button"
              class="inline-flex items-center gap-3 rounded-lg bg-white/10 px-2.5 py-2 text-left transition-colors hover:bg-white/20"
            >
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1f4f85]">
                <span class="text-xs font-semibold">{{ userInitials }}</span>
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-white">{{ displayName || 'User' }}</p>
                <p class="truncate text-xs text-white/70">{{ roleLabel }}</p>
              </div>
              <IconChevronDown :size="16" class="text-white/70" />
            </button>
          </template>
          <template #content>
            <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#16578D] transition-colors" @click="ubahSandi">Ubah Sandi</button>
            <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#16578D] transition-colors" @click="ubahTelepon">Ubah No Telepon</button>
            <button class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors" @click="handleLogout">Logout</button>
          </template>
        </UiDropdownmenu>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { IconBell, IconChevronDown, IconMenu2 } from '@tabler/icons-vue';
import UiDropdownmenu from '@/components/UI/UiDropdownmenu.vue';
import { useSidebarShell } from '@/composables/useSidebarShell';

const user = ref<{ name: string; role: string } | null>(null);
const authStore = useAuthStore();
const router = useRouter();
const isMobile = ref(false);
const { isMobileSidebarOpen, isDesktopSidebarCollapsed } = useSidebarShell();

const displayName = computed(() => user.value?.name || authStore.name || '');
const roleLabel = computed(() => user.value?.role || authStore.role || 'Dashboard');
const userInitials = computed(() => {
  const fullName = displayName.value.trim();
  if (!fullName) return 'US';

  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return initials || 'US';
});

const fetchUserData = async () => {
  // Ganti dengan API user yang sesuai jika ada
  try {
    // Jika sudah login, ambil dari store
    if (authStore.isAuthenticated) {
      user.value = { name: authStore.name, role: authStore.role };
      return;
    }
    // Jika ingin fetch dari API:
    // const response = await fetch('/api/users');
    // const data = await response.json();
    // user.value = data;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    user.value = null;
  }
};

function checkScreenSize() {
  isMobile.value = window.innerWidth < 1024;
}

onMounted(() => {
  fetchUserData();
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

function handleLogout() {
  authStore.clearAuth();
  router.push('/login');
}
function ubahSandi() {
  alert('Ubah Sandi Clicked');
}
function ubahTelepon() {
  alert('Ubah No Telepon Clicked');
}
</script>
