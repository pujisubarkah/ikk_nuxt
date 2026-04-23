import { defineEventHandler, readBody, getMethod, createError } from 'h3'
import { db } from '#server/db'
import { agencies, instansi, instansiKategori } from '#server/db/schema'

import { eq } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  if (method === 'POST') {
    const body = await readBody(event)
    const { active_year, agency_id_panrb } = body

    if (!active_year || !agency_id_panrb) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    try {
      // Note: original didn't set name/category, assuming defaults or from instansi
      // You may need to add name from instansi lookup or UI
      const newAgency = await db.insert(agencies).values({
        agency_id_panrb: Number(agency_id_panrb),
        // name, category set to defaults or fetch from instansi
      }).returning()

      return newAgency[0]
    } catch (error) {
      console.error('Error creating agency:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal server error'
      })
    }
  }

  if (method === 'GET') {
    try {
      const agenciesData = await db
        .select({
          id: agencies.id,
          name: agencies.name,
          category: agencies.category,
          active_year: agencies.active_year,
          agencyIdPanrb: agencies.agency_id_panrb,
          instansiAgencyId: instansi.agency_id,
          instansiAgencyName: instansi.agency_name,
          instansiKategoriId: instansiKategori.id,
          instansiKategoriKatInstansi: instansiKategori.kat_instansi
        })
        .from(agencies)
        .leftJoin(instansi, eq(agencies.agency_id_panrb, instansi.agency_id))
        .leftJoin(instansiKategori, eq(instansi.agency_category_id, instansiKategori.id))

      return agenciesData
    } catch (error) {
      console.error('Error fetching agencies:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal server error'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})

