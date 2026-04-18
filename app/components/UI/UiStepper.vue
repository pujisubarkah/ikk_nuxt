<template>
  <div class="p-5">
    <Stepper :steps="steps" :current-step="currentStep" orientation="horizontal" />
    <div class="mt-14">
      <Button hierarchy="secondary" @click="currentStep = Math.max(0, currentStep - 1)">
        Previous
      </Button>
      <Button
        hierarchy="primary"
        @click="currentStep = Math.min(steps.length - 1, currentStep + 1)"
        class="ml-2"
      >
        Next
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Stepper, Button } from '@idds/vue';

const currentStep = ref(1);
const steps = ref([
  { label: 'Step 1' },
  { label: 'Step 2' },
  { label: 'Step 3' },
  { label: 'Step 4' },
]);
</script>
