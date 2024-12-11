import { NextApiRequest, NextApiResponse } from 'next';
import { fetchIntervenantAvailability } from '@/app/lib/data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { intervenantId } = req.query;

  if (!intervenantId || typeof intervenantId !== 'string') {
    return res.status(400).json({ message: 'ID intervenant invalide' });
  }

  try {
    // Fetch availability using the intervenantId
    const availability = await fetchIntervenantAvailability(parseInt(intervenantId as string));
    return res.status(200).json(availability);
  } catch (error) {
    console.error('Erreur lors de la récupération des disponibilités', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des disponibilités' });
  }
}
