'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import db from '@/app/lib/db';

export type State = {
  errors?: {
    email?: string[];
    firstname?: string[];
    lastname?: string[];
    enddate?: string[];
  };
  message?: string | null;
};

const validateFields = (fields: { email: any; firstname: any; lastname: any; enddate: any }) => {
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

  if (!fields.enddate) {
    errors.enddate = ['Please enter an end date.'];
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
  const key = generateKey(); // Implement this function to generate a unique key
  const creationdate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
  const enddate = new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split('T')[0]; // Two months from now
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
  formData: FormData,
  prevState: State,
) {
  const fields = {
    email: formData.get('email'),
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    enddate: formData.get('enddate'),
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
      [email, firstname, lastname, enddate, formData.get('id')]
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

export async function deleteIntervenants(id: string) {
  const client = await db.connect();
  try {
    await client.query('DELETE FROM intervenants WHERE id = $1', [id]);
    revalidatePath('/dashboard');
    return { message: 'Deleted Intervenant.' };
  } catch (err) {
    console.error('Database Error: Failed to Delete Intervenant.', err);
    return { message: 'Database Error: Failed to Delete Intervenant.' };
  } finally {
    client.release();
  }
}

// Example function to generate a unique key
function generateKey() {
  return Math.random().toString(36).substr(2, 9);
}