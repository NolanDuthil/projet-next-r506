'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, notFound } from 'next/navigation';
import { getIntervenantByKey } from '@/lib/data';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function Availability() {
    const [intervenant, setIntervenant] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const searchParams = useSearchParams();

    const calendarRef = useRef(null);

    useEffect(() => {
        const fetchIntervenant = async () => {
            const key = searchParams.get('key');
            if (key) {
                const intervenant = await getIntervenantByKey(key);
                setIntervenant(intervenant);

                const allEvents = transformSlotsToEvents(
                    `${intervenant.firstname} ${intervenant.lastname}`,
                    intervenant.availability,
                    new Date()
                );
                setEvents(allEvents);
            }
            setIsLoading(false);
        };
        fetchIntervenant();
    }, [searchParams]);

    const handleDatesSet = ({ start }) => {
        const startDate = new Date(start);

        // Trouver l'année basée sur le jeudi
        const thursday = new Date(startDate);
        thursday.setDate(startDate.getDate() + (4 - startDate.getDay() + 7) % 7); // Trouver le jeudi de la semaine
        const newYear = thursday.getFullYear(); // Année du jeudi

        // Mettre à jour l'année et la semaine actuelle si elles changent
        if (currentWeek.getTime() !== startDate.getTime() || currentYear !== newYear) {
            setCurrentWeek(startDate);
            setCurrentYear(newYear);
        }

        if (intervenant) {
            const allEvents = transformSlotsToEvents(
                `${intervenant.firstname} ${intervenant.lastname}`,
                intervenant.availability,
                startDate
            );

            // Vérifier si les événements ont réellement changé avant d'appeler setEvents
            const areEventsEqual = JSON.stringify(events) === JSON.stringify(allEvents);
            if (!areEventsEqual) {
                setEvents(allEvents);
            }
        }
    };



    function transformSlotsToEvents(intervenantName, slots, currentDate) {
        const events = [];
        const currentWeekNumber = getWeekNumber(currentDate);

        Object.keys(slots).forEach((key) => {
            if (key !== "default" && key === `S${currentWeekNumber}`) {
                slots[key].forEach((slot) => {
                    const days = slot.days.split(", ");
                    days.forEach((day) => {
                        const dayNumber = convertDayToNumber(day);
                        events.push({
                            title: intervenantName,
                            startTime: slot.from,
                            endTime: slot.to,
                            daysOfWeek: [dayNumber],
                        });
                    });
                });
            } else if (key === "default" && !Object.keys(slots).some(k => k === `S${currentWeekNumber}`)) {
                slots[key].forEach((slot) => {
                    const days = slot.days.split(", ");
                    days.forEach((day) => {
                        const dayNumber = convertDayToNumber(day);
                        events.push({
                            title: intervenantName,
                            startTime: slot.from,
                            endTime: slot.to,
                            daysOfWeek: [dayNumber],
                        });
                    });
                });
            }
        });

        return events;
    }

    function getWeekNumber(date) {
        const oneJan = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
        let weekNumber = Math.ceil((days + oneJan.getDay() + 1) / 7);
        if (weekNumber === 53) {
            weekNumber = 1;
        }
        return weekNumber;
    }

    function convertDayToNumber(day) {
        const days = {
            lundi: 1,
            mardi: 2,
            mercredi: 3,
            jeudi: 4,
            vendredi: 5,
        };
        return days[day];
    }

    function navigateToWeek(weekNumber) {
        const firstDayOfYear = new Date(currentYear, 0, 1);
        const firstThursday = new Date(firstDayOfYear);
        firstThursday.setDate(firstThursday.getDate() + ((4 - firstDayOfYear.getDay() + 7) % 7));

        const firstWeekMonday = new Date(firstThursday);
        firstWeekMonday.setDate(firstThursday.getDate() - 3);

        const targetDate = new Date(firstWeekMonday);
        targetDate.setDate(firstWeekMonday.getDate() + (weekNumber - 1) * 7);

        setCurrentWeek(targetDate);

        const calendarApi = calendarRef.current.getApi();
        calendarApi.changeView('timeGridWeek', targetDate);
    }

    function changeYear(year) {
        setCurrentYear(year);
        const firstDayOfYear = new Date(year, 0, 1);
        setCurrentWeek(firstDayOfYear);

        const calendarApi = calendarRef.current.getApi();
        calendarApi.changeView('timeGridWeek', firstDayOfYear);
    }

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    if (!intervenant) {
        return notFound();
    }

    return (
        <div className="mx-auto h-full p-6 bg-gray-50">
            <h1 className="text-center text-3xl font-bold mb-8 text-gray-700">
                Planning de l'intervenant {intervenant.firstname} {intervenant.lastname}
            </h1>
            <div className="flex gap-6">
                <div className="w-1/4 bg-white p-4 rounded-lg shadow border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4 text-gray-600">Semaine</h2>
                    <select
                        value={currentYear}
                        onChange={(e) => changeYear(parseInt(e.target.value))}
                        className="mb-4 p-2 border border-gray-300 rounded"
                    >
                        {[...Array(5)].map((_, i) => (
                            <option key={i} value={currentYear - 2 + i}>
                                {currentYear - 2 + i}
                            </option>
                        ))}
                    </select>
                    <div className="grid grid-cols-4 gap-2">
                        {[...Array(52).keys()].map((week) => (
                            <button
                                key={week + 1}
                                className={`p-2 rounded-lg text-center font-semibold ${getWeekNumber(currentWeek) === week + 1
                                    ? "bg-red-500 text-white"
                                    : "bg-gray-200 text-gray-800 hover:bg-red-200"
                                    }`}
                                onClick={() => navigateToWeek(week + 1)}
                            >
                                {week + 1}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-3/4 bg-white p-4 rounded-lg shadow border border-gray-200">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        hiddenDays={[0, 6]}
                        events={events}
                        headerToolbar={{
                            left: "prev,next today",
                            right: "title",
                        }}
                        buttonText={{
                            today: "Aujourd'hui",
                            week: "Semaine",
                        }}
                        eventColor="#FF0000"
                        eventTextColor="#FFFFFF"
                        slotLabelClassNames="text-gray-600 font-medium"
                        height="auto"
                        slotMinTime="08:00:00"
                        slotMaxTime="20:00:00"
                        slotLabelFormat={{
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                        }}
                        datesSet={handleDatesSet}
                        dayHeaderClassNames="bg-red-500 text-white font-semibold uppercase"
                    />
                </div>
            </div>
        </div>
    );
}
