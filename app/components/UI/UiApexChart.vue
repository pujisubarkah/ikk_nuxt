<template>
  <div class="h-full rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
    <component
      :is="vueApexChart"
      v-if="vueApexChart"
      class="w-full"
      :type="type"
      :height="height"
      :series="series"
      :options="mergedOptions"
      :style="chartContainerStyle"
    />
    <div
      v-else
      class="flex items-center justify-center text-gray-500"
      :style="chartContainerStyle"
    >
      {{ loadingText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

type ApexSeries = Array<Record<string, any>> | number[];

const props = withDefaults(
  defineProps<{
    type: string;
    series: ApexSeries;
    options?: Record<string, any>;
    height?: number | string;
    loadingText?: string;
    useBrandColors?: boolean;
    colorOffset?: number;
    monoColor?: boolean;
  }>(),
  {
    options: () => ({}),
    height: 350,
    loadingText: 'Loading chart...',
    useBrandColors: true,
    colorOffset: 0,
    monoColor: false,
  }
);

const vueApexChart = ref<any>(null);
const brandColors = ref<string[]>([]);

function getCssVariable(variableName: string): string {
  if (typeof window === 'undefined') return '#3b82f6';
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue(variableName).trim();
  return value || '#3b82f6';
}

function getBrandColors(): string[] {
  return [
    getCssVariable('--ina-primary-500'),
    getCssVariable('--ina-primary-300'),
    getCssVariable('--ina-primary-700'),
    getCssVariable('--ina-primary-400'),
    getCssVariable('--ina-primary-600'),
    getCssVariable('--ina-primary-200'),
  ];
}

function syncBrandColors(): void {
  const frameIds = { frame1: 0, frame2: 0, frame3: 0 };

  const updateBrandColors = () => {
    brandColors.value = getBrandColors();
  };

  const scheduleThirdFrame = () => {
    frameIds.frame3 = requestAnimationFrame(updateBrandColors);
  };

  const scheduleSecondFrame = () => {
    frameIds.frame2 = requestAnimationFrame(scheduleThirdFrame);
  };

  frameIds.frame1 = requestAnimationFrame(scheduleSecondFrame);
}

function rotateColors(colors: string[], offset: number): string[] {
  if (colors.length === 0) return [];
  const normalizedOffset = ((offset % colors.length) + colors.length) % colors.length;
  return [...colors.slice(normalizedOffset), ...colors.slice(0, normalizedOffset)];
}

const mergedOptions = computed(() => {
  const chartOptions = { ...props.options };
  const hasCustomColors = Array.isArray(chartOptions.colors) && chartOptions.colors.length > 0;

  if (props.useBrandColors && !hasCustomColors && brandColors.value.length > 0) {
    const rotated = rotateColors(brandColors.value, props.colorOffset);
    chartOptions.colors = props.monoColor ? [rotated[0]] : rotated;
  }

  return chartOptions;
});

const chartContainerStyle = computed(() => {
  const value = typeof props.height === 'number' ? `${props.height}px` : props.height;
  return { minHeight: value };
});

onMounted(() => {
  import('vue3-apexcharts')
    .then((chartModule) => {
      vueApexChart.value = (chartModule as any).default || chartModule;
    })
    .catch((error) => {
      console.error('Failed to load chart component:', error);
    });

  if (props.useBrandColors) {
    syncBrandColors();
  }
});
</script>