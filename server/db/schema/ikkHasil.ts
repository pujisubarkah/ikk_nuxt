import { bigint, integer, smallint, varchar } from 'drizzle-orm/pg-core';
import { ikkNew } from './_shared';
import { instansi } from './instansi';

export const ikkHasil = ikkNew.table('ikk_hasil', {
  instansi_kategori: varchar('instansi_kategori'),
  instansi_nama: varchar('instansi_nama'),
  predikat_2021: varchar('predikat_2021'),
  predikat_2023: varchar('predikat_2023'),
  predikat_2024: varchar('predikat_2024'),
  predikat_2025: varchar('predikat_2025'),
  id: varchar('id').primaryKey(),
  kd_prov: smallint('kd_prov'),
  kd_kabkot: integer('kd_kabkot'),
  agency_id_panrb: bigint('agency_id_panrb', { mode: 'number' }).references(() => instansi.agency_id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
});
