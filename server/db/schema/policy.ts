import {
  bigint,
  bigserial,
  boolean,
  date,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { json } from 'drizzle-orm/pg-core';
import { ikkNew } from './_shared';
import { instansi } from './core';
import { agencies } from './organization';
import { user } from './user';

export const policy = ikkNew.table('policy', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_at: timestamp('created_at', { precision: 6, withTimezone: true }),
  created_by: bigint('created_by', { mode: 'number' }).references(() => user.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  name: text('name'),
  name_detail: text('name_detail'),
  agency_id: bigint('agency_id', { mode: 'number' }).references(() => agencies.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  validated_by: bigint('validated_by', { mode: 'number' }).references(() => user.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  is_valid: boolean('is_valid'),
  sector: text('sector'),
  lainnya: text('lainnya'),
  file_url: text('file_url'),
  type: text('type'),
  agency_id_panrb: bigint('agency_id_panrb', { mode: 'number' }).references(() => instansi.agency_id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  active_year: bigint('active_year', { mode: 'number' }),
  policy_status: text('policy_status'),
  policy_process: text('policy_process'),
  progress: text('progress'),
  effective_date: date('effective_date', { mode: 'date' }),
  enumerator_id: bigint('enumerator_id', { mode: 'number' }).references(() => user.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  assigned_by_admin_id: bigint('assigned_by_admin_id', { mode: 'number' }).references(() => user.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  processed_by_enumerator_id: bigint('processed_by_enumerator_id', { mode: 'number' }).references(() => user.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  assigned_by_admin_at: timestamp('assigned_by_admin_at', { precision: 6 }),
  progress_validator: text('progress_validator'),
  melibatkan_jf_analis: boolean('melibatkan_jf_analis'),
  validated_at: timestamp('validated_at', { precision: 6, withTimezone: true }),
});

export const policyProgram = ikkNew.table('policy_program', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  policy_id: bigint('policy_id', { mode: 'number' }).references(() => policy.id, {
    onDelete: 'cascade',
    onUpdate: 'no action',
  }),
  dasar_hukum: json('dasar_hukum').notNull(),
  program: text('program').notNull(),
  file_url: text('file_url'),
});

export const notifikasi = ikkNew.table('notifikasi', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' }).references(() => user.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  pesan: varchar('pesan', { length: 255 }),
  policy_id: bigint('policy_id', { mode: 'number' }).references(() => policy.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  dibaca: boolean('dibaca'),
  created_by: bigint('created_by', { mode: 'number' }).references(() => user.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  created_at: timestamp('created_at', { precision: 6 }),
});
