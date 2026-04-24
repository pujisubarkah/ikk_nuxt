import { defineEventHandler, getRouterParam } from 'h3'
import { remove } from '../../../utils/db'
import { role } from '../../../db/schema/role'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return { success: false, error: 'ID required' }
  
  const result = await remove(id, role)
  return result
})
