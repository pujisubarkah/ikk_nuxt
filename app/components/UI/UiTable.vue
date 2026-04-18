<template>
  <div class="rounded-xl bg-white p-4 overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 text-sm" style="table-layout: auto;">
      <thead class="bg-blue-100 sticky top-0 z-10">
        <tr>
          <th
            v-for="header in props.headers"
            :key="header.value"
            :class="[
              'px-3 py-2 font-semibold align-middle',
              header.center ? 'text-center' : 'text-left',
              header.color ? header.color : 'text-blue-700'
            ]"
            :style="header.width ? { width: header.width, minWidth: header.width } : undefined"
          >
            {{ header.text }}
          </th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-100">
        <template v-if="props.items && props.items.length">
          <tr
            v-for="(item, rowIndex) in props.items"
            :key="rowIndex"
            :class="[
              'align-middle transition-colors',
              rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50',
              'hover:bg-blue-50/60'
            ]"
          >
            <td
              v-for="header in props.headers"
              :key="header.value"
              :class="[
                'px-3 py-2 text-sm align-middle !text-black',
                header.center ? 'text-center' : (header.right ? 'text-right' : 'text-left')
              ]"
              :style="[
                header.width ? { width: header.width, minWidth: header.width } : undefined,
                { color: '#000' }
              ]"
            >
              <slot :name="header.value" :item="item" :index="rowIndex">
                {{ getCellValue(item, header.value) }}
              </slot>
            </td>
          </tr>
        </template>

        <template v-else>
          <tr>
            <td :colspan="props.headers.length" class="text-center py-8">
              <slot name="empty">
                <span class="text-gray-400">Tidak ada data</span>
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
type TableHeader = {
  text: string;
  value: string;
  center?: boolean;
  right?: boolean;
  color?: string;
  width?: string;
};

const props = withDefaults(
  defineProps<{
    headers?: TableHeader[];
    items?: unknown[];
  }>(),
  {
    headers: () => [],
    items: () => [],
  }
);

function getCellValue(item: unknown, key: string): unknown {
  if (!item || typeof item !== 'object') return undefined;
  return (item as Record<string, unknown>)[key];
}
</script>
