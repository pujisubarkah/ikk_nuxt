import { eq } from 'drizzle-orm'
import { createError, defineEventHandler, readBody } from 'h3'
import { db } from '../db'
import { koorNasionalValidator } from '../db/schema/user'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method tidak diizinkan' })
  }

  const body = await readBody(event)
  const koorNasionalId = Number((body as { koor_nasional_id?: number })?.koor_nasional_id)
  const verifikatorIds = ((body as { verifikator_ids?: number[] })?.verifikator_ids ?? []).map(Number).filter(Boolean)

  if (!koorNasionalId || verifikatorIds.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Data penugasan verifikator tidak valid' })
  }

  await db.delete(koorNasionalValidator).where(eq(koorNasionalValidator.koor_nasional_id, koorNasionalId))

  const inserted = await db
    .insert(koorNasionalValidator)
    .values(
      verifikatorIds.map((validatorId) => ({
        koor_nasional_id: koorNasionalId,
        validator_id: validatorId,
        created_at: new Date(),
        updated_at: new Date(),
      }))
    )
    .returning({ validator_id: koorNasionalValidator.validator_id })

  return { success: true, data: inserted }
})