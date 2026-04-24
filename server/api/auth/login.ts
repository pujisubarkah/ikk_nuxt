import { defineEventHandler, readBody, sendError } from 'h3'
import { db } from '../../db/index'
import { user as userTable, roleUser as roleUserTable } from '../../db/schema/user'
import { role as roleTable } from '../../db/schema/role'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    return {
      success: false,
      error: 'Method tidak diizinkan',
      allow: ['POST']
    }
  }

  const body = await readBody(event)
  const { username, password } = body || {}

  // Validasi input
  if (typeof username !== 'string' || username.trim().length === 0 || !password) {
    return {
      success: false,
      error: 'Username dan password wajib diisi'
    }
  }

  try {
    // Cari user berdasarkan username
    const users = await db.select().from(userTable).where(eq(userTable.username, username)).limit(1)
    const user = users[0]

    if (!user) {
      return {
        success: false,
        error: 'User tidak ditemukan'
      }
    }

    // Pengecekan status akun
    if (user.status !== 'aktif') {
      return {
        success: false,
        error: 'Akun Anda belum aktif. Silakan tunggu verifikasi admin.'
      }
    }

    // Verifikasi password
    if (!user.password) {
      return {
        success: false,
        error: 'Password tidak valid'
      }
    }

    const passwordValid = await bcrypt.compare(password, user.password)
    if (!passwordValid) {
      return {
        success: false,
        error: 'Password salah'
      }
    }

    // Ambil role user (jika ada)
    const roleJoin = await db
      .select({
        role_id: roleUserTable.role_id,
        name: roleTable.name
      })
      .from(roleUserTable)
      .leftJoin(roleTable, eq(roleUserTable.role_id, roleTable.id))
      .where(eq(roleUserTable.user_id, user.id))
      .limit(1)

    const userRole = roleJoin[0]

    // Response sukses
    return {
      success: true,
      data: {
        id: user.id?.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        role: userRole?.name || 'user',
        role_id: userRole?.role_id?.toString(),
        status: user.status
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: 'Terjadi kesalahan saat proses login'
    }
  }
})
