<template>
	<div class="w-full px-4 md:px-8 py-6 md:py-10 bg-gray-50 min-h-screen">
		<UiBreadcrumb :items="breadcrumbItems" class="mb-4 md:mb-6" />

		<div class="mb-6 md:mb-8">
			<UiTabMenu :items="tabItems" :value="activeTab" @change="onTabChange" />
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
			<UiCard v-for="stat in stats" :key="stat.label" class="flex items-center gap-4">
				<component :is="stat.icon" class="text-blue-500" :size="36" />
				<div>
					<div class="text-2xl font-bold">{{ stat.value }}</div>
					<div class="text-gray-500 text-sm">{{ stat.label }}</div>
				</div>
			</UiCard>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
			<UiCard>
				<div class="font-semibold mb-2">Radar Penilaian Sektor</div>
				<UiApexChart
					type="radar"
					:data="radarChartData"
					:categories="radarChartCategories"
					:height="320"
				/>
			</UiCard>
			<UiCard>
				<div class="font-semibold mb-2">Bar Kinerja Sektor</div>
				<UiApexChart
					type="bar"
					:data="barChartData"
					:categories="barChartCategories"
					:height="320"
				/>
			</UiCard>
		</div>

		<UiCard>
			<div class="font-semibold mb-4">Tabel Perbandingan Sektor</div>
			<UiTable :headers="tableHeaders" :items="tableItems">
				<template #score="{ item }">
					<span class="font-bold text-blue-600">{{ (item as any).score }}</span>
				</template>
				<template #trend="{ item }">
					<component :is="(item as any).trendIcon" :size="18" :class="(item as any).trend === 'up' ? 'text-green-500' : 'text-red-500'" />
				</template>
			</UiTable>
		</UiCard>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import UiApexChart from '@/components/UI/UiApexChart.vue';
import UiTabMenu from '@/components/UI/UiTabMenu.vue';
import UiCard from '@/components/UI/UiCard.vue';
import UiTable from '@/components/UI/UiTable.vue';
import { IconChartBar, IconTrendingUp, IconTrendingDown, IconUsers, IconFileText } from '@tabler/icons-vue';
	definePageMeta({ layout: 'sidebar' });

const route = useRoute();
const slug = computed(() => route.params.slug as string);

const breadcrumbItems = computed(() => [
  { label: 'Dashboard', href: `/${slug.value}/dashboard` },
  { label: 'Chart', href: `/${slug.value}/chart` },
]);

const tabItems = [
	{ value: 'sektor1', label: 'Sektor 1' },
	{ value: 'sektor2', label: 'Sektor 2' },
	{ value: 'sektor3', label: 'Sektor 3' },
];
const activeTab = ref('sektor1');
function onTabChange(val: string) {
	activeTab.value = val;
}

const stats = computed(() => [
	{ label: 'Total Penilaian', value: 120, icon: IconChartBar },
	{ label: 'Instansi', value: 45, icon: IconUsers },
	{ label: 'Dokumen', value: 320, icon: IconFileText },
]);


const radarChartCategories = ['A', 'B', 'C', 'D', 'E'];
const radarChartData = computed(() =>
	radarChartCategories.map((cat, idx) => ({
		label: cat,
		value:
			activeTab.value === 'sektor1'
				? [80, 90, 70, 85, 60][idx]
				: activeTab.value === 'sektor2'
				? [60, 75, 80, 70, 90][idx]
				: [70, 60, 85, 80, 75][idx],
	}))
);

const barChartCategories = ['A', 'B', 'C', 'D', 'E'];
const barChartData = computed(() =>
	barChartCategories.map((cat, idx) => ({
		label: cat,
		value:
			activeTab.value === 'sektor1'
				? [80, 70, 90, 60, 85][idx]
				: activeTab.value === 'sektor2'
				? [70, 80, 60, 90, 75][idx]
				: [60, 85, 70, 80, 90][idx],
	}))
);

const tableHeaders = [
	{ text: 'Sektor', value: 'sektor' },
	{ text: 'Nilai', value: 'score', center: true },
	{ text: 'Trend', value: 'trend', center: true },
];
const tableItems = computed(() => [
	{
		sektor: 'Sektor 1',
		score: activeTab.value === 'sektor1' ? 80 : 70,
		trend: 'up',
		trendIcon: IconTrendingUp,
	},
	{
		sektor: 'Sektor 2',
		score: activeTab.value === 'sektor2' ? 85 : 75,
		trend: 'down',
		trendIcon: IconTrendingDown,
	},
	{
		sektor: 'Sektor 3',
		score: activeTab.value === 'sektor3' ? 90 : 80,
		trend: 'up',
		trendIcon: IconTrendingUp,
	},
]);
</script>
