import { fetchIntervenants } from '@/app/lib/data';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  try {
    const intervenants = await fetchIntervenants(query, page, limit);
    return NextResponse.json(intervenants);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}