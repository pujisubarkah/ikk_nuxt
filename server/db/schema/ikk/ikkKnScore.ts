import { sql } from 'drizzle-orm';
import { bigint, boolean, real, varchar } from 'drizzle-orm/pg-core';
import { ikkNew } from '../_shared';
import { activeYear } from '../core';
import { policy } from '../policy';
import { user } from '../user';
import { ikkKoornas } from './ikkKoornas';

export const ikkKnScore = ikkNew.table('ikk_kn_score', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  agency_id: bigint('agency_id', { mode: 'number' }),
  policy_id: bigint('policy_id', { mode: 'number' }).references(() => policy.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  active_year: bigint('active_year', { mode: 'number' }).references(() => activeYear.active_year, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  a1: bigint('a1', { mode: 'number' }),
  a2: bigint('a2', { mode: 'number' }),
  a3: bigint('a3', { mode: 'number' }),
  b1: bigint('b1', { mode: 'number' }),
  b2: bigint('b2', { mode: 'number' }),
  b3: bigint('b3', { mode: 'number' }),
  c1: bigint('c1', { mode: 'number' }),
  c2: bigint('c2', { mode: 'number' }),
  c3: bigint('c3', { mode: 'number' }),
  d1: bigint('d1', { mode: 'number' }),
  d2: bigint('d2', { mode: 'number' }),
  jf: boolean('jf'),
  created_by: bigint('created_by', { mode: 'number' }).references(() => user.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  informasi_a: varchar('informasi_a'),
  informasi_b: varchar('informasi_b'),
  informasi_c: varchar('informasi_c'),
  informasi_d: varchar('informasi_d'),
  informasi_jf: varchar('informasi_jf'),
  modified_id: bigint('modified_id', { mode: 'number' }),
  ikk_koornas: bigint('ikk_koornas', { mode: 'number' }).references(() => ikkKoornas.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  a_total_score: real('a_total_score').default(
    sql`(((0.375 * (a1)::numeric) + (0.375 * (a2)::numeric)) + (0.25 * (a3)::numeric))`
  ),
  b_total_score: real('b_total_score').default(
    sql`(((0.35 * (b1)::numeric) + (0.35 * (b2)::numeric)) + (0.30 * (b3)::numeric))`
  ),
  c_total_score: real('c_total_score').default(
    sql`(((0.35 * (c1)::numeric) + (0.35 * (c2)::numeric)) + (0.30 * (c3)::numeric))`
  ),
  d_total_score: real('d_total_score').default(
    sql`((0.50 * (d1)::numeric) + (0.50 * (d2)::numeric))`
  ),
  ikk_total_score: real('ikk_total_score').default(
    sql`(((((0.20 * (((0.375 * (a1)::numeric) + (0.375 * (a2)::numeric)) + (0.25 * (a3)::numeric))) + (0.25 * (((0.35 * (b1)::numeric) + (0.35 * (b2)::numeric)) + (0.30 * (b3)::numeric)))) + (0.30 * (((0.35 * (c1)::numeric) + (0.35 * (c2)::numeric)) + (0.30 * (c3)::numeric)))) + (0.15 * ((0.50 * (d1)::numeric) + (0.50 * (d2)::numeric)))) + ((10 * CASE WHEN jf THEN 1 ELSE 0 END))::numeric)`
  ),
});
