import { redirect } from '@remix-run/node';
import { eq } from 'drizzle-orm';
import { db } from '../.server/db.server';
import { members } from '../drizzle/schema.server';

export async function loader({ request }) {
  const username = new URL(request.url).searchParams.get('u');
  await db.delete(members).where(eq(members.username, username));
  return redirect('/team');
}
