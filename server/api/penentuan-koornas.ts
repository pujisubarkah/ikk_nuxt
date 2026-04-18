import { eq } from 'drizzle-orm'
import { createError, defineEventHandler, readBody } from 'h3'
import { db } from '../db'
import { koorInstansiValidator } from '../db/schema/user'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method tidak diizinkan' })
  }

  const body = await readBody(event)
  const koorInstansiId = Number((body as { koor_instansi_id?: number })?.koor_instansi_id)
  const koorNasionalId = Number((body as { koor_nasional_id?: number })?.koor_nasional_id)

  if (!koorInstansiId || !koorNasionalId) {
    throw createError({ statusCode: 400, statusMessage: 'koor_instansi_id dan koor_nasional_id wajib diisi' })
  }

  const [existing] = await db
    .select({ id: koorInstansiValidator.id })
    .from(koorInstansiValidator)
    .where(eq(koorInstansiValidator.koor_instansi_id, koorInstansiId))
    .limit(1)

  if (existing) {
    const [updated] = await db
      .update(koorInstansiValidator)
      .set({
        koor_nasional_id: koorNasionalId,
        updated_at: new Date(),
      })
      .where(eq(koorInstansiValidator.id, existing.id))
      .returning()

    return { success: true, data: updated }
  }

  const [inserted] = await db
    .insert(koorInstansiValidator)
    .values({
      koor_instansi_id: koorInstansiId,
      koor_nasional_id: koorNasionalId,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning()

  return { success: true, data: inserted }
})