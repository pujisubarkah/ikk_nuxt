import { eq, inArray } from 'drizzle-orm'
import { createError, defineEventHandler, getRouterParam } from 'h3'
import { db } from '../../../db'
import { koorNasionalValidator, user } from '../../../db/schema/user'

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET') {
    throw createError({ statusCode: 405, statusMessage: 'Method tidak diizinkan' })
  }

  const id = Number(getRouterParam(event, 'id'))
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID koordinator nasional wajib diisi' })
  }

  const assignments = await db
    .select({ validator_id: koorNasionalValidator.validator_id })
    .from(koorNasionalValidator)
    .where(eq(koorNasionalValidator.koor_nasional_id, id))

  const validatorIds = assignments.map((item) => item.validator_id).filter((value): value is number => value !== null)

  if (validatorIds.length === 0) {
    return []
  }

  const validators = await db
    .select({
      id: user.id,
      name: user.name,
    })
    .from(user)
    .where(inArray(user.id, validatorIds))

  return validators.map((item) => ({
    id: String(item.id),
    name: item.name ?? '',
  }))
})