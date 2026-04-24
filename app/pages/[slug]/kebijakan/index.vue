<template>
  <div class="w-full px-6 py-8">
    <UiBreadcrumb :items="breadcrumbItems" class="mb-4" />

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Daftar Instansi</h1>
      <button
        @click="handleUnduhExcel"
        class="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        Unduh Data
      </button>
    </div>

    <!-- Info Box - Statistik Kebijakan per Kategori -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-3">Statistik Kebijakan per Kategori</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="(stat, index) in categoryStats" :key="index" class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 class="font-medium text-gray-800 mb-2 text-sm">{{ stat.kategori }}</h3>
          <div class="space-y-1">
            <div class="flex justify-between text-xs">
              <span class="text-gray-600">Total Instansi:</span>
              <span class="font-medium">{{ stat.total }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-green-600">Ada Kebijakan:</span>
              <span class="font-medium text-green-600">{{ stat.withPolicy }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-red-600">Belum Ada:</span>
              <span class="font-medium text-red-600">{{ stat.withoutPolicy }}</span>
            </div>
            <div class="mt-2">
              <div class="flex justify-between text-xs mb-1">
                <span class="text-gray-600">Progress:</span>
                <span class="font-medium">{{ stat.percentage }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-green-500 h-2 rounded-full transition-all duration-300" 
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

      <select
        v-model="selectedPolicyStatus"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Semua Status Kebijakan</option>
        <option value="ada">Sudah Ada Kebijakan</option>
        <option value="tidak_ada">Belum Ada Kebijakan</option>
      </select>
    </div>

    <!-- Tabel -->
    <div class="overflow-x-auto rounded-lg border">
      <UiTable :headers="tableHeaders" :items="currentItems">
        <template #no="{ index }: { index: number }">
          {{ startIndex + index + 1 }}
        </template>
        
        <template #agency_name="{ item }: { item: any }">
          {{ item.agency_name }}
        </template>
        
        <template #kategori="{ item }: { item: any }">
          {{ item.instansi_kategori?.kat_instansi || '-' }}
        </template>

        <template #aksi="{ item }: { item: any }">
          <div class="flex justify-center">
            <button
              @click="item.policy ? handleLihat(item.agency_id) : undefined"
              :class="[
                'px-4 py-1.5 rounded text-xs shadow flex items-center justify-center space-x-2 transition-colors',
                item.policy
                  ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer' 
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              ]"
              :disabled="!item.policy"
            >
              <IconEye class="w-4 h-4 mr-1" />
              <span>{{ item.policy ? "Lihat" : "Tidak Ada Kebijakan" }}</span>
            </button>
          </div>
        </template>

        <template #empty>
          <div v-if="loading" class="text-center py-8 text-gray-500">Memuat data...</div>
          <div v-else-if="error" class="text-center py-8 text-red-500">{{ error }}</div>
          <div v-else class="text-center py-8 text-gray-500">Tidak ada data tersedia.</div>
        </template>
      </UiTable>
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
import { useRouter, useRoute } from 'vue-router'
import UiTable from '@/components/UI/UiTable.vue'
import UiPagination from '@/components/UI/UiPagination.vue'
import UiBreadcrumb from '@/components/UI/UiBreadcrumb.vue'
import { IconEye } from '@tabler/icons-vue'

interface Policy {
  name: string
  name_detail: string
  sector: string
  lainnya: string | null
  policy_status: string
  policy_process: string
  progress: string
}

interface InstansiResponse {
  agency_id: string
  agency_name: string
  instansi_kategori: {
    kat_instansi: string
  }
  policy: Policy | null
}

const router = useRouter()
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const breadcrumbItems = computed(() => [
  { label: 'Dashboard', href: `/${slug.value}/dashboard` },
  { label: 'Daftar Kebijakan', href: `/${slug.value}/kebijakan` }
])

const searchTerm = ref('')
const selectedKategori = ref('')
const selectedPolicyStatus = ref('')

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
    const data = await $fetch<InstansiResponse[]>('/api/instansi/policy')
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

// Kembalikan ke halaman 1 jika filter berubah
watch([searchTerm, selectedKategori, selectedPolicyStatus], () => {
  currentPage.value = 1
})

const kategoriOptions = computed(() => {
  const options = new Set(instansiData.value.map(item => item.instansi_kategori?.kat_instansi))
  return Array.from(options).filter(Boolean) as string[]
})

const categoryStats = computed(() => {
  return kategoriOptions.value.map(kategori => {
    const instansiInCategory = instansiData.value.filter(item => item.instansi_kategori?.kat_instansi === kategori)
    const withPolicy = instansiInCategory.filter(item => !!item.policy)
    const withoutPolicy = instansiInCategory.filter(item => !item.policy)
    
    return {
      kategori,
      total: instansiInCategory.length,
      withPolicy: withPolicy.length,
      withoutPolicy: withoutPolicy.length,
      percentage: instansiInCategory.length > 0 ? Math.round((withPolicy.length / instansiInCategory.length) * 100) : 0
    }
  })
})

const filteredData = computed(() => {
  return instansiData.value.filter(item => {
    const name = item.agency_name?.toLowerCase() || ''
    const term = searchTerm.value.toLowerCase()
    const matchesSearch = name.includes(term)
    const matchesKategori = selectedKategori.value ? item.instansi_kategori?.kat_instansi === selectedKategori.value : true
    
    let matchesPolicyStatus = true
    if (selectedPolicyStatus.value === 'ada') {
      matchesPolicyStatus = !!item.policy
    } else if (selectedPolicyStatus.value === 'tidak_ada') {
      matchesPolicyStatus = !item.policy
    }
    
    return matchesSearch && matchesKategori && matchesPolicyStatus
  })
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const currentItems = computed(() => filteredData.value.slice(startIndex.value, startIndex.value + itemsPerPage))

const handleLihat = (id: string) => {
  router.push(`/${slug.value}/kebijakan/instansi/${id}`)
}

const handleUnduhExcel = async () => {
  try {
    // Import secara dinamis untuk menghindari masalah SSR jika digunakan di sisi server
    // @ts-ignore
    const { saveAs } = await import('file-saver')
    const XLSX = await import('xlsx')

    const aoaData = [['No', 'Nama Instansi', 'Kategori'], ...currentItems.value.map((item, index) => [
      startIndex.value + index + 1,
      item.agency_name,
      item.instansi_kategori?.kat_instansi || '-'
    ])]
    
    const worksheet = XLSX.utils.aoa_to_sheet(aoaData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar Instansi')
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(dataBlob, 'daftar_instansi.xlsx')
  } catch (error) {
    console.error('Gagal mengunduh Excel:', error)
    alert('Gagal mengunduh file excel. Pastikan dependensi "xlsx" dan "file-saver" sudah terinstall.')
  }
}

definePageMeta({
  layout: 'sidebar'
})
</script>
