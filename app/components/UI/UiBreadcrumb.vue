<template>
  <div class="p-5 flex flex-col gap-6">
    <Breadcrumb :items="items1" />
    <Breadcrumb :items="items2" separator="/" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Breadcrumb } from '@idds/vue';

const items1 = ref([
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Detail' },
]);

const items2 = ref([
  { label: 'Home', href: '/' },
  { label: 'Category', href: '/category' },
  { label: 'Subcategory', href: '/category/subcategory' },
  { label: 'Current Page' },
]);
</script>
