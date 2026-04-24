<template>
  <div class="w-full px-6 py-8">
    <div v-if="loading">
      <p class="text-gray-600">Memuat data kebijakan...</p>
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
    
    <div v-else-if="!policyData">
      <p class="text-gray-600">Data kebijakan tidak ditemukan</p>
    </div>
    
    <div v-else class="space-y-8">
      <!-- PolicyCard is assumed to be an auto-imported Nuxt component -->
      <PolicyCard :policy="policyData" />

      <!-- Navigasi Step -->
      <PolicyStepsNav 
        :active-step="activeStep" 
        @change-step="activeStep = $event" 
      />

      <!-- Daftar Pertanyaan - Mode Read Only -->
      <QuestionList
        :active-step="activeStep"
        :selected-answers="selectedAnswers"
        :api-questions="apiQuestions"
        :is-read-only="true"
        :dimension-notes="{
          a: verificatorNotes.a ?? '',
          b: verificatorNotes.b ?? '',
          c: verificatorNotes.c ?? '',
          d: verificatorNotes.d ?? '',
        }"
        :uploaded-files="{}"
      />

      <!-- Informasi Tambahan Dinamis -->
      <AdditionalInfoSection
        :value="currentAdditionalInfo"
        :dimension-name="activeDimensionName"
        @change="() => {}"
        @save="() => {}"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Types
type Policy = {
  id: string
  nama_kebijakan: string
  deskripsi_kebijakan: string
  status_kebijakan: string
  tanggal_proses: string
  instansi: string
  progress_pengisian: number
  nilai_akhir: number
}

type Question = {
  id: string
  dimension_name: string
  indicator_question: string
  indicator_description: string
  indicator_column_code: string
  instrument_answer: {
    level_id: number
    level_score: string
    level_description: string
  }[]
}

const stepDimensionMap: Record<number, string> = {
  0: 'Perencanaan Kebijakan',
  1: 'Implementasi Kebijakan',
  2: 'Evaluasi dan Keberlanjutan Kebijakan',
  3: 'Transparansi dan Partisipasi Publik',
}

const route = useRoute()
const policyId = computed(() => route.params.policy_id as string)

// State
const activeStep = ref(0)
const selectedAnswers = ref<Record<string, { description: string; score: number }>>({})
const policyData = ref<Policy | null>(null)
const apiQuestions = ref<Question[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Informasi tambahan
const additionalInfoA = ref('')
const additionalInfoB = ref('')
const additionalInfoC = ref('')
const additionalInfoD = ref('')

// Catatan verifikator
const verificatorNotes = ref<Record<string, string>>({})

// Fetch data awal (policy & pertanyaan)
const fetchData = async () => {
  try {
    loading.value = true
    error.value = null

    if (!policyId.value) throw new Error('Policy ID tidak ditemukan')

    // Load policy data
    const policyRes = await $fetch<any>(`/api/policies/${policyId.value}`)
    policyData.value = policyRes.data

    // Load questions
    const questionsRes = await $fetch<any>('/api/pertanyaan')
    if (Array.isArray(questionsRes.data)) {
      apiQuestions.value = questionsRes.data
    }

    // Load answers
    const answersRes = await $fetch<any>(`/api/answers_ku?policyId=${policyId.value}`)
    
    // Mapping jawaban
    const savedAnswers: Record<string, { description: string; score: number }> = {}
    const answerKeys = Object.keys(answersRes.data || {}).filter(k =>
      ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3', 'd1', 'd2'].includes(k)
    )
    
    if (questionsRes.data) {
      questionsRes.data.forEach((q: Question) => {
        const columnCode = q.indicator_column_code
        if (answerKeys.includes(columnCode)) {
          const matchedAnswer = q.instrument_answer.find(
            a => a.level_score === answersRes.data[columnCode]
          )
          if (matchedAnswer) {
            savedAnswers[q.id] = {
              description: matchedAnswer.level_description,
              score: Number(matchedAnswer.level_score),
            }
          }
        }
      })
    }
    selectedAnswers.value = savedAnswers

    // Mapping informasi tambahan
    additionalInfoA.value = answersRes.data?.informasi_a || ''
    additionalInfoB.value = answersRes.data?.informasi_b || ''
    additionalInfoC.value = answersRes.data?.informasi_c || ''
    additionalInfoD.value = answersRes.data?.informasi_d || ''

    // Mapping catatan verifikator
    verificatorNotes.value = answersRes.data?.verifikator || {}

  } catch (err: any) {
    console.error(err)
    error.value = err.message || 'Terjadi kesalahan saat memuat data'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const activeDimensionName = computed(() => stepDimensionMap[activeStep.value])
const activeDimensionKey = computed(() => activeDimensionName.value?.charAt(0).toLowerCase() || '') // 'a', 'b', dll.

const currentAdditionalInfo = computed(() => {
  switch (activeDimensionKey.value) {
    case 'a': return additionalInfoA.value
    case 'b': return additionalInfoB.value
    case 'c': return additionalInfoC.value
    case 'd': return additionalInfoD.value
    default: return ''
  }
})

// Gunakan layout sidebar dan lewati proteksi role guard di halaman ini
definePageMeta({
  layout: 'sidebar'
})
</script>
