import * as core from './core';
import * as organization from './organization';
import * as userDomain from './user';
import * as policyDomain from './policy';
import * as ikkDomain from './ikk/index';
import * as misc from './misc';

export * from './core';
export * from './organization';
export * from './user';
export * from './policy';
export * from './ikk/index';
export * from './misc';

export const schema = {
  ...core,
  ...organization,
  ...userDomain,
  ...policyDomain,
  ...ikkDomain,
  ...misc,
};
