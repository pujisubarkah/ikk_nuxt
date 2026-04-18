import { eq } from 'drizzle-orm'
import { createError, defineEventHandler, readBody } from 'h3'
import { db } from '../db'
import { user } from '../db/schema/user'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method tidak diizinkan' })
  }

  const body = await readBody(event)
  const userId = Number((body as { userId?: number })?.userId)

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'userId wajib diisi' })
  }

  const [updated] = await db
    .update(user)
    .set({
      status: 'aktif',
      updated_at: new Date(),
    })
    .where(eq(user.id, userId))
    .returning({ id: user.id, status: user.status })

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'User tidak ditemukan' })
  }

  return { success: true, data: updated }
})