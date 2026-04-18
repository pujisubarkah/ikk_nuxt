<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <Navbar />

    <main class="flex-grow px-4 py-8 md:px-6 lg:px-8 flex items-center justify-center">
      <div class="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 border border-blue-100 w-full">
        <div
          v-if="toast.show"
          class="mb-4 rounded-md px-4 py-3 text-sm"
          :class="toast.variant === 'destructive' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'"
        >
          <p class="font-semibold">{{ toast.title }}</p>
          <p>{{ toast.description }}</p>
        </div>

        <form class="space-y-4 lg:space-y-6 p-4 max-w-lg mx-auto" @submit="handleSubmit">
          <div class="flex flex-col items-start gap-2">
            <img :src="illustrasiImage" class="max-w-sm w-full mb-2 self-center" alt="Register Illustration" />
            <div class="space-y-2">
              <h1 class="text-xl font-bold">Register</h1>
              <p class="text-sm">Disini kamu bisa register ke akun kamu</p>
            </div>
          </div>

          <div class="flex flex-col gap-2 md:gap-4 w-full">
            <div class="rounded-md p-2 -m-2" :class="errors.nama ? 'bg-red-50' : ''">
              <TextField
                label="Nama Lengkap"
                name="nama"
                v-model="formData.nama"
                placeholder="Enter text..."
                @update:modelValue="clearError('nama')"
              />
            </div>
            <p v-if="errors.nama" class="text-sm text-red-500 -mt-2">{{ errors.nama }}</p>

            <div class="rounded-md p-2 -m-2" :class="errors.nip ? 'bg-red-50' : ''">
              <TextField
                label="Username"
                name="nip"
                v-model="formData.nip"
                placeholder="Enter text..."
                @update:modelValue="clearError('nip')"
              />
            </div>
            <p v-if="errors.nip" class="text-sm text-red-500 -mt-2">{{ errors.nip }}</p>

            <div class="rounded-md p-2 -m-2" :class="errors.email ? 'bg-red-50' : ''">
              <TextField
                label="Email"
                name="email"
                v-model="formData.email"
                placeholder="Enter text..."
                @update:modelValue="clearError('email')"
              />
            </div>
            <p v-if="errors.email" class="text-sm text-red-500 -mt-2">{{ errors.email }}</p>

            <div class="rounded-md p-2 -m-2" :class="errors.password ? 'bg-red-50' : ''">
              <PasswordInput
                label="Password"
                name="password"
                v-model="formData.password"
                placeholder="Enter text..."
                @update:modelValue="clearError('password')"
              />
            </div>
            <p v-if="errors.password" class="text-sm text-red-500 -mt-2">{{ errors.password }}</p>

            <div class="rounded-md p-2 -m-2" :class="errors.confirmPassword ? 'bg-red-50' : ''">
              <PasswordInput
                label="Konfirmasi Password"
                name="confirmPassword"
                v-model="confirmPassword"
                placeholder="Enter text..."
                @update:modelValue="clearError('confirmPassword')"
              />
            </div>
            <p v-if="errors.confirmPassword" class="text-sm text-red-500 -mt-2">{{ errors.confirmPassword }}</p>
          </div>

          <details class="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
            <summary class="cursor-pointer text-sm font-semibold text-[#274472]">Lengkapi data registrasi</summary>
            <div class="mt-4 flex flex-col gap-4">
              <div class="rounded-md p-2 -m-2" :class="errors.nik ? 'bg-red-50' : ''">
                <TextField
                  label="NIK"
                  name="nik"
                  v-model="formData.nik"
                  placeholder="Masukkan NIK"
                  @update:modelValue="clearError('nik')"
                />
              </div>

              <div class="rounded-md p-2 -m-2" :class="errors.jabatan ? 'bg-red-50' : ''">
                <TextField
                  label="Jabatan"
                  name="jabatan"
                  v-model="formData.jabatan"
                  placeholder="Masukkan jabatan"
                  @update:modelValue="clearError('jabatan')"
                />
              </div>
              <p v-if="errors.jabatan" class="text-sm text-red-500 -mt-2">{{ errors.jabatan }}</p>

              <div class="rounded-md p-2 -m-2" :class="errors.unitKerja ? 'bg-red-50' : ''">
                <TextField
                  label="Unit Kerja"
                  name="unitKerja"
                  v-model="formData.unitKerja"
                  placeholder="Masukkan unit kerja"
                  @update:modelValue="clearError('unitKerja')"
                />
              </div>
              <p v-if="errors.unitKerja" class="text-sm text-red-500 -mt-2">{{ errors.unitKerja }}</p>

              <div>
                <label for="telepon" class="text-blue-700 font-semibold">Telepon</label>
                <div class="flex items-center border border-blue-300 rounded-md overflow-hidden mt-1 focus-within:ring-2 focus-within:ring-blue-500">
                  <span class="px-3 bg-gray-100 text-gray-700 border-r">+62</span>
                  <input
                    id="telepon"
                    name="telepon"
                    v-model="formData.telepon"
                    @input="clearError('telepon')"
                    placeholder="81234567890"
                    class="flex-1 p-3 outline-none"
                  />
                </div>
                <p v-if="errors.telepon" class="text-sm text-red-500 mt-1">{{ errors.telepon }}</p>
              </div>

              <div>
                <label for="instansi" class="text-blue-700 font-semibold">Instansi</label>
                <select
                  id="instansi"
                  name="instansi"
                  v-model="formData.instansi"
                  @change="clearError('instansi')"
                  class="w-full border rounded-md p-3 mt-1 bg-white"
                  :class="errors.instansi ? 'border-red-400' : 'border-blue-300'"
                >
                  <option value="">Pilih instansi...</option>
                  <option
                    v-for="instansi in sortedInstansis"
                    :key="instansi.instansi?.agency_id || instansi.id"
                    :value="instansi.instansi?.agency_id || instansi.id"
                  >
                    {{ instansi.instansi?.agency_name || instansi.name }}
                  </option>
                </select>
                <p v-if="errors.instansi" class="text-sm text-red-500 mt-1">{{ errors.instansi }}</p>
              </div>

              <div class="rounded-md p-2 -m-2" :class="errors.suratPenunjukkan ? 'bg-red-50' : ''">
                <TextField
                  label="Surat Penunjukkan"
                  name="suratPenunjukkan"
                  v-model="formData.suratPenunjukkan"
                  placeholder="Masukkan link Google Drive/Sheets"
                  @update:modelValue="clearError('suratPenunjukkan')"
                  @blur="validateSuratLink"
                />
              </div>
              <p v-if="errors.suratPenunjukkan" class="text-sm text-red-500 -mt-2">{{ errors.suratPenunjukkan }}</p>
              <p class="text-sm text-blue-500 -mt-2">Masukkan link file yang dapat diakses publik.</p>
              <a href="/panduan/unggah-bukti-dukung" target="_blank" class="text-blue-600 underline -mt-2">Lihat panduan</a>

              <div>
                <label class="text-blue-700 font-semibold">
                  Apakah dalam penilaian indeks kualitas kebijakan ini, Anda melibatkan jabatan fungsional analis kebijakan?
                </label>
                <div class="flex items-center mt-2 space-x-4">
                  <label class="inline-flex items-center">
                    <input
                      type="radio"
                      name="jf_analis"
                      value="ya"
                      :checked="formData.melibatkanJFAnalis === true"
                      @change="handleRadioChange(true)"
                      class="h-4 w-4 text-blue-600"
                    />
                    <span class="ml-2">Ya</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input
                      type="radio"
                      name="jf_analis"
                      value="tidak"
                      :checked="formData.melibatkanJFAnalis === false"
                      @change="handleRadioChange(false)"
                      class="h-4 w-4 text-blue-600"
                    />
                    <span class="ml-2">Tidak</span>
                  </label>
                </div>
              </div>
            </div>
          </details>

          <div class="flex flex-col gap-2 md:gap-4 w-full">
            <Button type="submit" hierarchy="primary" :disabled="isLoading">
              {{ isLoading ? 'Menyimpan...' : 'Daftar' }}
            </Button>
            <p class="text-xs sm:text-sm font-light text-center">
              Sudah punya akun?
              <NuxtLink to="/login" class="text-[#16578d] font-semibold hover:text-blue-600 transition-colors">
                Login
              </NuxtLink>
            </p>
          </div>
        </form>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Button, TextField, PasswordInput } from '@idds/vue';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

