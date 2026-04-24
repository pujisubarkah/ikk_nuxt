import { desc } from 'drizzle-orm'
import { createError, defineEventHandler, readBody, setResponseStatus } from 'h3'
import { db } from '../../db'
import { helpdesk } from '../../db/schema/helpdesk'

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    return db.select().from(helpdesk).orderBy(desc(helpdesk.created_at))
  }

  if (event.method === 'POST') {
    const body = await readBody(event)

    if (!body || typeof body !== 'object') {
      throw createError({ statusCode: 400, statusMessage: 'Body tidak valid' })
    }

    const payload = body as {
      nama_lengkap?: string
      email_aktif?: string
      instansi?: string | null
      masalah?: string | null
      pesan?: string | null
    }

    if (!payload.nama_lengkap || !payload.email_aktif) {
      throw createError({ statusCode: 400, statusMessage: 'Nama lengkap dan email aktif wajib diisi' })
    }

    const [inserted] = await db
      .insert(helpdesk)
      .values({
        nama_lengkap: payload.nama_lengkap,
        email_aktif: payload.email_aktif,
        instansi: payload.instansi ?? null,
        masalah: payload.masalah ?? null,
        pesan: payload.pesan ?? null,
      })
      .returning()

    setResponseStatus(event, 201)
    return inserted
  }

  throw createError({ statusCode: 405, statusMessage: 'Method tidak diizinkan' })
})