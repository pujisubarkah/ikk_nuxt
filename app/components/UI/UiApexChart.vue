<template>
  <div class="h-full rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
    

    <apexchart
      v-if="ready"
      type="type"
      :options="apexOptions"
      :series="series"
      :height="height"
      width="100%"
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

import { computed, ref, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
defineExpose({})

const series = computed(() => [{
  name: 'Data',
  data: props.data || []
}])

const apexOptions = computed(() => ({
  chart: {
    type: props.type,
    toolbar: { show: false }
  },
  xaxis: {
    categories: props.categories || []
  },
  theme: {
    mode: 'light'
  }
}))


const ready = ref(false)

const props = withDefaults(
  defineProps<{
    type: string
    data: any[]
    categories?: any[]
    height?: number | string
    loadingText?: string
  }>(),
  {
    height: 350,
    loadingText: 'Loading chart...'
  }
)

const dataSource = computed(() => ({
  chart: {
    theme: "fusion",
    caption: "",
    subCaption: "",
  },
  data: props.data,
  categories: props.categories ? [{ category: props.categories }] : []
}))

const chartContainerStyle = computed(() => {
  const value = typeof props.height === 'number' ? `${props.height}px` : props.height
  return { minHeight: value }
})


onMounted(() => {
  ready.value = true
})
// Register ApexCharts component
defineOptions({
  components: {
    apexchart: VueApexCharts
  }
})
</script>