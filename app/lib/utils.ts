import db from '@/app/lib/db';

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'fr-FR',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

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
    const currentDate = new Date().toISOString().split('T')[0];
    if (intervenant.enddate < currentDate) {
      return { valid: false, message: 'Clé expirée' };
    }

    return { valid: true, intervenant };
  } catch (err) {
    console.error('Erreur lors de la validation de la clé', err);
    throw err;
  } finally {
    client.release();
  }
};