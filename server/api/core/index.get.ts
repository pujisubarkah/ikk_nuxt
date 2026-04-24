import { defineEventHandler, getQuery } from 'h3'
import { getAll } from '../../utils/db'
import { instansi } from '../../db/schema/instansi'

export default defineEventHandler(async (event) => {
  const { limit = '50', offset = '0' } = getQuery(event)
  const result = await getAll(instansi, Number(limit), Number(offset))
  return result
})
