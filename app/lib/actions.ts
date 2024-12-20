'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import db from '@/app/lib/db';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { parse } from 'date-fns';

export type State = {
  errors?: {
    email?: string[];
    firstname?: string[];
    lastname?: string[];
  };
  message?: string | null;
};

const validateFields = (fields: { email: any; firstname: any; lastname: any }) => {
  const errors: State['errors'] = {};

  if (!fields.email) {
    errors.email = ['Please enter an email.'];
  }

  if (!fields.firstname) {
    errors.firstname = ['Please enter a firstname.'];
  }

  if (!fields.lastname) {
    errors.lastname = ['Please enter a lastname.'];
  }

  return errors;
};

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

export async function createIntervenants(prevState: State, formData: FormData) {
  const fields = {
    email: formData.get('email'),
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
  };

  const errors = validateFields(fields);

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      message: 'Missing Fields. Failed to Create Intervenant.',
    };
  }

  const { email, firstname, lastname } = fields;

  // Generate additional fields
  const key = uuidv4(); // Use uuid to generate a unique key
  const creationdate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
  const enddate = new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split('T')[0]; // Deux mois à partir de maintenant
  const availability = {}; // Default empty JSON object

  const client = await db.connect();
  try {
    // Check if email already exists
    const emailCheck = await client.query('SELECT id FROM intervenants WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return {
        errors: { email: ['Email already exists.'] },
        message: 'Email already exists. Failed to Create Intervenant.',
      };
    }

    await client.query(
      'INSERT INTO intervenants (email, firstname, lastname, key, creationdate, enddate, availability) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [email, firstname, lastname, key, creationdate, enddate, availability]
    );
  } catch (err) {
    console.error('Database Error: Failed to Create Intervenant.', err);
    return {
      message: 'Database Error: Failed to Create Intervenant.',
    };
  } finally {
    client.release();
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function updateIntervenants(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const fields = {
    email: formData.get('email'),
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    enddate: formData.get('enddate'), // Ajout de la date de validité
  };

  const errors = validateFields(fields);

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      message: 'Missing Fields. Failed to Update Intervenant.',
    };
  }

  const { email, firstname, lastname, enddate } = fields;

  const client = await db.connect();
  try {
    await client.query(
      'UPDATE intervenants SET email = $1, firstname = $2, lastname = $3, enddate = $4 WHERE id = $5',
      [email, firstname, lastname, enddate, id]
    );
  } catch (err) {
    console.error('Database Error: Failed to Update Intervenant.', err);
    return { message: 'Database Error: Failed to Update Intervenant.' };
  } finally {
    client.release();
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function deleteIntervenants(id: number) {
  const client = await db.connect();
  try {
    await client.query('DELETE FROM intervenants WHERE id = $1', [id]);
    return { message: 'Deleted Intervenant.' };
  } catch (err) {
    console.error('Database Error: Failed to Delete Intervenant.', err);
    return { message: 'Database Error: Failed to Delete Intervenant.' };
  } finally {
    client.release();
  }
}

export async function newKeyIntervenants(id: number) {
  const newKey = uuidv4();
  const newEndDate = new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split('T')[0];

  const client = await db.connect();
  try {
    await client.query(
      'UPDATE intervenants SET key = $1, enddate = $2 WHERE id = $3',
      [newKey, newEndDate, id]
    );
  } catch (err) {
    console.error('Database Error: Failed to Regenerate Key.', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function regenerateAllKeys() {
  const newEndDate = new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split('T')[0];

  const client = await db.connect();
  try {
    const intervenants = await client.query('SELECT id FROM intervenants');
    for (const intervenant of intervenants.rows) {
      const newKey = uuidv4();
      await client.query(
        'UPDATE intervenants SET key = $1, enddate = $2 WHERE id = $3',
        [newKey, newEndDate, intervenant.id]
      );
    }
  } catch (err) {
    console.error('Database Error: Failed to Regenerate All Keys.', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function updateAvailabilityByKey(key: string, newAvailability: Record<string, any>) {
  const client = await db.connect();
  try {
    const availabilityJson = JSON.stringify(newAvailability); // Convertir en JSON
    const lastModified = new Date().toISOString(); // Date de dernière modification
    const result = await client.query(
      'UPDATE intervenants SET availability = $1, last_modified = $2 WHERE key = $3 RETURNING *',
      [availabilityJson, lastModified, key]
    );

    if (result.rows.length === 0) {
      throw new Error('Intervenant non trouvé');
    }

    return result.rows[0];
  } catch (err) {
    console.error('Erreur lors de la mise à jour des disponibilités', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function checkAvailabilityAndWorkweek(key: string) {
  const client = await db.connect();
  try {
    const result = await client.query('SELECT availability, workweek FROM intervenants WHERE key = $1', [key]);
    if (result.rows.length === 0) {
      throw new Error('Intervenant non trouvé');
    }

    const { availability, workweek } = result.rows[0];
    const missingWeeks = [];
    const insufficientHours = [];

    for (const [week, requiredHours] of Object.entries(workweek)) {
      let weekAvailability = availability[week];
      if (!weekAvailability && availability.default) {
        weekAvailability = availability.default;
      }

      if (!weekAvailability) {
        missingWeeks.push(week);
      } else {
        const totalHours = weekAvailability.reduce((sum: number, slot: { from: string, to: string }) => {
          const from = parse(slot.from, 'HH:mm', new Date());
          const to = parse(slot.to, 'HH:mm', new Date());
          return sum + (to.getTime() - from.getTime()) / (1000 * 60 * 60);
        }, 0);

        if (totalHours < requiredHours) {
          insufficientHours.push({ week, totalHours, requiredHours });
        }
      }
    }

    return { missingWeeks, insufficientHours };
  } catch (err) {
    console.error('Erreur lors de la vérification des disponibilités et des heures de travail', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function exportIntervenantsAvailability() {
  const client = await db.connect();
  try {
    const result = await client.query('SELECT * FROM intervenants');
    const data = result.rows.map((row) => ({
      id: row.id,
      email: row.email,
      firstname: row.firstname,
      lastname: row.lastname,
      key: row.key,
      creationdate: row.creationdate,
      enddate: row.enddate,
      availability: row.availability,
      workweek: row.workweek,
      last_modified: row.last_modified ? new Date(row.last_modified).toLocaleString("fr-FR", { timeZone: "Europe/Paris" }) : null,
    }));
    const exportDate = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
    const exportData = {
      export_date: exportDate,
      intervenants: data,
    };
    return JSON.stringify(exportData, null, 2);
  } catch (err) {
    console.error('Erreur lors de l\'exportation des disponibilités', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function importWorkloads(workloads: { intervenant: string, workweek: { week: number, hours: number }[] }[]) {
  const client = await db.connect();
  try {
    for (const workload of workloads) {
      const { intervenant, workweek } = workload;
      const workweekJson = JSON.stringify(workweek);
      await client.query(
        'UPDATE intervenants SET workweek = $1 WHERE email = $2',
        [workweekJson, intervenant]
      );
    }
  } catch (err) {
    console.error('Erreur lors de l\'importation des workloads', err);
    throw err;
  } finally {
    client.release();
  }
}