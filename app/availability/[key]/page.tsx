import { fetchIntervenantByKey } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import Calendar from '@/app/ui/calendar';

const AvailabilityPage = async ({ params }: { params: { key: string } }) => {
  const key = params.key;

  if (!key || typeof key !== 'string') {
    notFound();
  }

  const { valid, intervenant, message } = await fetchIntervenantByKey(key);

  if (!valid) {
    if (message === 'Clé inconnue') {
      notFound();
    }
    return <div>{message}</div>;
  }

  return (
    <main>
              
        <h1>Disponibilités de {intervenant.firstname}</h1>
        <Calendar availability={intervenant.availability ?? ''} />
    </main>
  );
};

export default AvailabilityPage;