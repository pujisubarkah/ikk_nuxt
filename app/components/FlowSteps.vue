<template>
  <div class="flex flex-col items-center gap-8 py-10 px-4">
    <div class="flex flex-wrap justify-center gap-8">
      <TransitionGroup name="fade-up" tag="div" class="flex flex-wrap justify-center gap-8 w-full">
        <div
          v-for="(step, index) in steps"
          :key="step.number"
          class="flex flex-col items-center text-center max-w-[200px]"
          :style="{ transitionDelay: `${index * 0.2}s` }"
        >
          <div class="bg-[#16578D] text-white w-10 h-10 rounded-full flex items-center justify-center mb-3 font-bold">
            {{ step.number }}
          </div>
          <component :is="step.icon" class="text-[#16578D] text-4xl mb-2" aria-hidden="true" />
          <p class="font-semibold text-[#16578D]">{{ step.title }}</p>
          <p v-if="step.subtitle" class="text-sm text-gray-600 mt-1">{{ step.subtitle }}</p>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IconClipboardList,
  IconDownload,
  IconUsers,
  IconPalette,
  IconUserCheck,
  IconMessage,
} from '@tabler/icons-vue';

const steps = [
  {
    number: '01',
    icon: IconClipboardList,
    title: 'Self Assessment',
    subtitle: '(Admin Instansi dan Enumerator)',
  },
  {
    number: '02',
    icon: IconDownload,
    title: 'Desk Analysis',
    subtitle: '(Koordinator Instansi)',
  },
  {
    number: '03',
    icon: IconUsers,
    title: 'Board Member Meeting I',
    subtitle: 'Forum pemaparan hasil desk analysis...',
  },
  {
    number: '04',
    icon: IconPalette,
    title: 'Validasi',
    subtitle: '(Koordinator Utama)',
  },
  {
    number: '05',
    icon: IconUserCheck,
    title: 'Board Member Meeting II',
    subtitle: 'Forum pemaparan hasil validasi final...',
  },
  {
    number: '06',
    icon: IconMessage,
    title: 'Sharing Cerita Perubahan',
  },
];
</script>

<style scoped>
.fade-up-enter-active {
  transition: all 0.5s cubic-bezier(0.4,0,0.2,1);
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
