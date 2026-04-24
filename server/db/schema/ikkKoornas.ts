import { bigint, varchar } from 'drizzle-orm/pg-core';
import { ikkNew } from './_shared';
import { activeYear } from './activeYear';
import { policy } from './policy';
import { user } from './user';

import type { PgTable, AnyPgColumn } from 'drizzle-orm/pg-core';
import { ikkKnScore } from './ikkKnScore';

export const ikkKoornas = ikkNew.table('ikk_koornas', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  policy_id: bigint('policy_id', { mode: 'number' }).references(() => policy.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  active_year: bigint('active_year', { mode: 'number' }).references(() => activeYear.active_year, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  catatan_a1: varchar('catatan_a1'),
  catatan_a2: varchar('catatan_a2'),
  catatan_a3: varchar('catatan_a3'),
  catatan_b1: varchar('catatan_b1'),
  catatan_b2: varchar('catatan_b2'),
  catatan_b3: varchar('catatan_b3'),
  catatan_c1: varchar('catatan_c1'),
  catatan_c2: varchar('catatan_c2'),
  catatan_c3: varchar('catatan_c3'),
  catatan_d1: varchar('catatan_d1'),
  catatan_d2: varchar('catatan_d2'),
  created_by: bigint('created_by', { mode: 'number' }).references(() => user.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  iki_score_id: bigint('iki_score_id', { mode: 'number' }).references(() => ikkKnScore.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
});

export const ikkKoornasId: AnyPgColumn = ikkKoornas.id;
