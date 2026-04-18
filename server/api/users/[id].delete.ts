import { defineEventHandler, getRouterParam } from 'h3'
import { remove } from '../../utils/db'
import { user } from '../../db/schema/user'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return { success: false, error: 'ID required' }
  
  const result = await remove(id, user)
  return result
})
