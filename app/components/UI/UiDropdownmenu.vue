<template>
  <div class="relative inline-block">
    <div @click="toggle" ref="triggerRef">
      <slot name="trigger" />
    </div>
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="open"
        class="absolute right-0 mt-2 min-w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-1"
      >
        <slot name="content" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const open = ref(false);
const triggerRef = ref<HTMLElement | null>(null);

function toggle() {
  open.value = !open.value;
}

function handleClickOutside(e: MouseEvent) {
  if (triggerRef.value && !triggerRef.value.closest('.relative')?.contains(e.target as Node)) {
    open.value = false;
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside, true));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside, true));
</script>
