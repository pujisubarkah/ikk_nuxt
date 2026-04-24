import { defineEventHandler } from 'h3';
import { db } from '../db';
import { activeYear } from '../db/schema';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    return db.select().from(activeYear);
  }

  if (event.method === 'POST') {
    const body = await readBody(event);
    if (!body || typeof body.active_year !== 'number') {
      return { error: 'active_year harus berupa number' };
    }
    const inserted = await db.insert(activeYear).values({ active_year: body.active_year }).returning();
    return inserted[0];
  }

  return { error: 'Method not allowed' };
});
