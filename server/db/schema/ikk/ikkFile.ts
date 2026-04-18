import { bigint, varchar } from 'drizzle-orm/pg-core';
import { ikkNew } from '../_shared';
import { activeYear } from '../core';
import { policy } from '../policy';
import { user } from '../user';
import { ikkKiScore } from './ikkKiScore';

export const ikkFile = ikkNew.table('ikk_file', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  policy_id: bigint('policy_id', { mode: 'number' }).references(() => policy.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  active_year: bigint('active_year', { mode: 'number' }).references(() => activeYear.active_year, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  file_url_a1: varchar('file_url_a1'),
  file_url_a2: varchar('file_url_a2'),
  file_url_a3: varchar('file_url_a3'),
  file_url_b1: varchar('file_url_b1'),
  file_url_b2: varchar('file_url_b2'),
  file_url_b3: varchar('file_url_b3'),
  file_url_c1: varchar('file_url_c1'),
  file_url_c2: varchar('file_url_c2'),
  file_url_c3: varchar('file_url_c3'),
  file_url_d1: varchar('file_url_d1'),
  file_url_d2: varchar('file_url_d2'),
  file_url_jf: varchar('file_url_jf'),
  created_by: bigint('created_by', { mode: 'number' }).references(() => user.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  iki_score_id: bigint('iki_score_id', { mode: 'number' }).references(() => ikkKiScore.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
});
