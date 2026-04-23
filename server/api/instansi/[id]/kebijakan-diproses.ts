// pages/api/policies/diajukan.ts
import { H3Event, sendError } from 'h3';
import { db } from "../../../db";
import { eq, desc } from "drizzle-orm";
import { policy } from "../../../db/schema/policy";
import { policyProgram } from "../../../db/schema/policy.program";
import { serializeBigInt } from "@/lib/serializeBigInt";


export default defineEventHandler(async (event: H3Event) => {
  const id = event.context.params?.id || getRouterParam(event, 'id');
  if (!id) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'ID instansi tidak valid' }));
  }

  try {
    const policies = await db.select({
      id: policy.id,
      name: policy.name,
      name_detail: policy.name_detail,
      sector: policy.sector,
      lainnya: policy.lainnya,
      file_url: policy.file_url,
      policy_program: policyProgram,
      policy_status: policy.policy_status,
      created_by: policy.created_by,
      effective_date: policy.effective_date
    })
    .from(policy)
    .where(
      eq(policy.agency_id_panrb, Number(id)) &&
      eq(policy.policy_process, "PROSES")
    )
    .orderBy(desc(policy.created_at)) as Array<{
      id: number|string;
      name: string;
      name_detail: string|null;
      sector: string|null;
      lainnya: string|null;
      file_url: string|null;
      policy_program: Array<{ dasar_hukum?: string|null; program?: string|null; file_url?: string|null }>;
      policy_status: string;
      created_by: string|number|null;
      effective_date: string|Date|null;
    }>;

    const formatted = policies.map((policy) => ({
      id: policy.id,
      nama_kebijakan: `${policy.name}${policy.name_detail ? ` - ${policy.name_detail}` : ''}`,
      sektor: policy.sector, 
      lainnya: policy.lainnya,
      dasar_hukum: policy.policy_program?.[0]?.dasar_hukum ?? null,
      program: policy.policy_program?.[0]?.program ?? null,
      file_url: policy.file_url,
      program_url: policy.policy_program?.[0]?.file_url ?? null,
      status: policy.policy_status,
      created_by: policy.created_by,
      effective_year: policy.effective_date ? new Date(policy.effective_date).getFullYear() : null,
    }));

    // konversi BigInt biar bisa diserialisasi JSON
    const serialized = formatted.map((item) =>
      serializeBigInt(item as Record<string, unknown>)
    );

    return serialized;
  } catch (error) {
    console.error("Gagal ambil data kebijakan:", error);
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Internal Server Error' }));
  }
});
