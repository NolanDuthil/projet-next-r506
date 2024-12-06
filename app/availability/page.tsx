// FILE: app/availability/page.tsx

import { validateKey, fetchIntervenantAvailability } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

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

  const availability = await fetchIntervenantAvailability(intervenant.id);

  return (
    <div>
      <h1>Bonjour {intervenant.firstname} {intervenant.lastname}</h1>
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