interface FormData {
  nama: string;
  nip: string;
  nik: string;
  instansi: string;
  email: string;
  password: string;
  jabatan: string;
  unitKerja: string;
  telepon: string;
  suratPenunjukkan: string;
  melibatkanJFAnalis: boolean;
}

interface Instansi {
  id: string;
  name: string;
  category: string;
  instansi?: {
    agency_id: string;
    agency_name: string;
  };
}

const router = useRouter();
const illustrasiImage = '/lanri_.png';

const formData = ref<FormData>({
  nama: '',
  nip: '',
  nik: '',
  instansi: '',
  email: '',
  password: '',
  jabatan: '',
  unitKerja: '',
  telepon: '',
  suratPenunjukkan: '',
  melibatkanJFAnalis: false,
});

const instansis = ref<Instansi[]>([]);
const confirmPassword = ref('');
const isLoading = ref(false);
const errors = ref<Record<string, string>>({});
const toast = ref({
  show: false,
  title: '',
  description: '',
  variant: 'success' as 'success' | 'destructive',
});

function showToast(title: string, description: string, variant: 'success' | 'destructive') {
  toast.value = { show: true, title, description, variant };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
}

onMounted(async () => {
  try {
    const response = await $fetch<Instansi[]>('/api/instansi');
    instansis.value = response;
  } catch {
    errors.value = { ...errors.value, instansi: 'Gagal memuat data instansi' };
  }
});

