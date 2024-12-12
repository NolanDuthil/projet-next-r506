'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import db from '@/app/lib/db';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { signIn } from '@/auth';
import AuthError from 'next-auth';

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

export async function createAdminUser() {
  const client = await db.connect();
  try {
    const email = 'admin1@admin';
    const firstname = 'admin2';
    const lastname = 'admin2';
    const password = 'admin2';

    // Check if email already exists
    const emailCheck = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return { message: 'Admin user already exists.' };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query(
      'INSERT INTO users (email, firstname, lastname, password) VALUES ($1, $2, $3, $4)',
      [email, firstname, lastname, hashedPassword]
    );

    return { message: 'Admin user created successfully.' };
  } catch (err) {
    console.error('Database Error: Failed to Create Admin User.', err);
    return { message: 'Database Error: Failed to Create Admin User.' };
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