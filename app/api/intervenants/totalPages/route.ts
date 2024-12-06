
import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';

  const client = await db.connect();
  try {
    const result = await client.query('SELECT COUNT(*) FROM intervenants WHERE email ILIKE $1 OR firstname ILIKE $1 OR lastname ILIKE $1', [`%${query}%`]);
    const totalIntervenants = parseInt(result.rows[0].count, 10);
    const totalPages = Math.ceil(totalIntervenants / 10); // Assuming 10 intervenants per page
    return NextResponse.json({ totalPages });
  } catch (err) {
    console.error('Erreur lors de la récupération du nombre total de pages', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  } finally {
    client.release();
  }
}