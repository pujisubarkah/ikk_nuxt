import {
  bigint,
  bigserial,
  boolean,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { ikkNew } from './_shared';
import { activeYear } from './core';
import { instansi } from './instansi/instansi';

export const agencies = ikkNew.table('agencies', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_at: timestamp('created_at', { precision: 6 }),
  created_by: bigint('created_by', { mode: 'number' }),
  modified_by: bigint('modified_by', { mode: 'number' }),
  updated_at: timestamp('updated_at', { precision: 6 }),
  name: varchar('name', { length: 255 }),
  category: varchar('category', { length: 255 }),
  kd_bkn: varchar('kd_bkn', { length: 100 }),
  kd_prov: varchar('kd_prov', { length: 100 }),
  kd_kab: varchar('kd_kab', { length: 100 }),
  agency_id_panrb: bigint('agency_id_panrb', { mode: 'number' }).references(() => instansi.agency_id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  active_year: bigint('active_year', { mode: 'number' }).references(() => activeYear.active_year, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  melibatkan_jf_analis: boolean('melibatkan_jf_analis'),
});
