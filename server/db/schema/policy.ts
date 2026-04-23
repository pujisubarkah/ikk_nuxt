import { ikkNew } from './_shared';
import {
  bigserial,
  bigint,
  boolean,
  text,
  date,
  timestamp
} from 'drizzle-orm/pg-core';

export const policy = ikkNew.table('policy', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_at: timestamp('created_at', { withTimezone: true }),
  created_by: bigint('created_by', { mode: 'number' }),
  name: text('name'),
  name_detail: text('name_detail'),
  agency_id: bigint('agency_id', { mode: 'number' }),
  validated_by: bigint('validated_by', { mode: 'number' }),
  is_valid: boolean('is_valid'),
  sector: text('sector'),
  lainnya: text('lainnya'),
  file_url: text('file_url'),
  type: text('type'),
  agency_id_panrb: bigint('agency_id_panrb', { mode: 'number' }),
  active_year: bigint('active_year', { mode: 'number' }),
  policy_status: text('policy_status'),
  policy_process: text('policy_process'),
  progress: text('progress'),
  effective_date: date('effective_date', { mode: 'date' }),
  enumerator_id: bigint('enumerator_id', { mode: 'number' }),
  assigned_by_admin_id: bigint('assigned_by_admin_id', { mode: 'number' }),
  processed_by_enumerator_id: bigint('processed_by_enumerator_id', { mode: 'number' }),
  assigned_by_admin_at: timestamp('assigned_by_admin_at'),
  progress_validator: text('progress_validator'),
  melibatkan_jf_analis: boolean('melibatkan_jf_analis'),
  validated_at: timestamp('validated_at', { withTimezone: true }),
});
