import { defineEventHandler, readBody } from 'h3'
import { create } from '../../../utils/db'
import { role } from '../../../db/schema/core'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || typeof body !== 'object') {
    return { success: false, error: 'Invalid body' }
  }
  const result = await create(role, body)
  return result
})
