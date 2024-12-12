import { NextRequest, NextResponse } from 'next/server';
import { validateKey, fetchAvailabilityByIntervenantId } from '@/app/lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    console.log('Clé manquante');
    return NextResponse.json({ message: 'Clé manquante' }, { status: 400 });
  }

  try {
    const validation = await validateKey(key);
    if (!validation.valid) {
      console.log('Clé invalide:', validation.message);
      return NextResponse.json({ message: validation.message }, { status: 401 });
    }

    const availability = await fetchAvailabilityByIntervenantId(validation.intervenant_id);
    console.log('Disponibilités récupérées:', availability);
    return NextResponse.json({ valid: true, availability, intervenant: validation.intervenant }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des disponibilités:', error);
    console.error('Détails de l\'erreur:', error.stack);
    return NextResponse.json({ message: 'Erreur lors de la récupération des disponibilités' }, { status: 500 });
  }
}
