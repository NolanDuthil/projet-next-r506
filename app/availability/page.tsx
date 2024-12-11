import { validateKey } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const AvailabilityPage = async ({ searchParams }: { searchParams: { key?: string } }) => {
  const key = searchParams.key;

  if (!key || typeof key !== 'string') {
    notFound();
  }

  const { valid, intervenant, message } = await validateKey(key);

  if (!valid) {
    if (message === 'Clé inconnue') {
      notFound();
    }
    return <div>{message}</div>;
  }

  return (
    <div>
      <h1>Bonjour {intervenant.firstname} {intervenant.lastname}</h1>
      <Link href={`/availability/calendar?key=${key}`}>
        <button>Calendrier</button>
      </Link>
    </div>
  );
};

export default AvailabilityPage;