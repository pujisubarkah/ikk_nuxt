<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />

    <!-- Hero Section -->
    <main class="text-white px-4 text-center bg-[#16578d] py-20">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          Selamat Datang di
        </h1>
        <h2 class="text-3xl md:text-4xl font-semibold mb-6">
          Sistem Informasi Indeks Kualitas Kebijakan
        </h2>
        <p class="text-lg md:text-xl text-white/90 leading-relaxed">
          Membangun kualitas kebijakan
          <span class="text-white font-semibold">
            berbasis bukti dan berdampak
          </span>
          untuk masa depan yang lebih baik. Sistem ini membantu Anda menilai,
          memantau, dan meningkatkan kualitas kebijakan dengan pendekatan
          analitik dan data yang solid.
        </p>
      </div>
    </main>

    <!-- Image Slider Section -->
    <section class="w-full py-8 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <Swiper
          :modules="[Autoplay, Pagination]"
          :autoplay="{ delay: 3000, disableOnInteraction: false }"
          :pagination="{ clickable: true }"
          :loop="true"
          :slides-per-view="1"
          :space-between="20"
        >
          <SwiperSlide v-for="(url, index) in bannerImages" :key="index">
            <img
              :src="url"
              :alt="`Banner ${index + 1}`"
              class="w-full h-[300px] md:h-[500px] object-cover rounded-xl shadow-lg"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>

    <!-- Flow Steps Section -->
    <section class="bg-white py-16 px-4">
      <FlowSteps />
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import FlowSteps from '@/components/FlowSteps.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/pagination';

import { Autoplay, Pagination } from 'swiper/modules';

const bannerImages = [
  '/banner/Banner1.jpg',
  '/banner/Banner2.jpg',
  '/banner/Banner3.jpg',
  '/banner/Banner4.jpg',
  '/banner/Banner5.jpg',
  '/banner/Banner6.jpg',
  '/banner/Banner7.jpg',
  '/banner/Banner8.jpg',
  '/banner/Banner9.jpg',
  '/banner/Banner10.jpg',
  '/banner/Banner11.jpg',
  '/banner/Banner12.jpg',
];
</script>
