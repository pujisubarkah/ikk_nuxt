import { bigint, varchar } from 'drizzle-orm/pg-core';
import { ikkNew } from './_shared';
import { instrumentQuestion } from './instrumentQuestion';

export const instrumentAnswer = ikkNew.table('instrument_answer', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  question_id: bigint('question_id', { mode: 'number' }).references(() => instrumentQuestion.id, {
    onDelete: 'no action',
    onUpdate: 'no action',
  }),
  level_id: bigint('level_id', { mode: 'number' }),
  level_description: varchar('level_description'),
  level_score: bigint('level_score', { mode: 'number' }),
});
