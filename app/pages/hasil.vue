(The file `c:\Users\pujia\OneDrive\Documents\aplikasi\ikk_nuxt\app\pages\hasil.vue` exists, but is empty)
<template>
	<div class="w-full px-6 py-8">
		<UiBreadcrumb :items="breadcrumbItems" class="mb-4" />

		<!-- Info Box - Statistik Hasil per Kategori -->
		<div class="mb-6">
			<h2 class="text-lg font-semibold mb-3">Statistik Hasil per Kategori</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				<div v-for="(stat, index) in categoryStats" :key="index" class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
					<h3 class="font-medium text-gray-800 mb-2 text-sm">{{ stat.kategori }}</h3>
					<div class="space-y-1">
						<div class="flex justify-between text-xs">
							<span class="text-gray-600">Total Instansi:</span>
							<span class="font-medium">{{ stat.total }}</span>
						</div>
						<div class="flex justify-between text-xs">
							<span class="text-blue-600">Ada Hasil:</span>
							<span class="font-medium text-blue-600">{{ stat.withResult }}</span>
						</div>
						<div class="flex justify-between text-xs">
							<span class="text-red-600">Belum Ada:</span>
							<span class="font-medium text-red-600">{{ stat.withoutResult }}</span>
						</div>
						<div class="mt-2">
							<div class="flex justify-between text-xs mb-1">
								<span class="text-gray-600">Progress:</span>
								<span class="font-medium">{{ stat.percentage }}%</span>
							</div>
							<div class="w-full bg-gray-200 rounded-full h-2">
								<div 
									class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
									:style="{ width: `${stat.percentage}%` }"
								></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Pencarian dan Filter -->
		<div class="mb-4 flex flex-wrap gap-4">
			<input
				type="text"
				placeholder="Cari Instansi..."
				v-model="searchTerm"
				class="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>

			<select
				v-model="selectedKategori"
				class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				<option value="">Semua Kategori</option>
				<option v-for="(kat, index) in kategoriOptions" :key="index" :value="kat">
					{{ kat }}
				</option>
			</select>
		</div>

		<!-- Card Grid -->
		<div v-if="loading" class="text-center py-8 text-gray-500">Memuat data...</div>
		<div v-else-if="error" class="text-center py-8 text-red-500">{{ error }}</div>
		<div v-else-if="currentItems.length === 0" class="text-center py-8 text-gray-500">Tidak ada data tersedia.</div>
		<div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			<div v-for="(item, idx) in currentItems" :key="item.agency_id" class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between h-full">
				<div>
					<div class="flex items-center justify-between mb-2">
						<span class="text-xs text-gray-400">#{{ startIndex + idx + 1 }}</span>
						<span class="text-xs px-2 py-0.5 rounded-full" :class="(item as any).result ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'">
							{{ (item as any).result ? 'Ada Hasil' : 'Belum Ada Hasil' }}
						</span>
					</div>
					<h3 class="font-semibold text-lg text-gray-800 mb-1">{{ (item as any).agency_name }}</h3>
					<div class="text-sm text-gray-500 mb-2">Kategori: {{ (item as any).instansi_kategori?.kat_instansi || '-' }}</div>
				</div>
				<div class="mt-4 flex justify-end">
					<button
						@click="(item as any).result ? handleLihat((item as any).agency_id) : undefined"
						:class="[
							'px-4 py-1.5 rounded text-xs shadow flex items-center justify-center space-x-2 transition-colors',
							(item as any).result
								? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' 
								: 'bg-gray-300 text-gray-600 cursor-not-allowed'
						]"
						:disabled="!(item as any).result"
					>
						<IconEye class="w-4 h-4 mr-1" />
						<span>{{ (item as any).result ? 'Lihat' : 'Tidak Ada Hasil' }}</span>
					</button>
				</div>
			</div>
		</div>

		<!-- Pagination -->
		<div v-if="filteredData.length > itemsPerPage" class="mt-6 flex justify-between items-center text-sm">
			<UiPagination
				:page="currentPage"
				:per-page="itemsPerPage"
				:total="filteredData.length"
				@update:page="(p) => currentPage = p"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import UiTable from '@/components/UI/UiTable.vue'
import UiPagination from '@/components/UI/UiPagination.vue'
import UiBreadcrumb from '@/components/UI/UiBreadcrumb.vue'
import { IconEye } from '@tabler/icons-vue'

interface Result {
	name: string
	value: string
}

interface InstansiResponse {
	agency_id: string
	agency_name: string
	instansi_kategori: {
		kat_instansi: string
	}
	result: Result | null
}

const breadcrumbItems = [
	{ label: 'Dashboard', href: '/dashboard' },
	{ label: 'Daftar Hasil', href: '/hasil' }
]

const searchTerm = ref('')
const selectedKategori = ref('')
const instansiData = ref<InstansiResponse[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const itemsPerPage = 25

const tableHeaders = [
	{ text: 'No', value: 'no', center: true, width: '60px' },
	{ text: 'Nama Instansi', value: 'agency_name' },
	{ text: 'Kategori', value: 'kategori' },
	{ text: 'Aksi', value: 'aksi', center: true, width: '180px' },
]

const fetchData = async () => {
	loading.value = true
	error.value = null
	try {
		// Ganti endpoint sesuai kebutuhan
		const data = await $fetch<InstansiResponse[]>('/api/instansi/hasil')
		instansiData.value = Array.isArray(data) ? data : []
	} catch (err: any) {
		error.value = err.message || 'Terjadi kesalahan'
	} finally {
		loading.value = false
	}
}

onMounted(() => {
	fetchData()
})

watch([searchTerm, selectedKategori], () => {
	currentPage.value = 1
})

const kategoriOptions = computed(() => {
	const options = new Set(instansiData.value.map(item => item.instansi_kategori?.kat_instansi))
	return Array.from(options).filter(Boolean) as string[]
})

const categoryStats = computed(() => {
	return kategoriOptions.value.map(kategori => {
		const instansiInCategory = instansiData.value.filter(item => item.instansi_kategori?.kat_instansi === kategori)
		const withResult = instansiInCategory.filter(item => !!item.result)
		const withoutResult = instansiInCategory.filter(item => !item.result)
		return {
			kategori,
			total: instansiInCategory.length,
			withResult: withResult.length,
			withoutResult: withoutResult.length,
			percentage: instansiInCategory.length > 0 ? Math.round((withResult.length / instansiInCategory.length) * 100) : 0
		}
	})
})

const filteredData = computed(() => {
	return instansiData.value.filter(item => {
		const name = item.agency_name?.toLowerCase() || ''
		const term = searchTerm.value.toLowerCase()
		const matchesSearch = name.includes(term)
		const matchesKategori = selectedKategori.value ? item.instansi_kategori?.kat_instansi === selectedKategori.value : true
		return matchesSearch && matchesKategori
	})
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const currentItems = computed(() => filteredData.value.slice(startIndex.value, startIndex.value + itemsPerPage))

const handleLihat = (id: string) => {
	// Ganti navigasi sesuai kebutuhan
	// router.push(`/hasil/instansi/${id}`)
	alert('Lihat detail hasil untuk instansi ID: ' + id)
}
</script>
