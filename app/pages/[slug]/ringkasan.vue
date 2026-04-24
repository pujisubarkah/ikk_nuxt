<!-- pages/admin-nasional/ringkasan.vue -->
<script setup lang="ts">
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { IconEye, IconDownload, IconSearch, IconFilter } from '@tabler/icons-vue'

// Tipe data dari API
interface ScoreData {
  avg_a_total_score: number | null;
  avg_b_total_score: number | null;
  avg_c_total_score: number | null;
  avg_d_total_score: number | null;
  jf: boolean;
  avg_ikk_total_score: number | null;
}

interface RingkasanData {
  agency_id_panrb: number;
  agency_name: string;
  agency_category_id: number;
  agency_category_name: string;
  jumlah_kebijakan: number;
  ikk_ki_score: ScoreData;
  ikk_ku_score: ScoreData;
  ikk_kn_score: ScoreData;
}

interface RingkasanResponse {
  success: boolean;
  message: string;
  data: RingkasanData[];
  total: number;
}

const router = useRouter()
const searchTerm = ref('')
const selectedKategori = ref('')
const ringkasanData = ref<RingkasanData[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Pagination State
const currentPage = ref(1)
const itemsPerPage = 25

// Fetch data
const fetchData = async () => {
  loading.value = true
  try {
    const res = await fetch('/api/ringkasan')
    if (!res.ok) {
      throw new Error('Gagal memuat data')
    }
    const data: RingkasanResponse = await res.json()
    ringkasanData.value = data.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Terjadi kesalahan'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

// Ambil daftar kategori unik
const kategoriOptions = computed(() => 
  Array.from(
    new Set(ringkasanData.value.map(item => item.agency_category_name))
  ).filter(Boolean) as string[]
)

// Hitung rata-rata IKK Total Score per kategori
const categoryStats = computed(() => 
  kategoriOptions.value.map(kategori => {
    const instansiInCategory = ringkasanData.value.filter(item => item.agency_category_name === kategori)
    
    const avgKiScore = instansiInCategory.reduce((sum, item) => sum + (item.ikk_ki_score.avg_ikk_total_score || 0), 0) / instansiInCategory.length
    const avgKuScore = instansiInCategory.reduce((sum, item) => sum + (item.ikk_ku_score.avg_ikk_total_score || 0), 0) / instansiInCategory.length
    const avgKnScore = instansiInCategory.reduce((sum, item) => sum + (item.ikk_kn_score.avg_ikk_total_score || 0), 0) / instansiInCategory.length
    
    return {
      kategori,
      total: instansiInCategory.length,
      avgKiScore: Math.round(avgKiScore * 100) / 100,
      avgKuScore: Math.round(avgKuScore * 100) / 100,
      avgKnScore: Math.round(avgKnScore * 100) / 100,
      totalKebijakan: instansiInCategory.reduce((sum, item) => sum + item.jumlah_kebijakan, 0)
    }
  })
)

// Kelompokkan statistik berdasarkan PUSAT dan DAERAH
const pusatCategories = ['KEMENTERIAN', 'LEMBAGA']
const daerahCategories = computed(() => 
  kategoriOptions.value.filter((kat: string) => !pusatCategories.includes(kat))
)

// Statistik untuk PUSAT
const pusatData = computed(() => 
  ringkasanData.value.filter(item => pusatCategories.includes(item.agency_category_name))
)

const pusatStats = computed(() => ({
  kategori: 'PUSAT',
  total: pusatData.value.length,
  avgKiScore: pusatData.value.length > 0 
    ? Math.round((pusatData.value.reduce((sum, item) => sum + (item.ikk_ki_score.avg_ikk_total_score || 0), 0) / pusatData.value.length) * 100) / 100 
    : 0,
  avgKuScore: pusatData.value.length > 0 
    ? Math.round((pusatData.value.reduce((sum, item) => sum + (item.ikk_ku_score.avg_ikk_total_score || 0), 0) / pusatData.value.length) * 100) / 100 
    : 0,
  avgKnScore: pusatData.value.length > 0 
    ? Math.round((pusatData.value.reduce((sum, item) => sum + (item.ikk_kn_score.avg_ikk_total_score || 0), 0) / pusatData.value.length) * 100) / 100 
    : 0,
  totalKebijakan: pusatData.value.reduce((sum, item) => sum + item.jumlah_kebijakan, 0)
}))

// Statistik untuk DAERAH
const daerahData = computed(() => 
  ringkasanData.value.filter(item => daerahCategories.value.includes(item.agency_category_name))
)

const daerahStats = computed(() => ({
  kategori: 'DAERAH',
  total: daerahData.value.length,
  avgKiScore: daerahData.value.length > 0 
    ? Math.round((daerahData.value.reduce((sum, item) => sum + (item.ikk_ki_score.avg_ikk_total_score || 0), 0) / daerahData.value.length) * 100) / 100 
    : 0,
  avgKuScore: daerahData.value.length > 0 
    ? Math.round((daerahData.value.reduce((sum, item) => sum + (item.ikk_ku_score.avg_ikk_total_score || 0), 0) / daerahData.value.length) * 100) / 100 
    : 0,
  avgKnScore: daerahData.value.length > 0 
    ? Math.round((daerahData.value.reduce((sum, item) => sum + (item.ikk_kn_score.avg_ikk_total_score || 0), 0) / daerahData.value.length) * 100) / 100 
    : 0,
  totalKebijakan: daerahData.value.reduce((sum, item) => sum + item.jumlah_kebijakan, 0)
}))

// Statistik individual untuk KEMENTERIAN dan LEMBAGA
const kementerianStats = computed(() => 
  categoryStats.value.find(stat => stat.kategori === 'KEMENTERIAN')
)
const lembagaStats = computed(() => 
  categoryStats.value.find(stat => stat.kategori === 'LEMBAGA')
)

// Hitung rata-rata keseluruhan
const overallStats = computed(() => ({
  avgKiScore: ringkasanData.value.length > 0 
    ? Math.round((ringkasanData.value.reduce((sum, item) => sum + (item.ikk_ki_score.avg_ikk_total_score || 0), 0) / ringkasanData.value.length) * 100) / 100 
    : 0,
  avgKuScore: ringkasanData.value.length > 0 
    ? Math.round((ringkasanData.value.reduce((sum, item) => sum + (item.ikk_ku_score.avg_ikk_total_score || 0), 0) / ringkasanData.value.length) * 100) / 100 
    : 0,
  avgKnScore: ringkasanData.value.length > 0 
    ? Math.round((ringkasanData.value.reduce((sum, item) => sum + (item.ikk_kn_score.avg_ikk_total_score || 0), 0) / ringkasanData.value.length) * 100) / 100 
    : 0,
  totalInstansi: ringkasanData.value.length,
  totalKebijakan: ringkasanData.value.reduce((sum, item) => sum + item.jumlah_kebijakan, 0)
}))

// Filter data berdasarkan pencarian dan kategori
const filteredData = computed(() => 
  ringkasanData.value.filter(item => {
    const name = item.agency_name?.toLowerCase() || ''
    const term = searchTerm.value.toLowerCase()
    const matchesSearch = name.includes(term)
    const matchesKategori = selectedKategori.value ? item.agency_category_name === selectedKategori.value : true
    return matchesSearch && matchesKategori
  })
)

const indexOfLastItem = computed(() => currentPage.value * itemsPerPage)
const indexOfFirstItem = computed(() => indexOfLastItem.value - itemsPerPage)
const currentItems = computed(() => filteredData.value.slice(indexOfFirstItem.value, indexOfLastItem.value))
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))

const handleUnduhExcel = () => {
  const aoaData = [
    ['No', 'Nama Instansi', 'Kategori', 'Jumlah Kebijakan', 
     'KI A Score', 'KI B Score', 'KI C Score', 'KI D Score', 'KI JF', 'KI Total',
     'KU A Score', 'KU B Score', 'KU C Score', 'KU D Score', 'KU JF', 'KU Total',
     'KN A Score', 'KN B Score', 'KN C Score', 'KN D Score', 'KN JF', 'KN Total'],
    ...currentItems.value.map((item, index) => [
      index + 1,
      item.agency_name,
      item.agency_category_name,
      item.jumlah_kebijakan,
      item.ikk_ki_score.avg_a_total_score || 0,
      item.ikk_ki_score.avg_b_total_score || 0,
      item.ikk_ki_score.avg_c_total_score || 0,
      item.ikk_ki_score.avg_d_total_score || 0,
      item.ikk_ki_score.jf ? 'Ya' : 'Tidak',
      item.ikk_ki_score.avg_ikk_total_score || 0,
      item.ikk_ku_score.avg_a_total_score || 0,
      item.ikk_ku_score.avg_b_total_score || 0,
      item.ikk_ku_score.avg_c_total_score || 0,
      item.ikk_ku_score.avg_d_total_score || 0,
      item.ikk_ku_score.jf ? 'Ya' : 'Tidak',
      item.ikk_ku_score.avg_ikk_total_score || 0,
      item.ikk_kn_score.avg_a_total_score || 0,
      item.ikk_kn_score.avg_b_total_score || 0,
      item.ikk_kn_score.avg_c_total_score || 0,
      item.ikk_kn_score.avg_d_total_score || 0,
      item.ikk_kn_score.jf ? 'Ya' : 'Tidak',
      item.ikk_kn_score.avg_ikk_total_score || 0
    ])
  ]
  const worksheet = XLSX.utils.aoa_to_sheet(aoaData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Ringkasan IKK')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(dataBlob, 'ringkasan_ikk.xlsx')
}

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const formatScore = (score: number | null): string => {
  return score ? score.toFixed(2) : '-'
}

const handleLihatDetail = (agency_id_panrb: number) => {
  router.push(`/admin-nasional/kebijakan/instansi/${agency_id_panrb}`)
}

const resetFilters = () => {
  searchTerm.value = ''
  selectedKategori.value = ''
  currentPage.value = 1
}
</script>

<template>
  <NuxtLayout name="sidebar">
    <template #default>
      <div class="w-full px-6 py-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 class="text-2xl font-bold text-gray-800">Ringkasan IKK per Instansi</h1>
          <button
            @click="handleUnduhExcel"
            class="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <IconDownload :size="18" />
            <span>Unduh Data</span>
          </button>
        </div>

        <!-- Info Box - Statistik Keseluruhan -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-3 text-gray-700">Statistik Keseluruhan</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
              <h3 class="font-medium text-blue-800 mb-2 text-sm">Total Instansi</h3>
              <div class="text-2xl font-bold text-blue-600">{{ overallStats.totalInstansi }}</div>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
              <h3 class="font-medium text-green-800 mb-2 text-sm">Total Kebijakan</h3>
              <div class="text-2xl font-bold text-green-600">{{ overallStats.totalKebijakan }}</div>
            </div>
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 shadow-sm">
              <h3 class="font-medium text-purple-800 mb-2 text-sm">Rata-rata Skor Self Assesment</h3>
              <div class="text-2xl font-bold text-purple-600">{{ overallStats.avgKiScore }}</div>
            </div>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 shadow-sm">
              <h3 class="font-medium text-orange-800 mb-2 text-sm">Rata-rata Skor Verifikator</h3>
              <div class="text-2xl font-bold text-orange-600">{{ overallStats.avgKuScore }}</div>
            </div>
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
              <h3 class="font-medium text-red-800 mb-2 text-sm">Rata-rata Skor IKK Final</h3>
              <div class="text-2xl font-bold text-red-600">{{ overallStats.avgKnScore }}</div>
            </div>
          </div>

          <h2 class="text-lg font-semibold mb-3 text-gray-700">Statistik per Kategori Instansi</h2>
          <!-- Row 1: PUSAT, KEMENTERIAN, LEMBAGA -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <!-- PUSAT -->
            <div class="bg-blue-50 border border-blue-300 rounded-lg p-4 shadow-sm">
              <h3 class="font-medium text-blue-800 mb-2 text-sm">{{ pusatStats.kategori }}</h3>
              <div class="space-y-1">
                <div class="flex justify-between text-xs">
                  <span class="text-gray-600">Total Instansi:</span>
                  <span class="font-medium">{{ pusatStats.total }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-gray-600">Total Kebijakan:</span>
                  <span class="font-medium">{{ pusatStats.totalKebijakan }}</span>
                </div>
                <hr class="my-2"/>
                <div class="flex justify-between text-xs">
                  <span class="text-purple-600">Avg Skor Self Assesment:</span>
                  <span class="font-medium text-purple-600">{{ pusatStats.avgKiScore }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-orange-600">Avg Skor Verifikator:</span>
                  <span class="font-medium text-orange-600">{{ pusatStats.avgKuScore }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-red-600">Avg Skor IKK Final:</span>
                  <span class="font-medium text-red-600">{{ pusatStats.avgKnScore }}</span>
                </div>
              </div>
            </div>
            <!-- KEMENTERIAN -->
            <div v-if="kementerianStats" class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 class="font-medium text-gray-800 mb-2 text-sm">{{ kementerianStats.kategori }}</h3>
              <div class="space-y-1">
                <div class="flex justify-between text-xs">
                  <span class="text-gray-600">Total Instansi:</span>
                  <span class="font-medium">{{ kementerianStats.total }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-gray-600">Total Kebijakan:</span>
                  <span class="font-medium">{{ kementerianStats.totalKebijakan }}</span>
                </div>
                <hr class="my-2"/>
                <div class="flex justify-between text-xs">
                  <span class="text-purple-600">Avg Skor Self Assesment:</span>
                  <span class="font-medium text-purple-600">{{ kementerianStats.avgKiScore }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-orange-600">Avg Skor Verifikator:</span>
                  <span class="font-medium text-orange-600">{{ kementerianStats.avgKuScore }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-red-600">Avg Skor IKK Final:</span>
                  <span class="font-medium text-red-600">{{ kementerianStats.avgKnScore }}</span>
                </div>
              </div>
            </div>
            <!-- LEMBAGA -->
            <div v-if="lembagaStats" class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 class="font-medium text-gray-800 mb-2 text-sm">{{ lembagaStats.kategori }}</h3>
              <div class="space-y-1">
                <div class="flex justify-between text-xs">
                  <span class="text-gray-600">Total Instansi:</span>
                  <span class="font-medium">{{ lembagaStats.total }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-gray-600">Total Kebijakan:</span>
                  <span class="font-medium">{{ lembagaStats.totalKebijakan }}</span>
                </div>
                <hr class="my-2"/>
                <div class="flex justify-between text-xs">
                  <span class="text-purple-600">Avg Skor Self Assesment:</span>
                  <span class="font-medium text-purple-600">{{ lembagaStats.avgKiScore }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-orange-600">Avg Skor Verifikator:</span>
                  <span class="font-medium text-orange-600">{{ lembagaStats.avgKuScore }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-red-600">Avg Skor IKK Final:</span>
                  <span class="font-medium text-red-600">{{ lembagaStats.avgKnScore }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Row 2: DAERAH dan kategori daerah lainnya -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <!-- DAERAH -->
            <div class="bg-green-50 border border-green-300 rounded-lg p-4 shadow-sm">
              <h3 class="font-medium text-green-800 mb-2 text-sm">{{ daerahStats.kategori }}</h3>
              <div class="space-y-1">
                <div class="flex justify-between text-xs">
                  <span class="text-gray-600">Total Instansi:</span>
                  <span class="font-medium">{{ daerahStats.total }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-gray-600">Total Kebijakan:</span>
                  <span class="font-medium">{{ daerahStats.totalKebijakan }}</span>
                </div>
                <hr class="my-2"/>
                <div class="flex justify-between text-xs">
                  <span class="text-purple-600">Avg Skor Self Assesment:</span>
                  <span class="font-medium text-purple-600">{{ daerahStats.avgKiScore }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-orange-600">Avg Skor Verifikator:</span>
                  <span class="font-medium text-orange-600">{{ daerahStats.avgKuScore }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-red-600">Avg Skor IKK Final:</span>
                  <span class="font-medium text-red-600">{{ daerahStats.avgKnScore }}</span>
                </div>
              </div>
            </div>
            <!-- Kategori Daerah Individual -->
            <div 
              v-for="(stat, index) in categoryStats.filter(s => daerahCategories.includes(s.kategori))" 
              :key="index" 
              class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <h3 class="font-medium text-gray-800 mb-2 text-sm">{{ stat.kategori }}</h3>
              <div class="space-y-1">
                <div class="flex justify-between text-xs">
                  <span class="text-gray-600">Total Instansi:</span>
                  <span class="font-medium">{{ stat.total }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-gray-600">Total Kebijakan:</span>
                  <span class="font-medium">{{ stat.totalKebijakan }}</span>
                </div>
                <hr class="my-2"/>
                <div class="flex justify-between text-xs">
                  <span class="text-purple-600">Avg Skor Self Assesment:</span>
                  <span class="font-medium text-purple-600">{{ stat.avgKiScore }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-orange-600">Avg Skor Verifikator:</span>
                  <span class="font-medium text-orange-600">{{ stat.avgKuScore }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-red-600">Avg Skor IKK Final:</span>
                  <span class="font-medium text-red-600">{{ stat.avgKnScore }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pencarian dan Filter -->
        <div class="mb-4 flex flex-wrap gap-4 items-center">
          <div class="relative">
            <IconSearch class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="18" />
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Cari Instansi..."
              class="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            v-model="selectedKategori"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Kategori</option>
            <option v-for="(kat, index) in kategoriOptions" :key="index" :value="kat">
              {{ kat }}
            </option>
          </select>

          <button
            @click="resetFilters"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <IconFilter :size="16" />
            Reset Filter
          </button>
        </div>

        <!-- Tabel -->
        <div class="overflow-x-auto rounded-lg border">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="text-left p-3 text-gray-600 font-medium">No</th>
                <th class="text-left p-3 text-gray-600 font-medium">Nama Instansi</th>
                <th class="text-left p-3 text-gray-600 font-medium">Kategori</th>
                <th class="text-center p-3 text-gray-600 font-medium">Jumlah Kebijakan</th>
                <th class="text-center p-3 text-gray-600 font-medium bg-purple-50">Skor Self Assesment</th>
                <th class="text-center p-3 text-gray-600 font-medium bg-orange-50">Skor Verifikator</th>
                <th class="text-center p-3 text-gray-600 font-medium bg-red-50">Skor IKK Final</th>
                <th class="text-center p-3 text-gray-600 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="8" class="text-center py-4">Memuat data...</td>
              </tr>
              <tr v-else-if="error">
                <td colspan="8" class="text-center py-4 text-red-500">{{ error }}</td>
              </tr>
              <tr 
                v-else-if="currentItems.length > 0" 
                v-for="(item, index) in currentItems" 
                :key="item.agency_id_panrb" 
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="p-3">{{ indexOfFirstItem + index + 1 }}</td>
                <td class="p-3 font-medium">{{ item.agency_name }}</td>
                <td class="p-3">{{ item.agency_category_name }}</td>
                <td class="p-3 text-center">{{ item.jumlah_kebijakan }}</td>
                <!-- KI Score -->
                <td class="p-3 text-center bg-purple-50">
                  <div class="text-sm">
                    <div class="font-semibold text-purple-700 mb-2">
                      {{ formatScore(item.ikk_ki_score.avg_ikk_total_score) }}
                    </div>
                    <div class="text-xs space-y-1">
                      <div class="flex justify-center gap-2">
                        <span class="text-gray-500">A:</span>
                        <span class="font-bold text-gray-700">{{ formatScore(item.ikk_ki_score.avg_a_total_score) }}</span>
                        <span class="text-gray-500">B:</span>
                        <span class="font-bold text-gray-700">{{ formatScore(item.ikk_ki_score.avg_b_total_score) }}</span>
                      </div>
                      <div class="flex justify-center gap-2">
                        <span class="text-gray-500">C:</span>
                        <span class="font-bold text-gray-700">{{ formatScore(item.ikk_ki_score.avg_c_total_score) }}</span>
                        <span class="text-gray-500">D:</span>
                        <span class="font-bold text-gray-700">{{ formatScore(item.ikk_ki_score.avg_d_total_score) }}</span>
                      </div>
                    </div>
                    <div class="text-xs mt-2">
                      JF: <span :class="item.ikk_ki_score.jf ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                        {{ item.ikk_ki_score.jf ? 'Ya' : 'Tidak' }}
                      </span>
                    </div>
                  </div>
                </td>
                <!-- KU Score -->
                <td class="p-3 text-center bg-orange-50">
                  <div class="text-sm">
                    <div class="font-semibold text-orange-700 mb-2">
                      {{ formatScore(item.ikk_ku_score.avg_ikk_total_score) }}
                    </div>
                    <div class="text-xs space-y-1">
                      <div class="flex justify-center gap-2">
                        <span class="text-gray-500">A:</span>
                        <span class="font-bold text-gray-700">{{ formatScore(item.ikk_ku_score.avg_a_total_score) }}</span>
                        <span class="text-gray-500">B:</span>
                        <span class="font-bold text-gray-700">{{ formatScore(item.ikk_ku_score.avg_b_total_score) }}</span>
                      </div>
                      <div class="flex justify-center gap-2">
                        <span class="text-gray-500">C:</span>
                        <span class="font-bold text-gray-700">{{ formatScore(item.ikk_ku_score.avg_c_total_score) }}</span>
                        <span class="text-gray-500">D:</span>
                        <span class="font-bold text-gray-700">{{ formatScore(item.ikk_ku_score.avg_d_total_score) }}</span>
                      </div>
                    </div>
                    <div class="text-xs mt-2">
                      JF: <span :class="item.ikk_ku_score.jf ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                        {{ item.ikk_ku_score.jf ? 'Ya' : 'Tidak' }}
                      </span>
                    </div>
                  </div>
                </td>
                <!-- KN Score -->
                <td class="p-3 text-center bg-red-50">
                  <div class="text-sm">
                    <div class="font-semibold text-red-700 mb-2">
                      {{ formatScore(item.ikk_kn_score.avg_ikk_total_score) }}
                    </div>
                    <div class="text-xs space-y-1">
                      <div class="flex justify-center gap-2">
                        <span class="text-gray-500">A:</span>
                        <span class="font-bold text-gray-700">{{ formatScore(item.ikk_kn_score.avg_a_total_score) }}</span>
                        <span class="text-gray-500">B:</span>
                        <span class="font-bold text-gray-700">{{ formatScore(item.ikk_kn_score.avg_b_total_score) }}</span>
                      </div>
                      <div class="flex justify-center gap-2">
                        <span class="text-gray-500">C:</span>
                        <span class="font-bold text-gray-700">{{ formatScore(item.ikk_kn_score.avg_c_total_score) }}</span>
                        <span class="text-gray-500">D:</span>
                        <span class="font-bold text-gray-700">{{ formatScore(item.ikk_kn_score.avg_d_total_score) }}</span>
                      </div>
                    </div>
                    <div class="text-xs mt-2">
                      JF: <span :class="item.ikk_kn_score.jf ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                        {{ item.ikk_kn_score.jf ? 'Ya' : 'Tidak' }}
                      </span>
                    </div>
                  </div>
                </td>
                <td class="p-3 text-center">
                  <button
                    @click="handleLihatDetail(item.agency_id_panrb)"
                    class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-1.5 rounded text-xs shadow flex items-center justify-center gap-1 mx-auto transition-colors"
                  >
                    <IconEye :size="14" />
                    <span>Lihat Detail</span>
                  </button>
                </td>
              </tr>
              <tr v-else>
                <td colspan="8" class="text-center py-10 text-gray-500">
                  Tidak ada data tersedia.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center items-center mt-6 space-x-2">
          <button
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>
          <template v-for="page in Math.min(totalPages, 5)" :key="page">
            <button
              v-if="page >= Math.max(1, currentPage - 2) && page <= Math.min(totalPages, currentPage + 2)"
              @click="handlePageChange(page)"
              :class="[
                'px-3 py-1 rounded transition-colors',
                currentPage === page 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              ]"
            >
              {{ page >= Math.max(1, currentPage - 2) ? Math.max(1, currentPage - 2) + page - 1 : page }}
            </button>
          </template>
          <button
            @click="handlePageChange(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped>
/* Optional: Add custom styles if needed. 
   @apply tidak bisa digunakan langsung di <style> scoped. 
   Gunakan class Tailwind di elemen, atau tambahkan CSS biasa jika perlu. */
table th {
  font-weight: 600;
  font-size: 0.875rem;
}
table td {
  font-size: 0.875rem;
}
</style>