'use server'

import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const db = new Pool({
    user: process.env.DB_USER,
    host: "db",
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

export async function fetchIntervenants(offset: number, limit: number) {
  const client = await db.connect();
  try {
    const result = await client.query('SELECT * FROM "intervenants" ORDER BY id OFFSET $1 LIMIT $2;', [offset, limit]);
    return result.rows;
  } catch (err) {
    console.error('Erreur lors de la récupération des intervenants avec pagination', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function getIntervenantByKey(key: string) {
  const client = await db.connect();
  try {
    const result = await client.query('SELECT * FROM "intervenants" WHERE key = $1;', [key]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'intervenant par clé', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function countIntervenants() {
  const client = await db.connect();
  try {
    const result = await client.query('SELECT COUNT(*) FROM "intervenants";');
    return parseInt(result.rows[0].count, 10);
  } catch (err) {
    console.error('Erreur lors du comptage des intervenants', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteIntervenant(id){
  const client = await db.connect();
  try {
    await client.query('DELETE FROM "intervenants" WHERE id = $1;', [id]);
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'intervenant', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function getIntervenantById(id) {
  const client = await db.connect();
  try {
    const result = await client.query('SELECT * FROM "intervenants" WHERE id = $1;', [id]);
    if (result.rows.length > 0) {
      return result.rows[0]; // Renvoie l'objet intervenant directement
    } else {
      throw new Error("Intervenant introuvable");
    }
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'intervenant', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function createIntervenant(data: any) {
  const client = await db.connect();
  data.creationdate = new Date();
  const endDate = new Date(data.creationdate);
  endDate.setDate(endDate.getDate() + 61);
  data.enddate = endDate;
  data.key = uuidv4();
  try {
    await client.query(
      'INSERT INTO "intervenants" (email, firstname, lastname, key, creationdate, enddate) VALUES ($1, $2, $3, $4, $5, $6);',
      [data.email, data.firstname, data.lastname, data.key, data.creationdate, data.enddate]
    );
  } catch (err) {
    console.error('Erreur lors de la création de l\'intervenant', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function updateIntervenant(id, data: any){
  const client = await db.connect();
  try {
    await client.query(
      'UPDATE "intervenants" SET email = $1, firstname = $2, lastname = $3, enddate = $4 WHERE id = $5;',
      [data.email, data.firstname, data.lastname, data.enddate, id]
    );
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'intervenant', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function createIntervenantNewKey(id){
  const client = await db.connect();
  const newKey = uuidv4();
  try {
    await client.query('UPDATE "intervenants" SET key = $1 WHERE id = $2;', [newKey, id]);
  } catch (err) {
    console.error('Erreur lors de la création d\'une nouvelle clé pour l\'intervenant', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function refreshIntervenantsKeys() {
  const client = await db.connect();
  try {
    const result = await client.query('SELECT id FROM "intervenants";');
    for (const row of result.rows) {
      const newKey = uuidv4();
      const creationDate = new Date();
      const endDate = new Date(creationDate);
      endDate.setDate(endDate.getDate() + 61);
      await client.query(
        'UPDATE "intervenants" SET key = $1, creationdate = $2, enddate = $3 WHERE id = $4;',
        [newKey, creationDate, endDate, row.id]
      );
    }
  } catch (err) {
    console.error('Erreur lors de la régénération des clés intervenants', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function regenerateKeysForIntervenants() {
  const client = await db.connect();
  try {
    const result = await client.query('SELECT id FROM "intervenants";');
    for (const row of result.rows) {
      const newKey = uuidv4();
      const creationDate = new Date();
      const endDate = new Date(creationDate);
      endDate.setDate(endDate.getDate() + 61);
      await client.query(
        'UPDATE "intervenants" SET key = $1, creationdate = $2, enddate = $3 WHERE id = $4;',
        [newKey, creationDate, endDate, row.id]
      );
    }
  } catch (err) {
    console.error('Erreur lors de la génération des clés pour les intervenants', err);
    throw err;
  } finally {
    client.release();
  }
}