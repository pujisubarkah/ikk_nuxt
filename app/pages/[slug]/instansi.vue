<template>

  <div class="w-full px-6 py-8">
    <!-- Breadcrumb -->
    <UiBreadcrumb :items="breadcrumbItems" class="mb-4" />


    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Daftar Instansi</h1>
      <div class="flex space-x-4 items-center">
        <button
          @click="showPopup = true"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Tambah Instansi
        </button>
        <input
          type="text"
          placeholder="Cari Instansi..."
          v-model="searchQuery"
          class="p-2 border rounded-lg"
        />
        <select v-model="selectedActiveYear" class="p-2 border rounded-lg">
          <option value="">Semua Tahun</option>
          <option v-for="year in activeYears" :key="year.active_year" :value="year.active_year">
            {{ year.active_year }}
          </option>
        </select>
      </div>
    </div>

      <!-- Popup Tambah Instansi -->
      <div v-if="showPopup" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 class="text-xl font-bold mb-4">Tambah Instansi</h2>
          <form @submit.prevent="handleAddInstansi">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Nama Instansi</label>
              <select
                v-model="selectedAgencyId"
                class="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Pilih Instansi</option>
                <option
                  v-for="item in instansiDataPanrb"
                  :key="item.agency_id"
                  :value="item.agency_id"
                >
                  {{ item.agency_name }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Tahun Penilaian</label>
              <input
                type="number"
                v-model="activeYear"
                class="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                @click="showPopup = false"
                class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>

    <UiTable
      :headers="tableHeaders"
      :items="currentItems"
      class="mb-4"
    >
      <template #no="{ index }: { index: number }">
        {{ index + 1 + (currentPage - 1) * itemsPerPage }}
      </template>
      <template #agency_name="{ item }: { item: any }">
        {{ item.name || item.instansi?.agency_name || 'NA' }}
      </template>
      <template #kategori="{ item }: { item: any }">
        {{ item.category || item.kategori || '-' }}
      </template>
      <template #active_year="{ item }: { item: any }">
        {{ item.active_year }}
      </template>
      <template #aksi="{ item }: { item: any }">
        <UiButton
          @click="editInstansi(item)"
          class="flex justify-center items-center bg-blue-600 text-white hover:bg-blue-700 rounded-md py-2 px-4 transition duration-200"
        >
          <IconEdit class="mr-2" />
        </UiButton>
      </template>
      <template #empty>
        <span class="text-gray-400">Tidak ada data</span>
      </template>
    </UiTable>

      <!-- Pagination Controls -->
      <UiPagination
        v-if="filteredData.length > itemsPerPage"
        class="mt-6"
        :page="currentPage"
        :per-page="itemsPerPage"
        :total="filteredData.length"
        @update:page="(val) => currentPage = val"
      />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFetch } from '#app'
import { useRouter } from 'vue-router'
import UiTable from '@/components/UI/UiTable.vue'
import UiBreadcrumb from '@/components/UI/UiBreadcrumb.vue'
import { useRoute } from 'vue-router'
import { IconEdit } from '@tabler/icons-vue';
import UiPagination from '@/components/UI/UiPagination.vue';
const route = useRoute()
const slug = computed(() => route.params.slug as string)

// Breadcrumb items
const breadcrumbItems = computed(() => {
  const items = [
    { label: 'Dashboard', href: `/${slug.value}/dashboard` },
    { label: 'Daftar Instansi', href: `/${slug.value}/instansi` }
  ]
  // Contoh: jika ada parameter id (untuk detail/edit)
  if (route.params.id) {
    items.push({ label: `Detail Instansi ${route.params.id}`, href: `/${slug.value}/instansi/${route.params.id}` })
  }
  return items
})

// Table headers
const tableHeaders = [
  { text: 'No', value: 'no', center: true, width: '60px' },
  { text: 'Nama Instansi', value: 'agency_name' },
  { text: 'Kategori', value: 'kategori', center: true },
  { text: 'Tahun Penilaian', value: 'active_year', center: true },
  { text: 'Aksi', value: 'aksi', center: true, width: '120px' },
]

// Data & State
const searchQuery = ref('')
const instansiData = ref<any[]>([])
const instansiDataPanrb = ref<any[]>([])

const showPopup = ref(false)
const selectedAgencyId = ref('')
const activeYear = ref('')
const currentPage = ref(1)
const itemsPerPage = 20

// Tahun aktif
const activeYears = ref<any[]>([])
const selectedActiveYear = ref('')

// Fetch Data
const fetchInstansiData = async () => {
  try {
    const { data } = await useFetch('/api/instansi')
    instansiData.value = Array.isArray(data.value) ? data.value : []
    fetchInstansiDataPanrb()
  } catch (error) {
    console.error('Error fetching instansi data:', error)
  }
}

const fetchInstansiDataPanrb = async () => {
  try {
    const { data } = await useFetch('/api/instansi/panrb')
    instansiDataPanrb.value = Array.isArray(data.value) ? data.value : []
  } catch (error) {
    console.error('Error fetching instansi panrb:', error)
  }
}

onMounted(() => {
  fetchInstansiData()
  fetchActiveYears()
})

const fetchActiveYears = async () => {
  try {
    const { data } = await useFetch('/api/active_year')
    activeYears.value = Array.isArray(data.value) ? data.value : []
    // Jika tahun 2025 dan 2026 belum ada, tambahkan manual (untuk demo)
    const tahunList = activeYears.value.map(y => y.active_year)
    if (!tahunList.includes(2025)) activeYears.value.push({ active_year: 2025 })
    if (!tahunList.includes(2026)) activeYears.value.push({ active_year: 2026 })
    // Urutkan descending
    activeYears.value.sort((a, b) => b.active_year - a.active_year)
  } catch (error) {
    activeYears.value = [{ active_year: 2026 }, { active_year: 2025 }]
  }
}

// Filtering & Pagination
const filteredData = computed(() => {
  let data = instansiData.value
  if (selectedActiveYear.value) {
    data = data.filter(item => String(item.active_year) === String(selectedActiveYear.value))
  }
  return data.filter(item =>
    (item.instansi?.agency_name || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (item.active_year?.toString() || '').toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))
const indexOfLastItem = computed(() => currentPage.value * itemsPerPage)
const indexOfFirstItem = computed(() => indexOfLastItem.value - itemsPerPage)
const currentItems = computed(() =>
  filteredData.value
    .sort((a, b) => b.active_year - a.active_year)
    .slice(indexOfFirstItem.value, indexOfLastItem.value)
)

// Pagination handlers
const handleNextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const handlePrevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

// Add Instansi
const handleAddInstansi = async () => {
  try {
    await $fetch('/api/instansi', {
      method: 'POST',
      body: {
        agency_id_panrb: selectedAgencyId.value,
        active_year: activeYear.value,
      },
    })
    alert('Instansi berhasil ditambahkan')
    showPopup.value = false
    selectedAgencyId.value = ''
    activeYear.value = ''
    fetchInstansiData()
  } catch (error) {
    console.error('Error adding instansi:', error)
    alert('Gagal menambahkan instansi')
  }
}


// Edit Instansi (dummy)
const editInstansi = (item: any) => {
  alert(`Edit ${item.instansi?.agency_name ?? 'NA'}`)
}



definePageMeta({
  layout: 'sidebar',
})
</script>