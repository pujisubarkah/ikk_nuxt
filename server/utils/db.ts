import { db } from '../db'
import { eq } from 'drizzle-orm'


export interface ApiResponse<T = any> {
  success: boolean
  data?: T | null
  error?: string
  count?: number
}

type DbRecord = Record<string, any>

export async function getAll<T extends DbRecord>(table: any, limit = 50, offset = 0): Promise<ApiResponse<T[]>> {
  try {
    const items = await db.select().from(table).limit(limit).offset(offset)
    return { success: true, data: items as T[] }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function getById<T extends DbRecord>(table: any, id: number | string): Promise<ApiResponse<T | null>> {
  try {
    const items = await db.select().from(table).where(eq(table.id, id))
    return { success: true, data: (items[0] as T | undefined) ?? null }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function create<T extends DbRecord>(table: any, data: T): Promise<ApiResponse<T>> {
  try {
    const result = await db.insert(table).values(data as DbRecord).returning()
    const rows = result as DbRecord[]
    const item = rows[0]
    return { success: true, data: item as T }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function update<T extends DbRecord>(table: any, id: number | string, data: Partial<T>): Promise<ApiResponse<T>> {
  try {
    const result = await db.update(table).set(data as Partial<DbRecord>).where(eq(table.id, id)).returning()
    const rows = result as DbRecord[]
    const item = rows[0]
    return { success: true, data: item as T }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function remove(id: number | string, table: any): Promise<ApiResponse<null>> {
  try {
    await db.delete(table).where(eq(table.id, id))
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
