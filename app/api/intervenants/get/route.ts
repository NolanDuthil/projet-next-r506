import { fetchIntervenants, fetchIntervenantsPages, fetchIntervenantsById } from '@/app/lib/data';
import { NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';

// Route pour obtenir les intervenants
export async function GET() {
  try {
    const intervenants = await fetchIntervenants();
    return NextResponse.json(intervenants);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Route pour obtenir le nombre total de pages des intervenants
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const totalPages = await fetchIntervenantsPages();
      console.log('Total pages fetched successfully:', totalPages);
      res.status(200).json({ totalPages });
    } catch (error) {
      console.error('Failed to fetch total pages:', error);
      res.status(500).json({ error: 'Failed to fetch total pages' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Route pour obtenir un intervenant par ID
export async function getIntervenantById(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query;
    try {
      const intervenant = await fetchIntervenantsById(id as string);
      if (intervenant.length === 0) {
        res.status(404).json({ error: 'Intervenant not found' });
      } else {
        res.status(200).json(intervenant);
      }
    } catch (error) {
      console.error('Failed to fetch intervenant by ID:', error);
      res.status(500).json({ error: 'Failed to fetch intervenant by ID' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}