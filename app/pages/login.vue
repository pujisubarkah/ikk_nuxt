<template>
  <div class="relative min-h-screen flex flex-col overflow-hidden">
    <div class="absolute inset-0">
      <template v-if="imagesLoaded">
        <div
          v-for="(image, index) in bannerImages"
          :key="image"
          class="absolute inset-0 transition-all duration-700 ease-in-out"
          :class="index === currentImageIndex ? 'opacity-100 scale-[1.02]' : 'opacity-0 scale-100'"
        >
          <img
            :src="image"
            :alt="`Background ${index + 1}`"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </template>
      <div v-else class="absolute inset-0 bg-gradient-to-br from-[#16578d] via-[#1a5f96] to-[#1e67a3]" />
      <div class="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40" />
    </div>

    <Navbar />

    <main class="flex-grow flex items-center justify-center px-4 py-16 relative z-10">
      <div class="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl w-full">
        <div class="flex-1 max-w-xl text-center lg:text-left">
          <div class="bg-white/95 backdrop-blur-lg shadow-xl p-6 lg:p-8 rounded-2xl border border-white/20">
            <div class="mb-4">
              <span class="inline-block px-3 py-1 bg-[#16578d]/10 text-[#16578d] rounded-full text-xs font-medium mb-3">
                Lembaga Administrasi Negara RI
              </span>
            </div>

            <h1 class="text-2xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-[#16578d] to-blue-600 bg-clip-text text-transparent">
              Sistem Informasi
            </h1>
            <h2 class="text-xl lg:text-2xl font-semibold text-gray-700 mb-4">
              Pengukuran Kualitas Kebijakan
            </h2>

            <div class="space-y-3 text-gray-600">
              <p class="text-sm lg:text-base leading-relaxed">
                Instrumen untuk mengukur kualitas kebijakan pemerintah terhadap
                <span class="text-[#16578d] font-semibold">
                  dampak dan hasil bagi pembangunan yang strategis
                </span>
                dengan mengedepankan prinsip berbasis bukti
                <em class="text-[#16578d]">(evidence-based)</em>.
              </p>

              <div class="flex flex-wrap gap-2 justify-center lg:justify-start mt-4">
                <div class="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                  <IconCircleCheck class="w-4 h-4 text-green-500" />
                  <span class="text-xs font-medium">Evidence-based</span>
                </div>
                <div class="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                  <IconCircleCheck class="w-4 h-4 text-green-500" />
                  <span class="text-xs font-medium">Self Assessment</span>
                </div>
                <div class="flex items-center gap-1 bg-cyan-50 px-3 py-1 rounded-full">
                  <IconCircleCheck class="w-4 h-4 text-green-500" />
                  <span class="text-xs font-medium">Reformasi Birokrasi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 max-w-lg w-full">
          <div class="bg-white/95 backdrop-blur-lg shadow-xl p-6 rounded-2xl border border-white/20">
            <form class="space-y-4 lg:space-y-6 max-w-lg mx-auto" @submit="handleSubmit">
              <div class="flex flex-col items-start gap-2">
                <img :src="illustrasiImage" class="max-w-sm w-full mb-2 self-center" alt="Login Illustration" />
                <div class="space-y-2">
                  <h1 class="text-xl font-bold">Login</h1>
                  <p class="text-sm">Disini kamu bisa login ke akun kamu</p>
                </div>
              </div>

              <div class="flex flex-col gap-2 md:gap-4 w-full">
                <TextField label="Email" v-model="emailValue" placeholder="Enter text..." />
                <div class="flex flex-col gap-2 w-full">
                  <PasswordInput label="Password" v-model="password" placeholder="Enter text..." />
                  <Button hierarchy="link" class="self-start text-xs">Forgot Password</Button>
                </div>
              </div>

              <div class="flex flex-col gap-3 md:gap-4 w-full">
                <Button hierarchy="primary" type="submit" :disabled="isLoading">
                  {{ isLoading ? 'Memproses...' : 'Masuk' }}
                </Button>
                <p class="text-xs self-center">Atau</p>
                <p class="text-center text-xs text-gray-600">
                  Koordinator Instansi baru?
                  <NuxtLink
                    to="/register"
                    class="text-[#16578d] font-semibold hover:text-blue-600 transition-colors duration-300 inline-flex items-center gap-1"
                  >
                    Daftar di sini
                  </NuxtLink>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>

    <Transition name="fade">
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
      >
        <div class="bg-white p-6 rounded-xl shadow-2xl text-center max-w-sm mx-4 animate-pop">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <IconCircleCheck class="w-6 h-6 text-green-500" />
          </div>
          <h2 class="text-xl font-bold text-green-600 mb-2">Login Berhasil!</h2>
          <p class="text-gray-600 mb-3 text-sm">Selamat datang kembali! Anda akan diarahkan ke Dashboard...</p>
          <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div class="bg-green-500 h-2 rounded-full animate-progress" />
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div
        v-if="showErrorModal"
        class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
      >
        <div class="bg-white p-6 rounded-xl shadow-2xl text-center max-w-sm mx-4 animate-pop">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <IconCircleX class="w-6 h-6 text-red-500" />
          </div>
          <h2 class="text-xl font-bold text-red-600 mb-2">Login Gagal!</h2>
          <p class="text-gray-600 mb-4 text-sm">{{ error }}</p>
          <button
            class="w-full py-3 bg-gradient-to-r from-[#16578d] to-blue-600 text-white font-semibold rounded-lg hover:from-[#12466f] hover:to-blue-700 transition-all duration-300"
            @click="showErrorModal = false"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </Transition>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Button, TextField, PasswordInput } from '@idds/vue';
