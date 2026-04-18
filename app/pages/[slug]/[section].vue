<template>
  <div class="min-h-screen bg-slate-50">
    <Navbar />

    <main class="max-w-6xl mx-auto px-4 py-10">
      <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p class="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Role Section</p>
        <h1 class="mt-3 text-3xl font-bold text-slate-900">
          {{ sectionTitle }}
        </h1>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Route ini memakai parameter <strong>{{ roleSlug }}</strong> untuk role dan
          <strong>{{ sectionSlug }}</strong> untuk section. Nanti isi halaman bisa dibedakan sesuai role login.
        </p>

        <NuxtLink
          :to="`/${roleSlug}`"
          class="mt-8 inline-flex rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
        >
          Kembali ke dashboard role
        </NuxtLink>
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

const roleSlug = computed(() => String(route.params.slug || 'dashboard'));
const sectionSlug = computed(() => String(route.params.section || 'section'));
const sectionTitle = computed(() => {
  const normalizedRole = roleSlug.value.replace(/[-_]/g, ' ');
  const normalizedSection = sectionSlug.value.replace(/[-_]/g, ' ');
  return `${normalizedRole} / ${normalizedSection}`;
});
</script>