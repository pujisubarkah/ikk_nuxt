
import { db } from '../../../../db';
import { ikkHasil } from '../../../../db/schema/ikkHasil';
import { kementerianKordinat } from '../../../../db/schema/kementerianKordinat';
import { eq, inArray } from 'drizzle-orm';


export default defineEventHandler(async (event) => {
  const tahun = event.context?.params?.tahun || getRouterParam(event, 'tahun');
  const tahunStr = String(tahun);
  const allowedYears = ['2021', '2023', '2024'];

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
    // Ambil data utama
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
      .where(eq(ikkHasil.instansi_kategori, 'Kementerian/Badan'));

    // Ambil koordinat kementerian untuk setiap agency_id_panrb
    const agencyIds = data.map(d => d.agency_id_panrb).filter((id): id is number => typeof id === 'number' && id != null);
    let koordinatMap: Record<string, { Latitude: number|null, Longitude: number|null }> = {};
    if (agencyIds.length > 0) {
      const koordinatRows = await db.select({
        kode_instansi: kementerianKordinat.kode_instansi,
        Latitude: kementerianKordinat.Latitude,
        Longitude: kementerianKordinat.Longitude,
      }).from(kementerianKordinat)
        .where(inArray(kementerianKordinat.kode_instansi, agencyIds));
      koordinatMap = Object.fromEntries(
        koordinatRows.map(k => [String(k.kode_instansi), { Latitude: k.Latitude, Longitude: k.Longitude }])
      );
    }

    // Gabungkan data utama dengan koordinat
    const result = data.map(item => ({
      ...item,
      koordinat: koordinatMap[String(item.agency_id_panrb)] || null,
    }));

    return { data: result };
  } catch (error) {
    console.error('Error fetching data by tahun:', error);
    return {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    };
  }
});
