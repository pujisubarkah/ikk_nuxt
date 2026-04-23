import { defineEventHandler, getMethod, createError } from 'h3'
import { db } from '#server/db'
import { instansi, instansiKategori } from '#server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  if (method === 'GET') {
    try {
      const instansiList = await db
        .select({
          agency_id: instansi.agency_id,
          agency_name: instansi.agency_name,
          instansi_kategori: {
            id: instansiKategori.id,
            kat_instansi: instansiKategori.kat_instansi
          }
        })
        .from(instansi)
        .leftJoin(instansiKategori, eq(instansi.agency_category_id, instansiKategori.id))

      // Drizzle auto serializes BigInt to string, no need for manual serialization

      return instansiList
    } catch (error) {
      console.error('Error fetching instansi:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error'
      })
    }
  } else {
    throw createError({
      statusCode: 405,
      statusMessage: `Method ${method} Not Allowed`
    })
  }
})

