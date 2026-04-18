<template>
  <div class="p-5 flex flex-col gap-6">
    <div class="flex gap-6">
      <TabVertical
        :items="items"
        :value="value"
        @change="setValue"
        variant="button-brand"
        width="180px"
      />
      <div class="flex-1 p-4">
        <p>Selected: {{ value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TabVertical } from '@idds/vue';

const value = ref('overview');
const items = ref([
  { value: 'overview', label: 'Overview' },
  { value: 'details', label: 'Details' },
  { value: 'profile', label: 'Profile' },
]);

const setValue = (newValue: string) => {
  value.value = newValue;
};
</script>
