import { and, asc, eq, isNull, or } from 'drizzle-orm'
import { defineEventHandler } from 'h3'
import { db } from '../../db'
import { instansi } from '../../db/schema/core'
import { koorInstansiValidator, roleUser, user } from '../../db/schema/user'

const KOOR_INSTANSI_ROLE_ID = 4

export default defineEventHandler(async () => {
  const koorInstansiRows = await db
    .select({
      id: user.id,
      name: user.name,
      agency_name: instansi.agency_name,
    })
    .from(user)
    .innerJoin(roleUser, eq(roleUser.user_id, user.id))
    .leftJoin(instansi, eq(instansi.agency_id, user.agency_id_panrb))
    .where(
      and(
        eq(roleUser.role_id, KOOR_INSTANSI_ROLE_ID),
        eq(user.status, 'aktif'),
        or(isNull(user.deleted), eq(user.deleted, '0')),
      )
    )
    .orderBy(asc(user.id))

  const assignments = await db.select().from(koorInstansiValidator)
  const assignedKoornasIds = [...new Set(assignments.map((item) => item.koor_nasional_id).filter((value): value is number => value !== null))]

  const koornasUsers = assignedKoornasIds.length
    ? await db
        .select({
          id: user.id,
          name: user.name,
        })
        .from(user)
        .where(or(...assignedKoornasIds.map((id) => eq(user.id, id))))
    : []

  const koornasMap = new Map(koornasUsers.map((item) => [item.id, item]))
  const assignmentMap = new Map(assignments.map((item) => [item.koor_instansi_id, item]))

  return koorInstansiRows.map((row) => {
    const assignment = assignmentMap.get(row.id)
    const koorNasional = assignment?.koor_nasional_id ? koornasMap.get(assignment.koor_nasional_id) : null

    return {
      id: row.id,
      name: row.name ?? '',
      instansi: row.agency_name ?? '',
      koor_nasional: koorNasional
        ? {
            id: koorNasional.id,
            name: koorNasional.name ?? '',
          }
        : null,
    }
  })
})