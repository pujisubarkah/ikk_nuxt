import { integer, varchar } from 'drizzle-orm/pg-core';
import { ikkNew } from './_shared';

export const instansiKategori = ikkNew.table('instansi_kategori', {
  id: integer('id').primaryKey(),
  kat_instansi: varchar('kat_instansi'),
});
