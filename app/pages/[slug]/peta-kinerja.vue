<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-[#2c5282] mb-4">
      Peta Kinerja Tim Penilai
    </h1>

    <!-- Dropdown Koornas -->
    <div class="mb-6 flex items-center">
      <label class="font-semibold mr-2 text-gray-700">Pilih Koordinator Nasional:</label>
      <select
        class="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[250px]"
        v-model="selectedKoordinator"
      >
        <option v-for="kn in koordinatorList" :key="kn.id" :value="kn.id">
          {{ kn.name }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="text-gray-600">
      <p>Memuat data verifikator...</p>
    </div>
    
    <div v-else style="height: 500px; width: 100%" class="border rounded-lg shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden relative">
      <VueFlow 
        :nodes="nodes" 
        :edges="edges" 
        :fit-view-on-init="true"
        @node-click="handleNodeClick"
      >
        <Background color="#e0e7ff" :gap="20" />
        <Controls class="bg-white shadow-md rounded border border-gray-200" />
        <MiniMap class="bg-white shadow-md rounded border border-gray-200" />
      </VueFlow>
    </div>

    <!-- 💬 Modal info Verifikator -->
    <div v-if="selectedVerifikator" class="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-5xl max-h-[85vh] overflow-y-auto relative">
        <h2 class="text-2xl font-bold text-blue-700 mb-4">
          {{ selectedVerifikator.name }} — Detail Kebijakan
        </h2>

        <div v-if="loadingPolicies" class="py-8 text-center text-gray-500">
          <p>Memuat data kebijakan...</p>
        </div>
        <div v-else-if="policies.length === 0" class="py-8 text-center text-gray-500">
          <p>Tidak ada data kebijakan.</p>
        </div>
        <div v-else>
          <div class="overflow-x-auto rounded-lg border border-gray-200">
            <table class="w-full text-sm">
              <thead class="bg-blue-50/80 border-b border-gray-200">
                <tr>
                  <th class="p-3 font-semibold text-gray-700 w-12 text-center border-r">No</th>
                  <th class="p-3 font-semibold text-gray-700 text-left w-1/6 border-r">Instansi</th>
                  <th class="p-3 font-semibold text-gray-700 text-left w-1/4 border-r">Kebijakan</th>
                  <th class="p-3 font-semibold text-gray-700 text-left border-r">Detail</th>
                  <th class="p-3 font-semibold text-gray-700 text-left w-32 border-r">Sektor</th>
                  <th class="p-3 font-semibold text-gray-700 text-center w-36">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="(p, i) in policies" :key="p.id" class="hover:bg-gray-50/50 transition-colors">
                  <td class="p-3 text-center text-gray-600 border-r">{{ i + 1 }}</td>
                  <td class="p-3 text-gray-800 border-r">{{ p.instansi?.agency_name || '-' }}</td>
                  <td class="p-3 font-medium text-gray-900 border-r">{{ p.name }}</td>
                  <td class="p-3 text-gray-600 border-r">
                    <div>
                      {{ getTruncatedText(p, p.name_detail) }}
                      <button
                        v-if="p.name_detail && p.name_detail.length > 100"
                        type="button"
                        @click.stop="toggleExpand(p.id)"
                        class="ml-1 text-blue-600 hover:underline focus:outline-none text-xs font-medium"
                      >
                        {{ expanded[p.id] ? 'Sembunyikan' : 'Baca Selengkapnya' }}
                      </button>
                    </div>
                  </td>
                  <td class="p-3 text-gray-600 border-r">{{ p.sector || '-' }}</td>
                  <td class="p-3 text-center">
                    <span 
                      v-if="p.policy_status === 'SELESAI_VALIDASI_VERIFIKATOR' || p.policy_status === 'SELESAI_VALIDASI_KU'"
                      class="text-xs font-semibold px-2.5 py-1 rounded bg-green-100 text-green-700 whitespace-nowrap block w-full text-center"
                    >
                      Selesai
                    </span>
                    <span 
                      v-else-if="p.policy_status === 'MENUNGGU_VALIDASI_KU'"
                      class="text-xs font-semibold px-2.5 py-1 rounded bg-red-100 text-red-700 whitespace-nowrap block w-full text-center"
                    >
                      Belum Selesai
                    </span>
                    <span 
                      v-else
                      class="text-xs font-semibold px-2.5 py-1 rounded bg-gray-100 text-gray-700 whitespace-nowrap block w-full text-center"
                    >
                      Self Assessment
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Status summary -->
          <div class="mt-4 text-right">
            <span :class="['font-bold text-lg', getStatusColor(calculateCompletionRate())]">
              Kinerja: {{ calculateCompletionRate() }}%
            </span>
          </div>
        </div>

        <div class="mt-6 flex justify-end border-t pt-4">
          <button
            @click="selectedVerifikator = null"
            class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'

// Import style untuk Vue Flow
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'

type Koornas = {
  id: string
  name: string
}

type Verifikator = {
  id: string
  name: string
  username: string
}

type Policy = {
  id: string
  name: string
  name_detail: string
  sector: string
  policy_status: string
  policy_process: string
  progress: string
  instansi: {
    agency_name: string
  }
}

// State
const koordinatorList = ref<Koornas[]>([])
const selectedKoordinator = ref<string | null>(null)
const verifikatorList = ref<Verifikator[]>([])
const nodes = ref<any[]>([])
const edges = ref<any[]>([])
const loading = ref(true)
const selectedVerifikator = ref<Verifikator | null>(null)
const policies = ref<Policy[]>([])
const loadingPolicies = ref(false)
const expanded = ref<Record<string, boolean>>({})

// Helper untuk TruncatedText inline
const toggleExpand = (id: string) => {
  expanded.value[id] = !expanded.value[id]
}

const getTruncatedText = (p: Policy, text?: string | null) => {
  if (!text) return '-'
  if (expanded.value[p.id]) return text
  return text.length > 100 ? text.substring(0, 100) + '...' : text
}

// 🎯 Fetch Koornas
const fetchKoornas = async () => {
  try {
    const json = await $fetch<any>('/api/users/koornas')
    if (json.success) {
      koordinatorList.value = json.data
      if (json.data.length > 0) {
        selectedKoordinator.value = json.data[0].id
      }
    }
  } catch (error) {
    console.error('Gagal memuat Koornas:', error)
  }
}

onMounted(() => {
  fetchKoornas()
})

// 🧠 Fetch Verifikator berdasarkan Koornas
watch(selectedKoordinator, async (newId) => {
  if (!newId) return
  loading.value = true
  try {
    const json = await $fetch<any>(`/api/koordinator_utama/${newId}/verifikator`)
    verifikatorList.value = json || []
  } catch (error) {
    console.error('Gagal memuat verifikator:', error)
    verifikatorList.value = []
  } finally {
    loading.value = false
  }
})

// 🎨 Bangun Peta Relasi
watch([verifikatorList, selectedKoordinator, koordinatorList], async () => {
  if (!selectedKoordinator.value) return
  const kn = koordinatorList.value.find(k => k.id === selectedKoordinator.value)
  if (!kn) return

  const processedNodes: any[] = []
  const processedEdges: any[] = []

  const baseX = 400
  const baseY = 50

  const verifikatorWithPerformance = await Promise.all(
    verifikatorList.value.map(async (v) => {
      try {
        const json = await $fetch<any>(`/api/policies/verifikator/${v.id}`)
        const policiesData: Policy[] = json.success ? json.data : []

        const total = policiesData.length
        const completed = total > 0 ? policiesData.filter(p => 
          p.policy_status === 'SELESAI_VALIDASI_VERIFIKATOR' || 
          p.policy_status === 'SELESAI_VALIDASI_KU'
        ).length : 0
        const percentComplete = total > 0 ? Math.round((completed / total) * 100) : null

        return { ...v, total, completed, percentComplete, policies: policiesData }
      } catch (error) {
        console.error(`Gagal memuat policies untuk ${v.name}:`, error)
        return { ...v, total: 0, completed: 0, percentComplete: null, policies: [] }
      }
    })
  )

  const totals = verifikatorWithPerformance.reduce((acc, cur) => {
    if (cur.percentComplete !== null) {
      acc.totalVerifikatorsWithData += 1
      if (cur.percentComplete >= 90) acc.green += 1
    }
    acc.totalPolicies += cur.total || 0
    acc.totalCompleted += cur.completed || 0
    return acc
  }, { green: 0, totalVerifikatorsWithData: 0, totalPolicies: 0, totalCompleted: 0 })

  const totalV = verifikatorList.value.length
  const startX = baseX - (totalV - 1) * 150

  let knColor = '#6b7280' // gray-500
  let statusText = 'Belum ada data'

  if (totals.totalVerifikatorsWithData > 0) {
    const ratio = totals.green / totals.totalVerifikatorsWithData
    if (ratio === 1) {
      knColor = '#10b981' // green-500
    } else if (ratio >= 0.5) {
      knColor = '#10b981' // green-500
    } else {
      knColor = '#f59e0b' // amber-500
    }
    statusText = `${totals.totalCompleted}/${totals.totalPolicies} kebijakan selesai`
  }

  // 🔹 Koordinator Nasional Node
  const knLabel = `${kn.name}\nKoordinator Nasional\n${statusText}`

  processedNodes.push({
    id: `koornas-${kn.id}`,
    position: { x: baseX, y: baseY },
    label: knLabel,
    style: {
      background: knColor,
      color: 'white',
      borderRadius: '12px',
      padding: '16px',
      textAlign: 'center',
      width: '280px',
      fontSize: '14px',
      fontWeight: '600',
      whiteSpace: 'pre-line',
      lineHeight: '1.5',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    }
  })

  verifikatorWithPerformance.forEach((v, idx) => {
    const vX = startX + idx * 300
    const vY = baseY + 200

    let nodeColor = '#6b7280' // gray-500
    let edgeColor = '#DC2626' // red-600
    if (v.percentComplete !== null) {
      if (v.percentComplete >= 90) {
        nodeColor = '#10b981' // green-500
        edgeColor = '#10b981'
      } else if (v.percentComplete >= 50) {
        nodeColor = '#f59e0b' // amber-500
        edgeColor = '#f59e0b'
      } else {
        nodeColor = '#ef4444' // red-500
        edgeColor = '#ef4444'
      }
    }

    // 🔹 Verifikator Label
    const verLabel = v.percentComplete !== null
      ? `${v.name}\nVerifikator\n${v.completed}/${v.total} selesai (${v.percentComplete}%)`
      : `${v.name}\nVerifikator\nBelum ada data`

    processedNodes.push({
      id: `ver-${v.id}`,
      position: { x: vX, y: vY },
      label: verLabel,
      style: {
        background: nodeColor,
        color: 'white',
        borderRadius: '10px',
        padding: '14px',
        textAlign: 'center',
        width: '220px',
        fontSize: '13px',
        fontWeight: '600',
        whiteSpace: 'pre-line',
        lineHeight: '1.5',
        cursor: 'pointer',
        boxShadow: '0 3px 6px rgba(0,0,0,0.15)'
      }
    })

    processedEdges.push({
      id: `edge-${kn.id}-${v.id}`,
      source: `koornas-${kn.id}`,
      target: `ver-${v.id}`,
      type: 'smoothstep',
      style: { strokeDasharray: '0', strokeWidth: 3, stroke: edgeColor }
    })
  })

  nodes.value = processedNodes
  edges.value = processedEdges
})

// 🔍 Klik node Verifikator
const handleNodeClick = async (event: any) => {
  const node = event.node
  if (!node.id.startsWith('ver-')) return
  
  const id = node.id.replace('ver-', '')
  const v = verifikatorList.value.find(v => v.id === id)
  if (!v) return

  selectedVerifikator.value = v
  loadingPolicies.value = true
  expanded.value = {} // Reset status expanded text
  
  try {
    const json = await $fetch<any>(`/api/policies/verifikator/${id}`)
    if (json.success) {
      policies.value = json.data
    } else {
      policies.value = []
    }
  } catch (error) {
    console.error('Gagal memuat data policy:', error)
    policies.value = []
  } finally {
    loadingPolicies.value = false
  }
}

// Hitung persentase status SELESAI_VALIDASI_VERIFIKATOR
const calculateCompletionRate = () => {
  if (!policies.value.length) return 0
  const selesai = policies.value.filter(p => p.policy_status === 'SELESAI_VALIDASI_VERIFIKATOR' || p.policy_status === 'SELESAI_VALIDASI_KU').length
  return Math.round((selesai / policies.value.length) * 100)
}

const getStatusColor = (rate: number) => {
  if (rate >= 90) return 'text-green-600'
  if (rate >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

definePageMeta({
  layout: 'sidebar'
})
</script>
