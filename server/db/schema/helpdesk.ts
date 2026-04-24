import { bigserial, text, timestamp } from 'drizzle-orm/pg-core';
import { ikkNew } from './_shared';

export const helpdesk = ikkNew.table('helpdesk', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  nama_lengkap: text('nama_lengkap').notNull(),
  kategori: text('kategori'),
  email_aktif: text('email_aktif').notNull(),
  instansi: text('instansi'),
  masalah: text('masalah'),
  pesan: text('pesan'),
  created_at: timestamp('created_at', { precision: 6 }).defaultNow(),
});
