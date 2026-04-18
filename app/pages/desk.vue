<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="w-full px-8 py-10 bg-white shadow-md rounded-lg">
      <div class="flex flex-col gap-6">
        
        <!-- Toast Notification -->
        <div
          v-if="toast.show"
          class="mb-4 rounded-md px-4 py-3 text-sm transition-all duration-300"
          :class="toast.variant === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'"
        >
          <p class="font-semibold">{{ toast.variant === 'error' ? 'Gagal' : 'Sukses' }}</p>
          <p>{{ toast.message }}</p>
        </div>

        <h1 class="text-3xl font-semibold text-[#16578d] mb-4">Helpdesk IKK</h1>
        <p class="text-gray-600 text-base leading-relaxed">
          Jika Anda mengalami kendala dalam pengisian IKK, silakan isi formulir di bawah ini
          atau hubungi tim helpdesk kami melalui surel
          <a href="mailto:ikk@lan.go.id" class="text-[#16578d] underline font-medium">
            ikk@lan.go.id
          </a>.
        </p>

        <form
          @submit.prevent="handleSubmit"
          class="bg-gray-50 shadow-sm border border-gray-200 p-8 rounded-lg space-y-6"
        >
          <TextField
            label="Nama Lengkap"
            v-model="form.name"
            placeholder="Nama Lengkap"
            required
          />

          <TextField
            label="Email Aktif"
            v-model="form.email"
            placeholder="Email Aktif"
            required
          />

          <TextField
            label="Unit Kerja/Instansi"
            v-model="form.unit"
            placeholder="Unit Kerja/Instansi"
          />

          <SelectDropdown
            label="Kategori Masalah"
            v-model="form.category"
            :options="categoryOptions"
            placeholder="Pilih Kategori Masalah"
          />

          <TextArea
            label="Pesan / Permasalahan"
            v-model="form.message"
            :rows="4"
            placeholder="Jelaskan permasalahan Anda..."
            required
          />

          <div class="text-center">
            <Button
              type="submit"
              hierarchy="primary"
              :disabled="isLoading"
              class="w-full sm:w-auto"
            >
              {{ isLoading ? 'Mengirim...' : 'Kirim Permintaan' }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, TextField, TextArea, SelectDropdown } from '@idds/vue'

const categoryOptions = [
  { label: 'Masalah Teknis', value: 'TEKNIS' },
  { label: 'Login / Akses IKK', value: 'LOGIN/AKSES' },
  { label: 'Pengisian Instrumen IKK', value: 'INSTRUMEN' },
  { label: 'Lainnya', value: 'LAINNYA' }
]

const form = ref({
  name: '',
  email: '',
  unit: '',
  category: '',
  message: ''
})

const isLoading = ref(false)

const toast = ref({
  show: false,
  message: '',
  variant: 'success' as 'success' | 'error'
})

function showToast(message: string, variant: 'success' | 'error') {
  toast.value = { show: true, message, variant }
  setTimeout(() => {
    toast.value.show = false
  }, 5000)
}

async function handleSubmit() {
  isLoading.value = true
  toast.value.show = false

  try {
    const payload = {
      nama_lengkap: form.value.name,
      email_aktif: form.value.email,
      instansi: form.value.unit,
      masalah: form.value.category,
      pesan: form.value.message,
    }

    await $fetch('/api/helpdesk', {
      method: 'POST',
      body: payload
    })

    showToast('Pesan Anda telah dikirim, dapatkan pemberitahuan melalui email', 'success')
    form.value = { name: '', email: '', unit: '', category: '', message: '' }
  } catch (error) {
    showToast('Pesan Anda gagal dikirim, silakan coba lagi', 'error')
    console.error('An error occurred:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
