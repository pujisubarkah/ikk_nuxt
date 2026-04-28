
import { db } from '../../db';
import { ikkHasil } from '../../db/schema/ikkHasil';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { id, kd_prov } = query;

    // Build filter
    const filters = [];
    if (typeof id === 'string') {
      filters.push(eq(ikkHasil.id, id));
    }
    if (typeof kd_prov === 'string') {
      const parsedKdProv = parseInt(kd_prov, 10);
      if (!isNaN(parsedKdProv)) {
        filters.push(eq(ikkHasil.kd_prov, parsedKdProv));
      }
    }

    const data = await db.select().from(ikkHasil)
      .where(filters.length > 0 ? and(...filters) : undefined);

    // Kelompokkan data berdasarkan instansi_kategori
    const groupedData = data.reduce((acc: Record<string, typeof data>, item) => {
      const key = item.instansi_kategori || 'Unknown';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, typeof data>);

    return { data: groupedData };
  } catch (error) {
    console.error('Error fetching ikk_hasil:', error);
    return {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    };
  }
});