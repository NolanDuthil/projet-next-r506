'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useSearchParams } from 'next/navigation';

const AvailabilityPage = () => {
  const searchParams = useSearchParams();
  const key = searchParams.get('key');
  const [events, setEvents] = useState([]);
  const [intervenant, setIntervenant] = useState({ firstname: '', lastname: '' });

  const fetchAvailability = async () => {
    try {
      const validateResponse = await fetch(`/api/auth/validateKey?key=${key}`);
      const validateData = await validateResponse.json();
      if (!validateData.valid) {
        alert(validateData.message);
        return;
      }

      const availabilityResponse = await fetch(`/api/availability?key=${key}`);
      const availabilityData = await availabilityResponse.json();
      if (availabilityData.valid) {
        setEvents(availabilityData.availability);
        setIntervenant(availabilityData.intervenant);
      } else {
        alert(availabilityData.message);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  useEffect(() => {
    if (key) {
      fetchAvailability();
    }
  }, [key]);

  return (
    <div>
      <h2>{intervenant.firstname} {intervenant.lastname}</h2>
      <h1>Availability Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </div>
  );
};

export default AvailabilityPage;
