
import { db } from '../../../../db';
import { ikkHasil } from '../../../../db/schema/ikkHasil';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const tahun = event.context?.params?.tahun || getRouterParam(event, 'tahun');
  const tahunStr = String(tahun);
  const allowedYears = ['2021', '2023', '2024'];

  // Validasi tahun
  if (!allowedYears.includes(tahunStr)) {
    return {
      statusCode: 400,
      body: { message: 'Tahun tidak valid. Gunakan 2021, 2023, atau 2024.' }
    };
  }

  // Mapping kolom predikat
  let predikatColumn;
  if (tahunStr === '2021') predikatColumn = ikkHasil.predikat_2021;
  else if (tahunStr === '2023') predikatColumn = ikkHasil.predikat_2023;
  else predikatColumn = ikkHasil.predikat_2024;

  try {
    const data = await db.select({
      id: ikkHasil.id,
      kd_prov: ikkHasil.kd_prov,
      kd_kabkot: ikkHasil.kd_kabkot,
      instansi_kategori: ikkHasil.instansi_kategori,
      instansi_nama: ikkHasil.instansi_nama,
      agency_id_panrb: ikkHasil.agency_id_panrb,
      predikat: predikatColumn,
    })
      .from(ikkHasil)
      .where(eq(ikkHasil.instansi_kategori, 'Provinsi'));

    return { data };
  } catch (error) {
    console.error('Error fetching data by tahun:', error);
    return {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    };
  }
});
