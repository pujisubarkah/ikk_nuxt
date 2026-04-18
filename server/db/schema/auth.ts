import { db } from '../index'
import { user } from './user'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function getUserByUsername(username: string) {
  const result = await db.select().from(user).where(eq(user.username, username))
  return result[0] || null
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}
