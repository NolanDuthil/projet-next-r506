'use client';

import { useEffect, useState } from 'react';
import { fetchIntervenantsKey } from '@/app/lib/data';
import { checkAvailabilityAndWorkweek } from '@/app/lib/actions';
import Calendar from '@/app/ui/calendar';

export default function Disponibility() {
  const [intervenants, setIntervenants] = useState([]);
  const [selectedIntervenant, setSelectedIntervenant] = useState(null);
  const [missingWeeks, setMissingWeeks] = useState([]);
  const [insufficientHours, setInsufficientHours] = useState([]);

  useEffect(() => {
    async function loadIntervenants() {
      try {
        const data = await fetchIntervenantsKey();
        setIntervenants(data);
      } catch (err) {
        console.error('Erreur lors du chargement des intervenants', err);
      }
    }
    loadIntervenants();
  }, []);

  const handleSelectChange = async (event) => {
    const selectedKey = event.target.value;
    const intervenant = intervenants.find(i => i.key === selectedKey);
    setSelectedIntervenant(intervenant);

    if (intervenant) {
      try {
        const { missingWeeks, insufficientHours } = await checkAvailabilityAndWorkweek(selectedKey);
        setMissingWeeks(missingWeeks);
        setInsufficientHours(insufficientHours);
      } catch (err) {
        console.error('Erreur lors de la vérification des disponibilités et des heures de travail', err);
      }
    }
  };

  return (
    <>
    <div className="mb-4">
          <label htmlFor="intervenantSelect" className="block text-sm font-medium text-gray-700 mb-2">Sélectionnez un intervenant</label>
          <select
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            name="intervenantSelect"
            id="intervenantSelect"
            onChange={handleSelectChange}
          >
            <option value="">Sélectionnez un intervenant</option>
            {intervenants.map(intervenant => (
              <option key={intervenant.key} value={intervenant.key}>
                {intervenant.lastname} {intervenant.firstname}
              </option>
            ))}
          </select>
        </div>
      <div className="container mx-auto my-8 p-4 bg-purple-50 shadow-md rounded-lg">
        {selectedIntervenant && (
          <>
            <h1 className="text-left text-4xl font-bold mb-8">Disponibilités de {selectedIntervenant.firstname} {selectedIntervenant.lastname}</h1>
            {selectedIntervenant.last_modified && (
              <div className="text-left text-gray-600 mb-4">
                Dernière modification: {new Date(selectedIntervenant.last_modified).toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Paris" })}
              </div>
            )}
            {missingWeeks.length > 0 && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                <strong className="font-bold">Attention!</strong>
                <span className="block sm:inline"> Les disponibilités pour les semaines: {missingWeeks.join(', ')}. sont manquantes</span>
              </div>
            )}
            {insufficientHours.length > 0 && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <strong className="font-bold">Attention!</strong>
                <span className="block sm:inline"> Vous avez saisi moins d'heures que nécessaire pour les semaines suivantes:</span>
                <ul className="list-disc list-inside">
                  {insufficientHours.map(({ week, totalHours, requiredHours }) => (
                    <li key={week}>Semaine {week}: {totalHours} heures saisies, {requiredHours} heures requises</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mb-8">
              <Calendar key={selectedIntervenant.key} availability={selectedIntervenant.availability ?? ''} intervenantKey={selectedIntervenant.key} />
            </div>
          </>
        )}
      </div>
    </>
  );
};