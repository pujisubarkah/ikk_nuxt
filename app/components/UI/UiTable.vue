<template>
  <div class="flex flex-col h-full w-full gap-4">
    <div>
      <Button hierarchy="primary" @click="handleAdd">Tambah User +</Button>
    </div>
    <Table
      :rowClickable="true"
      :columns="columns"
      :fetchData="fetchData"
      :initialPageSize="5"
      :initialSortField="null"
      :initialSortOrder="null"
      :showSearch="true"
      rowKey="id"
      class="[&_.ina-table__search-controls]:flex-row [&_.ina-table__search-controls]:flex [&_.ina-table__search-controls]:gap-2"
    >
      <template #cell-status="{ row }">
        <span v-if="row.status === true" class="text-green-500 font-medium">Aktif</span>
        <span v-else-if="row.status === false" class="text-red-500 font-medium">Tidak Aktif</span>
        <span v-else>-</span>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <Button hierarchy="tertiary" class="text-guide-500" @click="handleEdit(row)">
            <IconEdit :size="16" />
          </Button>
          <Button hierarchy="tertiary" class="text-red-500" @click="handleDelete(row)">
            <IconTrash :size="16" />
          </Button>
        </div>
      </template>
      <template #cell-name="{ row }">
        {{ row.name ?? '-' }}
      </template>
      <template #cell-email="{ row }">
        {{ row.email ?? '-' }}
      </template>
      <template #cell-telp="{ row }">
        {{ row.telp ?? '-' }}
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { IconTrash, IconEdit } from '@tabler/icons-vue';
import { Button, Table } from '@idds/vue';

const columns = [
  { header: 'Name', accessor: 'name', slot: 'cell-name' },
  { header: 'Email', accessor: 'email', slot: 'cell-email' },
  { header: 'No. Telp', accessor: 'telp', slot: 'cell-telp' },
  { header: 'Status', accessor: 'status', slot: 'cell-status' },
  { header: 'actions', accessor: 'Actions', slot: 'cell-actions' },
];

const handleEdit = (row: any) => {
  console.log('Edit:', row);
};

const handleDelete = (row: any) => {
  console.log('Delete:', row);
};

const handleAdd = () => {
  console.log('Added');
};

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', telp: '081234567890', status: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', telp: '081298765432', status: false },
  { id: 3, name: 'Michael', email: null, telp: null, status: true },
];

const fetchData = async (params: any) => {
  const initialPageSize = 5;
  let resultData = data;

  if (params.searchTerm) {
    const searchLower = params.searchTerm.toLowerCase();
    resultData = resultData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        (item.email && item.email.toString().includes(searchLower)) ||
        item.id.toString().includes(searchLower)
    );
  }

  if (resultData.length < initialPageSize) {
    const emptyRowsCount = initialPageSize - resultData.length;
    const emptyRows = Array(emptyRowsCount).fill({});
    resultData = [...resultData, ...emptyRows];
  }

  return {
    data: resultData,
    total: resultData.length,
  };
};
</script>
