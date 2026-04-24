import { bigint, varchar, timestamp } from 'drizzle-orm/pg-core';
import { ikkNew } from './_shared';

export const suratJfak = ikkNew.table('Surat_JFAK', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  file: varchar('file', { length: 255 }),
  created_at: timestamp('created_at', { precision: 6 }),
});
