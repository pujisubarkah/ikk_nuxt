// Type guard for error with statusCode
function hasStatusCode(error: unknown): error is { statusCode: number } {
  return typeof error === 'object' && error !== null && 'statusCode' in error && typeof (error as any).statusCode === 'number';
}
import { defineEventHandler, createError } from 'h3'
import { db } from '#server/db'
import { agencies } from '#server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'agencyId tidak valid'
    })
  }

  try {
    const agencyData = await db
      .select({
        agency_name: agencies.name,
        agency_id: agencies.id
      })
      .from(agencies)
      .where(eq(agencies.id, parseInt(id)))  // agency.id is bigserial/number
      .limit(1)

    if (agencyData.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Agency tidak ditemukan'
      })
    }

    // Response structure matching original
    // agencyData[0] is guaranteed by the check above
    const agency = agencyData[0]!
    const responseData = {
      name: agency.agency_name,
      agency_id: agency.agency_id
    }

    return responseData
  } catch (error) {
    if (hasStatusCode(error) && error.statusCode === 404) {
      throw error
    }
    console.error('Gagal mengambil agency:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Terjadi kesalahan pada server'
    })
  }
})

