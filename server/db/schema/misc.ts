import {
  bigint,
  bigserial,
  integer,
  real,
  smallint,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { ikkNew } from './_shared';
import { instansi } from './instansi/instansi';

export const suratJfak = ikkNew.table('Surat_JFAK', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  file: varchar('file', { length: 255 }),
  created_at: timestamp('created_at', { precision: 6 }),
});

export const helpdesk = ikkNew.table('helpdesk', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  nama_lengkap: text('nama_lengkap').notNull(),
  email_aktif: text('email_aktif').notNull(),
  instansi: text('instansi'),
  masalah: text('masalah'),
  pesan: text('pesan'),
  created_at: timestamp('created_at', { precision: 6 }).defaultNow(),
});

export const ikkHasil = ikkNew.table('ikk_hasil', {
  instansi_kategori: varchar('instansi_kategori'),
  instansi_nama: varchar('instansi_nama'),
  predikat_2021: varchar('predikat_2021'),
  predikat_2023: varchar('predikat_2023'),
  predikat_2024: varchar('predikat_2024'),
  predikat_2025: varchar('predikat_2025'),
  id: varchar('id').primaryKey(),
  kd_prov: smallint('kd_prov'),
  kd_kabkot: integer('kd_kabkot'),
  agency_id_panrb: bigint('agency_id_panrb', { mode: 'number' }).references(() => instansi.agency_id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
});

export const instrumentQuestion = ikkNew.table('instrument_question', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  dimension_id: bigint('dimension_id', { mode: 'number' }),
  dimension_name: varchar('dimension_name'),
  indicator_id: varchar('indicator_id'),
  indicator_column_code: varchar('indicator_column_code'),
  indicator_question: varchar('indicator_question'),
  indicator_weight: real('indicator_weight'),
  dimension_weight: real('dimension_weight'),
  final_weight: real('final_weight'),
  indicator_description: varchar('indicator_description'),
  bukti_dukung_description: varchar('bukti_dukung_description'),
});

export const instrumentAnswer = ikkNew.table('instrument_answer', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  question_id: bigint('question_id', { mode: 'number' }).references(() => instrumentQuestion.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  level_id: bigint('level_id', { mode: 'number' }),
  level_description: varchar('level_description'),
  level_score: bigint('level_score', { mode: 'number' }),
});

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
