import { defineEventHandler, readBody } from 'h3'
import { create } from '../../utils/db'
import { instansi } from '../../db/schema/instansi/instansi'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || typeof body !== 'object') {
    return { success: false, error: 'Invalid body' }
  }
  const result = await create(instansi, body)
  return result
})
