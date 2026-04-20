<template>
  <div class="w-full px-6 py-8">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Data Pengguna</h1>
      <div class="flex flex-col md:flex-row md:items-center gap-2">
        <UiButton @click="goToAddUser">Tambah Pengguna</UiButton>
        <UiInput
          v-model="searchQuery"
          type="text"
          placeholder="Cari Nama..."
          class="w-60"
          @input="currentPage = 1"
        />
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex space-x-2 md:space-x-4 mb-6 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="handleTabChange(tab)"
        :class="[
          'px-4 py-2 text-sm md:text-base rounded-t-lg font-semibold whitespace-nowrap',
          activeTab === tab
            ? 'bg-white text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-600 bg-gray-200'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <div class="overflow-x-auto rounded-lg border">
      <UiTable :headers="tableHeaders" :items="paginatedData">
        <template #no="{ index }: { item: any, index: number }">
          {{ startIndex + index + 1 }}
        </template>
        <template #name="{ item, index }: { item: any, index: number }">
          {{ item.name }}
        </template>
        <template #username="{ item, index }: { item: any, index: number }">
          {{ item.username }}
        </template>
        <template #agency_name="{ item, index }: { item: any, index: number }">
          {{ item.instansi?.agency_name ?? '-' }}
        </template>
        <template #active_year="{ item, index }: { item: any, index: number }">
          {{ item.active_year ?? '-' }}
        </template>
        <template v-if="activeTab === 'Koordinator Instansi'" #surat_penunjukkan="{ item, index }: { item: any, index: number }">
          <span v-if="item.surat_penunjukkan?.file">
            <a
              :href="item.surat_penunjukkan.file"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-500 hover:underline break-all"
            >Lihat Surat</a>
          </span>
          <span v-else class="text-gray-500">Tidak Ada</span>
        </template>
        <template v-if="activeTab === 'Koordinator Instansi'" #jfak="{ item, index }: { item: any, index: number }">
          <span v-if="item.surat_penunjukkan?.melibatkan_jf_analis" class="text-green-500">✔</span>
          <span v-else class="text-red-500">✘</span>
        </template>
        <template #status="{ item, index }: { item: any, index: number }">
          <span
            :class="[
              'px-2 py-1 text-xs font-semibold rounded-full',
              item.status?.toLowerCase() === 'aktif'
                ? 'bg-green-200 text-green-800'
                : 'bg-red-200 text-red-800'
            ]"
          >
            {{ item.status || 'Tidak Diketahui' }}
          </span>
        </template>
        <template #aksi="{ item, index }: { item: any, index: number }">
          <div class="flex justify-center items-center space-x-2 w-40">
            <UiButton
              @click="handleEdit(item.id, item.name)"
              class="flex justify-center items-center bg-blue-600 text-white hover:bg-blue-700 rounded-md py-2 px-4 transition duration-200"
            >
              <IconEdit class="mr-2" />
            </UiButton>
            <UiButton
              @click="confirmDelete(item.id, item.name)"
              class="flex justify-center items-center bg-red-600 text-white hover:bg-red-700 rounded-md py-2 px-4 transition duration-200"
            >
              <IconTrash class="mr-2" />
            </UiButton>
          </div>
        </template>
        <template #empty>
          <span v-if="isLoading" class="text-gray-400">Memuat data...</span>
          <span v-else-if="error" class="text-red-500">Gagal memuat data</span>
          <span v-else class="text-gray-400">Data tidak ditemukan.</span>
        </template>
      </UiTable>
    </div>

    <!-- Pagination Controls -->
    <div v-if="filteredData.length > USERS_PER_PAGE" class="mt-6 flex justify-between items-center text-sm">
      <UiPagination
        :page="currentPage"
        :per-page="USERS_PER_PAGE"
        :total="filteredData.length"
        @update:page="(p) => currentPage = p"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import UiTable from '@/components/UI/UiTable.vue'
