import { bigint, real, varchar } from 'drizzle-orm/pg-core';
import { ikkNew } from './_shared';

export const instrumentQuestion = ikkNew.table('instrument_question', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  dimension_id: bigint('dimension_id', { mode: 'number' }),
  dimension_name: varchar('dimension_name'),
  indicator_id: varchar('indicator_id'),
  indicator_column_code: varchar('indicator_column_code'),
  indicator_question: varchar('indicator_question'),
  indicator_weight: real('indicator_weight'),
  dimension_weight: real('dimension_weight'),
  final_weight: real('final_weight'),
  indicator_description: varchar('indicator_description'),
  bukti_dukung_description: varchar('bukti_dukung_description'),
});
