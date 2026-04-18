<template>
  <div class="flex flex-col min-h-screen relative z-10">
    <!-- Popup Info Hotline -->
    <div v-if="showPopup" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div class="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center border-2 border-blue-400">
        <h3 class="text-lg font-semibold mb-2 text-blue-700">
          Informasi Hotline IKK
        </h3>
        <p class="text-gray-700 mb-4">
          Saat ini Nomor <b>Hotline SOBAT BIJAK</b> sudah aktif kembali di nomor
          <b>
            <a
              href="https://wa.me/6282199971711"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-700 hover:underline"
            >
              0821-9997-1711
            </a>
          </b>
        </p>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow"
          @click="showPopup = false"
        >
          Tutup
        </button>
      </div>
    </div>

    <!-- Hero Section -->
    <main class="text-white px-4 text-center bg-gradient-to-b from-[#16578d] to-[#2980c7] py-20">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-semibold mb-2">
          Sistem Informasi
        </h2>

        <h1 class="text-4xl md:text-5xl font-semibold mb-6">
          Pengukuran Kualitas Kebijakan
        </h1>
        <p class="text-lg md:text-xl text-white/90 leading-relaxed">
          Instrumen untuk mengukur kualitas kebijakan pemerintah terutama
          terhadap dampak atau hasil bagi pembangunan yang strategis dengan
          mengedepankan prinsip berbasis bukti <em>(evidence-based)</em>.
        </p>
      </div>
    </main>

    <!-- Peta Section -->
    <section class="w-full py-8 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <PetaIndonesiaDynamic />
      </div>
    </section>

    <!-- Image Slider Section -->
    <!--
    <section class="w-full py-8 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        Slider banner bisa diaktifkan kembali menggunakan swiper/vue.
      </div>
    </section>
    -->

    <!-- Countdown Section -->
    <section class="bg-white py-5 px-4">
      <div class="max-w-6xl mx-auto text-center">
        <Countdown />
      </div>
    </section>

    <!-- Flow Steps Section -->
    <section class="bg-white py-16 px-4">
      <div class="max-w-6xl mx-auto text-center">
        <h2 class="text-2xl md:text-3xl font-semibold mb-6 text-gray-800">
          Alur Pengukuran Kualitas Kebijakan
        </h2>
        <div class="flex justify-center">
          <img
            src="/flow.jpeg"
            alt="Alur Pengukuran Kualitas Kebijakan"
            class="w-full max-w-4xl h-auto rounded-xl shadow-lg"
          >
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PetaIndonesiaDynamic from '@/components/PetaIndonesiaDynamic.vue';
import Countdown from '@/components/Countdown.vue';

const showPopup = ref(false);
</script>
