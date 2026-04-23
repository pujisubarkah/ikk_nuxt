import { ikkNew } from './_shared';
import { policy } from './policy';
import { bigserial, bigint, json, text } from 'drizzle-orm/pg-core';

export const policyProgram = ikkNew.table('policy_program', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  policy_id: bigint('policy_id', { mode: 'number' }).references(() => policy.id, {
    onDelete: 'cascade',
    onUpdate: 'no action',
  }),
  dasar_hukum: json('dasar_hukum').notNull(),
  program: text('program'), // Changed from .notNull() to allow null values
  file_url: text('file_url'),
});
