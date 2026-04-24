import { defineEventHandler, getQuery } from 'h3'
import { getAll } from '../../../utils/db'
import { role } from '../../../db/schema/role'

export default defineEventHandler(async (event) => {
  const { limit = '50', offset = '0' } = getQuery(event)
  const result = await getAll(role, Number(limit), Number(offset))
  return result
})
