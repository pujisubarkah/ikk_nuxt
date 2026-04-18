<template>
  <div class="w-full px-8 py-10 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
      <div>
        <h1 class="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-base text-gray-600 mt-1">Overview of key metrics and performance</p>
      </div>

      <!-- Filter Dropdown -->
      <div class="flex items-center space-x-4">
        <label for="filter" class="text-gray-700 font-medium">Filter by:</label>
        <select
          id="filter"
          v-model="filter"
          class="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="Sales">Sales</option>
          <option value="Profit">Profit</option>
        </select>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <!-- Bar Chart -->
      <div class="h-full">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Bar Chart</h2>
        <UiApexChart
          class="h-[420px]"
          type="bar"
          :options="apexBarOptions"
          :series="apexBarSeries"
          :mono-color="true"
        />
      </div>

      <!-- Radar Chart -->
      <div class="h-full">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Radar Chart</h2>
        <UiApexChart
          class="h-[420px]"
          type="radar"
          :options="apexRadarOptions"
          :series="apexRadarSeries"
          :mono-color="true"
          :color-offset="2"
        />
      </div>

      <!-- Line Chart -->
      <div class="h-full">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Line Chart</h2>
        <UiApexChart
          class="h-[420px]"
          type="line"
          :options="apexLineOptions"
          :series="apexLineSeries"
          :mono-color="true"
          :color-offset="1"
        />
      </div>

      <!-- Pie Chart -->
      <div class="h-full">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Pie Chart</h2>
        <UiApexChart
          class="h-[420px]"
          type="pie"
          :options="apexPieOptions"
          :series="apexPieSeries"
          :mono-color="false"
          :color-offset="3"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useChartPresets } from '~/composables/useChartPresets';


const { barHorizontal, radar, line, pie } = useChartPresets();


const filter = ref<string>('Sales');

const salesData = [
  { label: 'Sales', data: [12, 19, 3, 5, 2, 3] },
  { label: 'Profit', data: [5, 8, 2, 4, 1, 2] }
];

const labels = ['January', 'February', 'March', 'April', 'May', 'June'];

const apexBarSeries = computed(() => {
  const selected = salesData.find(d => d.label === filter.value);
  return [{
    name: filter.value,
    data: selected ? selected.data : []
  }];
});

const apexBarOptions = computed(() => {
  return barHorizontal({ categories: labels, height: 350 });
});

const apexLineSeries = computed(() => {
  const selected = salesData.find(d => d.label === filter.value);
  return [{
    name: `${filter.value} Trend`,
    data: selected ? selected.data : []
  }];
});

const apexLineOptions = computed(() => {
  return line({
    categories: labels,
    height: 350,
    smooth: true,
  });
});


const apexRadarSeries = [{
  name: 'Performance',
  data: [2, 3, 4, 5, 1]
}];

const apexRadarOptions = radar({
  categories: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency'],
  height: 350,
  fillOpacity: 0.2,
});

const apexPieSeries = computed(() => {
  const selected = salesData.find(d => d.label === filter.value);
  return selected ? selected.data : [];
});

const apexPieOptions = computed(() => {
  return pie({
    labels,
    height: 350,
    donut: false,
    legendPosition: 'right',
  });
});


</script>
