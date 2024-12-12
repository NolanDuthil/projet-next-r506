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

// Fonction pour récupérer les disponibilités d'un intervenant par son identifiant
export async function fetchAvailabilityByIntervenantId(intervenantId: string) {
  const client = await db.connect();
  try {
    const result = await client.query(
      'SELECT * FROM availability WHERE intervenant_id = $1',
      [intervenantId]
    );
    const availabilityData = result.rows[0]?.availability;
    if (!availabilityData) {
      return [];
    }

    const availability = JSON.parse(availabilityData);
    const events = [];

    availability.default.forEach((slot: any) => {
      const days = slot.days.split(', ');
      days.forEach((day: string) => {
        events.push({
          title: 'Available',
          daysOfWeek: [day],
          startTime: slot.from,
          endTime: slot.to,
        });
      });
    });

    return events;
  } catch (err) {
    console.error('Erreur lors de la récupération des disponibilités', err);
    console.error('Détails de l\'erreur:', err.stack);
    throw err;
  } finally {
    client.release();
  }
}

export const validateKey = async (key: string) => {
  const client = await db.connect();
  try {
    const result = await client.query(
      'SELECT * FROM intervenants WHERE key = $1',
      [key]
    );
    if (result.rows.length === 0) {
      return { valid: false, message: 'Clé inconnue' };
    }

    const intervenant = result.rows[0];
    const currentDate = new Date();
    const endDate = new Date(intervenant.enddate);

    if (endDate < currentDate) {
      return { valid: false, message: 'Clé expirée' };
    }

    return { valid: true, intervenant_id: intervenant.id, intervenant: { firstname: intervenant.firstname, lastname: intervenant.lastname } };
  } catch (err) {
    console.error('Erreur lors de la validation de la clé', err);
    throw err;
  } finally {
    client.release();
  }
};

