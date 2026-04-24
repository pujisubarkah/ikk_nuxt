import { sql } from 'drizzle-orm';
import { bigint, bigserial } from 'drizzle-orm/pg-core';
import { ikkNew } from './_shared';

export const activeYear = ikkNew.table('active_year', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  active_year: bigint('active_year', { mode: 'number' }).unique(),
});
