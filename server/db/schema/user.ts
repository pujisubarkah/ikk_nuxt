import {
  bigint,
  bigserial,
  customType,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { ikkNew } from './_shared';
import { activeYear, role, suratPenunjukkan } from './core';
import { instansi } from './instansi/instansi';
import { agencies } from './organization';

const bit1 = customType<{ data: string }>({
  dataType() {
    return 'bit(1)';
  },
});

export const user = ikkNew.table('user', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_at: timestamp('created_at', { precision: 6 }),
  created_by: bigint('created_by', { mode: 'number' }),
  modified_by: bigint('modified_by', { mode: 'number' }),
  updated_at: timestamp('updated_at', { precision: 6 }),
  deleted: bit1('deleted'),
  deleted_at: timestamp('deleted_at', { precision: 6 }),
  deleted_by: bigint('deleted_by', { mode: 'number' }),
  email: varchar('email', { length: 255 }),
  name: varchar('name', { length: 255 }),
  nik: varchar('nik', { length: 255 }),
  password: varchar('password', { length: 255 }),
  phone: varchar('phone', { length: 255 }),
  position: varchar('position', { length: 255 }),
  status: varchar('status', { length: 255 }),
  username: varchar('username', { length: 255 }),
  work_unit: varchar('work_unit', { length: 255 }),
  agency_id: bigint('agency_id', { mode: 'number' }).references(() => agencies.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  agency_id_panrb: bigint('agency_id_panrb', { mode: 'number' }).references(() => instansi.agency_id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  active_year: bigint('active_year', { mode: 'number' }).references(() => activeYear.active_year, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  penunjukkan_id: bigint('penunjukkan_id', { mode: 'number' }).references(() => suratPenunjukkan.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
});

export const roleUser = ikkNew.table('role_user', {
  user_id: bigint('user_id', { mode: 'number' }).primaryKey().references(() => user.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  role_id: bigint('role_id', { mode: 'number' }).notNull().references(() => role.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
});

export const validatorAgency = ikkNew.table('validator_agency', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  created_at: timestamp('created_at', { precision: 6 }),
  created_by: bigint('created_by', { mode: 'number' }),
  modified_by: bigint('modified_by', { mode: 'number' }),
  updated_at: timestamp('updated_at', { precision: 6 }),
  agencies_id: bigint('agencies_id', { mode: 'number' }).references(() => agencies.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  validator_id: bigint('validator_id', { mode: 'number' }).references(() => user.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
});

export const koorInstansiAnalis = ikkNew.table('koor_instansi_analis', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_at: timestamp('created_at', { precision: 6 }),
  created_by: bigint('created_by', { mode: 'number' }),
  modified_by: bigint('modified_by', { mode: 'number' }),
  updated_at: timestamp('updated_at', { precision: 6 }),
  koor_instansi_id: bigint('koor_instansi_id', { mode: 'number' }).references(() => user.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  analis_instansi_id: bigint('analis_instansi_id', { mode: 'number' }).references(() => user.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
});

export const koorInstansiValidator = ikkNew.table('koor_instansi_validator', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_at: timestamp('created_at', { precision: 6 }),
  created_by: bigint('created_by', { mode: 'number' }),
  modified_by: bigint('modified_by', { mode: 'number' }),
  updated_at: timestamp('updated_at', { precision: 6 }),
  koor_instansi_id: bigint('koor_instansi_id', { mode: 'number' }).references(() => user.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  validator_id: bigint('validator_id', { mode: 'number' }),
  koor_nasional_id: bigint('koor_nasional_id', { mode: 'number' }).references(() => user.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
});

export const koorNasionalValidator = ikkNew.table('koor_nasional_validator', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_at: timestamp('created_at', { precision: 6 }),
  created_by: bigint('created_by', { mode: 'number' }),
  modified_by: bigint('modified_by', { mode: 'number' }),
  updated_at: timestamp('updated_at', { precision: 6 }),
  validator_id: bigint('validator_id', { mode: 'number' }).references(() => user.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  koor_nasional_id: bigint('koor_nasional_id', { mode: 'number' }).references(() => user.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
});
