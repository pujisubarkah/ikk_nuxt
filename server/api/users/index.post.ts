import { defineEventHandler, readBody, sendError } from 'h3'
import { create } from '../../utils/db'
import { user } from '../../db/schema/user'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || typeof body !== 'object') {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid body' }))
  }
  const result = await create(user, body)
  return result
})
