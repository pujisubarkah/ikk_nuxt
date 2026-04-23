import { defineEventHandler } from 'h3'
import { sql } from 'drizzle-orm'
import { db } from '../../db'
import { instansi } from '../../db/schema/instansi/instansi'

export default defineEventHandler(async () => {
  try {
    const count = await db.select({ count: sql`count(*)` }).from(instansi)
    return {
      success: true,
      message: 'DB connected',
      instansi_count: count[0]?.count || 0
    }
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message
    }
  }
})
