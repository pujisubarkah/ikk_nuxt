<template>
  <aside
    class="flex flex-col h-[720px] border-r border-neutral-200 transition-all duration-300 ease-in-out px-4 w-fit"
  >
    <!-- HEADER -->
    <header :class="['flex flex-col', justifyClass]">
      <div :class="['flex items-center h-20 border-b border-neutral-200 pb-4 mb-4', justifyClass]">
        <!-- Logo -->
        <img v-if="!collapsed" :src="illustrasiImage" alt="Your Logo" class="w-full max-w-32" />

        <!-- Collapsed Button -->
        <div class="flex items-center gap-2">
          <Button v-if="!collapsed" hierarchy="tertiary" size="sm">
            <IconBell :size="24" />
          </Button>
          <Button hierarchy="tertiary" size="sm" @click="collapsed = !collapsed">
            <IconLayoutSidebarLeftCollapse
              :size="24"
              :class="collapsed ? 'transform scale-x-[-1]' : ''"
            />
          </Button>
        </div>
      </div>
    </header>

    <div class="flex flex-col h-full justify-between">
      <!-- NAVIGATION -->
      <div
        v-for="group in menuGroups"
        :key="group.key"
        class="flex flex-col gap-2"
      >
        <Button
          v-for="item in group.items"
          :key="item.key"
          hierarchy="link"
          @click="handleNavigate(item.to)"
          :class="navButtonClass(item.key)"
        >
          <template #prefixIcon>
            <component :is="item.icon" :size="16" />
          </template>
          <span :class="collapseClass">{{ item.label }}</span>
        </Button>
      </div>
    </div>

    <!-- FOOTER -->
    <footer class="flex flex-col gap-4 mt-4 border-t border-neutral-200 pt-4">
      <!-- USER -->
      <div :class="['flex items-center pb-2', justifyClass]">
        <Avatar :size="40" initials="HA" />
        <div :class="['flex flex-col items-start', collapseClass]">
          <span class="text-xs md:text-sm">Haechal Abdillah Suhendar</span>
          <span class="text-xs md:text-sm">Product Designer</span>
        </div>
        <div :class="collapseClass">
          <Button hierarchy="tertiary" size="sm">
            <IconDotsVertical :size="16" />
          </Button>
        </div>
      </div>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Button, Avatar } from '@idds/vue';
import {
  IconDotsVertical,
  IconBell,
  IconLayoutSidebarLeftCollapse,
} from '@tabler/icons-vue';
import { useMenuConfiguration } from '@/composables/useMenuConfiguration';
// Ganti path gambar sesuai struktur assets Anda
const illustrasiImage = '/app/assets/pattern/navbar/navbar-code-examples.svg';

const collapsed = ref(false);
const { menuGroups } = useMenuConfiguration();
const route = useRoute();
const router = useRouter();

const activeKey = computed(() => {
  for (const group of menuGroups) {
    const match = group.items.find((item) => route.path === item.to || route.path.startsWith(`${item.to}/`));
    if (match) {
      return match.key;
    }
  }

  return 'overview';
});

const collapseClass = computed(() => {
  return [
    'overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out',
    collapsed.value
      ? 'max-w-0 opacity-0 -translate-x-2 pointer-events-none hidden'
      : 'max-w-[220px] opacity-100 translate-x-0',
  ].join(' ');
});

const justifyClass = computed(() => {
  return collapsed.value ? 'justify-center' : 'justify-between';
});

const navButtonClass = (key: string) => {
  return [
    'p-2 transition-colors duration-100',
    activeKey.value === key ? 'bg-guide-100 font-semibold' : 'text-neutral-500',
    !collapsed.value ? 'justify-start gap-2' : 'justify-center gap-0',
  ].join(' ');
};

function handleNavigate(to: string) {
  router.push(to);
}
</script>
