import { bigint, real, varchar } from 'drizzle-orm/pg-core';
import { ikkNew } from './_shared';
import { instansi } from './instansi';

export const kementerianKordinat = ikkNew.table('kementerian_kordinat', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  Kementerian: varchar('Kementerian', { length: 255 }),
  kode_instansi: bigint('kode_instansi', { mode: 'number' }).references(() => instansi.agency_id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  alamat: varchar('alamat', { length: 255 }),
  Latitude: real('Latitude'),
  Longitude: real('Longitude'),
});
