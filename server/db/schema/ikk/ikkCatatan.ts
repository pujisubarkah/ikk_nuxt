import { bigint, varchar } from 'drizzle-orm/pg-core';
import { ikkNew } from '../_shared';
import { activeYear } from '../core';
import { policy } from '../policy';
import { user } from '../user';
import { ikkKiScore } from './ikkKiScore';

export const ikkCatatan = ikkNew.table('ikk_catatan', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  policy_id: bigint('policy_id', { mode: 'number' }).references(() => policy.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  active_year: bigint('active_year', { mode: 'number' }).references(() => activeYear.active_year, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  penjelasan_a1: varchar('penjelasan_a1'),
  penjelasan_a2: varchar('penjelasan_a2'),
  penjelasan_a3: varchar('penjelasan_a3'),
  penjelasan_b1: varchar('penjelasan_b1'),
  penjelasan_b2: varchar('penjelasan_b2'),
  penjelasan_b3: varchar('penjelasan_b3'),
  penjelasan_c1: varchar('penjelasan_c1'),
  penjelasan_c2: varchar('penjelasan_c2'),
  penjelasan_c3: varchar('penjelasan_c3'),
  penjelasan_d1: varchar('penjelasan_d1'),
  penjelasan_d2: varchar('penjelasan_d2'),
  created_by: bigint('created_by', { mode: 'number' }).references(() => user.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  iki_score_id: bigint('iki_score_id', { mode: 'number' }).references(() => ikkKiScore.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
});
