import { defineEventHandler, getRouterParam } from 'h3'
import { getById } from '../../utils/db'
import { instansi } from '../../db/schema/instansi'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return { success: false, error: 'ID required' }
  const result = await getById(instansi, id)
  return result
})