import {
  IconCircleCheck,
  IconCircleX,
} from '@tabler/icons-vue';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

const bannerImages = [
  '/banner/Ilustrasi1.PNG',
  '/banner/Ilustrasi2.PNG',
  '/banner/Ilustrasi3.PNG',
  '/banner/Ilustrasi4.PNG',
  '/banner/Ilustrasi5.PNG',
];

const currentImageIndex = ref(0);
const emailValue = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);
const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const imagesLoaded = ref(false);
const illustrasiImage = '/lanri_.png';
const router = useRouter();

function toRoleSlug(role: string) {
  return role
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

let intervalId: ReturnType<typeof setInterval> | null = null;

onMounted(async () => {
  const imagePromises = bannerImages.map(
    (src) =>
      new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      })
  );

  await Promise.all(imagePromises);
  imagesLoaded.value = true;

  intervalId = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % bannerImages.length;
  }, 6000);
});

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
});

async function handleSubmit(e: Event) {
  e.preventDefault();
  error.value = '';
  showErrorModal.value = false;
  isLoading.value = true;

  try {
    const authToken = import.meta.client ? localStorage.getItem('authToken') || '' : '';

    const response = await $fetch<{
      success: boolean;
      error?: string;
      data?: {
        id: number;
        role_id: number;
        username: string;
        name: string;
        role: string;
      };
    }>('/api/login', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: {
        username: emailValue.value,
        password: password.value,
      },
    });

    if (!response.success || !response.data) {
      error.value = `Login failed: ${response.error || 'Unknown error'}`;
      showErrorModal.value = true;
      return;
    }

    const responseData = response.data;

    if (import.meta.client) {
      localStorage.setItem('id', String(responseData.id));
      localStorage.setItem('role_id', String(responseData.role_id));
      localStorage.setItem('username', responseData.username);
      localStorage.setItem('name', responseData.name);
      localStorage.setItem('role', responseData.role);
    }

    showSuccessModal.value = true;
    showErrorModal.value = false;

    setTimeout(() => {
      router.push(`/${toRoleSlug(responseData.role) || 'dashboard'}`);
    }, 2000);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    error.value = message;
    showErrorModal.value = true;
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes pop {
  0% {
    transform: scale(0.92);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-pop {
  animation: pop 0.25s ease;
}

@keyframes progress {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}

.animate-progress {
  animation: progress 2s linear forwards;
}
</style>
