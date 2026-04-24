import { bigint, timestamp, varchar } from 'drizzle-orm/pg-core';
import { ikkNew } from './_shared';

export const role = ikkNew.table('role', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  created_at: timestamp('created_at', { precision: 6 }),
  created_by: bigint('created_by', { mode: 'number' }),
  modified_by: bigint('modified_by', { mode: 'number' }),
  updated_at: timestamp('updated_at', { precision: 6 }),
  name: varchar('name', { length: 255 }),
});
