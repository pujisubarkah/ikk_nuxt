
import { H3Event, sendError } from 'h3';
import { db } from '../../../db';
import { eq } from 'drizzle-orm';
import { policy } from '../../../db/schema/policy';

export default defineEventHandler(async (event: H3Event) => {
  if (event.method !== 'POST') {
    return sendError(event, createError({ statusCode: 405, statusMessage: 'Method tidak diperbolehkan' }));
  }

  const id = event.context.params?.id || getRouterParam(event, 'id');
  if (!id) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'ID instansi harus disertakan' }));
  }

  const body = await readBody(event);
  const { verifikatorId } = body || {};

  try {
    const agencyIdPanrb = Number(id);
    // verifikatorId bisa null untuk membatalkan verifikator
    const validatedBy = verifikatorId ? Number(verifikatorId) : null;

    const policies = await db.select().from(policy).where(eq(policy.agency_id_panrb, agencyIdPanrb));
    if (policies.length === 0) {
      return sendError(event, createError({ statusCode: 404, statusMessage: 'Tidak ada policy ditemukan untuk instansi ini' }));
    }

    // Update all policies for this agency_id_panrb
    // NOTE: drizzle-orm does not support batch update, so update one by one
    const updatedPolicies = [];
    for (const p of policies) {
      const updated = await db.update(policy)
        .set({ validated_by: validatedBy })
        .where(eq(policy.id, p.id))
        .returning();
      if (updated && updated[0]) updatedPolicies.push(updated[0]);
    }

    const responseData = {
      success: true,
      message: verifikatorId ? 'Verifikator berhasil ditetapkan' : 'Verifikator berhasil dibatalkan',
      data: updatedPolicies,
    };

    // Serialisasi manual untuk menghindari error BigInt
    return JSON.parse(JSON.stringify(responseData, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
  } catch (error) {
    console.error('Gagal memproses verifikator:', error);
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Gagal memproses verifikator' }));
  }
});
