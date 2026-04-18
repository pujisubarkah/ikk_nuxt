import { bigint, varchar } from 'drizzle-orm/pg-core';
import { ikkNew } from '../_shared';
import { policy } from '../policy';
import { user } from '../user';
import { ikkKuScore } from './ikkKuScore';

export const ikkVerifikator = ikkNew.table('ikk_verifikator', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  policy_id: bigint('policy_id', { mode: 'number' }).references(() => policy.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  active_year: bigint('active_year', { mode: 'number' }),
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
  iki_score_id: bigint('iki_score_id', { mode: 'number' }).references(() => ikkKuScore.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
});
