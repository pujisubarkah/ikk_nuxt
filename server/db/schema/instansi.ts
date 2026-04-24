import { bigint, integer, varchar } from 'drizzle-orm/pg-core';
import { ikkNew } from './_shared';
import { instansiKategori } from './instansiKategori';

export const instansi = ikkNew.table('instansi', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  agency_id: bigint('agency_id', { mode: 'number' }).unique(),
  agency_name: varchar('agency_name', { length: 226 }),
  agency_category_id: integer('agency_category_id').references(() => instansiKategori.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
});
