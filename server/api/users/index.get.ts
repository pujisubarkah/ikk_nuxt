import { defineEventHandler, getQuery } from 'h3'
import { and, asc, eq, isNull, or } from 'drizzle-orm'
import { db } from '../../db'
import { instansi, suratPenunjukkan } from '../../db/schema/core'
import { roleUser, user } from '../../db/schema/user'

export default defineEventHandler(async (event) => {
  const { limit = '50', offset = '0' } = getQuery(event)
  const roleId = getQuery(event).role_id

  const filters = [or(isNull(user.deleted), eq(user.deleted, '0'))]
  if (roleId !== undefined) {
    filters.push(eq(roleUser.role_id, Number(roleId)))
  }

  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      position: user.position,
      work_unit: user.work_unit,
      active_year: user.active_year,
      status: user.status,
      agency_id: instansi.agency_id,
      agency_name: instansi.agency_name,
      surat_file: suratPenunjukkan.file,
      melibatkan_jf_analis: suratPenunjukkan.melibatkan_jf_analis,
      role_id: roleUser.role_id,
      penunjukkan_id: user.penunjukkan_id,
    })
    .from(user)
    .leftJoin(roleUser, eq(roleUser.user_id, user.id))
    .leftJoin(instansi, eq(instansi.agency_id, user.agency_id_panrb))
    .leftJoin(suratPenunjukkan, eq(suratPenunjukkan.id, user.penunjukkan_id))
    .where(and(...filters))
    .orderBy(asc(user.id))
    .limit(Number(limit))
    .offset(Number(offset))

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    username: row.username,
    email: row.email,
    phone: row.phone,
    position: row.position,
    work_unit: row.work_unit,
    active_year: row.active_year?.toString() ?? '',
    status: row.status,
    instansi: row.agency_id
      ? {
          agency_id: row.agency_id.toString(),
          agency_name: row.agency_name ?? '',
        }
      : null,
    surat_penunjukkan: row.penunjukkan_id
      ? {
          file: row.surat_file ?? '',
          melibatkan_jf_analis: Boolean(row.melibatkan_jf_analis),
        }
      : null,
    role_user: {
      role_id: row.role_id?.toString() ?? '',
    },
  }))
})
