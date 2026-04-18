<template>
  <div class="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-6 shadow-sm">
    <p class="text-sm uppercase tracking-wide text-blue-700 font-semibold mb-2">
      Countdown Pelaksanaan
    </p>
    <h3 class="text-2xl md:text-3xl font-bold text-[#16578d] mb-6">
      Pengukuran Kualitas Kebijakan 2026
    </h3>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      <div v-for="item in countdownItems" :key="item.label" class="rounded-xl bg-white border border-blue-100 p-4">
        <p class="text-2xl md:text-3xl font-bold text-[#16578d] leading-none">{{ item.value }}</p>
        <p class="text-xs md:text-sm text-gray-600 mt-2">{{ item.label }}</p>
      </div>
    </div>

    <p class="text-xs text-gray-500 mt-4">
      Menuju {{ formattedTargetDate }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const targetDate = new Date('2026-12-31T23:59:59+07:00');
const now = ref(new Date());
let timer: ReturnType<typeof setInterval> | null = null;

const diffMs = computed(() => {
  const value = targetDate.getTime() - now.value.getTime();
  return value > 0 ? value : 0;
});

const days = computed(() => Math.floor(diffMs.value / (1000 * 60 * 60 * 24)));
const hours = computed(() => Math.floor((diffMs.value / (1000 * 60 * 60)) % 24));
const minutes = computed(() => Math.floor((diffMs.value / (1000 * 60)) % 60));
const seconds = computed(() => Math.floor((diffMs.value / 1000) % 60));

const countdownItems = computed(() => [
  { label: 'Hari', value: String(days.value).padStart(2, '0') },
  { label: 'Jam', value: String(hours.value).padStart(2, '0') },
  { label: 'Menit', value: String(minutes.value).padStart(2, '0') },
  { label: 'Detik', value: String(seconds.value).padStart(2, '0') },
]);

const formattedTargetDate = computed(() => {
  return targetDate.toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
