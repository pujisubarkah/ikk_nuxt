import { sql } from 'drizzle-orm';
import {
  bigint,
  bigserial,
  boolean,
  integer,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { ikkNew } from './_shared';

export const activeYear = ikkNew.table('active_year', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  active_year: bigint('active_year', { mode: 'number' }).unique(),
});

export const instansiKategori = ikkNew.table('instansi_kategori', {
  id: integer('id').primaryKey(),
  kat_instansi: varchar('kat_instansi'),
});

export const instansi = ikkNew.table('instansi', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  agency_id: bigint('agency_id', { mode: 'number' }).unique(),
  agency_name: varchar('agency_name', { length: 226 }),
  agency_category_id: integer('agency_category_id').references(() => instansiKategori.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
});

export const suratPenunjukkan = ikkNew.table('surat_penunjukkan', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  file: varchar('file'),
  created_at: timestamp('created_at', { precision: 6 }).default(
    sql`'2025-05-01 23:36:38.525109'::timestamp without time zone`
  ),
  melibatkan_jf_analis: boolean('melibatkan_jf_analis'),
});

export const role = ikkNew.table('role', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  created_at: timestamp('created_at', { precision: 6 }),
  created_by: bigint('created_by', { mode: 'number' }),
  modified_by: bigint('modified_by', { mode: 'number' }),
  updated_at: timestamp('updated_at', { precision: 6 }),
  name: varchar('name', { length: 255 }),
});
