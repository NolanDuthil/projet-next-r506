'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import { startOfYear, eachWeekOfInterval, format, parse, addDays, startOfWeek, addMinutes } from 'date-fns';
import { updateAvailabilityByKey } from '@/app/lib/actions';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/ui/popover";
import { XMarkIcon, TrashIcon } from '@/app/ui/icons';

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

    if (Array.isArray(weekAvailability)) {
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
  }

  return events;
}

export default function Calendar({ availability: initialAvailability, intervenantKey }: { availability: Record<string, any>, intervenantKey: string }) {
  const [calendarView, setCalendarView] = useState("timeGridWeek");
  const [headerToolbar, setHeaderToolbar] = useState({
    left: "title prev,next today",
    center: "",
    right: "timeGridDay,timeGridWeek,dayGridMonth",
  });
  const [events, setEvents] = useState<{ title: string; start: string; end: string; url?: string; groupId?: string }[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [availability, setAvailability] = useState(initialAvailability); // Ajoutez cette ligne

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
    const transformedEvents = AvailabilityIntoEvents(availability);
    setEvents(transformedEvents);
  }, [availability]);

  const handleSelect = async (selectInfo: any) => {
    const start = new Date(selectInfo.start);
    const end = new Date(selectInfo.end);
    const day = start.toLocaleDateString("fr-FR", { weekday: "long" });
    const from = start.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
    const to = end.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });

    const weekNumber = format(start, 'I');  // Identifie la semaine à partir de la date sélectionnée
    const weekKey = `S${weekNumber}`;  // La clé de la semaine (par ex. S51)

    // Crée un objet pour la nouvelle disponibilité
    const newAvailability = {
      days: day,
      from: from,
      to: to
    };

    // On crée une copie des disponibilités existantes
    const updatedAvailability = { ...availability };

    // Si la semaine spécifiée n'existe pas encore dans la disponibilité, on l'initialise comme un tableau vide
    if (!updatedAvailability[weekKey]) {
      updatedAvailability[weekKey] = [];
    }

    // Ajoute la nouvelle disponibilité à la semaine spécifiée
    updatedAvailability[weekKey].push(newAvailability);

    // Enregistrer les nouvelles disponibilités dans la base de données
    try {
      await updateAvailabilityByKey(intervenantKey, updatedAvailability);

      // Mettre à jour l'état des disponibilités pour déclencher la mise à jour de l'affichage
      setEvents(AvailabilityIntoEvents(updatedAvailability));
      setAvailability(updatedAvailability); // Ajoutez cette ligne pour mettre à jour l'état
    } catch (error) {
      console.error('Erreur lors de la mise à jour des disponibilités', error);
    }
  };

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo);
    setIsPopoverOpen(true);
  };

  const handleDelete = async () => {
    const eventToDelete = selectedEvent.event;
    const weekNumber = format(new Date(eventToDelete.start), 'I');
    const weekKey = `S${weekNumber}`;
    const JourSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']; // Ajoutez cette ligne

    const updatedAvailability = { ...availability };
    if (updatedAvailability[weekKey]) {
      updatedAvailability[weekKey] = updatedAvailability[weekKey].filter((slot: any) => {
        const slotStart = parse(slot.from, 'HH:mm', new Date());
        const slotEnd = parse(slot.to, 'HH:mm', new Date());
        const eventStart = new Date(eventToDelete.start);
        const eventEnd = new Date(eventToDelete.end);
        const slotDay = slot.days.split(', ').map((day: string) => JourSemaine.indexOf(day));
        const eventDay = eventStart.getDay() - 1; // Convertir le jour de l'événement en index (0 pour lundi, 6 pour dimanche)
        return !(slotStart.getHours() === eventStart.getHours() && slotStart.getMinutes() === eventStart.getMinutes() &&
                 slotEnd.getHours() === eventEnd.getHours() && slotEnd.getMinutes() === eventEnd.getMinutes() &&
                 slotDay.includes(eventDay));
      });

      if (updatedAvailability[weekKey].length === 0) {
        delete updatedAvailability[weekKey];
      }
    }

    try {
      await updateAvailabilityByKey(intervenantKey, updatedAvailability);
      setEvents(AvailabilityIntoEvents(updatedAvailability));
      setAvailability(updatedAvailability); // Ajoutez cette ligne pour mettre à jour l'état
      handlePopoverClose();
    } catch (error) {
      console.error('Erreur lors de la suppression de la disponibilité', error);
    }
  };

  const handlePopoverClose = () => {
    setIsPopoverOpen(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={calendarView}
        headerToolbar={{
          ...headerToolbar,
          left: "today prev,next",
          center: "title",
          right: "timeGridDay,timeGridWeek,dayGridMonth"
        }}
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
        eventColor="#b61621"
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        slotMinTime="08:00:00"
        slotMaxTime="19:30:00"
        hiddenDays={[0, 6]}
        eventOverlap={false}
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
        select={handleSelect}
        eventClick={handleEventClick}
      />
      {selectedEvent && selectedEvent.el && (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <div style={{ position: 'absolute', left: selectedEvent.el.getBoundingClientRect().left, top: selectedEvent.el.getBoundingClientRect().top }}>
              {selectedEvent.event.title}
            </div>
          </PopoverTrigger>
          <PopoverContent side="right">
            <div className='flex flex-col gap-2'>
              <div className='flex justify-between items-center'>
                <h3 className="text-lg">{selectedEvent.event.title}</h3>
                <button className='border border-redunilim hover:bg-redunilim w-fit h-fit rounded-lg text-redunilim p-1 hover:text-white' onClick={handlePopoverClose}><XMarkIcon className='w-5 h-5'/></button>
              </div>
              <p><b>Début :</b> {new Date(selectedEvent.event.start).toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" })}</p>
              <p><b>Fin :</b> {new Date(selectedEvent.event.end).toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" })}</p>
              <div>
                <button className='flex items-center border border-redunilim bg-redunilim hover:bg-white w-fit h-fit rounded-lg text-white p-2 hover:text-redunilim' onClick={handleDelete}><TrashIcon className='w-5 h-5'/> Supprimer</button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}