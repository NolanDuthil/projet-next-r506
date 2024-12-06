// FILE: app/availability/page.tsx

import { useEffect, useState } from 'react';
import { validateKey, fetchIntervenantAvailability } from '@/app/lib/data';
import { useRouter, useSearchParams } from 'next/navigation';
import Calendar from '@/app/ui/calendar';

const AvailabilityPage = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [intervenant, setIntervenant] = useState<any>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const key = searchParams.get('key');

    if (!key || typeof key !== 'string') {
      router.push('/404');
      return;
    }

    const fetchData = async () => {
      try {
        const { valid, intervenant, message } = await validateKey(key);

        if (!valid) {
          if (message === 'Clé inconnue') {
            router.push('/404');
          } else {
            setMessage(message);
          }
          return;
        }

        setIntervenant(intervenant);
        const availability = await fetchIntervenantAvailability(intervenant.id);
        setAvailability(availability);
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
        setMessage('Erreur lors de la récupération des données');
      }
    };

    fetchData();
  }, [searchParams, router]);

  if (message) {
    return <div>{message}</div>;
  }

  if (!intervenant) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Bonjour {intervenant.firstname} {intervenant.lastname}</h1>
      <Calendar events={availability} />
    </div>
  );
};

export default AvailabilityPage;