import { sql } from 'drizzle-orm';
import { bigserial, boolean, timestamp, varchar } from 'drizzle-orm/pg-core';
import { ikkNew } from './_shared';

export const suratPenunjukkan = ikkNew.table('surat_penunjukkan', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  file: varchar('file'),
  created_at: timestamp('created_at', { precision: 6 }).default(
    sql`'2025-05-01 23:36:38.525109'::timestamp without time zone`
  ),
  melibatkan_jf_analis: boolean('melibatkan_jf_analis'),
});
