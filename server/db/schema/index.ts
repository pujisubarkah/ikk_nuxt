export * from './agencies';
export * from './instansi';
export * from './instansiKategori';
import { activeYear } from './activeYear';
import { suratPenunjukkan } from './suratPenunjukkan';
import { role } from './role';
import * as userDomain from './user';
import * as policyDomain from './policy';
import * as ikkDomain from './ikk/index';
import { suratJfak } from './suratJfak';
import { helpdesk } from './helpdesk';
import { ikkHasil } from './ikkHasil';
import { instrumentQuestion } from './instrumentQuestion';
import { instrumentAnswer } from './instrumentAnswer';
import { kementerianKordinat } from './kementerianKordinat';

export * from './activeYear';
export * from './suratPenunjukkan';
export * from './role';
export * from './user';
export * from './policy';
export * from './ikk/index';
export * from './suratJfak';
export * from './helpdesk';
export * from './ikkHasil';
export * from './instrumentQuestion';
export * from './instrumentAnswer';
export * from './kementerianKordinat';

export const schema = {
  activeYear,
  suratPenunjukkan,
  role,
  ...userDomain,
  ...policyDomain,
  ...ikkDomain,
  suratJfak,
  helpdesk,
  ikkHasil,
  instrumentQuestion,
  instrumentAnswer,
  kementerianKordinat,
};
