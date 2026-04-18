import { defineEventHandler, readBody, getRouterParam } from 'h3'
import { update } from '../../utils/db'
import { instansi } from '../../db/schema/core'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return { success: false, error: 'ID required' }
  
  const body = await readBody(event)
  if (!body || typeof body !== 'object') {
    return { success: false, error: 'Invalid body' }
  }
  
  const result = await update(instansi, id, body)
  return result
})
