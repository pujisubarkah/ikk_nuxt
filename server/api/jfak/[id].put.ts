import { eq } from 'drizzle-orm'
import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { db } from '../../db'
import { suratPenunjukkan } from '../../db/schema/suratPenunjukkan'
import { user } from '../../db/schema/user'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const value = (body as { melibatkan_jf_analis?: boolean })?.melibatkan_jf_analis

  if (!id || typeof value !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'Data tidak valid' })
  }

  const [userRow] = await db
    .select({ penunjukkan_id: user.penunjukkan_id })
    .from(user)
    .where(eq(user.id, id))
    .limit(1)

  if (!userRow?.penunjukkan_id) {
    throw createError({ statusCode: 404, statusMessage: 'Surat penunjukkan tidak ditemukan' })
  }

  const [updated] = await db
    .update(suratPenunjukkan)
    .set({ melibatkan_jf_analis: value })
    .where(eq(suratPenunjukkan.id, userRow.penunjukkan_id))
    .returning({ id: suratPenunjukkan.id, melibatkan_jf_analis: suratPenunjukkan.melibatkan_jf_analis })

  return { success: true, data: updated }
})