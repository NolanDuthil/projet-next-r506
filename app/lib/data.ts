import db from '@/app/lib/db';

const ITEMS_PER_PAGE = 5;

// Fonction pour récupérer les intervenants
export async function getIntervenants() {
  const client = await db.connect();
  try {
    const result = await client.query('SELECT * FROM intervenants');
    return result.rows;
  } catch (err) {
    console.error('Erreur lors de la récupération des intervenants', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function fetchIntervenantsPages() {
  const client = await db.connect();
  try {
    const result = await client.query('SELECT COUNT(*) FROM intervenants');
    const totalPages = Math.ceil(Number(result.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of intervenants.');
  } finally {
    client.release();
  }
}