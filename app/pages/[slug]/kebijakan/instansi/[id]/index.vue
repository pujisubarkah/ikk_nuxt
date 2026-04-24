<template>
  <div class="w-full px-6 py-8">
    <div class="flex-1">
      <button 
        @click="router.back()"
        class="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
      >
        &larr; Kembali
      </button>

      <!-- Title -->
      <h1 class="text-3xl font-semibold mb-6 text-gray-800">📋 Daftar Kebijakan</h1>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Memuat data kebijakan...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 class="text-red-600 font-medium">Error</h3>
        <p class="text-red-500 mt-1">{{ error }}</p>
        <button
          @click="fetchData"
          class="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
        >
          Coba Lagi
        </button>
      </div>

      <!-- Data State -->
      <div v-else>
        <div class="mb-6">
          <p class="text-lg font-medium text-gray-700">
            Instansi: <span class="font-normal">{{ instansiData?.agency_name || 'N/A' }}</span>
          </p>
          <p class="text-lg font-medium text-gray-700">
            Kategori Instansi: <span class="font-normal">{{ instansiData?.instansi_kategori?.kat_instansi || 'N/A' }}</span>
          </p>
        </div>

        <!-- Table -->
        <div class="rounded-xl shadow-md border bg-white overflow-hidden">
          <UiTable :headers="tableHeaders" :items="paginatedData">
            <template #no="{ index }: { index: number }">
              {{ startIndex + index + 1 }}
            </template>
            
            <template #name="{ item }: { item: any }">
              {{ item.name }}
            </template>

            <template #name_detail="{ item }: { item: any }">
              {{ item.name_detail }}
            </template>

            <template #sector="{ item }: { item: any }">
              {{ item.sector }}
            </template>

            <template #status="{ item }: { item: any }">
              <span :class="[
                'px-2 py-1 text-xs rounded-full font-medium whitespace-nowrap',
                item.policy_status === 'SELESAI_VERIFIKASI' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'
              ]">
                {{ item.policy_status?.replace(/_/g, ' ') || 'N/A' }}
              </span>
            </template>

            <template #process="{ item }: { item: any }">
              <span :class="[
                'px-2 py-1 text-xs rounded-full font-medium whitespace-nowrap',
                item.policy_process === 'DITOLAK' ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-800'
              ]">
                {{ item.policy_process || 'N/A' }}
              </span>
            </template>

            <template #progress="{ item }: { item: any }">
              <div class="flex flex-col space-y-2">
                <div class="flex items-center space-x-2">
                  <div class="w-32 bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" :style="{ width: item.progress || '0%' }"></div>
                  </div>
                  <span class="text-sm text-gray-600">{{ item.progress || '0%' }}</span>
                </div>
                
                <!-- IKK Scores -->
                <div class="flex flex-col space-y-1 text-xs whitespace-nowrap">
                  <div v-if="item.ikk_ki_score && item.ikk_ki_score.length > 0 && item.ikk_ki_score[0].ikk_total_score != null" class="flex items-center space-x-1">
                    <span class="font-medium text-blue-600">Self Assesment:</span>
                    <span class="font-bold text-gray-700">{{ Number(item.ikk_ki_score[0].ikk_total_score).toFixed(2) }}</span>
                  </div>
                  <div v-if="item.ikk_ku_score && item.ikk_ku_score.length > 0 && item.ikk_ku_score[0].ikk_total_score != null" class="flex items-center space-x-1">
                    <span class="font-medium text-orange-600">Verifikator:</span>
                    <span class="font-bold text-gray-700">{{ Number(item.ikk_ku_score[0].ikk_total_score).toFixed(2) }}</span>
                  </div>
                  <div v-if="item.ikk_kn_score && item.ikk_kn_score.length > 0 && item.ikk_kn_score[0].ikk_total_score != null" class="flex items-center space-x-1">
                    <span class="font-medium text-purple-600">Koornas:</span>
                    <span class="font-bold text-gray-700">{{ Number(item.ikk_kn_score[0].ikk_total_score).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </template>

            <template #aksi="{ item }: { item: any }">
              <button
                @click="router.push(`/${slug}/kebijakan/instansi/${id}/${item.id}/hasil`)"
                class="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
              >
                Lihat Hasil
              </button>
            </template>

            <template #empty>
              <div class="text-center py-10 text-gray-500">
                Tidak ada data kebijakan yang tersedia.
              </div>
            </template>
          </UiTable>
        </div>

        <!-- Pagination -->
        <div v-if="policies.length > itemsPerPage" class="mt-8 flex justify-center items-center">
          <UiPagination
            :page="currentPage"
            :per-page="itemsPerPage"
            :total="policies.length"
            @update:page="(p) => currentPage = p"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import UiTable from '@/components/UI/UiTable.vue'
import UiPagination from '@/components/UI/UiPagination.vue'

interface Policy {
  id: string
  name: string
  name_detail: string
  sector: string
  lainnya: string | null
  policy_status: string
  policy_process: string
  progress: string
  ikk_ki_score?: Array<{ ikk_total_score: number }>
  ikk_ku_score?: Array<{ ikk_total_score: number }>
  ikk_kn_score?: Array<{ ikk_total_score: number }>
}

interface InstansiData {
  agency_id: string
  agency_name: string
  instansi_kategori: {
    kat_instansi: string
  }
  policy: Policy[]
}

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)
const slug = computed(() => route.params.slug as string)

const instansiData = ref<InstansiData | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const currentPage = ref(1)
const itemsPerPage = 25

const tableHeaders = [
  { text: 'No', value: 'no', center: true, width: '60px' },
  { text: 'Nama Kebijakan', value: 'name' },
  { text: 'Detail Kebijakan', value: 'name_detail' },
  { text: 'Sektor', value: 'sector' },
  { text: 'Status Kebijakan', value: 'status', center: true },
  { text: 'Proses', value: 'process', center: true },
  { text: 'Progress', value: 'progress' },
  { text: 'Aksi', value: 'aksi', center: true },
]

const fetchData = async () => {
  if (!id.value) {
    loading.value = false
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    const data = await $fetch<InstansiData>(`/api/instansi/policy/${id.value}`)
    instansiData.value = data
  } catch (err: any) {
    console.error('Error fetching data:', err)
    error.value = err.message || 'Gagal memuat data kebijakan'
    instansiData.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const policies = computed(() => instansiData.value?.policy || [])
const totalPages = computed(() => Math.ceil(policies.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const paginatedData = computed(() => policies.value.slice(startIndex.value, startIndex.value + itemsPerPage))

definePageMeta({
  layout: 'sidebar' // Menggunakan layout sidebar
})
</script>
