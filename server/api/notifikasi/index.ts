import { desc, eq, sql } from 'drizzle-orm'
import { createError, defineEventHandler, getQuery, readBody, setResponseStatus } from 'h3'
import { db } from '../../db'
import { notifikasi } from '../../db/schema/policy.notifikasi'

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const { userId } = getQuery(event)

    const rows = userId
      ? await db
          .select()
          .from(notifikasi)
          .where(eq(notifikasi.user_id, Number(userId)))
          .orderBy(desc(notifikasi.created_at))
          .limit(20)
      : await db.select().from(notifikasi).orderBy(desc(notifikasi.created_at)).limit(20)

    return { success: true, data: rows }
  }

  if (event.method === 'POST') {
    const body = await readBody(event)
    if (!body || typeof body !== 'object') {
      throw createError({ statusCode: 400, statusMessage: 'Body tidak valid' })
    }

    const payload = body as {
      user_id?: number | null
      pesan?: string | null
      policy_id?: number | null
      dibaca?: boolean | null
      created_by?: number | null
      created_at?: string | Date | null
    }

    if (!payload.user_id || !payload.pesan) {
      throw createError({ statusCode: 400, statusMessage: 'user_id dan pesan wajib diisi' })
    }

    const [maxRow] = await db
      .select({ maxId: sql<number>`coalesce(max(${notifikasi.id}), 0)` })
      .from(notifikasi)

    const nextId = Number(maxRow?.maxId ?? 0) + 1

    const [inserted] = await db
      .insert(notifikasi)
      .values({
        id: nextId,
        user_id: Number(payload.user_id),
        pesan: payload.pesan,
        policy_id: payload.policy_id ?? null,
        dibaca: payload.dibaca ?? false,
        created_by: payload.created_by ?? null,
        created_at: payload.created_at ? new Date(payload.created_at) : new Date(),
      })
      .returning()

    setResponseStatus(event, 201)
    return { success: true, data: inserted }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method tidak diizinkan' })
})