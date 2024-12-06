import db from '@/app/lib/db';
import bcrypt from 'bcrypt';

// Fonction pour récupérer les intervenants avec pagination
export async function fetchIntervenants(query: string, page: number, limit: number) {
  const offset = (page - 1) * limit;
  const client = await db.connect();
  try {
    const result = await client.query(
      'SELECT * FROM intervenants WHERE email ILIKE $1 OR firstname ILIKE $1 OR lastname ILIKE $1 ORDER BY lastname, firstname LIMIT $2 OFFSET $3',
      [`%${query}%`, limit, offset]
    );
    return result.rows;
  } catch (err) {
    console.error('Erreur lors de la récupération des intervenants', err);
    throw err;
  } finally {
    client.release();
  }
}

// Fonction pour récupérer un intervenant par son identifiant
export async function fetchIntervenantById(id: string) {
  const client = await db.connect();
  try {
    const result = await client.query('SELECT * FROM intervenants WHERE id = $1', [id]);
    return result.rows[0];
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'intervenant', err);
    throw err;
  } finally {
    client.release();
  }
}

// Fonction pour la connexion des utilisateurs
export async function loginUser(email: string, password: string) {
  const client = await db.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    return user;
  } catch (err) {
    console.error('Erreur lors de la connexion de l\'utilisateur', err);
    throw err;
  } finally {
    client.release();
  }
}

