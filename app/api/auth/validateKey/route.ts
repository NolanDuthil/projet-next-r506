import { NextRequest, NextResponse } from 'next/server';
import { validateKey } from '@/app/lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ message: 'Clé manquante' }, { status: 400 });
  }

  try {
    const validation = await validateKey(key);
    if (!validation.valid) {
      return NextResponse.json({ message: validation.message }, { status: 401 });
    }

    return NextResponse.json({ valid: true, intervenant: validation.intervenant }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erreur lors de la validation de la clé' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};