<template>
  <div style="padding: 20px">
    <Pagination
      v-model="currentPage"
      :total-pages="totalPages"
      :page-size="pageSize"
      :page-size-options="pageSizeOptions"
      @update:model-value="handlePageChange"
      @page-size-change="handlePageSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Pagination } from '@idds/vue';

const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = 10;
const pageSizeOptions = [10, 20, 50, 100];

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const handlePageSizeChange = (newPageSize: number) => {
  pageSize.value = newPageSize;
  currentPage.value = 1;
};
</script>
