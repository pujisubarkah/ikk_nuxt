<template>
  <div class="flex space-x-2 md:space-x-4 overflow-x-auto">
    <button
      v-for="item in items"
      :key="item.value"
      class="px-4 py-2 text-sm md:text-base rounded-t-lg font-semibold whitespace-nowrap transition-colors"
      :class="item.value === value ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 bg-gray-200 hover:bg-gray-300'"
      @click="setValue(item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
export interface UiTabMenuItem {
  value: string;
  label: string;
}

const props = defineProps<{
  items: UiTabMenuItem[];
  value: string;
}>();

const emit = defineEmits<{
  (e: 'change', value: string): void;
  (e: 'update:value', value: string): void;
}>();

function setValue(newValue: string) {
  if (newValue === props.value) return;
  emit('update:value', newValue);
  emit('change', newValue);
}
</script>
