<template>
  <input
    class="block w-full rounded-lg border border-cyan-300 bg-white/80 px-4 py-2 text-slate-800 shadow focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition placeholder:text-slate-400"
    v-bind="$attrs"
    :type="type"
    :disabled="disabled"
  />
</template>

<script setup lang="ts">
defineProps({
  type: { type: String, default: 'text' },
  disabled: { type: Boolean, default: false }
})
</script>
