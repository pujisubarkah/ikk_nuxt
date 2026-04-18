<template>
  <div class="relative min-h-screen flex flex-col overflow-hidden bg-gray-50">
    <!-- 🌄 Background Slideshow -->
    <div class="absolute inset-0 overflow-hidden">
      <div v-if="imagesLoaded" class="absolute inset-0">
        <div
          v-for="(image, index) in bannerImages"
          :key="index"
          class="absolute inset-0 transition-all duration-1000 ease-in-out"
          :class="index === currentImageIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'"
        >
          <img :src="image" :alt="`Background ${index + 1}`" class="w-full h-full object-cover" />
        </div>
      </div>
      <div v-else class="absolute inset-0 bg-gradient-to-br from-[#0f4a7a] via-[#16578d] to-[#1e67a3]" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
    </div>

    <!-- 📱 Main Content -->
    <main class="relative z-10 flex-grow flex items-center justify-center px-4 py-8 sm:py-12">
      <div class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        <!-- ℹ️ Info Card -->
        <div class="text-center lg:text-left space-y-6">
          <div class="bg-white/80 backdrop-blur-xl shadow-2xl p-6 sm:p-8 rounded-2xl border border-white/30">
            <span class="inline-flex items-center gap-2 px-4 py-1.5 bg-[#16578d]/10 text-[#16578d] rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
              <IconShield class="w-4 h-4" />
              Lembaga Administrasi Negara RI
            </span>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              Sistem Informasi
              <span class="block bg-gradient-to-r from-[#16578d] to-blue-500 bg-clip-text text-transparent mt-1">
                Pengukuran Kualitas Kebijakan
              </span>
            </h1>
            <p class="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
              Instrumen resmi untuk mengukur kualitas kebijakan pemerintah terhadap
              <span class="font-semibold text-[#16578d]">dampak & hasil pembangunan strategis</span>,
              mengedepankan pendekatan berbasis bukti <em class="not-italic font-medium text-[#16578d]">(evidence-based)</em>.
            </p>
            <div class="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
              <FeatureBadge text="Evidence-based" color="blue" />
              <FeatureBadge text="Self Assessment" color="green" />
              <FeatureBadge text="Reformasi Birokrasi" color="cyan" />
            </div>
          </div>
        </div>

        <!-- 🔐 Login Card -->
        <div class="w-full max-w-md mx-auto lg:mx-0">
          <div class="bg-white/90 backdrop-blur-xl shadow-2xl p-6 sm:p-8 rounded-2xl border border-white/40">
            <div class="text-center mb-6">
              <img :src="illustrasiImage" class="h-24 mx-auto mb-4 object-contain drop-shadow-lg animate-float" alt="Login Illustration" />
              <h2 class="text-2xl font-bold text-gray-800">Selamat Datang</h2>
              <p class="text-gray-500 text-sm mt-1">Silakan masuk untuk mengakses sistem</p>
            </div>

            <form class="space-y-5" @submit="handleSubmit">
              <!-- Username -->
              <div class="group relative flex items-center rounded-xl border border-gray-200 bg-white/60 px-3 py-2 focus-within:border-[#16578d] focus-within:ring-2 focus-within:ring-[#16578d]/20 transition-all duration-200">
                <IconUser class="w-5 h-5 text-gray-400 group-focus-within:text-[#16578d] transition-colors mr-2" />
                <TextField 
                  label="Username" 
                  v-model="emailValue" 
                  placeholder="Masukkan username" 
                  class="flex-1 border-0 shadow-none bg-transparent focus:ring-0 text-sm" 
                />
              </div>

              <!-- Password -->
              <div class="group relative flex items-center rounded-xl border border-gray-200 bg-white/60 px-3 py-2 focus-within:border-[#16578d] focus-within:ring-2 focus-within:ring-[#16578d]/20 transition-all duration-200">
                <IconLock class="w-5 h-5 text-gray-400 group-focus-within:text-[#16578d] transition-colors mr-2" />
                <PasswordInput 
                  label="Password" 
                  v-model="password" 
                  placeholder="Masukkan password" 
                  class="flex-1 border-0 shadow-none bg-transparent focus:ring-0 text-sm" 
                />
              </div>

              <div class="flex items-center justify-between text-sm">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-[#16578d] focus:ring-[#16578d] transition" />
                  <span class="text-gray-600">Ingat saya</span>
                </label>
                <Button hierarchy="link" class="text-[#16578d] hover:text-blue-600 font-medium text-sm transition-colors">Lupa Password?</Button>
              </div>

              <Button 
                hierarchy="primary" 
                type="submit" 
                :disabled="isLoading" 
                class="w-full py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span class="inline-flex items-center gap-2">
                  <IconLogin2 v-if="!isLoading" class="w-5 h-5" />
                  {{ isLoading ? 'Memproses...' : 'Masuk' }}
                </span>
              </Button>

              <div class="text-center pt-2 border-t border-gray-100 mt-4">
                <p class="text-gray-500 text-sm">
                  Belum memiliki akun?
                  <NuxtLink to="/register" class="text-[#16578d] font-semibold hover:text-blue-600 transition-colors ml-1">
                    Daftar Sekarang
                  </NuxtLink>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>

    <!-- ✅ Success Modal -->
    <Transition name="modal">
      <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" @click.self="showSuccessModal = false">
        <div class="bg-white p-6 rounded-2xl shadow-2xl text-center max-w-sm w-full animate-pop">
          <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconCircleCheck class="w-7 h-7 text-green-500" />
          </div>
          <h2 class="text-xl font-bold text-gray-800 mb-2">Login Berhasil!</h2>
          <p class="text-gray-500 mb-4 text-sm">Selamat datang kembali! Anda akan diarahkan ke Dashboard...</p>
          <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div class="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full animate-progress" />
          </div>
        </div>
      </div>
    </Transition>

    <!-- ❌ Error Modal -->
    <Transition name="modal">
      <div v-if="showErrorModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" @click.self="showErrorModal = false">
        <div class="bg-white p-6 rounded-2xl shadow-2xl text-center max-w-sm w-full animate-pop">
          <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconCircleX class="w-7 h-7 text-red-500" />
          </div>
          <h2 class="text-xl font-bold text-gray-800 mb-2">Login Gagal!</h2>
          <p class="text-gray-500 mb-5 text-sm">{{ error }}</p>
          <button
            class="w-full py-2.5 bg-gradient-to-r from-[#16578d] to-blue-600 text-white font-semibold rounded-xl hover:from-[#12466f] hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            @click="showErrorModal = false"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Button, TextField, PasswordInput } from '@idds/vue';
import { useAuthStore } from '~/store/auth';
import {
  IconCircleCheck,
  IconCircleX,
  IconUser,
  IconLock,
  IconShield,
  IconLogin2,
} from '@tabler/icons-vue';

// Inline Badge Component
const FeatureBadge = defineComponent({
  props: { text: String, color: String },
  setup(props) {
    const colorMap = { blue: 'bg-blue-50 text-blue-700', green: 'bg-green-50 text-green-700', cyan: 'bg-cyan-50 text-cyan-700' };
    return () => h('div', { class: `flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colorMap[props.color as keyof typeof colorMap] || 'bg-gray-50'}` }, [
      h(IconCircleCheck, { class: 'w-3.5 h-3.5' }),
      h('span', props.text)
    ]);
  }
});

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
  return role.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

let intervalId: ReturnType<typeof setInterval> | null = null;

onMounted(async () => {
  const imagePromises = bannerImages.map(src => new Promise<void>(resolve => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  }));

  await Promise.all(imagePromises);
  imagesLoaded.value = true;

  intervalId = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % bannerImages.length;
  }, 6000);
});

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
});

const authStore = useAuthStore();

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
      data?: { id: number; role_id: number; username: string; name: string; role: string; };
    }>('/api/auth/login', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: { username: emailValue.value, password: password.value },
    });

    if (!response.success || !response.data) {
      error.value = `Login failed: ${response.error || 'Unknown error'}`;
      showErrorModal.value = true;
      return;
    }

    const { id, role_id, username, name, role } = response.data;
    authStore.setAuth({
      id: String(id),
      role_id: String(role_id),
      username,
      name,
      role,
    });

    showSuccessModal.value = true;
    setTimeout(() => {
      router.push(`/${toRoleSlug(role) || 'dashboard'}`);
    }, 2000);
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Terjadi kesalahan tak terduga';
    showErrorModal.value = true;
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* Modal Transitions */
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }

/* Animations */
@keyframes pop {
  0% { transform: scale(0.92); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-pop { animation: pop 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards; }

@keyframes progress {
  0% { width: 0%; }
  100% { width: 100%; }
}
.animate-progress { animation: progress 2s linear forwards; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.animate-float { animation: float 4s ease-in-out infinite; }
</style>