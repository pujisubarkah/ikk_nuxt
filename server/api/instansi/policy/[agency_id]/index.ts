
import { H3Event, sendError } from 'h3';
import { db } from '../../../../db';
import { instansi } from '../../../../db/schema/instansi';
import { policy } from '../../../../db/schema/policy';
import { instansiKategori } from '../../../../db/schema/instansiKategori';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event: H3Event) => {
  const agency_id = event.context.params?.agency_id || getRouterParam(event, 'agency_id');
  if (!agency_id) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'agency_id tidak diberikan atau tidak valid' }));
  }
  try {
    // Query instansi
    const instansiResult = await db.select({
      agency_id: instansi.agency_id,
      agency_name: instansi.agency_name,
      agency_category_id: instansi.agency_category_id
    })
    .from(instansi)
    .where(eq(instansi.agency_id, Number(agency_id)));
    if (!instansiResult.length) {
      return sendError(event, createError({ statusCode: 404, statusMessage: 'Instansi tidak ditemukan' }));
    }

    // Query kategori instansi
    const kategori = await db.select({
      kat_instansi: instansiKategori.kat_instansi
    })
    .from(instansiKategori)
    .where(
      eq(
        instansiKategori.id,
        instansiResult[0]?.agency_category_id ?? -1 // fallback to -1 if undefined
      )
    );

    // Query policies
    const policies = await db.select({
      id: policy.id,
      name: policy.name,
      name_detail: policy.name_detail,
      sector: policy.sector,
      lainnya: policy.lainnya,
      policy_status: policy.policy_status,
      policy_process: policy.policy_process,
      progress: policy.progress
      // TODO: Add score queries if needed
    })
    .from(policy)
    .where(eq(policy.agency_id, Number(agency_id)));

    if (!instansiResult[0]) {
      return sendError(event, createError({ statusCode: 404, statusMessage: 'Instansi tidak ditemukan' }));
    }
    const result = {
      agency_id: instansiResult[0].agency_id,
      agency_name: instansiResult[0].agency_name,
      instansi_kategori: kategori[0] ? { kat_instansi: kategori[0].kat_instansi } : null,
      policy: policies
    };
    return result;
  } catch (error) {
    console.error('Error fetching data:', error);
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Internal Server Error' }));
  }
});