const sortedInstansis = computed(() => {
  return [...instansis.value].sort((a, b) => {
    const nameA = a.instansi?.agency_name || a.name || '';
    const nameB = b.instansi?.agency_name || b.name || '';
    return nameA.localeCompare(nameB, 'id', { sensitivity: 'base' });
  });
});

function isValidUrl(url: string): boolean {
  try {
    const newUrl = new URL(url);
    return ['http:', 'https:'].includes(newUrl.protocol);
  } catch {
    return false;
  }
}

function handleRadioChange(value: boolean) {
  formData.value = {
    ...formData.value,
    melibatkanJFAnalis: value,
  };
}

function clearError(field: string) {
  if (errors.value[field]) {
    errors.value = { ...errors.value, [field]: '' };
  }
}

function validateSuratLink() {
  if (formData.value.suratPenunjukkan && !isValidUrl(formData.value.suratPenunjukkan)) {
    errors.value = {
      ...errors.value,
      suratPenunjukkan: 'Harus berupa URL yang valid',
    };
  }
}

function validateForm(): boolean {
  const newErrors: Record<string, string> = {};

  if (!formData.value.nama.trim()) newErrors.nama = 'Nama wajib diisi';
  if (!formData.value.nip.trim()) newErrors.nip = 'NIP wajib diisi';
  if (!formData.value.email.trim()) newErrors.email = 'Email wajib diisi';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) newErrors.email = 'Format email tidak valid';
  if (!formData.value.password) newErrors.password = 'Password wajib diisi';
  else if (formData.value.password.length < 8) newErrors.password = 'Password minimal 8 karakter';
  if (!confirmPassword.value) newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
  else if (confirmPassword.value !== formData.value.password) newErrors.confirmPassword = 'Konfirmasi password tidak sama';
  if (!formData.value.jabatan.trim()) newErrors.jabatan = 'Jabatan wajib diisi';
  if (!formData.value.unitKerja.trim()) newErrors.unitKerja = 'Unit kerja wajib diisi';
  if (!formData.value.telepon || !/^\d+$/.test(formData.value.telepon)) newErrors.telepon = 'Nomor telepon harus angka';
  if (!formData.value.instansi) newErrors.instansi = 'Instansi wajib dipilih';
  if (!formData.value.suratPenunjukkan || !isValidUrl(formData.value.suratPenunjukkan)) {
    newErrors.suratPenunjukkan = 'Harus berupa URL yang valid';
  }

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
}

async function handleSubmit(e: Event) {
  e.preventDefault();

  if (!validateForm()) {
    showToast('Error', 'Periksa kembali form Anda.', 'destructive');
    return;
  }

  isLoading.value = true;

  try {
    const suratResponse = await $fetch<{ id: number }>('/api/surat_penunjukkan', {
      method: 'POST',
      body: {
        file: formData.value.suratPenunjukkan,
        melibatkan_jf_analis: formData.value.melibatkanJFAnalis,
      },
    });

    const penunjukkanId = suratResponse.id;

    const instansiTerpilih = instansis.value.find(
      (item) => item.instansi?.agency_id === formData.value.instansi || item.id === formData.value.instansi
    );

    const namaInstansi = instansiTerpilih?.instansi?.agency_name || instansiTerpilih?.name || 'Tidak Diketahui';

    await $fetch('/api/notifikasi', {
      method: 'POST',
      body: {
        user_id: 1,
        pesan: `Ada registrasi koordinator instansi baru: ${formData.value.nama} dari ${namaInstansi}`,
        policy_id: null,
        dibaca: false,
        created_by: null,
      },
    });

    await $fetch('/api/users/register', {
      method: 'POST',
      body: {
        name: formData.value.nama,
        username: formData.value.nip,
        nik: formData.value.nik,
        agency_id_panrb: formData.value.instansi,
        email: formData.value.email,
        phone: `+62${formData.value.telepon.replace(/^0+/, '')}`,
        position: formData.value.jabatan,
        work_unit: formData.value.unitKerja,
        role_id: 4,
        status: 'inaktif',
        password: formData.value.password,
        penunjukkan_id: penunjukkanId,
        melibatkan_jf_analis: formData.value.melibatkanJFAnalis,
      },
    });

    router.push('/registrasi-berhasil');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal melakukan registrasi';
    showToast('Error', message, 'destructive');
  } finally {
    isLoading.value = false;
  }
}
</script>
