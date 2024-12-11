'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';


const AvailabilityPage = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    const key = searchParams.get('key');
    const intervenantId = searchParams.get('intervenantId');

    if (!key || typeof key !== 'string' || !intervenantId || typeof intervenantId !== 'string') {
      setMessage('Clé ou ID intervenant invalide');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/availability?intervenantId=${intervenantId}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des disponibilités');
        }
        const data = await response.json();
        setAvailability(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des disponibilités', error);
        setMessage('Erreur lors de la récupération des disponibilités');
      }
    };

    fetchData();
  }, [searchParams]);

  if (message) {
    return <div>{message}</div>;
  }

  return (
    <div>
      <h1>Disponibilités</h1>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={availability}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,timeGridDay'
        }}
      />
    </div>
  );
};

export default AvailabilityPage;