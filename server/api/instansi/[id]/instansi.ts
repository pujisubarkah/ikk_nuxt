// Type guard for error with statusCode
function hasStatusCode(error: unknown): error is { statusCode: number } {
  return typeof error === 'object' && error !== null && 'statusCode' in error && typeof (error as any).statusCode === 'number';
}
import { defineEventHandler, createError } from 'h3'
import { db } from '#server/db'
import { instansi } from '#server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID parameter missing'
    })
  }

  try {
    const instansiData = await db
      .select({
        agency_name: instansi.agency_name
      })
      .from(instansi)
      .where(eq(instansi.agency_id, Number(id)))
      .limit(1)

    if (instansiData.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Instansi tidak ditemukan'
      })
    }

    return instansiData[0]
  } catch (error) {
    if (hasStatusCode(error) && error.statusCode === 404) {
      throw error
    }
    console.error('Gagal ambil data instansi:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Terjadi kesalahan server'
    })
  }
})

