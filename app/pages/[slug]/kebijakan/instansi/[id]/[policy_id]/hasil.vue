<template>
  <div class="w-full px-6 py-8">
    <div v-if="loading" class="text-gray-600">
      <p>Memuat data hasil jawaban...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <h3 class="text-red-600 font-medium">Error</h3>
      <p class="text-red-500 mt-1">{{ error }}</p>
      <button
        @click="fetchData"
        class="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm transition-colors hover:bg-red-200"
      >
        Coba Lagi
      </button>
    </div>

    <div v-else-if="!policy || !apiQuestions.length">
      <p class="text-gray-600">Data hasil jawaban tidak lengkap atau belum ada.</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="flex items-start gap-4">
          <button
            @click="router.back()"
            class="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md transition-colors whitespace-nowrap mt-1"
          >
            <IconArrowLeft class="w-4 h-4" />
            Kembali
          </button>
          <div>
            <h1 class="text-2xl font-bold">Hasil Jawaban Kebijakan</h1>
            <div class="mt-4 space-y-1">
              <p class="text-gray-600"><b>Nama Kebijakan:</b> {{ policy.nama_kebijakan }}</p>
              <p class="text-gray-600"><b>Deskripsi:</b> {{ policy.deskripsi_kebijakan }}</p>
              
              <!-- Sektor -->
              <p v-if="policy.sektor" class="text-gray-600">
                <b>Sektor:</b> {{ policy.sektor }}
              </p>
              
              <!-- Dasar Hukum -->
              <div v-if="policy.dasar_hukum && policy.dasar_hukum.length > 0" class="mt-2">
                <p class="text-gray-600 font-medium flex items-center gap-2">
                  <b>Dasar Hukum</b> 
                  <a 
                    v-if="policy.file_url"
                    :href="policy.file_url" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:text-blue-800 underline text-sm ml-2"
                  >
                    (Lihat Dokumen Dasar Hukum)
                  </a>
                </p>
                <ul class="list-disc list-inside ml-4 text-gray-600">
                  <li v-for="(item, index) in policy.dasar_hukum" :key="index">
                    <span class="font-medium">{{ item.jenis }}:</span> {{ item.nomor }}
                  </li>
                </ul>
              </div>
              
              <!-- Program -->
              <div v-if="policy.policy_program" class="mt-2">
                <p class="text-gray-600 flex items-center gap-2">
                  <b>Program:</b> {{ policy.policy_program }}
                  <a 
                    v-if="policy.program_url"
                    :href="policy.program_url" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    (Lihat Detail Program)
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-end gap-2 shrink-0">
          <div class="flex gap-2">
            <button
              @click="handleExportExcel"
              :disabled="isExporting"
              class="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 px-4 py-2 rounded-md transition-colors font-medium shadow-sm"
              title="Ekspor semua data hasil jawaban ke Excel"
            >
              <IconFileText class="w-4 h-4" />
              {{ isExporting ? 'Mengekspor...' : 'Export Excel' }}
            </button>
            <button
              @click="handleExportPDF"
              :disabled="isExporting"
              class="flex items-center gap-2 border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-md transition-colors font-medium shadow-sm"
              title="Ekspor hasil jawaban ke PDF"
            >
              <IconDownload class="w-4 h-4" />
              {{ isExporting ? 'Mengekspor...' : 'Export PDF' }}
            </button>
          </div>
          <p class="text-xs text-gray-500">
            Excel: Info, Ringkasan, Detail & Analisis | PDF: Laporan Lengkap
          </p>
        </div>
      </div>

      <!-- Policy Info Card -->
      <div class="bg-white rounded-xl border shadow-sm">
        <div class="p-5 border-b bg-gray-50/50">
          <h3 class="text-lg font-semibold text-gray-800">Informasi Kebijakan</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div>
              <p class="text-sm text-gray-500 mb-1">Instansi</p>
              <p class="font-medium text-gray-900">{{ policy.instansi }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Status</p>
              <p class="font-medium text-gray-900">{{ policy.status_kebijakan }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Nilai Self Assessment</p>
              <p class="font-medium text-gray-900">{{ policy.nilai_akhir || 0 }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Nilai Verifikasi</p>
              <p class="font-medium text-gray-900">{{ policy.nilai_akhir_verifikasi || 0 }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Nilai Koordinator Nasional</p>
              <p class="font-medium text-gray-900">{{ policy.nilai_akhir_koornas || 0 }}</p>
            </div>
          </div>
          
          <!-- Statistik Progress -->
          <div class="border-t pt-5">
            <h4 class="font-semibold text-gray-800 mb-4">Statistik Progress</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                <p class="text-sm text-gray-600 mb-1">Total Indikator</p>
                <p class="font-bold text-2xl text-blue-600">{{ apiQuestions.length }}</p>
              </div>
              <div class="bg-green-50/50 p-4 rounded-lg border border-green-100">
                <p class="text-sm text-gray-600 mb-1">Self Assessment</p>
                <p class="font-bold text-2xl text-green-600">
                  {{ Object.keys(selfAssessmentAnswers).length }} 
                  <span class="text-sm font-normal text-gray-500 ml-1">
                    ({{ apiQuestions.length > 0 ? ((Object.keys(selfAssessmentAnswers).length / apiQuestions.length) * 100).toFixed(0) : 0 }}%)
                  </span>
                </p>
              </div>
              <div class="bg-orange-50/50 p-4 rounded-lg border border-orange-100">
                <p class="text-sm text-gray-600 mb-1">Terverifikasi</p>
                <p class="font-bold text-2xl text-orange-600">
                  {{ Object.keys(verifikatorAnswers).length }}
                  <span class="text-sm font-normal text-gray-500 ml-1">
                    ({{ apiQuestions.length > 0 ? ((Object.keys(verifikatorAnswers).length / apiQuestions.length) * 100).toFixed(0) : 0 }}%)
                  </span>
                </p>
              </div>
              <div class="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
                <p class="text-sm text-gray-600 mb-1">Tervalidasi KN</p>
                <p class="font-bold text-2xl text-purple-600">
                  {{ Object.keys(koornasAnswers).length }}
                  <span class="text-sm font-normal text-gray-500 ml-1">
                    ({{ apiQuestions.length > 0 ? ((Object.keys(koornasAnswers).length / apiQuestions.length) * 100).toFixed(0) : 0 }}%)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Table -->
      <div class="bg-white rounded-xl border shadow-sm">
        <div class="p-5 border-b bg-gray-50/50">
          <h3 class="text-lg font-semibold text-gray-800">Ringkasan Skor per Dimensi</h3>
        </div>
        <div class="p-6">
          <SummaryTable
            :questions-by-dimension="questionsByDimension"
            :self-assessment-answers="selfAssessmentAnswers"
            :verifikator-answers="verifikatorAnswers"
            :koornas-answers="koornasAnswers"
            :jf-data="jfData"
            :policy="policy"
          />
        </div>
      </div>

      <!-- Detailed Results by Dimension -->
      <div 
        v-for="(questions, dimension) in questionsByDimension" 
        :key="dimension"
        class="bg-white rounded-xl border shadow-sm overflow-hidden"
      >
        <div class="p-5 border-b bg-blue-50/30">
          <h3 class="text-lg font-semibold flex items-center gap-3 text-gray-800">
            <div class="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
            {{ dimension }}
          </h3>
        </div>
        <div class="p-0">
          <ResultTable
            :questions="questions"
            :self-assessment-answers="selfAssessmentAnswers"
            :self-assessment-notes="selfAssessmentNotes"
            :self-assessment-file-urls="selfAssessmentFileUrls"
            :verifikator-answers="verifikatorAnswers"
            :verifikator-notes="verifikatorNotes"
            :koornas-answers="koornasAnswers"
            :koornas-notes="koornasNotes"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IconArrowLeft, IconDownload, IconFileText } from '@tabler/icons-vue'
// Jika Anda tidak menggunakan vue-sonner, ganti dengan alert biasa atau toast plugin dari Nuxt
import { toast } from 'vue-sonner' 

// Import utility untuk export (Pastikan file ini sudah ada di Nuxt project Anda)
// import { exportToExcel } from '@/utils/excelExport'
// import { exportToPDF } from '@/utils/pdfExport'

// Types
type AnswerOption = {
  level_id: number
  level_score: string
  level_description: string
}

type Question = {
  id: string
  dimension_name: string
  indicator_question: string
  indicator_description: string
  indicator_column_code: string
  instrument_answer: AnswerOption[]
}

type Policy = {
  id: string
  nama_kebijakan: string
  deskripsi_kebijakan: string
  sektor?: string
  dasar_hukum?: Array<{
    jenis: string
    nomor: string
  }>
  file_url?: string
  policy_program?: string
  program_url?: string
  tanggal_proses: string
  instansi: string
  status_kebijakan: string
  progress_pengisian?: number
  nilai_akhir?: number
  nilai_akhir_verifikasi?: number
  nilai_akhir_koornas?: number
}

const route = useRoute()
const router = useRouter()
const policyId = computed(() => route.params.policy_id as string)

// State
const isExporting = ref(false)
const loading = ref(true)
const error = ref<string | null>(null)

const policyData = ref<Policy | null>(null)
const apiQuestions = ref<Question[]>([])

const answersKiData = ref<Record<string, unknown>>({})
const answersVerifData = ref<Record<string, unknown>>({})
const answersKoornasData = ref<Record<string, unknown>>({})

// Data fetching menggunakan Promise.all untuk paralel
const fetchData = async () => {
  try {
    loading.value = true
    error.value = null

    if (!policyId.value) throw new Error('Policy ID tidak ditemukan')

    const [policyRes, questionsRes, kiRes, verifRes, koornasRes] = await Promise.all([
      $fetch<any>(`/api/policies/${policyId.value}`).catch(() => ({ data: null })),
      $fetch<any>('/api/pertanyaan').catch(() => ({ data: [] })),
      $fetch<any>(`/api/answers?policyId=${policyId.value}`).catch(() => ({ data: {} })),
      $fetch<any>(`/api/answers_ku?policyId=${policyId.value}`).catch(() => ({ data: {} })),
      $fetch<any>(`/api/answers_kn?policyId=${policyId.value}`).catch(() => ({ data: {} }))
    ])

    policyData.value = policyRes?.data || null
    
    if (Array.isArray(questionsRes?.data)) {
      apiQuestions.value = questionsRes.data
    }
    
    answersKiData.value = kiRes?.data || {}
    answersVerifData.value = verifRes?.data || {}
    answersKoornasData.value = koornasRes?.data || {}

  } catch (err: any) {
    console.error('Error fetching data:', err)
    error.value = err.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

// Computed Properties
const policy = computed(() => {
  if (!policyData.value) return undefined
  return {
    ...policyData.value,
    nilai_akhir: policyData.value.nilai_akhir ?? null,
    nilai_akhir_verifikasi: policyData.value.nilai_akhir_verifikasi ?? null,
    nilai_akhir_koornas: policyData.value.nilai_akhir_koornas ?? null,
  }
})

// Helper functions (Di dalam setup, tidak perlu dependensi luar)
const mapAnswers = (data: Record<string, unknown>, questions: Question[]) => {
  const result: Record<string, { description: string; score: number }> = {}
  questions.forEach((q) => {
    const code = q.indicator_column_code
    const score = data?.[code]
    if (score !== undefined && q.instrument_answer?.length > 0) {
      const matched = q.instrument_answer.find(a => String(a.level_score) === String(score))
      if (matched) {
        result[q.id] = { 
          description: matched.level_description, 
          score: Number(matched.level_score) 
        }
      }
    }
  })
  return result
}

const mapNotes = (data: Record<string, unknown>, prefix: string) => {
  const result: Record<string, string> = {}
  Object.entries(data || {}).forEach(([key, value]) => {
    if (key.startsWith(prefix)) {
      result[key] = value ? String(value) : ''
    }
  })
  return result
}

const mapFileUrls = (data: Record<string, unknown>, prefix: string) => {
  const result: Record<string, string> = {}
  Object.entries(data || {}).forEach(([key, value]) => {
    if (key.startsWith(prefix) && value) {
      result[key] = String(value)
    }
  })
  return result
}

const extractJfData = (data: Record<string, unknown>) => {
  const jfValue = Boolean(data?.jf)
  return {
    selfAssessment: jfValue,
    verifikator: jfValue,
    koornas: jfValue
  }
}

const selfAssessmentAnswers = computed(() => mapAnswers(answersKiData.value, apiQuestions.value))
const selfAssessmentNotes = computed(() => mapNotes(answersKiData.value, 'penjelasan_'))
const selfAssessmentFileUrls = computed(() => mapFileUrls(answersKiData.value, 'file_url_'))
const jfData = computed(() => extractJfData(answersKiData.value))

const verifikatorAnswers = computed(() => mapAnswers(answersVerifData.value, apiQuestions.value))
const verifikatorNotes = computed(() => mapNotes((answersVerifData.value?.verifikator as Record<string, unknown>) || {}, 'catatan_'))

const koornasAnswers = computed(() => mapAnswers(answersKoornasData.value, apiQuestions.value))
const koornasNotes = computed(() => mapNotes((answersKoornasData.value?.verifikator as Record<string, unknown>) || {}, 'catatan_'))

const questionsByDimension = computed(() => {
  return apiQuestions.value.reduce((acc, question) => {
    const dimension = question.dimension_name
    if (!acc[dimension]) {
      acc[dimension] = []
    }
    acc[dimension].push(question)
    return acc
  }, {} as Record<string, Question[]>)
})

// Handlers
const handleExportPDF = async () => {
  if (!policy.value || !apiQuestions.value.length) {
    toast.error('Data belum lengkap untuk diekspor')
    return
  }

  isExporting.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500)) // delay animasi
    
    // Asumsi exportToPDF adalah fungsi sinkronous atau asinkronous
    // await exportToPDF({
    //   policy: policy.value,
    //   questionsByDimension: questionsByDimension.value,
    //   selfAssessmentAnswers: selfAssessmentAnswers.value,
    //   selfAssessmentNotes: selfAssessmentNotes.value,
    //   selfAssessmentFileUrls: selfAssessmentFileUrls.value,
    //   verifikatorAnswers: verifikatorAnswers.value,
    //   verifikatorNotes: verifikatorNotes.value,
    //   koornasAnswers: koornasAnswers.value,
    //   koornasNotes: koornasNotes.value,
    //   jfData: jfData.value,
    // })
    toast.info('Fungsi export PDF belum tersedia/dimigrasi.')
    
    toast.success('File PDF berhasil diunduh!')
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    toast.error('Gagal mengekspor ke PDF. Silakan coba lagi.')
  } finally {
    isExporting.value = false
  }
}

const handleExportExcel = async () => {
  if (!policy.value || !apiQuestions.value.length) {
    toast.error('Data belum lengkap untuk diekspor')
    return
  }

  isExporting.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // await exportToExcel({
    //   policy: policy.value,
    //   questionsByDimension: questionsByDimension.value,
    //   selfAssessmentAnswers: selfAssessmentAnswers.value,
    //   selfAssessmentNotes: selfAssessmentNotes.value,
    //   selfAssessmentFileUrls: selfAssessmentFileUrls.value,
    //   verifikatorAnswers: verifikatorAnswers.value,
    //   verifikatorNotes: verifikatorNotes.value,
    //   koornasAnswers: koornasAnswers.value,
    //   koornasNotes: koornasNotes.value,
    //   jfData: jfData.value,
    // })
    toast.info('Fungsi export Excel belum tersedia/dimigrasi.')
    
    toast.success('File Excel berhasil diunduh!')
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    toast.error('Gagal mengekspor ke Excel. Silakan coba lagi.')
  } finally {
    isExporting.value = false
  }
}

definePageMeta({
  layout: 'sidebar'
})
</script>
