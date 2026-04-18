<template>
  <div>
    <RadioInput
      label="Choose an option"
      v-model="value"
      :options="options"
    />
    <p class="mt-2 text-sm text-[#6B7280]">
      Selected: {{ value || 'None' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RadioInput } from '@idds/vue';

const value = ref('');

const options = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];
</script>
