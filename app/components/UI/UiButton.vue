<template>
  <button
    class="inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-4 py-2 text-white font-semibold shadow hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
    v-bind="$attrs"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  type?: 'button' | 'submit' | 'reset',
  disabled?: boolean
}>()
</script>
