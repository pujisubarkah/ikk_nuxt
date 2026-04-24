import { defineEventHandler } from 'h3';
import { db } from '../../db';
import { activeYear } from '../../db/schema';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    // Drizzle ORM: gunakan orderBy dengan kolom, reverse di JS jika perlu descending
    const result = await db.select().from(activeYear).orderBy(activeYear.active_year);
    return result.reverse();
  }
  return { error: 'Method not allowed' };
});
