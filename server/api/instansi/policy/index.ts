import { defineEventHandler, getMethod, createError } from 'h3'
import { db } from '#server/db'
import { instansi, instansiKategori, policy } from '#server/db/schema'
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
            kat_instansi: instansiKategori.kat_instansi
          },
          policy: {
            name: policy.name,
            name_detail: policy.name_detail,
            sector: policy.sector,
            lainnya: policy.lainnya,
            policy_status: policy.policy_status,
            policy_process: policy.policy_process,
            progress: policy.progress
          }
        })
        .from(instansi)
        .leftJoin(instansiKategori, eq(instansi.agency_category_id, instansiKategori.id))
        .leftJoin(policy, eq(policy.agency_id_panrb, instansi.agency_id))  // assuming join on panrb id, adjust if agency_id

      return instansiList
    } catch (error) {
      console.error('Error fetching instansi with policy:', error)
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

