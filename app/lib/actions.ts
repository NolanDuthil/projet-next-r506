'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import db from '@/app/lib/db';

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const validateFields = (fields: { customerId: any; amount: any; status: any }) => {
  const errors: State['errors'] = {};

  if (!fields.customerId) {
    errors.customerId = ['Please select a customer.'];
  }

  const amount = Number(fields.amount);
  if (isNaN(amount) || amount <= 0) {
    errors.amount = ['Please enter an amount greater than $0.'];
  }

  if (!['pending', 'paid'].includes(fields.status)) {
    errors.status = ['Please select an invoice status.'];
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
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  };

  const errors = validateFields(fields);

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = fields;
  const amountInCents = Number(amount) * 100;
  const date = new Date().toISOString().split('T')[0];

  const client = await db.connect();
  try {
    await client.query(
      'INSERT INTO invoices (customer_id, amount, status, date) VALUES ($1, $2, $3, $4)',
      [customerId, amountInCents, status, date]
    );
  } catch (err) {
    console.error('Database Error: Failed to Create Invoice.', err);
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  } finally {
    client.release();
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateIntervenants(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const fields = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  };

  const errors = validateFields(fields);

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = fields;
  const amountInCents = Number(amount) * 100;

  const client = await db.connect();
  try {
    await client.query(
      'UPDATE invoices SET customer_id = $1, amount = $2, status = $3 WHERE id = $4',
      [customerId, amountInCents, status, id]
    );
  } catch (err) {
    console.error('Database Error: Failed to Update Invoice.', err);
    return { message: 'Database Error: Failed to Update Invoice.' };
  } finally {
    client.release();
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteIntervenants(id: string) {
  const client = await db.connect();
  try {
    await client.query('DELETE FROM invoices WHERE id = $1', [id]);
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (err) {
    console.error('Database Error: Failed to Delete Invoice.', err);
    return { message: 'Database Error: Failed to Delete Invoice.' };
  } finally {
    client.release();
  }
}