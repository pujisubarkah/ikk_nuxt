import { and, asc, eq, isNull, or } from 'drizzle-orm'
import { defineEventHandler } from 'h3'
import { db } from '../../../db'
import { roleUser, user } from '../../../db/schema/user'

const KOORNAS_ROLE_ID = 2

export default defineEventHandler(async () => {
  return db
    .select({
      id: user.id,
      name: user.name,
    })
    .from(user)
    .innerJoin(roleUser, eq(roleUser.user_id, user.id))
    .where(
      and(
        eq(roleUser.role_id, KOORNAS_ROLE_ID),
        eq(user.status, 'aktif'),
        or(isNull(user.deleted), eq(user.deleted, '0')),
      )
    )
    .orderBy(asc(user.id))
})