import UiButton from '@/components/UI/UiButton.vue'
import UiInput from '@/components/UI/UiInput.vue'
import { IconEdit, IconTrash } from '@tabler/icons-vue'
import { useFetch } from '#app'
import UiPagination from '@/components/UI/UiPagination.vue'
// import toast from plugin vue-sonner/vue-toastification jika ada

const tabs = [
  'Koordinator Nasional',
  'Tim Verifikator',
  'Koordinator Instansi',
  'Analis Instansi',
]
const USERS_PER_PAGE = 20

interface Instansi {
  agency_name: string
}
interface SuratPenunjukkan {
  file?: string
  melibatkan_jf_analis?: boolean
}
interface User {
  instansi: Instansi | null
  active_year: string
  coordinator_type_name: string
  agency_name: string
  id: number
  name: string
  username: string
  work_unit: string
  status: string
  surat_penunjukkan?: SuratPenunjukkan
}

const searchQuery = ref('')
const activeTab = ref(tabs[0])
const currentPage = ref(1)
const router = useRouter()

const getRoleIdFromTab = (tab: string): number => {
  const roleMap: Record<string, number> = {
    'Koordinator Nasional': 2,
    'Tim Verifikator': 3,
    'Koordinator Instansi': 4,
    'Analis Instansi': 5,
  }
  return roleMap[tab] || 0
}

// Data fetching
const { data, error, pending: isLoading, refresh } = useFetch<User[]>(() =>
  `/api/users?role_id=${getRoleIdFromTab(activeTab.value ?? '')}`
)

watch(activeTab, () => {
  currentPage.value = 1
  refresh()
})

const filteredData = computed(() =>
  (data.value ?? []).filter(
    (item) =>
      (item.name ?? '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (item.instansi?.agency_name ?? '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (item.active_year ?? '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (item.username ?? '').toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

const totalPages = computed(() => Math.ceil(filteredData.value.length / USERS_PER_PAGE))
const startIndex = computed(() => (currentPage.value - 1) * USERS_PER_PAGE)
const paginatedData = computed(() =>
  filteredData.value.slice(startIndex.value, startIndex.value + USERS_PER_PAGE)
)

// Table headers
const tableHeaders = computed(() => {
  const base = [
    { text: 'No', value: 'no', center: true, width: '60px' },
    { text: 'Nama', value: 'name' },
    { text: 'NIP', value: 'username', center: true },
    { text: 'Nama Instansi', value: 'agency_name', center: true },
    { text: 'Tahun Aktif', value: 'active_year', center: true },
  ]
  if (activeTab.value === 'Koordinator Instansi') {
    base.push(
      { text: 'Surat Penunjukan', value: 'surat_penunjukkan', center: true },
      { text: 'JFAK', value: 'jfak', center: true }
    )
  }
  base.push({ text: 'Status', value: 'status', center: true })
  base.push({ text: 'Aksi', value: 'aksi', center: true, width: '120px' })
  return base
})

// Actions
const goToAddUser = () => {
  router.push({ path: `add` })
}
const handleEdit = (id: number, name: string) => {
  // Ganti dengan toast/info sesuai plugin yang kamu pakai
  // toast.info(`Mengarahkan ke halaman edit ${name}...`)
  router.push({ path: `edit/${id}` })
}
const handleDelete = async (id: number, name: string) => {
  // Ganti dengan toast loading/success/error sesuai plugin yang kamu pakai
  // const deleteToast = toast.loading(`Sedang menghapus ${name}...`)
  try {
    const response = await $fetch(`/api/users/${id}`, { method: 'DELETE' })
    // toast.success(`Pengguna ${name} berhasil dihapus`, { id: deleteToast })
    refresh()
  } catch (error: any) {
    // toast.error(error?.message || 'Gagal menghapus pengguna', { id: deleteToast })
  }
}
const confirmDelete = (id: number, name: string) => {
  if (confirm(`Apakah Anda yakin ingin menghapus pengguna "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
    handleDelete(id, name)
  }
}

// Pagination
const handleNextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const handlePrevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const handleTabChange = (tab: string) => {
  activeTab.value = tab
  currentPage.value = 1
}
definePageMeta({
  layout: 'sidebar',
})
</script>

