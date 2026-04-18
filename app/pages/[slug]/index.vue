<template>
  <div class="min-h-screen bg-slate-50">
    <Navbar />

    <main class="max-w-6xl mx-auto px-4 py-10">
      <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p class="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Role Page</p>
        <h1 class="mt-3 text-3xl font-bold text-slate-900">
          {{ pageTitle }}
        </h1>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Halaman ini disiapkan sebagai entry point dinamis berdasarkan role login. Konten dashboard
          untuk role <strong>{{ readableSlug }}</strong> bisa dilanjutkan dari route ini.
        </p>

        <div class="mt-8 grid gap-4 md:grid-cols-3">
          <NuxtLink
            v-for="section in defaultSections"
            :key="section.to"
            :to="section.to"
            class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
          >
            {{ section.label }}
          </NuxtLink>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

const route = useRoute();

const slug = computed(() => String(route.params.slug || 'dashboard'));
const readableSlug = computed(() => slug.value.replace(/[-_]/g, ' '));
const pageTitle = computed(() => `Dashboard ${readableSlug.value}`);

const defaultSections = computed(() => [
  { label: 'Penggunaan', to: `/${slug.value}/penggunaan` },
  { label: 'Receipt', to: `/${slug.value}/receipt` },
  { label: 'User Management', to: `/${slug.value}/users` },
]);
</script>