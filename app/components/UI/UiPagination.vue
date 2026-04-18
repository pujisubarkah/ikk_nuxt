<template>
  <div>
    <Pagination
      :model-value="page"
      :total-pages="totalPages"
      :page-size="perPage"
      :page-size-options="pageSizeOptions"
      @update:model-value="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Pagination } from '@idds/vue';
const props = defineProps({
  page: { type: Number, required: true },
  perPage: { type: Number, required: true },
  total: { type: Number, required: true },
});
const emit = defineEmits(['update:page']);
const pageSizeOptions = [10, 20, 50, 100];
const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.perPage)));
function onPageChange(newPage: number) {
  emit('update:page', newPage);
}
</script>
