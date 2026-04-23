import { bigint, boolean, timestamp, varchar } from 'drizzle-orm/pg-core';
import { ikkNew } from './_shared';
import { user } from './user';
import { policy } from './policy';

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
