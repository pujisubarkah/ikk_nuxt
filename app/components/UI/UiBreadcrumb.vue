<template>
  <Breadcrumb :items="items" />
</template>

<script setup lang="ts">
defineProps<{ items: Array<{ label: string, href: string }> }>()
import { Breadcrumb } from '@idds/vue';
</script>
