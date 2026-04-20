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
        {{ item.instansi?.agency_name || 'NA' }}
      </template>
      <template #active_year="{ item }: { item: any }">
        {{ item.active_year }}
      </template>
      <template #aksi="{ item }: { item: any }">
        <button
          @click="editInstansi(item)"
          class="flex justify-center items-center bg-blue-600 text-white hover:bg-blue-700 rounded-md py-2 px-4 transition duration-200"
        >
          <Icon name="fa6-solid:pen-to-square" class="mr-2" />
          Edit
        </button>
      </template>
      <template #empty>
        <span class="text-gray-400">Tidak ada data</span>
      </template>
    </UiTable>

      <!-- Pagination Controls -->
      <div v-if="filteredData.length > itemsPerPage" class="mt-6 flex justify-between items-center text-sm">
        <span>
          Halaman {{ currentPage }} dari {{ totalPages }}
        </span>
        <div class="space-x-2">
          <button
            class="border border-gray-300 px-4 py-2 rounded"
            :disabled="currentPage === 1"
            @click="handlePrevPage"
          >
            Sebelumnya
          </button>
          <button
            class="border border-gray-300 px-4 py-2 rounded"
            :disabled="currentPage === totalPages"
            @click="handleNextPage"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFetch } from '#app'
import { useRouter } from 'vue-router'
import UiTable from '@/components/UI/UiTable.vue'
import UiBreadcrumb from '@/components/UI/UiBreadcrumb.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const slug = computed(() => route.params.slug as string)

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'Dashboard', href: '/' },
  { label: 'Instansi', href: `/${slug.value}/instansi` },
  { label: 'Daftar Instansi' },
])

// Table headers
const tableHeaders = [
  { text: 'No', value: 'no', center: true, width: '60px' },
  { text: 'Nama Instansi', value: 'agency_name' },
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
})

// Filtering & Pagination
const filteredData = computed(() =>
  instansiData.value.filter(item =>
    (item.instansi?.agency_name || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (item.active_year?.toString() || '').toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

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