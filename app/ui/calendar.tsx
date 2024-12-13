'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import { startOfYear, eachWeekOfInterval, format, parse, addDays, startOfWeek, addMinutes } from 'date-fns';

interface Availability {
  [key: string]: any;
}

export default function Calendar({ availability }: { availability: string }) {
  const [calendarView, setCalendarView] = useState("timeGridWeek");
  const [headerToolbar, setHeaderToolbar] = useState({
    left: "title prev,next today",
    center: "",
    right: "timeGridDay,timeGridWeek,dayGridMonth",
  });
  const [events, setEvents] = useState<{ title: string; start: string; end: string; url?: string; groupId?: string }[]>([]);

  const handleWindowResize = () => {
    const { innerWidth } = window;
    if (innerWidth < 768) {
      setCalendarView("timeGridDay");
      setHeaderToolbar({
        left: "today,prev",
        center: "title",
        right: "next",
      });
    } else if (innerWidth < 1024) {
      setCalendarView("timeGridWeek");
      setHeaderToolbar({
        left: "today,prev title next,timeGridDay,timeGridWeek,dayGridMonth",
        center: "",
        right: "",
      });
    } else {
      setHeaderToolbar({
        left: "today,prev title next,timeGridDay,timeGridWeek,dayGridMonth",
        center: "",
        right: "",
      });
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    handleWindowResize();
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  useEffect(() => {
    function AvailabilityIntoEvents(availability: any) {
      let events: { title: string; start: string; end: string; url?: string; groupId?: string }[] = [];
      const JourSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
      
      const Currentyear = new Date().getFullYear();
      const DebutAnneeScolaire = new Date(Currentyear, 8, 1); 
      const FinAnneeScolaire = new Date(Currentyear + 1, 6, 1); 
      const allWeeks = eachWeekOfInterval({ start: DebutAnneeScolaire, end: FinAnneeScolaire }, { weekStartsOn: 1 });
    
      for (const weekStart of allWeeks) {
        const weekNumber = format(weekStart, 'I'); 
        if (!availability[`S${weekNumber}`] && availability.default !== null) {
          availability[`S${weekNumber}`] = availability.default;
        }
      }
    
      for (const [week, weekAvailability] of Object.entries(availability)) {
        if (week === 'default') continue;
        const weekStart = allWeeks.find(w => format(w, 'I') === week.replace('S', ''));
        if (!weekStart) continue;
    
        events = events.filter(event => event.groupId !== week);
    
        for (const availability of weekAvailability as { days: string; from: string; to: string }[]) {
          if (!availability.days) continue;
          const days = availability.days.split(', ');
          const from = parse(availability.from, 'HH:mm', new Date());
          const to = parse(availability.to, 'HH:mm', new Date());
    
          if (isNaN(from.getTime())) {
            console.error(`Invalid 'from' time: ${availability.from}`);
            continue;
          }
          if (isNaN(to.getTime())) {
            console.error(`Invalid 'to' time: ${availability.to}`);
            continue;
          }
    
          for (const day of days) {
            const dayIndex = JourSemaine.indexOf(day);
            const start = addDays(startOfWeek(weekStart, { weekStartsOn: 1 }), dayIndex);
            const startTime = addMinutes(start, from.getHours() * 60 + from.getMinutes());
            const endTime = addMinutes(start, to.getHours() * 60 + to.getMinutes());
            events.push({
              title: 'Disponible',
              start: startTime.toISOString(),
              end: endTime.toISOString(),
              groupId: week
            });
          }
        }
      }
    
      return events;
    }

    const transformedEvents = AvailabilityIntoEvents(availability);
    setEvents(transformedEvents);
  }, [availability]);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView={calendarView}
      headerToolbar={headerToolbar}
      events={events}
      locale={"fr"}
      allDaySlot={false}
      slotLabelFormat={{
        hour: "2-digit",
        minute: "2-digit",
      }}
      weekNumbers={true}
      navLinks={true}
      editable={true}
      selectable={true}
      selectMirror={true}
      dayMaxEvents={true}
      dayHeaderContent={(args) => {
        const date = new Date(args.date);
        const day = date.toLocaleDateString("fr-FR", { weekday: "short" });
        const dayNumber = date.getDate();
        return (
          <div className="flex flex-col text-center">
            <div className="capitalize text-sm font-semibold text-muted-foreground">{day}</div>
            <div className="text-xl font-semibold text-foreground">{dayNumber}</div>
          </div>
        );
      }}
    />
  );
}